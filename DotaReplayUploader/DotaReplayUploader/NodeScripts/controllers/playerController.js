var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var DOMParser = require("dom-parser");

exports.search_player = function (req, res) {
    let xhr = new XMLHttpRequest();
    xhr.onload = function (e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let parser = new DOMParser();
            let loadingNode;
            while (!loadingNode) {
                let doc = parser.parseFromString(xhr.responseText, 'text/xml');
                let resultNode = doc.getElementById("search_results");
                console.log(resultNode);
                loadingNode = resultNode.childNodes[1];
            }
        }
    }

    xhr.onload
    xhr.open('GET', "https://steamcommunity.com/search/users/#text=" + req.query.playerName);
    xhr.responseType = 'document';
    xhr.send();
}