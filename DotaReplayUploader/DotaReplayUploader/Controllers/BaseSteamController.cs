using System.Net.Http;
using System.Web.Http;

namespace DotaReplayUploader.Controllers
{
    public abstract class BaseSteamController : ApiController
    {
        protected static HttpClient client = new HttpClient();

        protected const string ApiKey = "6A6D20F570231ED182B34AEDFF1DACD8";
        protected const string MyId = "76561197975498171";
        protected const string GetAllHeroesEndpoint = "https://api.steampowered.com/IEconDOTA2_570/GetHeroes/v1/?key=" + ApiKey;
        protected const string ResolveVanityUrlEndpoint = "https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=" + ApiKey;
        protected const string GetMatchHistoryEndpoint = "https://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/v1/?key=" + ApiKey;
        protected const string GetMatchDetailsEndpoint = "https://api.steampowered.com/IDOTA2Match_570/GetMatchDetails/v1/?key=" + ApiKey;
    }
}
