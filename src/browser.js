// Camera manipulation code derived from https://github.com/mrdoob/three.js/blob/master/examples/webgl_materials_cubemap_dynamic2.html

'use strict';

import THREE from 'three';
import { init } from './common';

let scene, camera, renderer;
let fov = 10,
    onMouseDownMouseX = 0,
    onMouseDownMouseY = 0,
    lon = 0,
    lat = 0,
    onMouseDownLon = 0,
    onMouseDownLat = 0,
    phi = 0,
    theta = 0;

export default function(canvas, structureSchematic) {
    scene = init(structureSchematic);

    camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 0;

    renderer = new THREE.WebGLRenderer({
        canvas
    });
    renderer.setClearColor(0xbfd1e5);

    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('wheel', onDocumentMouseWheel, false);

    animate();
}

function onDocumentMouseDown(event) {
    event.preventDefault();
    onMouseDownMouseX = event.clientX;
    onMouseDownMouseY = event.clientY;
    onMouseDownLon = lon;
    onMouseDownLat = lat;
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
}

function onDocumentMouseMove(event) {
    lon = (event.clientX - onMouseDownMouseX) * 0.1 + onMouseDownLon;
    lat = (event.clientY - onMouseDownMouseY) * 0.1 + onMouseDownLat;
}

function onDocumentMouseUp(event) {
    document.removeEventListener('mousemove', onDocumentMouseMove, false);
    document.removeEventListener('mouseup', onDocumentMouseUp, false);
}

function onDocumentMouseWheel(event) {
    if (event.wheelDeltaY) {
        // WebKit
        fov -= event.wheelDeltaY * 0.05;
        // If FOV is negative, it inverts the structure
        fov = fov <= 0 ? 1 : fov;
        // If FOV goes above ~180, it inverts the structure
        fov = fov > 150 ? 150 : fov;
    } else if (event.wheelDelta) {
        // Opera / Explorer 9
        fov -= event.wheelDelta * 0.05;
        fov = fov <= 0 ? 1 : fov;
        fov = fov > 150 ? 150 : fov;
    } else if (event.detail) {
        // Firefox
        fov += event.detail * 1.0;
        fov = fov <= 0 ? 1 : fov;
        fov = fov > 150 ? 150 : fov;
    }
    camera.projectionMatrix.makePerspective(fov, window.innerWidth / window.innerHeight, 1, 1100);
}

function animate() {
    requestAnimationFrame(animate);

    lon += .15;
    lat = Math.max(-85, Math.min(85, lat));
    phi = THREE.Math.degToRad(90 - lat);
    theta = THREE.Math.degToRad(lon);

    camera.position.x = 100 * Math.sin(phi) * Math.cos(theta);
    camera.position.y = 100 * Math.cos(phi);
    camera.position.z = 100 * Math.sin(phi) * Math.sin(theta);
    camera.lookAt(scene.position);

    renderer.render(scene, camera);

}
