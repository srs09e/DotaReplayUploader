using DotaReplayUploader.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using SikuliSharp;
using System.Threading;
using System.Threading.Tasks;
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
    public class ReplayCreator
    {
        private static ReplayCreator _instance;
        public static ReplayCreator Instance
        {
            get
            {
                if (_instance == null)
                {
                    _instance = new ReplayCreator();
                }
                return _instance;
            }
        }

        public Queue<MatchReplayProgress> Matches = new Queue<MatchReplayProgress>();
        public MatchReplayProgress CurrentMatch;
        public MatchReplayProgress LastCompletedMatch;
        private bool IsBusy;

        public void addMatch(MatchReplayProgress match)
        {
            Matches.Enqueue(match);
            MakeReplays();
        }

        public void MakeReplays()
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
                        WaitAndClick(session, imagePath + "WatchButton.PNG");
                        WaitAndClick(session, imagePath + "WatchButton.PNG");
                        WaitAndClick(session, imagePath + "ReplaysButton.PNG");
                        WaitAndClick(session, imagePath + "MatchIds.PNG");
                        session.Type(CurrentMatch.MatchId);
                        WaitAndClick(session, imagePath + "SearchButton.PNG");
                        WaitAndClick(session, imagePath + "DownloadReplayButton.PNG");
                        WaitAndClick(session, imagePath + "MatchIdText.PNG");
                        WaitAndClick(session, imagePath + "WatchReplayButton.PNG", .9F);
                        StartStopRecording();

                        WaitAndClick(session, imagePath + "CollapseButton.PNG", .7f, 300);
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
                    YoutubeUploader.UploadToYoutube();
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

        private void WaitAndClick(ISikuliSession session, string fileName, float matchPercentage = .7f, int waitSeconds = 120)
        {
            session.Wait(Patterns.FromFile(fileName, matchPercentage), waitSeconds);
            session.Click(Patterns.FromFile(fileName, matchPercentage));
        }

        private void StartStopRecording()
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
    }
}
