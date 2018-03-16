/* global AFRAME */

if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
}

window.onGoogleMapAPILoaded = init;

// ymaps.ready(init);

// const apiScript = document.createElement('script');
// apiScript.src = 'https://maps.googleapis.com/maps/api/js?' +
//     'key=AIzaSyAvRxwKIdIOuGSC3sRgBZcgqtk6kZgzK14&' +
//     'callback=onGoogleMapAPILoaded';
// document.querySelector('head').appendChild(apiScript);

function init() {
    document.querySelectorAll('[streetview]').forEach((entity) => {
        entity.components.streetview.loadPano();
    });
    // const service = new google.maps.StreetViewService();

    // const latLng = new google.maps.LatLng(55.738545, 37.586016);

    // service.getPanorama({
    //     location: latLng,
    //     radius: 50
    // }, (result, status) => {
    //     console.log(result.location, status);
    // });
}

window.AFRAME.registerComponent('streetview', {
    schema: {
        location: {
            type: 'array',
            default: [40.730031, -73.991428]
        },
        radius: {
            type: 'number',
            default: 100
        }
    },

    init: function () {
    },

    loadPano: function () {
        // console.log(this.data.location, this.el);
        // ymaps.panorama.createPlayer(this.el, this.data.location, {})
        //     .done(
        //         () => console.log('created'),
        //         (err) => console.log(err)
        //     );

        // const position = new google.maps.LatLng(this.data.location[0], this.data.location[1]);
        // return new google.maps.StreetViewPanorama(
        //     this.el,
        //     {
        //         position,
        //         pov: {
        //             heading: 151.78,
        //             pitch: -0.76
        //         },
        //         visible: true
        //     }
        // );
    }
});
