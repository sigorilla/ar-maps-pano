/* globals THREE */

const THREEx = window.THREEx || {};

THREEx.Portal360 = function (videoImageURL, doorWidth, doorHeight) {
    const doorCenter = new THREE.Group();
    doorCenter.position.y = doorHeight / 2;
    this.object3d = doorCenter;

    //////////////////////////////////////////////////////////////////////////////
    //      build texture360
    //////////////////////////////////////////////////////////////////////////////
    const isVideo = videoImageURL.match(/.(mp4|webm|ogv)/i) ? true : false;
    let texture360;
    if (isVideo) {
        const video = document.createElement('video');
        video.width = 640;
        video.height = 360;
        video.loop = true;
        video.muted = true;
        video.src = videoImageURL;
        video.crossOrigin = 'anonymous';
        video.setAttribute('webkit-playsinline', 'webkit-playsinline');
        video.play();

        texture360 = new THREE.VideoTexture(video);
        texture360.minFilter = THREE.LinearFilter;
        texture360.format = THREE.RGBFormat;
        texture360.flipY = false;
    } else {
        texture360 = new THREE.TextureLoader().load(videoImageURL);
        texture360.minFilter = THREE.NearestFilter;
        texture360.format = THREE.RGBFormat;
        texture360.flipY = false;
    }

    //////////////////////////////////////////////////////////////////////////////
    //      build mesh
    //////////////////////////////////////////////////////////////////////////////

    // create insideMesh which is visible IIF inside the portal
    const insideMesh = this._buildInsideMesh(texture360, doorWidth, doorHeight);
    doorCenter.add(insideMesh);
    this.insideMesh = insideMesh;

    // create outsideMesh which is visible IIF outside the portal
    const outsideMesh = this._buildOutsideMesh(texture360, doorWidth, doorHeight);
    doorCenter.add(outsideMesh);
    this.outsideMesh = outsideMesh;

    // create frameMesh for the frame of the portal
    const frameMesh = this._buildRectangularFrame(doorWidth / 100, doorWidth, doorHeight);
    doorCenter.add(frameMesh);
};
//////////////////////////////////////////////////////////////////////////////
//      Code Separator
//////////////////////////////////////////////////////////////////////////////
THREEx.Portal360.buildTransparentMaterial = function () {
    // if there is a cached version, return it
    if (THREEx.Portal360.buildTransparentMaterial.material) {
        return THREEx.Portal360.buildTransparentMaterial.material;
    }
    const material = new THREE.MeshBasicMaterial({
        colorWrite: false // only write to z-buf
    });
    // an alternative to reach the same visual - this one seems way slower tho.
    // My guess is it is hitting a slow-path in gpu
    // var material   = new THREE.MeshBasicMaterial();
    // material.color.set('black')
    // material.opacity   = 0;
    // material.blending  = THREE.NoBlending;

    // cache the material
    THREEx.Portal360.buildTransparentMaterial.material = material;

    return material;
};

//////////////////////////////////////////////////////////////////////////////
//      Build various cache
//////////////////////////////////////////////////////////////////////////////
THREEx.Portal360.buildSquareCache = function () {
    const container = new THREE.Group();
    // add outter cube - invisibility cloak
    const geometry = new THREE.PlaneGeometry(50, 50);
    const material = THREEx.Portal360.buildTransparentMaterial();

    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = geometry.parameters.width / 2 + 0.5;
    mesh.position.y = -geometry.parameters.height / 2 + 0.5;
    container.add(mesh);

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = -geometry.parameters.width / 2 + 0.5;
    mesh.position.y = -geometry.parameters.height / 2 - 0.5;
    container.add(mesh);

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = -geometry.parameters.width / 2 - 0.5;
    mesh.position.y = geometry.parameters.height / 2 - 0.5;
    container.add(mesh);

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = Number(geometry.parameters.width) / 2 - 0.5;
    mesh.position.y = geometry.parameters.height / 2 + 0.5;
    container.add(mesh);

    return container;
};

//////////////////////////////////////////////////////////////////////////////
//      build meshes
//////////////////////////////////////////////////////////////////////////////

/**
 * create insideMesh which is visible IIF inside the portal
 */
THREEx.Portal360.prototype._buildInsideMesh = function (texture360, doorWidth, doorHeight) {
    const doorInsideCenter = new THREE.Group();

    // var squareCache = THREEx.Portal360.buildSquareCache()
    // squareCache.scale.y = doorWidth
    // squareCache.scale.y = doorHeight
    // doorInsideCenter.add( squareCache )

    let geometry = new THREE.PlaneGeometry(doorWidth, doorHeight);
    let material = THREEx.Portal360.buildTransparentMaterial();
    // var material = new THREE.MeshNormalMaterial()
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.y = Math.PI;
    // mesh.position.z = 0.03
    doorInsideCenter.add(mesh);

    //////////////////////////////////////////////////////////////////////////////
    //      add 360 sphere
    //////////////////////////////////////////////////////////////////////////////
    // add 360 texture
    // TODO put that in a this.data
    const radius360Sphere = 10;
    // var radius360Sphere = 1

    geometry = new THREE.SphereGeometry(radius360Sphere, 16, 16).rotateZ(Math.PI);
    material = new THREE.MeshBasicMaterial({
        map: texture360,
        // opacity: 0.9,
        side: THREE.DoubleSide
    });
    // var material = new THREE.MeshNormalMaterial()
    const sphere360Mesh = new THREE.Mesh(geometry, material);
    sphere360Mesh.position.z = -0.1;
    sphere360Mesh.rotation.y = Math.PI;
    doorInsideCenter.add(sphere360Mesh);

    return doorInsideCenter;
};

/**
 * create outsideMesh which is visible IIF outside the portal
 */
THREEx.Portal360.prototype._buildOutsideMesh = function (texture360, doorWidth, doorHeight) {
    const doorOutsideCenter = new THREE.Group();

    //////////////////////////////////////////////////////////////////////////////
    //      add squareCache
    //////////////////////////////////////////////////////////////////////////////
    const squareCache = THREEx.Portal360.buildSquareCache();
    squareCache.scale.y = doorWidth;
    squareCache.scale.y = doorHeight;
    doorOutsideCenter.add(squareCache);

    //////////////////////////////////////////////////////////////////////////////
    //      add 360 sphere
    //////////////////////////////////////////////////////////////////////////////
    // add 360 texture
    const radius360Sphere = 10;
    // var radius360Sphere = 1

    // build half sphere geometry
    const geometry = new THREE.SphereGeometry(radius360Sphere, 16, 16, Math.PI, Math.PI, 0, Math.PI).rotateZ(Math.PI);
    // fix UVs
    geometry.faceVertexUvs[0].forEach((faceUvs) => {
        faceUvs.forEach((uv) => {
            uv.x /= 2;
        });
    });
    geometry.uvsNeedUpdate = true;
    const material = new THREE.MeshBasicMaterial({
        map: texture360,
        // opacity: 0.9,
        side: THREE.BackSide
    });
    // var geometry = new THREE.SphereGeometry( radius360Sphere, 16, 16);
    // var material = new THREE.MeshNormalMaterial()
    const sphere360Mesh = new THREE.Mesh(geometry, material);
    sphere360Mesh.position.z = -0.1;
    doorOutsideCenter.add(sphere360Mesh);

    return doorOutsideCenter;
};

/**
 * create frameMesh for the frame of the portal
 */
THREEx.Portal360.prototype._buildRectangularFrame = function (radius, width, height) {
    const container = new THREE.Group();
    // const material = new THREE.MeshNormalMaterial();
    const material = new THREE.MeshPhongMaterial({
        color: 'silver',
        emissive: 'green'
    });

    const geometryBeamVertical = new THREE.CylinderGeometry(radius, radius, height - radius);

    // mesh right
    const meshRight = new THREE.Mesh(geometryBeamVertical, material);
    meshRight.position.x = width / 2;
    container.add(meshRight);

    // mesh right
    const meshLeft = new THREE.Mesh(geometryBeamVertical, material);
    meshLeft.position.x = -width / 2;
    container.add(meshLeft);

    const geometryBeamHorizontal = new THREE.CylinderGeometry(radius, radius, width - radius).rotateZ(Math.PI / 2);

    // mesh top
    const meshTop = new THREE.Mesh(geometryBeamHorizontal, material);
    meshTop.position.y = height / 2;
    container.add(meshTop);

    // mesh bottom
    const meshBottom = new THREE.Mesh(geometryBeamHorizontal, material);
    meshBottom.position.y = -height / 2;
    container.add(meshBottom);

    return container;
};

//////////////////////////////////////////////////////////////////////////////
//      update function
//////////////////////////////////////////////////////////////////////////////

THREEx.Portal360.prototype.update = function () {
    // determine if the user is isOutsidePortal
    const localPosition = new THREE.Vector3();
    this.object3d.worldToLocal(localPosition);
    const isOutsidePortal = localPosition.z >= 0 ? true : false;

    // handle mesh visibility based on isOutsidePortal
    if (isOutsidePortal) {
        this.outsideMesh.visible = true;
        this.insideMesh.visible = false;
    } else {
        this.outsideMesh.visible = false;
        this.insideMesh.visible = true;
    }
};
