module.exports = function (app) {
    var replayController = require('../controllers/replayController');
    var matchesController = require('../controllers/matchesController');
    var playerController = require('../controllers/playerController');

    // todoList Routes
    // app.route('api/dota/replay/queueMatches')
    //     .get(replayController.get_current_queue)
    //     .post(replayController.queue_replay);


    // app.route('api/dota/search/matches/players')
    //     .get(matchesController.get_replays_via_players);

    // app.route('api/dota/search/matches')
    //     .get(matchesController.get_match_details);

    app.get('/api/dota/search/player',playerController.search_player);
};