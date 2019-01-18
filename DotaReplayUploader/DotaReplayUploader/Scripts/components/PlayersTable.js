import React from 'react';
import ReactTable from 'react-table';
import "react-table/react-table.css";
import { connect } from 'react-redux';
import { removePlayerFromQuery } from '../actions/message_action';
export class PlayersTable extends React.Component {
    

    render() {
        //One column with player details.
        //One column to remove from the search list
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
            Header: 'Remove',
            id: 'Id',
            width: 75,
            Cell: (row) => {
                return  <div className="inline-flex">
                        <button className="btn removeBtn" onClick={() => this.removeFromQuery(row)}> </button>
                        </div>
                }
        }];

        return (
            <ReactTable className="playerTable -striped -highlight"
                data={this.props.messageReducer.selectedPlayers}
                columns= {columns}
                showPagination= {false}
                minRows= {3}
            />
        )
    }
    /**
     * Removes a player from the match query list.
     * @param {*} row 
     */
    removeFromQuery(row) {
        this.props.dispatch(removePlayerFromQuery(row.original));
    }
}

export default connect(state => state)(PlayersTable);