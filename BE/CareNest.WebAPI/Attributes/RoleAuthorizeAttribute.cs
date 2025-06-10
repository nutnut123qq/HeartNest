using CareNest.Domain.Enums;
using Microsoft.AspNetCore.Authorization;

namespace CareNest.WebAPI.Attributes;

public class RoleAuthorizeAttribute : AuthorizeAttribute
{
    public RoleAuthorizeAttribute(params UserRole[] roles)
    {
        Roles = string.Join(",", roles.Select(r => r.ToString()));
    }
}
