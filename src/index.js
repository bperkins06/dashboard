import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import LogoutIcon from '@mui/icons-material/Logout';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import './index.css';
import { createMuiTheme as createThemeV4 } from "@material-ui/core/styles";
import {
  createTheme as createThemeV5,
  ThemeProvider as ThemeProviderV5
} from "@mui/material/styles";
import {
  createGenerateClassName,
  ThemeProvider as ThemeProviderV4,
  StylesProvider
} from "@material-ui/core/styles";

const generateClassName = createGenerateClassName({
  disableGlobal: true,
  seed: "mui-jss"
});
const actions = [
  { icon: <FileCopyIcon />, name: 'Copy' },
  { icon: <SaveIcon />, name: 'Save' },
  { icon: <PrintIcon />, name: 'Print' },
  { icon: <ShareIcon />, name: 'Share' },
];

const themeV4 = createThemeV4({
  palette: {
    primary: {
      main: "#2196f3"
    },
    secondary: {
      main: "#f50057"
    }
  },
  shape: {
    borderRadius: 8
  }
});

const themeV5 = createThemeV5({
  palette: {
    primary: {
      main: themeV4.palette.primary.main
    },
    secondary: {
      main: themeV4.palette.secondary.main
    }
  },
  shape: { ...themeV4.shape }
});

function Square(props) {
  let style = "square";
  if (props.winner) {
    style += " winner";
  }
  return (
    <button className={style} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const cell = "cell_"+i;
    let winnerCell = false;
    if (this.props.winner !== null) {
      if (this.props.winner.line.indexOf(i) !== -1) {
        console.log('Winner pos: '+i);
        winnerCell = true;
      }
    }
    return (
      <Square
        key={cell}
        value={this.props.squares[i]}
        winner={winnerCell}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let row_key, cells, rows=[];
    const ROWS = 3;
    const COLS = 3;

    // ---------------------------------------------------------------
    // Dynamic way that uses JSX
    // ---------------------------------------------------------------
    for (let i=0;i<ROWS;i++){
      cells = [];
      row_key = 'row_'+i;
      for (let j=0;j<COLS;j++){
        cells.push(this.renderSquare((i*COLS)+j));
      }
      rows.push(<div key={row_key} className="board-row">{cells}</div>);
    }

    return (<div>{rows}</div>);
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        location: 0
      }],
      stepNumber: 0,
      xIsNext: true,
      orderAscending: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const location = calculateLocation(i);
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        location: location
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      orderAscending: this.state.orderAscending,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  sortMoves() {
    console.log('Sort the moves');
    this.setState({
      orderAscending: !this.state.orderAscending,
    });
  }

  renderList(moves) {
    if (this.state.orderAscending) {
      return (<ol>{moves}</ol>);
    } else {
      return (<ol reversed>{moves}</ol>);
    }
  }

  render() {
    let history = JSON.parse(JSON.stringify(this.state.history));
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const draw = current.squares.indexOf(null) == -1;
    const order = this.state.orderAscending ? history : history.reverse();
    const sortButton = this.state.orderAscending ? "Sort Descending":"Sort Ascending"
    const moves = order.map((step, move) => {
      const linkMove = this.state.orderAscending ? move : (order.length-move-1)
      let location = move ? ' Location: ('+order[move].location+')':'';
      let desc = move ?
        'Go to move #' + move:
        'Go to game start';
      if (!this.state.orderAscending) {
        location = (move == (order.length-1)) ? '':' Location: ('+order[move].location+')';
        desc = (move == (order.length-1)) ?
            'Go to game start':
            'Go to move #' + (order.length - move -1);
      }

      return (
        <li key={linkMove}>
          <button onClick={() => this.jumpTo(linkMove)}>{desc}</button>{location}
        </li>
      );
    });
    const orderedList = this.renderList(moves);
    let status;
    if (draw) {
      status = 'Draw: You are both LOOOSERS! &#128527;';
    } else {
      if (winner) {
        status = 'Winning: ' + winner.player + ' &#127881;';
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winner={winner}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div dangerouslySetInnerHTML={{ __html: status}}></div>
          <div><button onClick={() => this.sortMoves()}>{sortButton}</button></div>
          {orderedList}
        </div>
        <div>
          <Button variant="contained" color="primary" onClick={() => { alert('ouch!')}}>Hello World</Button>
          <Button variant="outlined" startIcon={<DeleteIcon />}>Delete</Button>
          <Button variant="contained" startIcon={<LogoutIcon />}>Logout</Button>
        </div>
        <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1 }}>
          <SpeedDial
            ariaLabel="SpeedDial basic example"
            sx={{ position: 'absolute', bottom: 16, right: 16 }}
            icon={<SpeedDialIcon />}
          >
            {actions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
              />
            ))}
          </SpeedDial>
        </Box>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <StylesProvider generateClassName={generateClassName}>
    <ThemeProviderV4 theme={themeV4}>
      <ThemeProviderV5 theme={themeV5}>
        <Game />
      </ThemeProviderV5>
    </ThemeProviderV4>
  </StylesProvider>,
  document.getElementById('root')
);

function calculateLocation(index) {
  const x = Math.floor(index/3);
  const y = index%3;
  return x+','+y;
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        player: squares[a],
        line: lines[i]
      };
    }
  }
  return null;
}
