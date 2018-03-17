import 'babel-polyfill';
import extras from 'aframe-extras';
import {Scene, Entity} from 'aframe-react';
import React from 'react';
import ReactDOM from 'react-dom';

const SIZE = 3;
const R = 0.9;
const IN_R = 0.03;

const ROWS = Array(SIZE).fill().map((_, i) => i);

const NEXT_TURN = {
    x: 'o',
    o: 'x'
};

const getInitialState = () => ({
    board: ROWS.map(() => ROWS.map(() => 'e')),
    turn: Math.random() < 0.5 ? 'x' : 'o',
    winner: null
});

class Chess extends React.Component {
    constructor(props) {
        super(props);

        this.state = getInitialState();
    }

    _getWinner = (board) => {
        // Check rows.
        for (let i = 0; i < SIZE; i++) {
            const row = board[i];
            const sorted = row.filter((cell, j) => row.indexOf(cell) === j);
            if (sorted.length === 1 && sorted[0] !== 'e') {
                return sorted[0];
            }
        }

        // Check columns.
        for (let i = 0; i < SIZE; i++) {
            const column = board.map((row) => row[i]);
            const sorted = column.filter((cell, j) => column.indexOf(cell) === j);
            if (sorted.length === 1 && sorted[0] !== 'e') {
                return sorted[0];
            }
        }

        // Check diagonals.
        // TODO: refactor.
        const diagonals = [
            [board[0][0], board[1][1], board[2][2]],
            [board[0][2], board[1][1], board[2][0]]
        ];
        for (let i = 0; i < 2; i++) {
            const sorted = diagonals[i].filter((cell, j) => diagonals[i].indexOf(cell) === j);
            if (sorted.length === 1 && sorted[0] !== 'e') {
                return sorted[0];
            }
        }

        // const hasEmpty = board.some((row) => row.some((cell) => cell === 'e'));
        return null;
    };

    _onCellClick = (i, j) => {
        const {board: oldBoard, turn, winner} = this.state;
        if (winner) {
            this.setState(getInitialState());
            return;
        }

        const board = deepSlice(oldBoard);
        const cell = board[i][j];
        if (cell !== 'e') {
            // Wrong! It's not empty.
            return;
        }

        board[i][j] = turn;
        const newWinner = this._getWinner(board);
        this.setState({
            board,
            winner: newWinner,
            turn: NEXT_TURN[turn]
        });
    };

    _renderX = (i, j) => {
        return [-1, 1].map((n) => (
            <Entity
                key={`p-${i}-${j}-${n}`}
                primitive="a-cylinder"
                color="#5788de"
                radius={IN_R * 2}
                height={R}
                rotation={{
                    x: n * 45,
                    y: 90,
                    z: 0
                }}
            />
        ));
    }

    render() {
        const {board, winner, turn} = this.state;
        const text = !winner ?
            `Player '${turn}', now is your turn!` :
            `Player '${winner}' is winner! Grats!`;
        return (
            <Scene embedded>
                <a-assets>
                    <img id="skyTexture" src="https://cdn.aframe.io/360-image-gallery-boilerplate/img/sechelt.jpg" />
                    <img id="groundTexture" src="https://cdn.aframe.io/a-painter/images/floor.jpg" />
                </a-assets>

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
                    id="board"
                    width={SIZE}
                    height={SIZE}
                    position="-2 -0.5 -6"
                >
                    <Entity
                        primitive="a-text"
                        value={text}
                        position="2 3.7 0"
                        align="center"
                    />
                    {board.map((row, i) =>
                        row.map((cell, j) => (
                            <Entity
                                key={`c-${i}-${j}`}
                                primitive="a-plane"
                                color="#f2f2f2"
                                position={{x: i + 1, y: j + 1, z: 0}}
                                events={{
                                    click: this._onCellClick.bind(this, i, j)
                                }}
                            />
                        ))
                    )}

                    {['x', 'y'].map((l) =>
                        board.slice(0, SIZE - 1).map((_, i) => (
                            <Entity
                                key={`divider-${l}-${i}`}
                                primitive="a-cylinder"
                                color="#666"
                                radius={IN_R / 2}
                                height={SIZE}
                                position={{
                                    x: (l === 'x' ? i : 0.5) + 1.5,
                                    y: (l === 'y' ? i : 0.5) + 1.5,
                                    z: 0
                                }}
                                rotation={{
                                    x: 0,
                                    y: 0,
                                    z: l === 'y' ? -90 : 0
                                }}
                            />
                        ))
                    )}

                    {board.map((row, i) =>
                        row.map((cell, j) => {
                            if (cell === 'e') {
                                return null;
                            }

                            const params = {};
                            if (cell === 'o') {
                                params.primitive = 'a-torus';
                                params.color = '#f23c3c';
                                params.radius = R / 2 - IN_R * 3;
                                params.geometry = {
                                    radiusTubular: IN_R
                                };
                            }
                            return (
                                <Entity
                                    key={`s-${i}-${j}`}
                                    position={{
                                        x: i + 1,
                                        y: j + 1,
                                        z: 0
                                    }}
                                    {...params}
                                >
                                    {cell === 'x' ? this._renderX(i, j) : null}
                                </Entity>
                            );
                        })
                    )}
                </Entity>

                <Entity primitive="a-sky" src="#skyTexture" />
                <Entity primitive="a-plane" src="#groundTexture" rotation="-90 0 0" width="30" height="30" />

                <Entity primitive="a-camera">
                    <Entity
                        primitive="a-cursor"
                        geometry={{
                            primitive: 'ring',
                            radiusOuter: 0.01,
                            radiusInner: 0.005
                        }}
                        color="black"
                    />
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
