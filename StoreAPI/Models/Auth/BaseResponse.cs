using System.Net;

namespace StoreAPI.Models.Auth;
public class BaseResponse
{
    public HttpStatusCode Status { get; set; }
    public string? MessageCode { get; set;}
    public string? Message { get; set; }
}