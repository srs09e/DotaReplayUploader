using DotaReplayUploader.Controllers;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DotaReplayUploader.Models
{
    public class Match
    {
        public Match(JToken jObject)
        {
            MatchId = (string)jObject["match_id"];
            MatchSeqNum = (string)jObject["match_seq_num"];
            double startTime = (double)jObject["start_time"];
            DateTime origin = new DateTime(1970, 1, 1, 0, 0, 0, 0);
            DateTimeStartTime = origin.AddSeconds(startTime).ToLocalTime();
            StartTime = DateTimeStartTime.ToLongDateString() + " " + DateTimeStartTime.ToLongTimeString();
            LobbyType = (string)jObject["lobby_type"];

            JArray playerList = (JArray)jObject["players"];
            List<MatchPlayer> newPlayerList = new List<MatchPlayer>();
            foreach (JToken player in playerList)
            {
                MatchPlayer newPlayer = new MatchPlayer(player);
                newPlayerList.Add(newPlayer);
            }
            Players = newPlayerList.ToArray();

        }
        public Match() { }

        public string MatchId;
        public string MatchSeqNum;
        public string StartTime;
        public string LobbyType;
        public Player SearchedPlayer;
        public MatchPlayer[] Players;
        public DateTime DateTimeStartTime;
    }

    public class MatchPlayer
    {
        public MatchPlayer(JToken player)
        {
            AccountId = (string)player["account_id"];
            HeroId = (int)player["hero_id"];
            PlayerSlot = (string)player["player_slot"];
        }
        public MatchPlayer() { }
        public string AccountId;
        public int HeroId;
        public Hero Hero;
        public string PlayerSlot;
    }

    public class MatchDetails : Match
    {
        public MatchDetails(JToken jToken) : base(jToken)
        {
            Winner = Boolean.Parse((string)jToken["radiant_win"]) ? "Radiant" : "Dire";
            Duration = (string)jToken["duration"];
            RadiantScore = (string)jToken["radiant_score"];
            DireScore = (string)jToken["dire_score"];
        }
        public MatchDetails() : base() { }

        public string Winner;
        public string Duration;
        public string RadiantScore;
        public string DireScore;
    }

    public class MatchDetailsPlayer : MatchPlayer
    {
        public MatchDetailsPlayer(JToken jToken) : base(jToken)
        {
            PersonaName = (string)jToken["persona"];
            Kills = (string) jToken["kills"];
            Deaths = (string)jToken["deaths"];
            Assists = (string)jToken["assists"];
            Level = (string)jToken["level"];
            LastHits = (string)jToken["last_hits"];
            Denies = (string)jToken["denies"];
            GPM = (string)jToken["gold_per_min"];
            XPM = (string)jToken["xp_per_min"];
        }
        public MatchDetailsPlayer() : base() { }

        public string PersonaName;
        public string Kills;
        public string Deaths;
        public string Assists;
        public string Level;
        public string LastHits;
        public string Denies;
        public string GPM;
        public string XPM;
    }

    public class MatchReplayProgress : MatchDetails
    {
        public MatchReplayProgress(JToken jToken) : base(jToken) { }
        public MatchReplayProgress() : base() { }

        public int ProgressPercentage;
        public bool Done;
    }
}