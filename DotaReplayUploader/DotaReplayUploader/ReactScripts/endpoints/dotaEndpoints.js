
/**
 * Player search method - finds playernames with the given string.
 * @param {*} playerName 
 * @param {*} okCallBack 
 */
export function getPlayerViaNickname(playerName = "", okCallBack) {
    const request = new XMLHttpRequest();
    request.open("GET", "api/dota/search/player?playerName=" + playerName, true);
    request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    request.send();
    request.onreadystatechange = () => {
        if (request.readyState == request.DONE && request.status == 200)
            okCallBack(JSON.parse(request.responseText));
    }
}

/**
 * Searches for matches via a list of select players.
 * @param {*} selectedPlayers 
 * @param {*} okCallBack 
 */
export function getMatchesViaPlayers(selectedPlayers = [], okCallBack) {
    const request = new XMLHttpRequest();
    request.open("POST", "api/dota/search/matches/players", true);
    request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    request.send(JSON.stringify(selectedPlayers));
    request.onreadystatechange = () => {
        if (request.readyState == request.DONE && request.status == 200)
            okCallBack(JSON.parse(request.responseText));
    }
}

/**
 * Retrieves the details of a given matchId.
 * @param {*} matchId 
 * @param {*} okCallBack 
 */
export function getMatchDetails(matchId, okCallBack) {
    const request = new XMLHttpRequest();
    request.open("GET", "api/dota/search/matches?matchId=" + matchId, true);
    request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    request.send();
    request.onreadystatechange = () => {
        if (request.readyState == request.DONE && request.status == 200)
            okCallBack(JSON.parse(request.responseText));
    }
}

/**
 * Adds every match to the replay queue
 * @param {*} matches 
 * @param {*} okCallBack 
 */
export function queueMatchesForReplay(matches, okCallBack) {
    const request = new XMLHttpRequest();
    request.open("POST", "api/dota/replay/queueMatches", true);
    request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    request.send(JSON.stringify(matches));
    request.onreadystatechange = () => {
        if (request.readyState == request.DONE && request.status == 200)
            okCallBack();
    }
}

/**
 * Returns the current list of matches being processed.
 * @param {*} okCallBack 
 */
export function getCurrentQueue(okCallBack) {
    const request = new XMLHttpRequest();
    request.open("GET", "api/dota/replay/queueMatches", true);
    request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    request.send();
    request.onreadystatechange = () => {
        if (request.readyState == request.DONE && request.status == 200)
            okCallBack(JSON.parse(request.responseText));
    }
}