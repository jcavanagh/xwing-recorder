import React from 'react';

// this is a maneuver button, e.g., 1 straight, 2  turn, 3 bank, 4-k etc..
const test_dial = [
    "1BB",
    "1FB",
    "1NB",
    "2TW",
    "2BB",
    "2FB",
    "2NB",
    "2YW",
    "3ER",
    "3TW",
    "3BW",
    "3FB",
    "3NW",
    "3YW",
    "3RR",
    "4FW",
    "4KR"
]

// order of columns of bearings which  should appear if they  exist.
const bearing_order = [
    "T",
    "B",
    "F",
    "N",
    "Y",
    "K",
    "L",
    "S",
    "E",
    "R",
    "O",
    "A",
    "P",
    "D"
]

// to be used with var unique = a.filter(onlyUnique) where a is an array
function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

// returns an  array of all  the unique bearings as they exist in an order defined by bearing_order
function getMBearings(maneuver_list) {
    var bearing_order = [
      "T", 
      "B",
      "F",
      "N",
      "Y",
      "K",
      "L",
      "S",
      "E",
      "R",
      "O",
      "A",
      "P",
      "D"
		]
    
    var bearings = maneuver_list.map(x => x[1]).filter(onlyUnique);
 		var inbearings = function(x) {
        return bearings.includes(x)
    }
    var bearings_list = bearing_order.filter(inbearings);
    return bearings_list;
}

// returns an array of all the unique speeds
function getMSpeeds(maneuver_list) {
    var speeds = maneuver_list.map(x => x[0]).filter(onlyUnique);
    return speeds
}


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
                <div>
                    haiyou blah
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