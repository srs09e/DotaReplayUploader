import React from 'react';

export class ProgressBar extends React.Component {
    render() {
        let currentProgress = this.props.percentage + "%";
        return <div className="progressBar">
                <div className="progress" style={{ width: currentProgress, backgroundColor: this.props.done ? "green" : "gray" }}>
            </div>
        </div>
    }
}