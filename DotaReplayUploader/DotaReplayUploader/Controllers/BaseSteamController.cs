using System.Net.Http;
using System.Web.Http;

namespace DotaReplayUploader.Controllers
{
    public abstract class BaseSteamController : ApiController
    {
        protected static HttpClient client = new HttpClient();

        protected const string ApiKey = "D4240739D255FABEAB9EFBB0BD24EE71";
        protected const string GetAllHeroesEndpoint = "https://api.steampowered.com/IEconDOTA2_570/GetHeroes/v1/?key=" + ApiKey;
        protected const string ResolveVanityUrlEndpoint = "https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=" + ApiKey;
        protected const string GetMatchHistoryEndpoint = "https://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/v1/?key=" + ApiKey;
        protected const string GetMatchDetailsEndpoint = "https://api.steampowered.com/IDOTA2Match_570/GetMatchDetails/v1/?key=" + ApiKey;
    }
}
