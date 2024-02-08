namespace FU.API.Interfaces;

using FU.API.Models;

public interface IRelationService : ICommonService
{
    Task HandleRelationAction(int initiatedById, int otherUserId, UserRelationAction action);

    Task RemoveRelation(int initiatedById, int otherUserId);

    Task<UserRelation> GetRelation(int initiatedById, int otherUserId);

    Task<IEnumerable<UserProfile>> GetRelations(UserQuery query, bool userIsRequester = false);
}
