namespace StoreAPI.Models.Auth;
public class AuthResponse : BaseResponse
{
    public string accessToken { get; set; }
    public string refreshToken { get; set; }
}