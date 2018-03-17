/* globals AFRAME, THREEx */

//////////////////////////////////////////////////////////////////////////////
//      arjs-hit-testing
//////////////////////////////////////////////////////////////////////////////
AFRAME.registerComponent('arjs-portal-door', {
    schema: {
        url: {     // Url of the content - may be video or image
            type: 'string'
        },
        doorWidth: {   // width of the door
            type: 'number',
            default: 1
        },
        doorHeight: {  // height of the door
            type: 'number',
            default: 2
        }
    },
    init: function () {
        const doorWidth = this.data.doorWidth;
        const doorHeight = this.data.doorHeight;
        const imageURL = this.data.url;

        const portalDoor = new THREEx.Portal360(imageURL, doorWidth, doorHeight);
        this._portalDoor = portalDoor;

        this.el.object3D.add(portalDoor.object3d);
    },
    tick: function () {
        this._portalDoor.update();
    }
});

AFRAME.registerPrimitive(
    'a-portal-door',
    AFRAME.utils.extendDeep({}, AFRAME.primitives.getMeshMixin(), {
        defaultComponents: {
            'arjs-portal-door': {}
        },
        mappings: {
            url: 'arjs-portal-door.url',
            doorWidth: 'arjs-portal-door.doorWidth',
            doorHeight: 'arjs-portal-door.doorHeight'
        }
    })
);
