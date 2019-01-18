import React from 'react';
import ReactTable from 'react-table';
import "react-table/react-table.css";
import { connect } from 'react-redux';
import { MATCH_SEARCH } from '../reducers/message_reducer';
import { removeMatchFromReplays } from '../actions/message_action';
import { getMatchDetails } from '../endpoints/dotaEndpoints';
export class MatchesTable extends React.Component {

    render() {

        //Columns with a single cell containing the avatar, the played hero image, the playername and the match start time and a column for the remove control
        const columns = [{
            Header: 'Selected Matches',
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
                    </div>
                </div>
            }
        },
        {
            Header: 'Remove',
            id: 'Id',
            width: 75,
            Cell: (row) => {
                return  <div className="inline-flex">
                        <button className="btn removeBtn" onClick={() => this.removeMatchFromList(row)}> </button>
                        </div>
                }
        }];

        return (
            <ReactTable className="playerTable -striped -highlight"
                data={this.props.messageReducer.matchReplays}
                columns={columns}
                showPagination= {false}
                minRows = {3}
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
     * Removes a match from replay list
     * @param {*} row 
     */
    removeMatchFromList(row) {
        this.props.dispatch(removeMatchFromReplays(row.original));
    }
}

export default connect(state => state)(MatchesTable);