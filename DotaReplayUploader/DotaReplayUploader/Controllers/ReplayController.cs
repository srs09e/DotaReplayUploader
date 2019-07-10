using DotaReplayUploader.Models;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using SikuliSharp;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Routing;
using System.IO;
using System.Reflection;
using System.Web;


using Google.Apis.Auth.OAuth2;
using Google.Apis.Services;
using Google.Apis.Upload;
using Google.Apis.YouTube.v3;
using Google.Apis.YouTube.v3.Data;

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
                    CurrentMatch.Status = "Replay In Progress";
                    string imagePath = HttpRuntime.AppDomainAppPath + "Images\\";
                    using (ISikuliSession session = Sikuli.CreateSession())
                    {
                        //session.Click(Patterns.FromFile(imagePath + "CloseButton.PNG"));
                        session.Click(Patterns.FromFile(imagePath + "WatchButton.PNG"));
                        session.Click(Patterns.FromFile(imagePath + "WatchButton.PNG"));
                        session.Click(Patterns.FromFile(imagePath + "ReplaysButton.PNG"));
                        session.Click(Patterns.FromFile(imagePath + "MatchIds.PNG"));
                        session.Type(CurrentMatch.MatchId);
                        session.Click(Patterns.FromFile(imagePath + "SearchButton.PNG"));
                        session.Wait(Patterns.FromFile(imagePath + "DownloadReplayButton.PNG"), 120);
                        session.Click(Patterns.FromFile(imagePath + "DownloadReplayButton.PNG"));
                        session.Click(Patterns.FromFile(imagePath + "MatchIdText.PNG"));
                        session.Wait(Patterns.FromFile(imagePath + "WatchReplayButton.PNG", .9F), 120);
                        session.Click(Patterns.FromFile(imagePath + "WatchReplayButton.PNG"));
                        StartStopRecording();

                        session.Wait(Patterns.FromFile(imagePath + "CollapseButton.PNG"), 300);
                        session.Click(Patterns.FromFile(imagePath + "CollapseButton.PNG"));
                        //Wait 2 hours at most
                        //session.Wait(Patterns.FromFile(imagePath + "WatchReplayButton.PNG"), 7200);
                        try
                        {
                            session.Wait(Patterns.FromFile(imagePath + "WatchReplayButton.PNG"), 60);
                        }
                        catch { };
                        StartStopRecording();
                        //Wait 1 second for the sake of shadowplay's save
                        Thread.Sleep(1000);
                    }
                    //Cleanup Replay File
                    File.Delete(@"D:\Program Files (x86)\Steam\steamapps\common\dota 2 beta\game\dota\replays\" + CurrentMatch.MatchId + ".DEM");
                    CurrentMatch.Done = true;
                    CurrentMatch.ProgressPercentage = 100;
                    LastCompletedMatch = CurrentMatch;
                    CurrentMatch = null;
                    IsBusy = false;
                    CurrentMatch.Status = "Replay Uploading";
                    UploadToYoutube();
                    MakeReplays();
                });
            }

            //Task to give a rough idea of replay progress
            Task progressUpdator = Task.Factory.StartNew(() =>
            {
                DateTime startTime = DateTime.Now;
                while (CurrentMatch != null && !CurrentMatch.Done)
                {
                    CurrentMatch.ProgressPercentage = DateTime.Now.Subtract(startTime).Seconds / int.Parse(CurrentMatch.Duration);
                    Thread.Sleep(2000);
                }
            });
        }

        private static void StartStopRecording()
        {
            //Inline sikuli function to press alt f9 for shadowplay
            using (var runtime = Sikuli.CreateRuntime())
            {
                runtime.Start();

                var result = runtime.Run(
                  @"print ""RESULT: OK"" if keyDown(Key.ALT + Key.F9) else ""RESULT: FAIL""",
                  "RESULT:",
                  0d
                  );

            }
        }
        
        public async static void UploadToYoutube()
        {
            await Upload();
        }

        private static async Task Upload()
        {
            UserCredential credential;
            using (var stream = new FileStream(HttpRuntime.AppDomainAppPath + "client_secrets.json", FileMode.Open, FileAccess.Read))
            {
                credential = await GoogleWebAuthorizationBroker.AuthorizeAsync(
                    GoogleClientSecrets.Load(stream).Secrets,
                    // This OAuth 2.0 access scope allows an application to upload files to the
                    // authenticated user's YouTube channel, but doesn't allow other types of access.
                    new[] { YouTubeService.Scope.YoutubeUpload },
                    "user",
                    CancellationToken.None
                );
            }

            var youtubeService = new YouTubeService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
                ApplicationName = Assembly.GetExecutingAssembly().GetName().Name
            });

            //TODO
            var video = new Video();
            video.Snippet = new VideoSnippet();
            video.Snippet.Title = "Default Video Title";
            video.Snippet.Description = "Default Video Description";
            video.Snippet.Tags = new string[] { "tag1", "tag2" };
            video.Snippet.CategoryId = "22"; // See https://developers.google.com/youtube/v3/docs/videoCategories/list
            video.Status = new VideoStatus();
            video.Status.PrivacyStatus = "unlisted"; // or "private" or "public"

            DirectoryInfo directory = new DirectoryInfo(@"D:\Shadowplay\Dota 2");
            FileInfo myFile = directory.GetFiles()
                         .OrderByDescending(f => f.LastWriteTime)
                         .First();

            var filePath = myFile.FullName; // Replace with path to actual movie file.

            using (var fileStream = new FileStream(filePath, FileMode.Open))
            {
                var videosInsertRequest = youtubeService.Videos.Insert(video, "snippet,status", fileStream, "video/*");
                videosInsertRequest.ProgressChanged += videosInsertRequest_ProgressChanged;
                videosInsertRequest.ResponseReceived += videosInsertRequest_ResponseReceived;

                await videosInsertRequest.UploadAsync();
            }
        }

        private static void videosInsertRequest_ProgressChanged(Google.Apis.Upload.IUploadProgress progress)
        {
            switch (progress.Status)
            {
                case UploadStatus.Uploading:
                    Console.WriteLine("{0} bytes sent.", progress.BytesSent);
                    break;

                case UploadStatus.Failed:
                    Console.WriteLine("An error prevented the upload from completing.\n{0}", progress.Exception);
                    break;
            }
        }

        private static void videosInsertRequest_ResponseReceived(Video video)
        {
            Console.WriteLine("Video id '{0}' was successfully uploaded.", video.Id);
            //TODO delete the video file for clean up.
        }
    }

}
