using DotaReplayUploader.Models;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Routing;

namespace DotaReplayUploader.Controllers
{
    public class ReplayController : BaseSteamController
    {
        /*
         * Adds a replay to the upload queue. 
         */
        [Route("api/dota/replay/queueMatches")]
        [HttpPost]
        public async Task<IHttpActionResult> QueueReplay(HttpRequestMessage request)
        {
            string jsonString = await request.Content.ReadAsStringAsync();
            JArray matches = JArray.Parse(jsonString);

            List<DotaMatch> newMatches = new List<DotaMatch>();

            /*
           * Add each match sent.
           */
            foreach (JToken matchToken in matches)
            {
                MatchReplayProgress match = matchToken.ToObject<MatchReplayProgress>();
                //Get the duration so we can monitor replay progress
                MatchDetails md = await MatchesController.GetDetailsFromMatch(match.MatchId);
                match.Duration = md.Duration;
                ReplayCreator.Instance.addMatch(match);
            }
            return Ok();
        }

        /*
         * Returns the current replay queue. 
         * 
         */
        [Route("api/dota/replay/queueMatches")]
        [HttpGet]
        public async Task<MatchReplayProgress[]> GetCurrentQueue()
        {
            List<MatchReplayProgress> currentProgress = new List<MatchReplayProgress>(ReplayCreator.Instance.Matches);
            if (ReplayCreator.Instance.CurrentMatch != null)
                currentProgress.Insert(0, ReplayCreator.Instance.CurrentMatch);
            if (ReplayCreator.Instance.LastCompletedMatch != null)
                currentProgress.Insert(0, ReplayCreator.Instance.LastCompletedMatch);

            return currentProgress.ToArray();
        }
    }
}

