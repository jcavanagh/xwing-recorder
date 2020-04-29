import React, { useCallback, useState } from 'react';
import get from 'lodash/get';

import data from '../data';
import { useEventListener, useHover } from '../util/hooks';

export function XWSTooltip({ children, xwsPath }) {
  const [hoverRef, isHovered] = useHover();
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const onMouseMove = useCallback(
    ({ clientX, clientY }) => {
      setCoords({ x: clientX, y: clientY });
    },
    [setCoords]
  );

  useEventListener('mousemove', onMouseMove);

  function renderTooltip() {
    if (!isHovered) {
      return null;
    }

    const imgSrc = get(data, xwsPath);
    if (!imgSrc) {
      return null;
    }

    const sides = imgSrc.sides ? imgSrc.sides : [imgSrc];
    return (
      <div style={{ position: 'fixed', top: `${coords.y + 5}px`, left: `${coords.x + 5}px` }}>
        {sides.map(side => {
          return (
            <img key={side.name || side.title} src={side.image} style={{ display: 'inline', maxWidth: '300px' }} />
          );
        })}
      </div>
    );
  }

  return (
    <span style={{ cursor: 'pointer' }} ref={hoverRef}>
      {renderTooltip()}
      {children}
    </span>
  );
}
