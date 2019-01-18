import React from 'react';
import ReactTable from 'react-table';
import "react-table/react-table.css";
import { connect } from 'react-redux';
import { MATCH_SEARCH } from '../reducers/message_reducer';
import { matchDetailsQuery, matchDetailsResult, addMatchToReplays } from '../actions/message_action';
import { getMatchDetails } from '../endpoints/dotaEndpoints';
export class MatchesSearchTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            //Matches with details expanded.
            matchesShowingDetails: []
        }
    }

    render() {
        //Don't show if we arent doing a match query.
        if (this.props.messageReducer.currentTable != MATCH_SEARCH) {
            return null;
        }

        //Columns with a single cell containing the avatar, the played hero image, the playername, the match start time, details, and add control. 
        const columns = [{
            Header: 'Last 100 Matches for each selected player',
            accessor: 'MatchId',
            Cell: (row) => {

                return <div>
                            <div className="inline-flex">
                                <video loop autoPlay className="playerTableCellImage" src={this.findPlayerHero(row.original)} typeof="video/webm" />
                                <div className="block">
                                    <img className="playerTableCellImageSmall" src={row.original.SearchedPlayer.AvatarUrl} />
                                    <p className="playerTableCellTextSmallSpacing"> {row.original.SearchedPlayer.Alias} </p>
                                </div>
                                <p className="playerTableCellText"> {row.original.StartTime} </p>
                                <div className="block">
                                    <div className="inline-flex">
                                        <button className={this.getShowDetailsBtn(row)} onClick={() => this.showDetails(row)}> </button>
                                        <p className="playerTableCellText">Show/Hide Details</p>
                                    </div>
                                    <div className="inline-flex">
                                        <button className="btn playBtn" onClick={() => this.addToReplayList(row)}> </button>
                                        <p className="playerTableCellText">Add to Replay List</p>
                                    </div>
                                </div>
                            </div>
                            {this.renderDetails(row)}
                        </div>
            }
        }
        ];

        return (
            <ReactTable className="playerSearchTable -striped -highlight"
                data={this.props.messageReducer.matchSearchResults}
                columns={columns}
                loading={this.props.messageReducer.activeQuery}
            />
        )
    }

    /**
     * Finds the player hero for the player the match was searched on.
     * @param {*} match 
     */
    findPlayerHero(match) {
        console.log(match);
        var playerInMatch = match.Players.find((p) => p.AccountId == match.SearchedPlayer.Id32);
        return "/icons/" + playerInMatch.Hero.LongName + ".webm";
    }

    /**
     * Gets current toggle state of the show details
     * @param {*} row 
     */
    getShowDetailsBtn(row) {
        if (this.state.matchesShowingDetails.find((value, index) => {
            if (value == row.original.MatchId) {
                return true;
            }
        })) {
            return "btn removeBtn";
        } else {
            return "btn addBtn"
        }
    }

    /**
     * Toggles showing the details of a given match.
     * @param {*} row 
     */
    showDetails(row) {
        var foundIdx = -1;
        if (this.state.matchesShowingDetails.find((value, index) => {
            if (value == row.original.MatchId) {
                foundIdx = index;
                return true;
            }
        })) {
            this.state.matchesShowingDetails.splice(foundIdx, 1)
            this.setState({ matchesShowingDetails: this.state.matchesShowingDetails });
        } else {
            this.state.matchesShowingDetails.push(row.original.MatchId)
            this.setState({ matchesShowingDetails: this.state.matchesShowingDetails });
            if (!row.original.HasDetails) {
                this.props.dispatch(matchDetailsQuery(row.original.MatchId));
                getMatchDetails(row.original.MatchId, (result) => {
                    console.log(result);
                    this.props.dispatch(matchDetailsResult(result));
                });
            }
        }
    }

    /**
     * Renders a details pane if they aren't loading
     * @param {*} row 
     */
    renderDetails(row) {
        if (this.state.matchesShowingDetails.find((value) => {
            return value == row.original.MatchId;
        })) {
            if (row.original.LoadingDetails) {
                return <div>
                    <p>Loading...</p>
                </div>
            } else {
                return <div>
                    <span className="inline-flex">
                        <p style={{ color: "green" }}>Radiant: {row.original.RadiantScore} </p>
                        <p style={{ color: "red", paddingLeft: "5px" }}> Dire: {row.original.DireScore} </p>
                        <p style={{ color: row.original.Winner == "Dire" ? "red" : "green", paddingLeft: "5px" }}> {row.original.Winner} Victory! </p>
                    </span>
                    {this.renderPlayerList(row)}
                </div>
            }
        }

        return null;
    }

    /**
     * Iterates over every player in the match and renders their states / hero.
     * @param {*} row 
     */
    renderPlayerList(row) {
        let counter = 0;
        return <div className="block">
            {row.original.Players.map((player) => {
                counter++;
                return (
                    <div className="block" style={{borderStyle:"solid", borderColor: counter <= 5 ? "green" : "red"}}>
                    <div className="inline-flex">
                        <div  className="inline-flex">
                            <video loop autoPlay className="playerTableCellImageSmall" src={"/icons/" + player.Hero.LongName + ".webm"} typeof="video/webm" />
                            <p className="playerTableCellText"  style={{width:"200px"}}> {player.PersonaName} </p>
                        </div>
                        <div className="block" style={{width:"150px"}}>
                            <p className="playerTableCellTextSmallSpacing"> Kills: {player.Kills}</p>
                            <p className="playerTableCellTextSmallSpacing"> Deaths: {player.Deaths}</p>
                            <p className="playerTableCellTextSmallSpacing"> Assists: {player.Assists}</p>
                        </div>
                        <div className="block" style={{width:"150px"}}>
                            <p className="playerTableCellTextSmallSpacing"> GPM: {player.GPM}</p>
                            <p className="playerTableCellTextSmallSpacing"> XPM: {player.XPM}</p>
                        </div>
                        <div className="block" style={{width:"150px"}}>
                            <p className="playerTableCellTextSmallSpacing"> Level: {player.Level}</p>
                            <p className="playerTableCellTextSmallSpacing"> Last Hits: {player.LastHits}</p>
                            <p className="playerTableCellTextSmallSpacing"> Denies: {player.Denies}</p>
                        </div>
                    </div>
                    </div>)
            })}
        </div>
    }

    /**
     * Adds the match to the selected matches to be queued for replays.
     * @param {*} row 
     */
    addToReplayList(row) {
        this.props.dispatch(addMatchToReplays(row.original));
    }
}

export default connect(state => state)(MatchesSearchTable);