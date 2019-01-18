import * as messages from '../types/message';

/**
 * Updates the input search text.
 * @param {*} searchText 
 */
export function playerSearchChange(searchText) {
    return { type:messages.PLAYER_SEARCH_CHANGE, text:searchText };
}

/**
 * Sent before a player search query.
 */
export function playerSearchQuery() {
    return { type:messages.PLAYER_SEARCH_QUERY };
}

/**
 * Result of a player search query. Data contained in playerSearchResults.
 * @param {*} players 
 */
export function playerSearchResults(players) {
    return { type:messages.PLAYER_SEARCH_RESULTS, playerSearchResults: players }
}

/**
 * Adds a player from a player search result to the player search match list.
 * @param {*} player 
 */
export function addPlayerToQuery(player) {
    return { type:messages.ADD_PLAYER_TO_QUERY, player:player };
}

/**
 * Removes a player from the player search match list.
 * @param {*} player 
 */
export function removePlayerFromQuery(player) {
    return { type:messages.REMOVE_PLAYER_FROM_QUERY, player:player };
}

/**
 * Sent before a match search query.
 */
export function matchSearchQuery() {
    return { type:messages.MATCH_SEARCH_QUERY};
}

/**
 * Result of a match search query. Data contained in matchSearchResults.
 * @param {*} matches 
 */
export function matchSearchResults(matches) {
    return { type:messages.MATCH_SEARCH_RESULTS, matchSearchResults: matches};
}

/**
 * Sent before a match details query. The associated match is in match.
 * @param {*} matchId
 */
export function matchDetailsQuery(matchId) {
    return { type:messages.MATCH_DETAILS_QUERY, matchId: matchId};
}

/**
 * Result of a match details query. Data contained in matchDetailsResult
 * @param {*} matchDetails 
 */
export function matchDetailsResult(matchDetails) {
    return { type:messages.MATCH_DETAILS_RESULT, matchDetailsResult: matchDetails};
}

/**
 * Adds a match to potential replay list.
 * @param {*} match 
 */
export function addMatchToReplays(match) {
    return { type:messages.ADD_MATCH_TO_REPLAYS, match: match};
}

/**
 * Removes a match from the potential replay list.
 * @param {*} match 
 */
export function removeMatchFromReplays(match) {
    return { type:messages.REMOVE_MATCH_FROM_REPLAYS, match: match};
}

/**
 * Adds every match in the potential replay list to a queue.
 */
export function queueCurrentMatches() {
    return { type:messages.QUEUE_CURRENT_MATCHES};
}

/**
 * Sent after a replay queue poll. Matches current being processed in replays
 * @param {*} replays 
 */
export function replayQueueUpdate(replays) {
    return { type:messages.REPLAY_QUEUE_UPDATE, replays: replays};
}