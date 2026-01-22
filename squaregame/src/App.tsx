import React, { useEffect, useMemo, useState } from 'react';
import startCol from "./startCol";
import logo from './logo.svg';
import './App.css';

// Load colors from environment variables (secrets)
// Format: REACT_APP_COLOR_1, REACT_APP_COLOR_2, etc.
// Values can be color names (red, blue) or hex codes (#FF0000)
const loadColorsFromSecrets = (): string[] => {
  const colors: string[] = [];
  let i = 1;

  // Keep reading REACT_APP_COLOR_N until we don't find one
  while (true) {
    const envKey = `REACT_APP_COLOR_${i}`;
    const color = process.env[envKey];

    if (color) {
      colors.push(color);
      i++;
    } else {
      break;
    }
  }

  // Fallback to default colors if no secrets are configured
  if (colors.length === 0) {
    console.log('No color secrets found. Using default colors.');
    console.log('Set REACT_APP_COLOR_1, REACT_APP_COLOR_2, etc. to configure colors.');
    return ['white', 'gray'];
  }

  console.log(`Loaded ${colors.length} colors from secrets:`, colors);
  return colors;
};

const colors = loadColorsFromSecrets();
const Square = (props: any) => {
  const [col, setCol] = useState(props.initialCol)
  const [clicks, setClicks] = useState(props.initialClicks)
  const increaseColor = () => {
    let newCol = (col+1) % colors.length;
    setCol(newCol);
    props.onNewCol(newCol);
  }
  useEffect(() => {
    props.setColorListener(setCol)
  }, [])

  useEffect(() => {
    if (props.showsNumber) {
      props.setClickListener(setClicks)
    }
  })
  return <div onClick={increaseColor} className="square" style={{backgroundColor: colors[col]}}>{props.showsNumber ? clicks.toString()[props.id] : ""}</div>
}

const numSquares = 4000
let initialState = localStorage.getItem("state");
let initialCols = initialState ? JSON.parse(initialState) : startCol;
let squareListeners = Array(numSquares);
let currentColors = [...initialCols]
localStorage.setItem("state", JSON.stringify(currentColors))
let initialClicks = localStorage.getItem("clicks");
let clicks = initialClicks ? Number.parseInt(initialClicks) : 0;
let clickListeners = Array(numSquares / 100);
function App() {
  let squares = [];
  for (let i = 0; i < numSquares; i++) {
    squares.push(
      <Square key={i} 
        id={i}
        initialCol={initialCols[i]}
        setColorListener={(colorChangeListener: any) => {
          squareListeners[i] = colorChangeListener
        }}
        onNewCol={(newCol: number) => {
          currentColors[i] = newCol;
          clicks += 1;
          for (let j = 0; j < (numSquares / 100); j++) {
            clickListeners[j](clicks);
          }
          localStorage.setItem("state", JSON.stringify(currentColors));
          localStorage.setItem("clicks", clicks.toString());
        }}
        showsNumber={i < 40}
        setClickListener={(clickListener: any) => {
          clickListeners[i] = clickListener;
        }}
        initialClicks={clicks}
      />
    )
  }
  useEffect(() => {
    for (let i = 0; i < numSquares; i++) {
      squareListeners[i](initialCols[i])
    }
  }, [])
  return (
    <div className="App">
      {squares}
    </div>
  );
}

export default App;
