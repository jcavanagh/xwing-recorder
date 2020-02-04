import React from 'react';

import groupBy from 'lodash/groupBy';
import mapValues from 'lodash/mapValues';
import range from 'lodash/range';

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
    "4KR",
    "5KR"
]

// order of columns of bearings which  should appear if they  exist.
const bearingOrder = [
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

const bearingSvg = {
    "T": '',
    "B": '',
    "F": '',
    "N": '',
    "Y": '',
    "K": '',
    "L": '',
    "S": '',
    "E": '',
    "R": '',
    "O": '',
    "A": '',
    "P": '',
    "D": ''
}

function parseXwsManeuvers(xwsManeuvers) {
    return xwsManeuvers.map(xwsm => {
        return {
            xws: xwsm,
            speed: parseInt(xwsm[0], 10),
            bearing: xwsm[1],
            // May be useful to convert this to a more semantic value, but keeping the xws difficulty for now
            difficulty: xwsm[2]
        }
    })
}

// to be used with var unique = a.filter(onlyUnique) where a is an array
// function onlyUnique(value, index, self) { 
//     return self.indexOf(value) === index;
// }

// // returns an  array of all  the unique bearings as they exist in an order defined by bearing_order
// function getMBearings(maneuver_list) {
//     var bearing_order = [
//       "T",
//       "B",
//       "F",
//       "N",
//       "Y",
//       "K",
//       "L",
//       "S",
//       "E",
//       "R",
//       "O",
//       "A",
//       "P",
//       "D"
//     ]
    
//     var bearings = maneuver_list.map(x => x[1]).filter(onlyUnique);
//     var inbearings = function(x) {
//         return bearings.includes(x)
//     }
//     var bearings_list = bearing_order.filter(inbearings);
//     return bearings_list;
// }

// // returns an array of all the unique speeds
// function getMSpeeds(maneuver_list) {
//     var speeds = maneuver_list.map(x => x[0]).filter(onlyUnique);
//     return speeds
// }


// function MButton(props) {
//     return (
        
//     );
// }

class MDial extends React.Component {
    // put in some state for now
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         maneuvers: ['3TR', '3BR', '3FR', '3NR', '3YR']
    //     }
    // }

    // renderMButton(i) {
    //     return (
    //         <MButton
    //             value={this.props.maneuvers[i]}
    //             onClick={() =>  this.props.onClick(i)}
    //         />
    //     )
    // }

    // render() {
    //     return (
    //     <> 
    //         <div>
    //             <div className="mdial-row">
    //                 {this.renderMButton(0)}
    //                 {this.renderMButton(1)}
    //                 {this.renderMButton(2)}
    //                 {this.renderMButton(3)}
    //                 {this.renderMButton(4)}
    //             </div>
    //             <div>
    //                 haiyou blah
    //             </div>
    //         </div>
    //     </>
    //     );
    // }

    renderButton(maneuverData) {
        const buttonSize = '35px'
        const border = '1px solid';
        const display = 'flex';
        const difficultyStyles = {
            'R': 'red',
            'B': 'blue',
            'W': 'black'
        }

        if(maneuverData) {
            // Actual button
            const fontColor = difficultyStyles[maneuverData.difficulty];
            const style = {
                color: fontColor,
                height: buttonSize,
                width: buttonSize,
                border,
                display,
                alignContent: 'center',
                justifyContent: 'center',
                alignItems: 'center'
            }

            return (
                <div key={maneuverData.xws} onClick={this.props.onClick} style={style}>
                    <span>{maneuverData.speed}{maneuverData.bearing}</span>
                </div>
            );
        }

        // Placeholder button
        return <div style={{ height: buttonSize, width: buttonSize, border, display }} />;
    }

    render() {
        const parsedManeuvers = parseXwsManeuvers(this.props.maneuvers);
        const bySpeed = groupBy(parsedManeuvers, 'speed');
        // const existingBearings = getMBearings(this.props.maneuvers);
        //const maneuverSpeeds = range(Math.max(Object.keys(bySpeed).)+1)
        const maneuverSpeeds = range(6);

        // Build a 2D array of manuevers
        // Each row is a speed, and each column is the matching bearing, according to our order
        // Maneuvers the ship does not have will be null
        let rows = maneuverSpeeds.map(speed => {
            const bySpeedAndBearing = groupBy(bySpeed[speed], 'bearing');

            // Create a block element container for each row, so they look like rows
            return bearingOrder.map(bearing => {
                const maneuver = (bySpeedAndBearing[bearing] || [])[0]
                return maneuver;
            })
        })

        // Prune empty rows
        rows = rows.filter(row => row.some(val => val))

        // Prune empty columns
        // Create a map of bearing -> Boolean, where the bool is whether this ship has any maneuvers of that bearing
        const byBearing = mapValues(groupBy(parsedManeuvers, 'bearing'), bearings => !!bearings.length);
        rows = rows.map(row => {
            // We already know the order from the above loop, so check each column against the bearing order
            // If the ship has no maneuvers with that bearing, remove each column for that bearing
            return row.filter((col, idx) => {
                const currentBearing = bearingOrder[idx];
                return byBearing[currentBearing];
            })
        })

        // Render
        return rows.reverse().map(row => {
            return (
                <div style={{ display: 'flex' }}>
                    {row.map(col => this.renderButton(col))}
                </div>
            )
        })
    }
}

export class MDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            setmaneuver: null
        }
    }

    handleClick(i) {
        this.setState({
            setmaneuver: i
        })
    }

    render() {
        const maneuvers = this.props.manuevers || test_dial;

        return (
            <>
                <div className="manuever-dashboard">
                    <MDial
                        maneuvers={maneuvers}
                        onClick={(i) => this.handleClick(i)}
                    />
                    
                </div>
                <div className="test1">
                    <p>{this.state.setmaneuver}</p>
                </div>
            </>
        );

    }

}