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
                let addPlayers = [...state.selectedPlayers];
                if (addPlayers.find((value) => {
                    if (value.Id == action.player.Id)
                        return true;
                })) {
                    //If player is already added, dont update anything
                    return state;
                }
                addPlayers.push(action.player);
                return Object.assign({}, state, { selectedPlayers: addPlayers });
        //Removes a player from the selected list.
        case messages.REMOVE_PLAYER_FROM_QUERY:
                let foundIdx = -1;
                let removePlayers = [...state.selectedPlayers];
                if (removePlayers.find((value, index) => {
                    if (value.Id == action.player.Id) {
                        foundIdx = index;
                        return true;
                    }
                })) {
                    removePlayers.splice(foundIdx, 1);
                }
                return Object.assign({}, state, { selectedPlayers: removePlayers });
        //Update the current table and loading state.
        case messages.MATCH_SEARCH_QUERY:
            return Object.assign({}, state, { activeQuery: true, currentTable: MATCH_SEARCH });
        //Update the stored match search result.
        case messages.MATCH_SEARCH_RESULTS:
            return Object.assign({}, state, { activeQuery: false, matchSearchResults: action.matchSearchResults });
        //Updates the loading details state of a given match.
        case messages.MATCH_DETAILS_QUERY:
            let detailMatches = [...state.matchSearchResults];
            detailMatches.find((value) => {
                if (value.MatchId == action.matchId) {
                    value.LoadingDetails = true;
                    return true;
                }
            });
            return Object.assign({}, state, { matchSearchResults: detailMatches });
        //Updates the loading details state of a given match.
        case messages.MATCH_DETAILS_RESULT:
            let resultMatches = [...state.matchSearchResults];
            resultMatches.find((value) => {
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
            return Object.assign({}, state, { matchSearchResults: resultMatches });
        //Adds a searched match to the potential replays.
        case messages.ADD_MATCH_TO_REPLAYS: {
            let addReplays = [...state.matchReplays];
            if (addReplays.find((value) => {
                if (value.MatchId == action.match.MatchId)
                    return true;
            })) {
                return state;
            }
            addReplays.push(action.match);
            return Object.assign({}, state, { matchReplays: addReplays });
        }
        //Removes a searched match from the potential replays.
        case messages.REMOVE_MATCH_FROM_REPLAYS: {
            let removeReplays = [...state.matchReplays];
            if (removeReplays.find((value, index) => {
                if (value.MatchId == action.match.MatchId) {
                    foundIdx = index;
                    return true;
                }
            })) {
                removeReplays.splice(foundIdx, 1);
            }
            return Object.assign({}, state, { matchReplays: removeReplays });
        }
        //Clears out the match replays since they were added to the queue.
        case messages.QUEUE_CURRENT_MATCHES: {
            return Object.assign({}, state, { matchReplays: [] });
        }
        //Sets the queued match replay value.
        case messages.REPLAY_QUEUE_UPDATE: {
            let queueReplays = [...state.queuedMatchReplays];
            if (action.replays) {
                queueReplays = action.replays;
            }
            return Object.assign({}, state, { queuedMatchReplays: queueReplays });
        }
        default:
            return state
    }
}