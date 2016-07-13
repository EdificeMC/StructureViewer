'use strict';

import THREE from 'three';

const dummyMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000 } );

function slab(blockData) {
    return new THREE.BoxGeometry(1, 0.5, 1);
}

function stairs(blockData) {
    // TODO other shapes other than straight and also other orientations (upside down and whatever else)
    const base = slab(blockData);
    base.translate(0, -0.25, 0)

    let geometry;
    switch(blockData.properties.shape) {
        case 'straight':
            let step = new THREE.BoxGeometry(1, 0.5, 0.5);
            step.translate(0, 0.25, 0.25);
            geometry = mergeGeometries([base, step]);
            break;
        default:
            console.log('Unhandled stair block shape: ' + blockData.properties.shape);
            geometry = new THREE.BoxGeometry(1, 1, 1);
            break;
    }

    let angle;
    switch(blockData.properties.facing) {
        case 'north':
            angle = Math.PI;
            break;
        case 'south':
            angle = 0;
            break;
        case 'east':
            angle = Math.PI / 2;
            break;
        case 'west':
            angle = Math.PI * 3 / 2;
            break;
    }

    geometry.rotateY(angle);

    return geometry;
}

function mergeGeometries(geometries) {
    let geometry = new THREE.Geometry();
    for(let geo of geometries) {
        const mesh = new THREE.Mesh(geo, dummyMaterial);
        geometry.merge(mesh.geometry, mesh.matrix);
    }
    return geometry;
}

export default {
    stairs
}
