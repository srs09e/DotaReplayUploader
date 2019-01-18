using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DotaReplayUploader.Models
{
    public class Player
    {
        public Player(string alias, string vanityUrl, string id, string avatarUrl)
        {
            Alias = alias;
            VanityUrl = vanityUrl;
            Id = id;
            if (id.Length > 0)
            {
                Id32 = ((Int32)Int64.Parse(Id)).ToString();
            }
            AvatarUrl = avatarUrl;
        }
        public string Alias;
        public string VanityUrl;
        public string Id;
        public string Id32;
        public string AvatarUrl;
    }

    public class SteamIdResponse
    {
        public string steamId;
    }
}