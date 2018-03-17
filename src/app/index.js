import 'babel-polyfill';
import extras from 'aframe-extras';
import {Scene, Entity} from 'aframe-react';
import React from 'react';
import ReactDOM from 'react-dom';
import 'components/threex-portal-door';
import 'components/portal-door';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            alpha: 0,
            beta: 90,
            gamma: 0
        };
    }

    componentDidMount() {
        this._startWatchPosition();
    }

    _startWatchPosition = () => {
        window.addEventListener('deviceorientation', this._onOrientationChange);
    }

    _onOrientationChange = ({alpha, beta, gamma}) => {
        this.setState({alpha, beta, gamma});
    };

    render() {
        const {alpha, beta, gamma} = this.state;
        return (
            <Scene arjs embedded>
                <div style={{position: 'fixed', top: 0, left: 0, display: 'none'}}>
                    {`${alpha}, ${beta}, ${gamma}`}
                </div>

                <a-assets>
                    <img id="podval" src="/assets/podval.jpg" />
                    <img id="city" src="https://c1.staticflickr.com/1/818/39008494870_62f6b9a2b7_k.jpg" />
                </a-assets>

                <Entity
                    primitive="a-sphere"
                    position="0 1 0"
                    radius={0.5}
                    material="src: #city;"
                    rotation={{
                        x: this.state.alpha,
                        y: 90,
                        z: -90
                    }}
                />

                <Entity
                    primitive="a-plane"
                    position="0 0 0"
                    rotation="-90 0 0"
                    width="1"
                    height="1"
                    color="black"
                />

                <Entity
                    primitive="a-marker-camera"
                    preset="hiro"
                />
            </Scene>
        );
    }
}

extras.registerAll();
ReactDOM.render(<App />, document.querySelector('.scene-container'));
