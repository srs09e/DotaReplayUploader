using DotaReplayUploader.Models;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
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

            List<Match> newMatches = new List<Match>();

            /*
           * Add each match sent.
           */
            foreach (JToken matchToken in matches)
            {
                MatchReplayProgress match = matchToken.ToObject<MatchReplayProgress>();
                ReplayCreator.addMatch(match);
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
            List<MatchReplayProgress> currentProgress = new List<MatchReplayProgress>(ReplayCreator.Matches);
            if (ReplayCreator.CurrentMatch != null)
                currentProgress.Insert(0, ReplayCreator.CurrentMatch);
            if (ReplayCreator.LastCompletedMatch != null)
                currentProgress.Insert(0, ReplayCreator.LastCompletedMatch);

            return currentProgress.ToArray();
        }
    }


    /*
     * Place holder class that simulates progress to the client.
     */
    public static class ReplayCreator
    {
        public static Queue<MatchReplayProgress> Matches = new Queue<MatchReplayProgress>();
        public static MatchReplayProgress CurrentMatch;
        public static MatchReplayProgress LastCompletedMatch;
        private static bool IsBusy;

        public static void addMatch(MatchReplayProgress match)
        {
            Matches.Enqueue(match);
            MakeReplays();
        }

        public static void MakeReplays()
        {
            if (!IsBusy && Matches.Count > 0)
            {
                IsBusy = true;
                Task T = Task.Factory.StartNew(() =>
                {
                    CurrentMatch = Matches.Dequeue();
                    for (int i = 1; i <= 100; i++)
                    {
                        CurrentMatch.ProgressPercentage = i;
                        Thread.Sleep(2000);
                    }
                    CurrentMatch.Done = true;
                    LastCompletedMatch = CurrentMatch;
                    IsBusy = false;
                    MakeReplays();
                });
            }
        }

    }
}
