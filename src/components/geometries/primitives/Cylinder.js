import {Entity} from 'aframe-react';
import React from 'react';

export class Cylinder extends React.Component {
    render() {
        const radius = this.props.radius || 1;
        const segmentsWidth = this.props.segmentsWidth || 36;
        const translate = this.props.translate || '0 0 0';
        const color = this.props.color || 'gray';
        const opacity = this.props.opacity || '1.0';
        const shader = this.props.shader || 'standard';
        const transparent = this.props.transparent || true;
        const metalness = this.props.metalness || 0.0;
        const roughness = this.props.roughness || 0.5;

        return (
            <Entity
                geometry={{primitive: 'cylinder', radius,
                    segmentsWidth: segmentsWidth,
                    translate
                }}
                material={{color, opacity, shader, transparent, metalness, roughness}}
                {...this.props}
            >
                {this.props.children}
            </Entity>
        );
    }
}
