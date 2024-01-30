namespace FU.API.Services;

using FU.API.Data;
using FU.API.Interfaces;

public class RelationService : CommonService, IRelationService
{
    private readonly AppDbContext _dbContext;

    public RelationService(AppDbContext dbContext)
        : base(dbContext)
    {
        _dbContext = dbContext;
    }
}
