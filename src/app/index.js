import 'babel-polyfill';
import extras from 'aframe-extras';
import {Scene, Entity} from 'aframe-react';
import React from 'react';
import ReactDOM from 'react-dom';
// import 'components/panorama';
import 'components/threex-portal-door';
import 'components/portal-door';

class App extends React.Component {
    render() {
        /*
        // <a-camera-static />
                <Entity primitive="a-marker" preset="hiro">
                </Entity>
                <Entity
                    primitive="a-plane"
                    src="#pano"
                    width="1024"
                    height="512"
                    position="0 256 -512"
                />
                */
        return (
            <Scene embedded arjs>
                <a-assets>
                    <img id="pano" src="https://maps.googleapis.com/maps/api/streetview?size=1024x512&location=55.738545,37.586016&heading=151.78&pitch=-0.76&key=AIzaSyAvRxwKIdIOuGSC3sRgBZcgqtk6kZgzK14" />
                </a-assets>

                <Entity primitive="a-grid" />
                <Entity
                    primitive="a-portal-door"
                    url="https://maps.googleapis.com/maps/api/streetview?size=1024x512&location=55.738545,37.586016&heading=151.78&pitch=-0.76&key=AIzaSyAvRxwKIdIOuGSC3sRgBZcgqtk6kZgzK14"
                    position="0 0.5 -1.5"
                />
            </Scene>
        );
    }
}

extras.registerAll();
ReactDOM.render(<App />, document.querySelector('.scene-container'));
