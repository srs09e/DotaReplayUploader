import * as messages from '../types/message';
const initState = {
    //Search box query value
    playerSearchQuery: "",
    //Whether a quey is currently being executed.
    activeQuery: false,
    //Results of player search
    playerSearchResults: [],
    //Players to search matches on
    selectedPlayers: [],
    //Results of a match search
    matchSearchResults: [],
    //What the current table in the right pane is
    currentTable: PLAYER_SEARCH,
    //Matches to be added to queued match replays.
    matchReplays: [],
    //Current queued match replays.
    queuedMatchReplays: []
}

//The current query being performed.
export const PLAYER_SEARCH = "PLAYER_SEARCH";
export const MATCH_SEARCH = "MATCH_SEARCH";

export default (state = initState, action) => {
    switch (action.type) {
        //Update the search text.
        case messages.PLAYER_SEARCH_CHANGE:
            return Object.assign({}, state, { playerSearchQuery: action.text });
        //Update the current table and loading state.
        case messages.PLAYER_SEARCH_QUERY:
            return Object.assign({}, state, { activeQuery: true, currentTable: PLAYER_SEARCH });
        //Update the stored player search result.
        case messages.PLAYER_SEARCH_RESULTS:
            return Object.assign({}, state, { activeQuery: false, playerSearchResults: action.playerSearchResults });
        //Add a player to the selected list if they aren't already.
        case messages.ADD_PLAYER_TO_QUERY:
            if (state.selectedPlayers.find((value) => {
                if (value.Id == action.player.Id)
                    return true;
            })) {
                return state;
            }
            state.selectedPlayers.push(action.player);
            return Object.assign({}, state);
        //Removes a player from the selected list.
        case messages.REMOVE_PLAYER_FROM_QUERY:
            var foundIdx = -1;
            if (state.selectedPlayers.find((value, index) => {
                if (value.Id == action.player.Id) {
                    foundIdx = index;
                    return true;
                }
            })) {
                state.selectedPlayers.splice(foundIdx, 1);
            }
            return Object.assign({}, state);
        //Update the current table and loading state.
        case messages.MATCH_SEARCH_QUERY:
            return Object.assign({}, state, { activeQuery: true, currentTable: MATCH_SEARCH });
        //Update the stored match search result.
        case messages.MATCH_SEARCH_RESULTS:
            return Object.assign({}, state, { activeQuery: false, matchSearchResults: action.matchSearchResults });
        //Updates the loading details state of a given match.
        case messages.MATCH_DETAILS_QUERY:
            var foundIdx = -1;
            state.matchSearchResults.find((value) => {
                if (value.MatchId == action.matchId) {
                    value.LoadingDetails = true;
                    return true;
                }
            });
            return Object.assign({}, state);
        //Updates the loading details state of a given match.
        case messages.MATCH_DETAILS_RESULT:
            var foundIdx = -1;
            state.matchSearchResults.find((value) => {
                if (value.MatchId == action.matchDetailsResult.MatchId) {
                    value.LoadingDetails = false;
                    value.HasDetails = true;
                    //Match Details query didn't know about searched player so reassign after copy.
                    let searchedPlayer = value.SearchedPlayer;
                    Object.assign(value, action.matchDetailsResult);
                    value.SearchedPlayer = searchedPlayer;
                    return true;
                }
            });
            return Object.assign({}, state);
        //Adds a searched match to the potential replays.
        case messages.ADD_MATCH_TO_REPLAYS: {
            if (state.matchReplays.find((value) => {
                if (value.MatchId == action.match.MatchId)
                    return true;
            })) {
                return state;
            }
            state.matchReplays.push(action.match);
            return Object.assign({}, state);
        }
        //Removes a searched match from the potential replays.
        case messages.REMOVE_MATCH_FROM_REPLAYS: {
            var foundIdx = -1;
            if (state.matchReplays.find((value, index) => {
                if (value.MatchId == action.match.MatchId) {
                    foundIdx = index;
                    return true;
                }
            })) {
                state.matchReplays.splice(foundIdx, 1);
            }
            return Object.assign({}, state);
        }
        //Clears out the match replays since they were added to the queue.
        case messages.QUEUE_CURRENT_MATCHES: {
            state.matchReplays = [];
            return Object.assign({}, state);
        }
        //Sets the queued match replay value.
        case messages.REPLAY_QUEUE_UPDATE: {
            if (action.replays) {
                state.queuedMatchReplays = action.replays;
            }
            return Object.assign({}, state);
        }
        default:
            return state
    }
}