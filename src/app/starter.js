import 'aframe-core';
import 'babel-polyfill';
import {Animation, Entity, Scene} from 'aframe-react';
import React from 'react';
import ReactDOM from 'react-dom';
import sample from 'lodash.sample';
import {cdn} from '../utils';
import {Camera, Cursor, Light, Sky, CurvedImage} from '../components/primitives';

class StarterScene extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            color: '#2979ff',
            videoAlt: false
        };

        this._rings = [-1, 0, 1];
        this._boxes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        this._colors = ['#3f51b5', '#ffb74d', '#607d8b', '#ef5350', '#4caf50'];
    }

    _changeColor = () => {
        this.setState({
            color: this._colors[Math.floor(Math.random() * this._colors.length)]
        });
    }

    _generateBox(index, level) {
        const materialOpts = {
            color: sample(this._colors),
            metalness: 0.8
        };

        const deg = index * (Math.PI * 2 / this.boxes.length);
        const spacingUnit = 20;

        // console.log(`box-${index} deg:`, deg);

        if (!level) {
            level = 0;
        }

        return (
            <Entity
                key={`box-${index}`}
                geometry="primitive: box"
                material={materialOpts}
                onClick={this._changeColor}
                position={`${Math.cos(deg) * spacingUnit} ${level * spacingUnit} ${Math.sin(deg) * spacingUnit}`}
            >
                <Animation attribute="rotation" dur="5000" repeat="indefinite" to="0 -360 360" />
            </Entity>
        );
    }

    _generateRing = (level) => {
        return this._boxes.map((box) => this._generateBox(box, level));
    }

    render() {
        const boxes = this._rings.map(this._generateRing);

        // <VideoSphere
        //       src={cdn(Math.random() < .5 ? 'https://ucarecdn.com/bcece0a8-86ce-460e-856b-40dac4875f15/' : 'assets/videos/overpass.mp4')}
        //       muted={true}
        //       position="50 0 15"
        //       rotation="0 -90 0"/>
        return (
            <Scene fog="type: linear; color: #ef9a9a; far: 30; near: 0;">
                <Camera position="0 0 0">
                    <Cursor />
                </Camera>

                <Sky />

                <Light type="ambient" color="#fff" />
                <Light type="directional" intensity="0.5" position="0 0 -1" />
                <Light type="directional" intensity="1" position="0 0 -1" />

                <CurvedImage
                    src={cdn('assets/images/wikipage.png')}
                    position="0 2 0"
                    radius="5.7"
                    thetaStart="30"
                    thetaLength="72"
                    height="3.02" rotation="180 0 90" scale="0.8 0.8 0.8"
                />

                {boxes}
            </Scene>
        );
    }
}

ReactDOM.render(<StarterScene />, document.querySelector('.scene-container'));
