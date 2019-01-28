import React from 'react';
export class QueryButton extends React.Component {
    render() {
        return (
            <div className="queryBtn">
                <button
                    onClick={this.props.onClick}
                > {this.props.buttonText} 
                </button>
            </div>
        )
    }
}