import 'babel-polyfill';
import 'aframe-core';
import {Scene} from 'aframe-react';
import React from 'react';
import ReactDOM from 'react-dom';
import {Sky} from '../components/primitives';
import {Sphere, Cube, Cylinder, Plane} from '../components/geometries';

class DemoScene extends React.Component {
    render() {
        return (
            <Scene>
                <Sphere position="0 1.25 -1" radius="1.25" color="#ef2d5e" />
                <Cube
                    position="-1 0.5 1" rotation="0 45 0" width="1"
                    height="1" depth="1" color="#4cc3d9"
                />
                <Cylinder position="1 0.75 1" radius="0.5" height="1.5" color="#ffc65d" />
                <Plane rotation="-90 0 0" width="4" height="4" color="#78c8a4" />

                <Sky color="#ececec" />
            </Scene>
        );
    }
}

ReactDOM.render(<DemoScene />, document.querySelector('.scene-container'));
