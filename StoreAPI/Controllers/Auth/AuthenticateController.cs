using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using StoreAPI.Models.Auth;

namespace StoreAPI.Controllers.Auth;

[ApiController]
[Route("api/[controller]")]
public class AuthenticateController : ControllerBase
{

    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IConfiguration _configuration;

    // Constructor
    public AuthenticateController(UserManager<ApplicationUser> userManager
                                , RoleManager<IdentityRole> roleManager
                                , IConfiguration configuration)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _configuration = configuration;
    }

    [HttpPost]
    [Route("register")]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {
        var response = await RegisterAsync(model);
        return StatusCode((int)response.Status, response);
    }

    private async Task<AuthResponse> RegisterAsync(RegisterModel model)
    {
        // เช็คว่ามี username นี้ในระบบแล้วหรือไม่
        var userExist = await _userManager.FindByNameAsync(model.Username);
        if (userExist != null)
        {
            return new AuthResponse
            {
                Status = HttpStatusCode.InternalServerError,
                MessageCode = "Error",
                Message = "User already exist!"
            };
        }

        ApplicationUser user = new()
        {
            Email = model.Email,
            SecurityStamp = Guid.NewGuid().ToString(),
            UserName = model.Username,

            //customm
            FirstName = model.FirstName,
            LastName = model.LastName
        };

        // สร้าง user ใหม่
        var result = await _userManager.CreateAsync(user, model.Password);
        
        // ถ้าสร้างไม่สำเร็จ
        if (!result.Succeeded){
            return new AuthResponse
            {
                Status = HttpStatusCode.InternalServerError,
                MessageCode = "Error",
                Message = "User creation failed! Please check user details and try again."
            };
        }

        await _userManager.AddToRoleAsync(user, UserRoles.User);

        return new AuthResponse
        {
            Status = HttpStatusCode.OK,
            MessageCode = "Success",
            Message = "User created successfully!"
        };
    }

    [HttpPost]
    [Route("register-admin")]
    public async Task<IActionResult> RegisterAdmin([FromBody] RegisterModel model)
    {
        var response = await RegisterAdminAsync(model);
        return StatusCode((int)response.Status, response);
    }

    private async Task<AuthResponse> RegisterAdminAsync(RegisterModel model)
    {
        var userExist = await _userManager.FindByNameAsync(model.Username);
        if (userExist != null)
        {
            return new AuthResponse
            {
                Status = HttpStatusCode.InternalServerError,
                MessageCode = "Error",
                Message = "User already exist!"
            };
        }

        ApplicationUser user = new()
        {
            Email = model.Email,
            SecurityStamp = Guid.NewGuid().ToString(),
            UserName = model.Username,

            //customm
            FirstName = model.FirstName,
            LastName = model.LastName
        };

        var result = await _userManager.CreateAsync(user, model.Password);
        
        if (!result.Succeeded){
            return new AuthResponse
            {
                Status = HttpStatusCode.InternalServerError,
                MessageCode = "Error",
                Message = "User creation failed! Please check user details and try again."
            };
        }

        await _userManager.AddToRoleAsync(user, UserRoles.User);

        return new AuthResponse
        {
            Status = HttpStatusCode.OK,
            MessageCode = "Success",
            Message = "User created successfully!"
        };
    }

    // // Register Role
    // [HttpPost]
    // [Route("register-role")]
    // public async Task<IActionResult> RegisterRole([FromBody] RegisterRoleModel model)
    // {
    //     if (!await _roleManager.RoleExistsAsync(model.Role))
    //         await _roleManager.CreateAsync(new IdentityRole(model.Role));

    //     return Ok(new Response { Status = "Success", Message = "Role created successfully!" });
    // }

    [HttpPost]
    [Route("register-manager")]
    public async Task<IActionResult> RegisterManager([FromBody] RegisterModel model)
    {
        var response = await RegisterManagerAsync(model);
        return StatusCode((int)response.Status, response);
    }

    private async Task<AuthResponse> RegisterManagerAsync(RegisterModel model){
        var userExist = await _userManager.FindByNameAsync(model.Username);
        if (userExist != null)
        {
            return new AuthResponse
            {
                Status = HttpStatusCode.InternalServerError,
                MessageCode = "Error",
                Message = "User already exist!"
            };
        }

        ApplicationUser user = new()
        {
            Email = model.Email,
            SecurityStamp = Guid.NewGuid().ToString(),
            UserName = model.Username,

            //customm
            FirstName = model.FirstName,
            LastName = model.LastName
        };

        var result = await _userManager.CreateAsync(user, model.Password);
        
        if (!result.Succeeded){
            return new AuthResponse
            {
                Status = HttpStatusCode.InternalServerError,
                MessageCode = "Error",
                Message = "User creation failed! Please check user details and try again."
            };
        }

        //await CheckRole();

        await _userManager.AddToRoleAsync(user, UserRoles.Admin);

        return new AuthResponse
        {
            Status = HttpStatusCode.OK,
            MessageCode = "Success",
            Message = "User created successfully!"
        };
    }

    [HttpPost]
    [Route("seed-role")]
    public async Task<IActionResult> SeedRole(String pToken)
    {
        if (pToken == null)
        {
            return Unauthorized(new
            {
                IsSucceed = false,
                Message = "token not found"
            });
        }

        if (pToken != "123456")
        {
            return Unauthorized(new
            {
                IsSucceed = false,
                Message = "Invalid token"
            });
        }

        await CheckRole();
        return Ok(new
        {
            IsSucceed = true,
            Message = "Role created successfully!"
        });
    }

    private async Task CheckRole()
    {
        if (!await _roleManager.RoleExistsAsync(UserRoles.Admin))
            await _roleManager.CreateAsync(new IdentityRole(UserRoles.Admin));
        if (!await _roleManager.RoleExistsAsync(UserRoles.Manager))
            await _roleManager.CreateAsync(new IdentityRole(UserRoles.Manager));
        if (!await _roleManager.RoleExistsAsync(UserRoles.User))
            await _roleManager.CreateAsync(new IdentityRole(UserRoles.User));
    }

    [HttpPost]
    [Route("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        var response = await LoginAsync(model);
        return StatusCode((int)response.Status, response);
    }

    private async Task<AuthResponse> LoginAsync(LoginModel model)
    {
        var user = await _userManager.FindByNameAsync(model.Username!);

        if (user is null)
        {
            return new AuthResponse
            {
                Status = HttpStatusCode.Unauthorized,
                MessageCode = "Error",
                Message = "Credentials not found"
            };
        }

        bool isPasswordCorrect = await _userManager.CheckPasswordAsync(user, model.Password);
        if (!isPasswordCorrect)
        {
            return new AuthResponse
            {
                Status = HttpStatusCode.Unauthorized,
                MessageCode = "Error",
                Message = "Invalid Credentials"
            };
        }

        var userRoles = await _userManager.GetRolesAsync(user);

        var authClaims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.UserName!),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new("FirstName", user.FirstName),
            new("LastName", user.LastName),
        };

        foreach (var userRole in userRoles)
        {
            authClaims.Add(new Claim(ClaimTypes.Role, userRole));
        }

        var token = GenerateAccessToken(authClaims);
        var refreshToken = GenerateRefreshToken();
        _ = int.TryParse(_configuration["JWT:RefreshTokenValidityInDays"], out int refreshTokenValidityInDays);
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.Now.AddDays(refreshTokenValidityInDays).ToUniversalTime();
        
        await _userManager.UpdateAsync(user);

        return new AuthResponse
        {
            Status = HttpStatusCode.OK,
            MessageCode = "Success",
            Message = "Login successful",
            accessToken = new JwtSecurityTokenHandler().WriteToken(token),
            refreshToken = refreshToken
        };
    }

    [HttpPost]
    [Route("logout")]
    public async Task<IActionResult> Logout()
    {
        var response = await LogoutAsync();
        return StatusCode((int)response.Status, response);
    }

    private async Task<AuthResponse> LogoutAsync()
    {
        var userName = User.Identity?.Name;
        if (userName != null)
        {
            var user = await _userManager.FindByNameAsync(userName);
            if (user != null)
            {
                await _userManager.UpdateSecurityStampAsync(user);
                return new AuthResponse
                {
                    Status = HttpStatusCode.OK,
                    MessageCode = "Success",
                    Message = "User logged out!"
                };
            }
        }
        return new AuthResponse
        {
            Status = HttpStatusCode.OK,
            MessageCode = "Success",
            Message = "User logged out!"
        };
    }

    // Method for generating JWT token
    private JwtSecurityToken GenerateAccessToken(List<Claim> authClaims)
    {
        var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]!));
        _ = int.TryParse(_configuration["JWT:AccessTokenValidityInMinutes"], out int AccessTokenValidityInMinutes);

        var token = new JwtSecurityToken(
            issuer: _configuration["JWT:ValidIssuer"],
            audience: _configuration["JWT:ValidAudience"],
            expires: DateTime.Now.AddMinutes(AccessTokenValidityInMinutes),
            claims: authClaims,
            signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
        );
        return token; 
    }

    private static string GenerateRefreshToken()
    {
        var randomNumber = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }


    [HttpPost]
    //[Route("revoke-alltoken")]
    [Authorize(Roles = UserRoles.Admin)]
    public async Task<IActionResult> RevokeAllToken()
    {
        var response = await RevokeAllTokenAsync();
        return StatusCode((int)response.Status, response);
    }

    private async Task<AuthResponse> RevokeAllTokenAsync()
    {
        var users = _userManager.Users.ToList();
        foreach (var user in users)
        {
            user.RefreshToken = null;
            await _userManager.UpdateAsync(user);
        }

        return new AuthResponse
        {
            Status = HttpStatusCode.OK,
            MessageCode = "Success",
            Message = "All Refresh token has been revoked"
        };
    }


    [HttpPost]
    [Route("revoke")]
    //[Authorize(Roles = UserRoles.Admin)]
    public async Task<IActionResult> Revoke([FromBody] String pUsername)
    {
        var response = await RevokeAsync(pUsername);
        return StatusCode((int)response.Status, response);
    }

    private async Task<BaseResponse> RevokeAsync(string username)
    {
        var user = await _userManager.FindByNameAsync(username);
        if (user == null) return new BaseResponse()
        {
            Status = HttpStatusCode.NotFound,
            Message = "Invalid user name"
        }; //return BadRequest("Invalid user name");

        user.RefreshToken = null;
        await _userManager.UpdateAsync(user);

        return new BaseResponse()
        {
            Status = HttpStatusCode.OK,
            Message = "Refresh token has been revoked"
        };
    }
}