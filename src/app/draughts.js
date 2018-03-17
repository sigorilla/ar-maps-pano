import 'babel-polyfill';
import extras from 'aframe-extras';
import {Scene, Entity} from 'aframe-react';
import React from 'react';
import ReactDOM from 'react-dom';
import Draughts from 'draughts';
// import DraughtsBoard from 'draughtsboard';
import 'components/threex-portal-door';
import 'components/portal-door';

const BOARD_SIZE = 8;

const ROWS = Array(BOARD_SIZE).fill().map((_, i) => i);
const COLS = ROWS.map((i) => String.fromCharCode(97 + i));

const CELLS = {
    white: 1,
    black: -1,
    empty: 0,
    omit: 100
};

const NEXT_TURN = {
    white: 'black',
    black: 'white'
};

class Chess extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            game: new Draughts(),
            turn: 'white',
            move: null,
            board: ROWS.map((row, j) => {
                const half = BOARD_SIZE / 2 - 1;
                if (j === half || j === half + 1) {
                    return Array(BOARD_SIZE).fill().map((_, i) =>
                        i % 2 !== j % 2 ? CELLS.empty : CELLS.omit
                    );
                }

                return COLS.map((s, i) =>
                    i % 2 === j % 2 ?
                        (j <= 4 ? CELLS.black : CELLS.white) :
                        CELLS.omit
                );
            })
        };
    }

    /**
     * `i` and `j` are new coordinates.
     */
    _endTurn = (i, j) => {
        const {board: oldBoard, turn, move} = this.state;
        const board = deepSlice(oldBoard);

        if (board[i][j] !== CELLS.empty) {
            // Wrong! Choose other cell.
            return;
        }

        // TODO: check rules for current move.

        board[move.i][move.j] = CELLS.empty;
        board[i][j] = CELLS[turn];

        this.setState({board, move: null, turn: NEXT_TURN[turn]});
    };

    _onCellClick = (i, j) => {
        const {board, move} = this.state;

        const cell = board[i][j];
        if (cell === CELLS.omit) {
            // Wrong! Choose other cell.
            return;
        }

        if (move) {
            this._endTurn(i, j);
        }
    };

    _onClick = (i, j) => {
        const {board, turn, move} = this.state;
        if (move) {
            // Wrong! Choose empty cell.
            return;
        }

        const cell = board[i][j];
        if (cell !== CELLS[turn]) {
            // Wrong! It's not your cell.
            return;
        }

        this.setState({
            move: {i, j}
        });
    };

    render() {
        const {board, move} = this.state;
        return (
            <Scene embedded>
                <Entity
                    primitive="a-sky"
                    color="#f5f5f5"
                />

                <Entity
                    light={{
                        type: 'point',
                        color: 'white',
                        intensity: 1
                    }}
                    position="-4 7 -5"
                />
                <Entity
                    light={{
                        type: 'ambient',
                        color: 'white',
                        intensity: 0.4
                    }}
                />

                <Entity
                    id="boardContainer"
                    color="black"
                    width="8"
                    height="8"
                    position="-4 0 -10"
                    rotation="90 0 0"
                >
                    {board.map((row, i) =>
                        row.map((cell, j) => (
                            <Entity
                                key={`c-${i}-${j}`}
                                primitive="a-box"
                                color={i % 2 === j % 2 ? 'white' : 'black'}
                                position={{x: i + 1, y: j + 1, z: -1}}
                                events={{
                                    click: this._onCellClick.bind(this, i, j)
                                }}
                            />
                        ))
                    )}

                    {board.map((row, i) =>
                        row.map((cell, j) => (
                            cell === CELLS.white || cell === CELLS.black ?
                                <Entity
                                    key={`s-${i}-${j}`}
                                    primitive="a-cylinder"
                                    color={cell === CELLS.black ? 'black' : 'white'}
                                    height={0.3}
                                    radius={0.5}
                                    position={{
                                        x: i + 1,
                                        y: j + 1,
                                        z: move && move.i === i && move.j === j ? -1.7 : -1.5
                                    }}
                                    rotation="90 0 0"
                                    events={{
                                        click: this._onClick.bind(this, i, j)
                                    }}
                                /> :
                                null
                        ))
                    )}
                </Entity>

                <Entity primitive="a-grid" />

                <Entity position="0 2 1" rotation="-25 0 0">
                    <Entity primitive="a-camera">
                        <Entity
                            primitive="a-cursor"
                            geometry={{
                                primitive: 'ring',
                                radiusOuter: 0.05,
                                radiusInner: 0.03
                            }}
                            color="firebrick"
                        />
                    </Entity>
                </Entity>
            </Scene>
        );
    }
}

function deepSlice(board) {
    return board.slice().map((row) => row.slice());
}

extras.registerAll();
ReactDOM.render(<Chess />, document.querySelector('.scene-container'));
