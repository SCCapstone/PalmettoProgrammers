﻿namespace FU.API.Services;

using FU.API.Data;
using FU.API.Exceptions;
using FU.API.Interfaces;
using FU.API.Models;
using Microsoft.EntityFrameworkCore;

public class RelationService : CommonService, IRelationService
{
    private readonly AppDbContext _dbContext;

    private readonly IChatService _chatService;

    public RelationService(AppDbContext dbContext, IChatService chatService)
        : base(dbContext)
    {
        _dbContext = dbContext;
        _chatService = chatService;
    }

    public async Task HandleRelationAction(int initiatedById, int otherUserId, UserRelationAction action)
    {
        if (initiatedById == otherUserId)
        {
            throw new BadRequestException("You can't modify your own relation");
        }

        var initiatedByUser = await _dbContext.Users.FindAsync(initiatedById)
            ?? throw new NotFoundException("User not found", "The requested user was not found");
        var otherUser = await _dbContext.Users.FindAsync(otherUserId)
            ?? throw new NotFoundException("User not found", "The requested user was not found");

        var relation = await _dbContext.UserRelations.Where(r => r.User1Id == initiatedById && r.User2Id == otherUserId).FirstOrDefaultAsync();

        // Relation null means that the relation does not exist yet
        if (relation is null)
        {
            await HandleNewRelation(initiatedByUser, otherUser, action);
            return;
        }

        // Can't friend/block a user that has blocked you
        // And can't modify blocked relations. Users should unblock first
        if (relation.Status == UserRelationStatus.BlockedBy)
        {
            throw new ForbidException("You are not allowed to modify this relation");
        }
        else if (relation.Status == UserRelationStatus.Blocked)
        {
            throw new BadRequestException("You are not allowed to modify blocked relations");
        }

        var inverseRelation = await _dbContext.UserRelations
            .Where(r => r.User1Id == otherUserId && r.User2Id == initiatedById)
            .FirstOrDefaultAsync()
                ?? throw new ServerError("The inverse relation does not exist");

        if (action == UserRelationAction.Block)
        {
            // If action is block, then we're blocking a friend, a user that has requested us, or a user that we have requested
            relation.Status = UserRelationStatus.Blocked;
            inverseRelation.Status = UserRelationStatus.BlockedBy;
        }
        else
        {
            // If action is friend, then we're friending a user that has requested us
            if (relation.Status == UserRelationStatus.Friends)
            {
                // Users can't friend a user they are already friends with
                throw new BadRequestException("You are already friends with this user");
            }
            else if (relation.Status == UserRelationStatus.Requested)
            {
                // Users can't friend a user they have already requested
                throw new BadRequestException("You have already requested this user");
            }

            relation.Status = UserRelationStatus.Friends;
            inverseRelation.Status = UserRelationStatus.Friends;
        }

        // Save the changes
        try
        {
            _dbContext.UserRelations.Update(relation);
            _dbContext.UserRelations.Update(inverseRelation);
            await _dbContext.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            throw new DbUpdateException();
        }

        return;
    }

    public async Task RemoveRelation(int initiatedById, int otherUserId)
    {
        if (initiatedById == otherUserId)
        {
            throw new BadRequestException("You can't modify your own relation");
        }

        await AssertUserExists(initiatedById);
        await AssertUserExists(otherUserId);

        var relation = await _dbContext.UserRelations
            .Where(r => r.User1Id == initiatedById && r.User2Id == otherUserId)
            .FirstOrDefaultAsync()
                ?? throw new NotFoundException("Relation not found", "The requested relation was not found");

        if (relation.Status == UserRelationStatus.BlockedBy)
        {
            throw new ForbidException("You are not allowed to modify this relation");
        }

        var inverseRelation = await _dbContext.UserRelations
            .Where(r => r.User1Id == otherUserId && r.User2Id == initiatedById)
            .FirstOrDefaultAsync()
                ?? throw new ServerError("The inverse relation does not exist");

        try
        {
            // Remove both sides of the relations
            _dbContext.UserRelations.Remove(relation);
            _dbContext.UserRelations.Remove(inverseRelation);
            await _dbContext.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            throw new DbUpdateException();
        }

        return;
    }

    private async Task HandleNewRelation(ApplicationUser initiatedBy, ApplicationUser otherUser, UserRelationAction action)
    {
        // Create or find a chat between the two users
        var chat = await _chatService.GetChat(initiatedBy.UserId, otherUser.UserId) ?? await _chatService.CreateChat(initiatedBy, otherUser);

        if (chat is null)
        {
            throw new ServerError("Chat creation failed");
        }

        switch (action)
        {
            case UserRelationAction.Friend:
                var newFriendRelations = new List<UserRelation>
                {
                    new UserRelation
                    {
                        User1 = initiatedBy,
                        User2 = otherUser,
                        Status = UserRelationStatus.Requested,
                        Chat = chat,
                    },
                    new UserRelation
                    {
                        User1 = otherUser,
                        User2 = initiatedBy,
                        Status = UserRelationStatus.Pending,
                        Chat = chat,
                    },
                };

                _dbContext.UserRelations.AddRange(newFriendRelations);
                break;
            case UserRelationAction.Block:
                var newBlockedRelations = new List<UserRelation>
                {
                    new UserRelation
                    {
                        User1 = initiatedBy,
                        User2 = otherUser,
                        Status = UserRelationStatus.Blocked,
                        Chat = chat,
                    },
                    new UserRelation
                    {
                        User1 = otherUser,
                        User2 = initiatedBy,
                        Status = UserRelationStatus.BlockedBy,
                        Chat = chat,
                    },
                };

                _dbContext.UserRelations.AddRange(newBlockedRelations);
                break;
        }

        try
        {
            await _dbContext.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            throw new DbUpdateException();
        }

        return;
    }

    private async Task AssertUserExists(int userId)
    {
        if (await _dbContext.Users.FindAsync(userId) is null)
        {
            throw new NotFoundException("User not found", "The requested user was not found");
        }
    }
}
