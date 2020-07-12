import React from 'react';

import '../styles/Grid.css';
import dirtTexture from '../assets/textures/dirt.jpg';
import grassTexture from '../assets/textures/grass.jpg';
import waterTexture from '../assets/textures/water.jpg';
import cliffTexture from '../assets/textures/cliff.jpg';
import lavaTexture from '../assets/textures/lava.png';

const GridSquare = (props) => {
  const { gridSquare } = props;

  let renderTexture, altText;
  switch (gridSquare.terrain) {
    case 'grass':
      renderTexture = grassTexture;
      altText = 'grass texture';
      break;
    case 'water':
      renderTexture = waterTexture;
      altText = 'water texture';
      break;
    case 'cliff':
      renderTexture = cliffTexture;
      altText = 'cliff texture';
      break;
    case 'lavaPit':
      renderTexture = lavaTexture;
      altText = 'lava texture';
      break;
    case 'dirt':
    default:
      renderTexture = dirtTexture;
      altText = 'dirt texture';
      break;
  }

  const classes = gridSquare.isOrigin
    ? `isOrigin ${gridSquare.terrain}`
    : gridSquare.occupants.length > 0
    ? `${gridSquare.terrain} occupied`
    : gridSquare.show
    ? `${gridSquare.terrain}`
    : '';

  return (
    <div
      className={`grid_square ${classes}`}
      data-idx={props.idx}
      data-x={gridSquare.pos[0]}
      data-y={gridSquare.pos[1]}
      onClick={props.handleClick}
    >
      {gridSquare.show && (
        <img
          style={{ borderRadius: gridSquare.isOrigin ? '50%' : '' }}
          src={renderTexture}
          alt={altText}
        />
      )}
    </div>
  );
};

export default GridSquare;
