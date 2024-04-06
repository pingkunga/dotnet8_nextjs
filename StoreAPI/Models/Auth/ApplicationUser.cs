using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace StoreAPI.Models.Auth
{
    [Table("ApplicationUser")]
    public class ApplicationUser:IdentityUser
    {
        [Column("FirstName")]
        public string FirstName { get; set; }
        [Column("LastName")]
        public string LastName { get; set; }
        [Column("RefreshToken")]
        public string? RefreshToken { get; set; }
        [Column("RefreshTokenExpiryTime")]
        public DateTime? RefreshTokenExpiryTime { get; set; }
    }
}