import 'babel-polyfill';
import extras from 'aframe-extras';
import {Scene} from 'aframe-react';
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
            </Scene>
        );
    }
}

extras.registerAll();
ReactDOM.render(<App />, document.querySelector('.scene-container'));
