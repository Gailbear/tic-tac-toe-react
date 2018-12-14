import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";

function Square(props) {
  let clazz = "square";
  if (props.winner) {
    clazz += " winner";
  }
  return (
    <button className={clazz} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function Location(props) {
  if (props.step.location === null) return <span />;
  const row = (props.step.location % 3) + 1;
  const col = Math.floor(props.step.location / 3) + 1;
  return (
    <span>
      ({col}, {row})
    </span>
  );
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
      return { winner: squares[a], squares: [a, b, c] };
    }
  }
  return null;
}

class Board extends React.Component {
  renderSquare(i) {
    const winner =
      this.props.winner && this.props.winner.squares.includes(i) ? true : false;
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        winner={winner}
      />
    );
  }
  render() {
    let rows = [];
    for (let i = 0; i < 3; i++) {
      let squares = [];
      for (let j = 0; j < 3; j++) {
        squares.push(this.renderSquare(i * 3 + j));
      }
      rows.push(<div className="board-row">{squares}</div>);
    }
    return <div>{rows}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          location: null,
        },
      ],
      moveSortAsc: true,
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    // slice to make a copy of the array!
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([{ squares, location: i }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  toggleSort() {
    this.setState({
      moveSortAsc: !this.state.moveSortAsc,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={move} className={move === this.state.stepNumber ? "bold" : ""}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
          <Location step={step} />
        </li>
      );
    });

    if (!this.state.moveSortAsc) {
      moves = moves.reverse();
    }

    let status;
    if (winner) {
      status = "Winner: " + winner.winner;
    } else if (current.squares.reduce((x, y) => x && y)) {
      status = "This one's a draw.";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    const sortIcon = this.state.moveSortAsc ? faArrowUp : faArrowDown;

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            winner={winner}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            Move List{" "}
            <button onClick={() => this.toggleSort()}>
              <FontAwesomeIcon icon={sortIcon} />
            </button>
          </div>
          <ol id="moveList" reversed={!this.state.moveSortAsc}>
            {moves}
          </ol>
        </div>
      </div>
    );
  }
}

// ==========================================

ReactDOM.render(<Game />, document.getElementById("root"));
