import 'babel-polyfill';
import 'aframe';
import extras from 'aframe-extras';
import {Scene, Entity} from 'aframe-react';
import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
    render() {
        return (
            <Scene>
                <Entity
                    primitive="a-ocean"
                    color="#92e2e2"
                    width="25"
                    depth="25"
                    density="15"
                    speed="2"
                />
            </Scene>
        );
    }
}

extras.registerAll();
ReactDOM.render(<App />, document.querySelector('.scene-container'));
