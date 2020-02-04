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

// https://github.com/raithos/xwing/blob/master/coffeescripts/xwing.coffee#L1854
const bearingSvg = {
    "T": {
        line: "M160,180 L160,70 80,70",
        triangle: "M80,100 V40 L30,70 Z",
        transform: null
    },
    "B": {
        line: "M150,180 S150,120 80,60",
        triangle: "M80,100 V40 L30,70 Z",
        transform: "translate(-5 -15) rotate(45 70 90)"
    },
    "F": {
        line: "M100,180 L100,100 100,80",
        triangle: "M70,80 H130 L100,30 Z",
        transform: ''
    },
    "N": {
        line: "M50,180 S50,120 120,60",
        triangle: "M120,100 V40 L170,70 Z",
        transform: "translate(5 -15) rotate(-45 130 90)"
    },
    "Y": {
        line:  "M40,180 L40,70 120,70",
        triangle: "M120,100 V40 L170,70 Z",
        transform: null
    },
    "K": {
        line: 'M50,180 L50,100 C50,10 140,10 140,100 L140,120',
        triangle: 'M170,120 H110 L140,180 Z',
        transform: null
    },
    "L": {
        line: 'M150,180 S150,120 80,60',
        triangle: 'M80,100 V40 L30,70 Z',
        transform: "translate(0 50)"
    },
    "S": {
        line: 'M50,180 S50,120 120,60',
        triangle: 'M120,100 V40 L170,70 Z',
        transform: "translate(0 50)"
    },
    "E": {
        line: 'M160,180 L160,70 80,70',
        triangle: 'M60,100 H100 L80,140 Z',
        transform: null
    },
    "R": {
        line: 'M40,180 L40,70 120,70',
        triangle: 'M100,100 H140 L120,140 Z',
        transform: null
    },
    "O": {
        element: maneuver => {}
    },
    "A": {
        line: 'M50,180 S50,120 120,60',
        triangle: 'M120,100 V40 L170,70 Z',
        transform: "translate(5 -15) rotate(-45 130 90)"
    },
    "P": {
        line: 'M100,180 L100,100 100,80',
        triangle: 'M70,80 H130 L100,30 Z',
        transform: null
    },
    "D": {
        line: 'M150,180 S150,120 80,60',
        triangle: 'M80,100 V40 L30,70 Z',
        transform: "translate(-5 -15) rotate(45 70 90)"
    }
}

function renderManeuverSvg(maneuver) {
    const bsvg = bearingSvg[maneuver.bearing];

    if(!bsvg.line) return null

    const difficultyStyles = {
        'R': 'red',
        'B': 'blue',
        'W': 'white'
    }

    const color = difficultyStyles[maneuver.difficulty];
    const outline = 'black';

    const svgInner = bsvg.element ? bsvg.element(maneuver): (
        <>
            <path className='svg-maneuver-outer #{maneuverClass} #{maneuverClass2}' strokeWidth='25' fill='none' stroke={outline} d={bsvg.line} />
            <path className='svg-maneuver-triangle #{maneuverClass} #{maneuverClass2}' d={bsvg.triangle} fill={color} strokeWidth='5' stroke={outline} transform={bsvg.transform} />
            <path className='svg-maneuver-inner #{maneuverClass} #{maneuverClass2}' strokeWidth='15' fill='none' stroke={color} d={bsvg.line} />
        </>
    )

    return (
        <svg width='30px' height='30px' viewBox='0 0 200 200'>
            <g>
                {svgInner}
            </g>
        </svg>
    )
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

        if(maneuverData) {
            // Actual button
            const style = {
                height: buttonSize,
                width: buttonSize,
                border,
                display,
                alignContent: 'center',
                justifyContent: 'center',
                alignItems: 'center'
            }

            const content = renderManeuverSvg(maneuverData)

            return (
                <div key={maneuverData.xws} onClick={this.props.onClick} style={style}>
                    <span>{content}</span>
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