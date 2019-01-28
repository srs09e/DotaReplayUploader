import React from 'react';
import { playerSearchChange } from '../actions/message_action';
import { connect } from 'react-redux';
export class SearchBox extends React.Component {

    /**
     * Update the store value for the search parameter on change.
     * @param {*} value 
     */
    onChange(value) {
        this.props.dispatch(playerSearchChange(value))
    }

    render() {
        return (
            <div>
                <input className="inputField"
                    type="text"
                    value={this.props.messageReducer.playerSearchQuery}
                    onChange={e => this.onChange(e.target.value)}
                    onKeyPress={e => this.onEnterKeyPress(e)}
                />
            </div>
        )
    }

    onEnterKeyPress(e) {
        if (e.key === 'Enter') {
            this.props.onEnterKeyPressed();
        }
    }
}

export default connect(state => state)(SearchBox);