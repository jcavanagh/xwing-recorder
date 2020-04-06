import React from 'react';

import groupBy from 'lodash/groupBy';
import mapValues from 'lodash/mapValues';
import range from 'lodash/range';
import get from 'lodash/get';

// Guido's xwing database
import data from './data';

// order of columns of bearings which should appear if they  exist.
const bearingOrder = [
  'T', // Hard Left
  'B', // Bank Left
  'F', // Straight
  'N', // Bank Right
  'Y', // Hard Right
  'K', // K Turn
  'L', // Sloop Left
  'S', // Sloop Right
  'E', // Tallon Roll Left
  'R', // Tallong Roll Right
  'O', // Stop
  'A', // Backwards Bank Left
  'P', // Backwards Straight
  'D' // Backwards Bank Right
];

// https://github.com/raithos/xwing/blob/master/coffeescripts/xwing.coffee#L1854
const bearingSvg = {
  T: {
    line: 'M160,180 L160,70 80,70',
    triangle: 'M80,100 V40 L30,70 Z',
    transform: null
  },
  B: {
    line: 'M150,180 S150,120 80,60',
    triangle: 'M80,100 V40 L30,70 Z',
    transform: 'translate(-5 -15) rotate(45 70 90)'
  },
  F: {
    line: 'M100,180 L100,100 100,80',
    triangle: 'M70,80 H130 L100,30 Z',
    transform: ''
  },
  N: {
    line: 'M50,180 S50,120 120,60',
    triangle: 'M120,100 V40 L170,70 Z',
    transform: 'translate(5 -15) rotate(-45 130 90)'
  },
  Y: {
    line: 'M40,180 L40,70 120,70',
    triangle: 'M120,100 V40 L170,70 Z',
    transform: null
  },
  K: {
    line: 'M50,180 L50,100 C50,10 140,10 140,100 L140,120',
    triangle: 'M170,120 H110 L140,180 Z',
    transform: null
  },
  L: {
    line: 'M150,180 S150,120 80,60',
    triangle: 'M80,100 V40 L30,70 Z',
    transform: 'translate(0 50)'
  },
  S: {
    line: 'M50,180 S50,120 120,60',
    triangle: 'M120,100 V40 L170,70 Z',
    transform: 'translate(0 50)'
  },
  E: {
    line: 'M160,180 L160,70 80,70',
    triangle: 'M60,100 H100 L80,140 Z',
    transform: null
  },
  R: {
    line: 'M40,180 L40,70 120,70',
    triangle: 'M100,100 H140 L120,140 Z',
    transform: null
  },
  O: {
    element: (maneuver, color) => {
      return <rect x="50" y="50" width="100" height="100" style={{ fill: color }} />;
    }
  },
  A: {
    line: 'M50,180 S50,120 120,60',
    triangle: 'M120,100 V40 L170,70 Z',
    transform: 'translate(5 -15) rotate(-45 130 90)'
  },
  P: {
    line: 'M100,180 L100,100 100,80',
    triangle: 'M70,80 H130 L100,30 Z',
    transform: null
  },
  D: {
    line: 'M150,180 S150,120 80,60',
    triangle: 'M80,100 V40 L30,70 Z',
    transform: 'translate(-5 -15) rotate(45 70 90)'
  }
};

function renderManeuverSvg(maneuver) {
  const bsvg = bearingSvg[maneuver.bearing];

  const difficultyStyles = {
    R: 'red',
    B: 'blue',
    W: 'white'
  };

  const color = difficultyStyles[maneuver.difficulty];
  const outline = 'black';

  const svgInner = bsvg.element ? (
    bsvg.element(maneuver, color)
  ) : (
    <>
      <path strokeWidth="25" fill="none" stroke={outline} d={bsvg.line} />
      <path d={bsvg.triangle} fill={color} strokeWidth="5" stroke={outline} transform={bsvg.transform} />
      <path strokeWidth="15" fill="none" stroke={color} d={bsvg.line} />
    </>
  );

  return (
    <svg width="30px" height="30px" viewBox="0 0 200 200">
      <g>{svgInner}</g>
    </svg>
  );
}

function parseXwsManeuvers(xwsManeuvers) {
  return xwsManeuvers.map(xwsm => {
    return {
      xws: xwsm,
      speed: parseInt(xwsm[0], 10),
      bearing: xwsm[1],
      // May be useful to convert this to a more semantic value, but keeping the xws difficulty for now
      difficulty: xwsm[2]
    };
  });
}

// Basic Dial Class
class MDial extends React.Component {
  // function invoked when a maneuver button is rendered.
  renderButton(maneuverData) {
    const buttonSize = '35px';
    const border = '1px solid';
    const display = 'flex';

    if (maneuverData) {
      // Actual button
      const style = {
        height: buttonSize,
        width: buttonSize,
        border,
        display,
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center'
      };
      return (
        <div key={maneuverData.xws} onClick={() => this.props.onClick(maneuverData.xws)} style={style}>
          <span>{renderManeuverSvg(maneuverData)}</span>
        </div>
      );
    }

    // Placeholder button
    return <div style={{ height: buttonSize, width: buttonSize, border, display }} />;
  }

  render() {
    const parsedManeuvers = parseXwsManeuvers(this.props.maneuvers);
    const bySpeed = groupBy(parsedManeuvers, 'speed');
    const maneuverSpeeds = range(6);

    // Build a 2D array of manuevers
    // Each row is a speed, and each column is the matching bearing, according to our order
    // Maneuvers the ship does not have will be null
    let rows = maneuverSpeeds.map(speed => {
      const bySpeedAndBearing = groupBy(bySpeed[speed], 'bearing');

      // Create a block element container for each row, so they look like rows
      return bearingOrder.map(bearing => {
        const maneuver = (bySpeedAndBearing[bearing] || [])[0];
        return maneuver;
      });
    });

    // Prune empty rows
    rows = rows.filter(row => row.some(val => val));

    // Prune empty columns
    // Create a map of bearing -> Boolean, where the bool is whether this ship has any maneuvers of that bearing
    const byBearing = mapValues(groupBy(parsedManeuvers, 'bearing'), bearings => !!bearings.length);
    rows = rows.map(row => {
      // We already know the order from the above loop, so check each column against the bearing order
      // If the ship has no maneuvers with that bearing, remove each column for that bearing
      return row.filter((col, idx) => {
        const currentBearing = bearingOrder[idx];
        return byBearing[currentBearing];
      });
    });

    // Render
    return rows.reverse().map(row => {
      return <div style={{ display: 'flex' }}>{row.map(col => this.renderButton(col))}</div>;
    });
  }
}

export class MDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      setmaneuver: 'default maneuver'
    };
  }

  handleClick(i) {
    this.setState({
      setmaneuver: i
    });
  }

  render() {
    const maneuvers = this.props.manuevers || test_dial;

    return (
      <>
        <div className="manuever-dashboard">
          <MDial maneuvers={maneuvers} onClick={i => this.handleClick(i)} />
        </div>
        <div className="test1">
          <p>{this.state.setmaneuver}</p>
        </div>
      </>
    );
  }
}
