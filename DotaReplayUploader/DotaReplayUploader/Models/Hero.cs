using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DotaReplayUploader.Models
{
    public class Hero
    {
        string[] heroNames =
        {
            "Anti-Mage",
            "Axe",
            "Bane",
            "Bloodseeker",
            "Crystal Maiden",
            "Drow Ranger",
            "Earthshaker",
            "Juggernaut",
            "Mirana",
            "Morphling",
            "Shadow Fiend" ,
            "Phantom Lancer",
            "Puck",
            "Pudge",
            "Razor",
            "Sand King",
            "Storm Spirit",
            "Sven",
            "Tiny",
            "Vengeful Spirit",
            "Windranger",
            "Zeus",
            "Kunkka",
            "UNKNOWN",
            "Lina",
            "Lion",
            "Shadow Shaman",
            "Slardar",
            "Tidehunter",
            "Witch Doctor",
            "Lich",
            "Riki",
            "Enigma",
            "Tinker",
            "Sniper",
            "Necrophos",
            "Warlock",
            "Beastmaster",
            "Queen Of Pain",
            "Venomancer",
            "Faceless Void",
            "Wraith King",
            "Death Prophet",
            "Phantom Assassin",
            "Pugna",
            "Templar Assassin",
            "Viper",
            "Luna",
            "Dragon Knight",
            "Dazzle",
            "Clockwerk",
            "Leshrac",
            "Nature's Prophet",
            "Lifestealer",
            "Dark Seer",
            "Clinkz",
            "Omniknight",
            "Enchantress",
            "Huskar",
            "Night Stalker",
            "Broodmother",
            "Bounty Hunter",
            "Weaver",
            "Jakiro",
            "Batrider",
            "Chen",
            "Spectre",
            "Ancient Apparition",
            "Doom",
            "Ursa",
            "Spirit Breaker",
            "Gyrocopter",
            "Alchemist",
            "Invoker",
            "Silencer",
            "Outworld Devourer",
            "Lycan",
            "Brewmaster",
            "Shadow Demon",
            "Lone Druid",
            "Chaos Knight",
            "Meepo",
            "Treant",
            "Ogre Magi",
            "Undying",
            "Rubick",
            "Disruptor",
            "Nyx Assassin",
            "Naga Siren",
            "Keeper of the Light",
            "Wisp",
            "Visage",
            "Slark",
            "Medusa",
            "Troller Warlord",
            "Centaur",
            "Magnus",
            "Timbersaw",
            "Bristleback",
            "Tusk",
            "Skywrath Mage",
            "Abaddon",
            "Elder Titan",
            "Legion Commander",
            "Techies",
            "Ember Spirit",
            "Earth Spirit",
            "Underlord",
            "Terrorblade",
            "Phoenix",
            "Oracle",
            "Winter Wyvern",
            "Arc Warden",
            "Monkey King",
            "UNKNOWN",
            "UNKNOWN",
            "UNKNOWN",
            "UNKNOWN",
            "Dark Willow",
            "Pangolier",
            "Grimstroke",
            "Mars"
        };

        public Hero(JToken jToken)
        {
            Id = (int)jToken["id"];
            LongName = (string)jToken["name"];
            try
            {
                Name = heroNames[Id - 1];
            } catch
            {
                Name = "UNKNOWN";
            }
        }

        public Hero()
        {

        }

        public int Id;
        public string Name;
        public string LongName;
    }



}