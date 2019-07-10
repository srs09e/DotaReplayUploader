import '../css/homePage.css';
import React, { Component } from 'react';
import SearchBox from '../components/SearchBox';
import { QueryButton } from '../components/QueryButton';
import { connect } from 'react-redux';
import { getPlayerViaNickname, getMatchesViaPlayers, queueMatchesForReplay, getCurrentQueue } from '../endpoints/dotaEndpoints';
import { playerSearchQuery, playerSearchResults, matchSearchQuery, matchSearchResults, queueCurrentMatches, replayQueueUpdate } from '../actions/message_action';
import PlayersSearchTable from '../components/PlayersSearchTable';
import MatchesSearchTable from '../components/MatchesSearchTable';
import MatchesTable from '../components/MatchesTable';
import PlayersTable from '../components/PlayersTable';
import ReplayProgressTable from '../components/ReplayProgressTable';
class App extends Component {
    constructor(props) {
        super(props);
        setTimeout(() => this.refreshQueue(), 5000);
    }

    //The app is split down the middle, the right portion being an area for tables.
    //The left for search parameters and forms.
    render() {
        return (
            <div>
                <div className="splitLeft">
                    <div style={{paddingTop:10}}>
                        <SearchBox 
                            onEnterKeyPressed={() => this.queryForPlayers()}
                        />
                    </div>
                    <QueryButton 
                        buttonText="Player Search"
                        onClick={() => this.queryForPlayers()}
                    /> 
                    <PlayersTable />
                    <QueryButton 
                        buttonText="Match Search"
                        onClick={() => this.queryForMatches()}
                    />
                    <MatchesTable />
                    <QueryButton
                        buttonText="Queue matches for Replay Upload"
                        onClick={() => this.queueCurrentMatches()}
                    />
                    <ReplayProgressTable />
                </div>
                <div className="splitRight">
                    <PlayersSearchTable />
                    <MatchesSearchTable />
                </div>
            </div>
        )
    }

    /**
     * Queries for players - Dispatches a PLAYER_SEARCH_QUERY and PLAYER_SEARCH_RESULT when completed.
     */
    queryForPlayers() {
        this.props.dispatch(playerSearchQuery());
        getPlayerViaNickname(this.props.messageReducer.playerSearchQuery, (result) => {
            console.log(result) 
            this.props.dispatch(playerSearchResults(result)); 
        });
    }

    /**
     * Queries for matches - Dispatches a MATCH_SEARCH_QUERY and a MATCH_SEARCH_RESULT when completed.
     */
    queryForMatches() {
        this.props.dispatch(matchSearchQuery());
        getMatchesViaPlayers(this.props.messageReducer.selectedPlayers, (result) => {
            console.log(result);
            this.props.dispatch(matchSearchResults(result));
        });
    }

    queueCurrentMatches() {
        queueMatchesForReplay(this.props.messageReducer.matchReplays, () => {
            console.log("Matches Queued");
            this.props.dispatch(queueCurrentMatches());
        });
    }

    refreshQueue() {
        getCurrentQueue((result) =>{
            console.log(result);
            this.props.dispatch(replayQueueUpdate(result));
            setTimeout(() => this.refreshQueue(), 5000);
        });
    }
}
export default connect(state => state)(App);