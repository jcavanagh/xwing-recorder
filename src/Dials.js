import React from 'react';

// this is a maneuver button, e.g., 1 straight, 2  turn, 3 bank, 4-k etc..

function MButton(props) {
    return (
        <button  className="msquare" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class MDial extends React.Component {
    // put in some state for now
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         maneuvers: ['3TR', '3BR', '3FR', '3NR', '3YR']
    //     }
    // }

    renderMButton(i) {
        return (
            <MButton
                value={this.props.maneuvers[i]}
                onClick={() =>  this.props.onClick(i)}
            />
        )
    }

    render() {
        return (
        <> 
            <div>
                <div className="mdial-row">
                    {this.renderMButton(0)}
                    {this.renderMButton(1)}
                    {this.renderMButton(2)}
                    {this.renderMButton(3)}
                    {this.renderMButton(4)}
                </div>
            </div>
        </>
        );
    }

}

export class MDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            setmaneuver: null
        }
        this.maneuvers = [
            "1TW",
            "1BB",
            "1FB",
            "1NB",
            "1YW"
            ]
        
    }

    handleClick(i) {
        this.setState({
            setmaneuver: i
        })
    }

    render() {
        const maneuvers = this.maneuvers;

        return (
            <>
                <div className="manuever-dashboard">
                    <MDial
                        maneuvers={maneuvers}
                        onClick={(i) => this.handleClick(i)}
                    />
                    
                </div>
                <div classname="test1">
                    <p>{this.state.setmaneuver}</p>
                </div>
            </>
        );

    }

}