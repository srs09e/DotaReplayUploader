using MongoDB.Bson;
using MongoDB.Driver;

namespace DotaReplayUploader.Controllers
{
    public class MongoDbController
    {

        private static MongoDbController _instance;
        public static MongoDbController Instance
        {
            get
            {
                if (_instance == null)
                {
                    _instance = new MongoDbController();
                }
                return _instance;
            }
        }

        public MongoDbController()
        {
            var client = new MongoClient("mongodb+srv://<username>:<password>@<cluster-address>/test");
            var database = client.GetDatabase("test");
        }
    }
}
