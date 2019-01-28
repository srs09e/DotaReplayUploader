import React from 'react';
import ReactTable from 'react-table';
import "react-table/react-table.css";
import { connect } from 'react-redux';
import { ProgressBar } from './ProgressBar';
export class ReplayProgressTable extends React.Component {

    render() {
        //Columns with a single cell containing the avatar, the played hero image, the playername, the match start time, and the progress bar. 
        const columns = [{
            Header: 'Queued Replay Progress',
            accessor: 'MatchId',
            Cell: (row) => {

                return <div>
                            <div className="inline-flex">
                                <video loop autoPlay className="playerTableCellImage" src={this.findPlayerHero(row.original)} typeof="video/webm" />
                                <div className="block"  style={{width:100}}>
                                    <img className="playerTableCellImageSmall" src={row.original.SearchedPlayer.AvatarUrl} />
                                    <p className="playerTableCellTextSmallSpacing"> {row.original.SearchedPlayer.Alias} </p>
                                </div>
                                <p className="playerTableCellText"> {row.original.StartTime} </p>
                            </div>
                            <ProgressBar percentage={row.original.ProgressPercentage} done={row.original.Done}/>
                        </div>
            }
        }
        ];

        return (
            <ReactTable className="playerTable -striped -highlight"
                data={this.props.messageReducer.queuedMatchReplays}
                columns={columns}
                minRows={3}
                showPagination={false}
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
}

export default connect(state => state)(ReplayProgressTable);