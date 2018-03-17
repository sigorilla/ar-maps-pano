import 'babel-polyfill';
// import 'aframe-refraction-system';
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
        /**

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
                    primitive="a-sphere"
                    position="0 1 0"
                    radius={0.49}
                    detail="3"
                    scale="-0.5 -0.5 -0.5"
                    material="shader: pano-portal-dither; src: #city;"
                    rotation={{
                        x: this.state.alpha,
                        y: 90,
                        z: -90
                    }}
                />

         */
        return (
            <Scene arjs embedded>
                <div style={{position: 'fixed', top: 0, left: 0, display: 'none'}}>
                    {`${alpha}, ${beta}, ${gamma}`}
                </div>

                <a-assets>
                    <img id="podval" src="/assets/podval.jpg" />
                    <img id="city" src="https://c1.staticflickr.com/1/818/39008494870_62f6b9a2b7_k.jpg" />
                    <img id="cafe" src="https://c2.staticflickr.com/4/3575/3319582836_162a174fe9_b.jpg" />
                </a-assets>

                <Entity
                    primitive="a-sphere"
                    position="0 0 0"
                    radius={10}
                    geometry={{
                        phiStart: 0,
                        phiLength: 180,
                        thetaStart: 30,
                        thetaLength: 70
                    }}
                    src="#cafe"
                />

                <Entity position="0 0 0" rotation="0 -90 0">
                    <Entity primitive="a-camera" />
                </Entity>

            </Scene>
        );
        // return (
        //     <a-scene embedded arjs="trackingMethod: best;">
        //         <a-camera />

        //         <a-anchor hit-testing-enabled="true">
        //             <a-portal-door
        //                 url="https://c1.staticflickr.com/1/818/39008494870_62f6b9a2b7_k.jpg"
        //                 position="1 0 0"
        //                 scale="0.7 1 0.7"
        //                 rotation="-90 90 0"
        //             />
        //         </a-anchor>

        //         <a-camera-static />
        //     </a-scene>
        // );
    }
}

extras.registerAll();
ReactDOM.render(<App />, document.querySelector('.scene-container'));
