using Newtonsoft.Json;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Xml;
using OpenQA.Selenium.Support.UI;
using DotaReplayUploader.Models;
using Newtonsoft.Json.Linq;

namespace DotaReplayUploader.Controllers
{
    public class PlayerController : BaseSteamController
    {
        
        /*
         * Searches the steam community for a player.
         */ 
        [Route("api/dota/search/player")]
        [HttpGet]
        public async Task<Player[]> SearchPlayer(string playerName)
        {
            /*
             * There is no search functionality for finding a player on Steam, so we have to piggy back off of the actual community search page.
             * Scrape what we need off it.
             */
            ChromeOptions option = new ChromeOptions();
            option.AddArgument("--headless");
            IWebDriver driver = new ChromeDriver(option);

            driver.Navigate().GoToUrl("https://steamcommunity.com/search/users/#text=" + playerName);
            HtmlNode resultNode = null;
            WebDriverWait waiter = new WebDriverWait(driver, new TimeSpan(0, 1, 0));
            /*
             * Search Results load Async
             */
            waiter.Until(d => {
                string html = driver.PageSource;
                HtmlDocument htmlDoc = new HtmlDocument();
                htmlDoc.LoadHtml(html);
                resultNode = htmlDoc.GetElementbyId("search_results");
                HtmlNode loadingNode = null;
                if (resultNode != null && resultNode.HasChildNodes && resultNode.ChildNodes.Count > 0)
                {
                    loadingNode = resultNode.ChildNodes[1];
                }
                return loadingNode == null || !loadingNode.Attributes["class"].Value.Equals("LoadingWrapper");
            });
            HtmlNodeCollection searchResults = resultNode.ChildNodes;
            List<Player> playerResults = new List<Player>();
            foreach (HtmlNode resultChildNode in searchResults)
            {
                try
                {
                    if (resultChildNode.Name == "div" && resultChildNode.Attributes["class"] != null && resultChildNode.Attributes["class"].Value == "search_row")
                {
                        string alias = resultChildNode.ChildNodes[3].ChildNodes[1].InnerText;
                        string vanityUrl = resultChildNode.ChildNodes[3].ChildNodes[1].Attributes["href"].Value;
                        string id = "";
                        if ( vanityUrl.IndexOf("https://steamcommunity.com/profiles") >= 0)
                        {
                            id = vanityUrl.Substring(vanityUrl.LastIndexOf('/') + 1);
                            vanityUrl = id;
                        } else
                        {
                            vanityUrl = vanityUrl.Substring(vanityUrl.LastIndexOf('/') + 1);
                        }
                        string avatarUrl = resultChildNode.ChildNodes[1].ChildNodes[0].ChildNodes[0].ChildNodes[0].Attributes["src"].Value;
                        Player newPlayer = new Player(alias, vanityUrl, id, avatarUrl);
                        playerResults.Add(newPlayer);
                    
                }
                }
                catch (Exception e)
                {
                    //TODO
                    Console.WriteLine(e);
                }
            }

            /*
             * For each player in the results find their steam ID
             */
            foreach (Player player in playerResults)
            {
                if (player.Id.Length == 0)
                {
                    HttpResponseMessage response = await client.GetAsync(ResolveVanityUrlEndpoint + "&vanityurl=" + player.VanityUrl);
                    string content = await response.Content.ReadAsStringAsync();
                    JObject jsonObject = JObject.Parse(content);
                    player.Id = (string)((JObject)jsonObject.GetValue("response")).GetValue("steamid");
                    player.Id32 = ((Int32)Int64.Parse(player.Id)).ToString();
                }
            }
            
            driver.Close();

            return playerResults.ToArray();
        }
    }
}
