import React from 'react';
import ReactTable from 'react-table';
import "react-table/react-table.css";
import { connect } from 'react-redux';
import { addPlayerToQuery } from '../actions/message_action';
import { PLAYER_SEARCH } from '../reducers/message_reducer';
export class PlayersSearchTable extends React.Component {
   

    render() {
        //Don't show if we aren't doing a player query.
        if (this.props.messageReducer.currentTable !=  PLAYER_SEARCH) {
            return null;
        }

        //One column containing player info and a link to their steam profile.
        //One column devoted to adding the player to the search list.
        const columns = [{
            Header: 'User',
            accessor: 'Id',
            Cell: (row) => {
                return  <div className="inline-flex">
                            <img className="playerTableCellImage" src={row.original.AvatarUrl}/>
                            <p className="playerTableCellText"> {row.original.Alias} 
                                <a className="playerTableCellText"
                                    href={"https://steamcommunity.com/profiles/" + row.original.Id}
                                    target="_blank">
                                    Steam Profile
                                </a>
                            </p>
                        </div>
            }
        },
        {
            Header: 'Add',
            id: 'Id',
            width: 100,
            Cell: (row) => {
                return  <div className="inline-flex">
                        <button className="btn addBtn" onClick={() => this.addToQuery(row)}> </button>
                        </div>
                }
        }];

        return (
            <ReactTable className="playerSearchTable -striped -highlight"
                data={this.props.messageReducer.playerSearchResults}
                columns={columns}
                showPagination={false}
                loading={this.props.messageReducer.activeQuery}
            />
        )
    }
    /**
     * Adds a player to the match query list.
     * @param {*} row 
     */
    addToQuery(row) {
        this.props.dispatch(addPlayerToQuery(row.original));
    }
}

export default connect(state => state)(PlayersSearchTable);