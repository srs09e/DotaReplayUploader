using DotaReplayUploader.Models;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Routing;

namespace DotaReplayUploader.Controllers
{
    public class MatchesController : BaseSteamController
    {
        private static Dictionary<int, Hero> HeroMap;

        [Route("api/dota/search/matches/players")]
        [HttpPost]
        public async Task<Match[]> GetReplaysViaPlayers(HttpRequestMessage request)
        {
            string jsonString = await request.Content.ReadAsStringAsync();
            JArray players = JArray.Parse(jsonString);

            await GetHeroes();

            List<Match> newMatches = new List<Match>();
            /*
           * For each player in the results find their steam ID
           */
            foreach (JToken playerToken in players)
            {
                Player player = playerToken.ToObject<Player>();

                HttpResponseMessage response = await client.GetAsync(GetMatchHistoryEndpoint + "&account_id=" + player.Id32);
                string content = await response.Content.ReadAsStringAsync();
                JArray matchResults = (JArray)JToken.Parse(content)["result"]["matches"];
                foreach (JToken matchToken in matchResults)
                {
                    Match match = new Match(matchToken);
                    foreach (MatchPlayer matchPlayer in match.Players)
                    {
                        matchPlayer.Hero = HeroMap[matchPlayer.HeroId];
                    }
                    match.SearchedPlayer = player;
                    newMatches.Add(match);
                }
            }

            List<Match> sortedMatches = newMatches.OrderBy(o => o.DateTimeStartTime).Reverse().ToList();
            return sortedMatches.ToArray();
        }

        [Route("api/dota/search/matches")]
        [HttpGet]
        public async Task<MatchDetails> GetMatchDetails(string matchId)
        {
            HttpResponseMessage response = await client.GetAsync(GetMatchDetailsEndpoint + "&match_id=" + matchId + "&include_persona_names=1");
            string content = await response.Content.ReadAsStringAsync();
            JToken resultNode = JToken.Parse(content)["result"];
            MatchDetails matchDetails = new MatchDetails(resultNode);
            JArray players = (JArray)resultNode["players"];
            List<MatchDetailsPlayer> matchDetailsPlayers = new List<MatchDetailsPlayer>();
            foreach (JToken playerToken in players)
            {
                MatchDetailsPlayer matchDetailsPlayer = new MatchDetailsPlayer(playerToken);
                matchDetailsPlayer.Hero = HeroMap[matchDetailsPlayer.HeroId];
                matchDetailsPlayers.Add(matchDetailsPlayer);
            }
            matchDetails.Players = matchDetailsPlayers.ToArray();
            return matchDetails;
        }


    public async Task<Hero[]> GetHeroes()
        {
            if (HeroMap == null)
            {
                HttpResponseMessage response = await client.GetAsync(GetAllHeroesEndpoint);
                string content = await response.Content.ReadAsStringAsync();
                JArray heroResults = (JArray)JToken.Parse(content)["result"]["heroes"];
                HeroMap = new Dictionary<int, Hero>();
                foreach (JToken hero in heroResults)
                {
                    Hero newHero = new Hero(hero);
                    HeroMap.Add(newHero.Id, newHero);
                }
                
            }
            return HeroMap.Values.ToArray();
        }
    }
}
