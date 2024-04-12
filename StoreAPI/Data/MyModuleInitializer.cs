using System.Runtime.CompilerServices;

namespace StoreAPI.Data;

public static class MyModuleInitializer
{
    //Ref https://www.npgsql.org/doc/release-notes/6.0.html#breaking-changes
    //https://stackoverflow.com/a/73586129/20000255
    [ModuleInitializer]
    public static void Initialize()
    {
        AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
    }
}