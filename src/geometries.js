'use strict';

import THREE from 'three';

const dummyMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000 } );

function slab(blockData) {
    let slab = new THREE.BoxGeometry(1, 0.5, 1);
    // Possibly no block data if called internally (stairs)
    if(blockData) {
        if(blockData.properties.half === 'top') {
            // Shift the slab to the top half of the block
            slab.translate(0, 0.25, 0);
        } else {
            // Shift the slab to the bottom half of the block
            slab.translate(0, -0.25, 0);
        }
    }
    return slab;
}

function stairs(blockData) {
    const base = slab();

    const isUpsideDown = blockData.properties.half === 'top';
    let stepTransformY = 0.25;
    let baseTransformY = -0.25;
    if(isUpsideDown) {
        stepTransformY *= -1;
        baseTransformY *= -1;
    }
    base.translate(0, baseTransformY, 0);

    let geometry;
    const shape = blockData.properties.shape;
    if(shape === 'straight') {
        let step = new THREE.BoxGeometry(1, 0.5, 0.5);
        step.translate(0, stepTransformY, 0.25);
        geometry = mergeGeometries([base, step]);
    } else if(shape.startsWith('inner')) {
        // The one with the mostly full block except for a quarter taken out of a corner
        // const stepPts = [new THREE.Vector2(0, 0), new THREE.Vector2(0, 1), new THREE.Vector2(0.5, 1), new THREE.Vector2(0.5, 0.5), new THREE.Vector2(1, 0.5), new THREE.Vector2(1, 0)];
        // const stepShape = new THREE.Shape(stepPts);
        //
        // // geometry = mergeGeometries([base, stepShape.extrude({amount: 0.5})]);

        let step1 = new THREE.BoxGeometry(1, 0.5, 0.5);
        step1.translate(0, stepTransformY, 0.25);
        let step2 = new THREE.BoxGeometry(0.5, 0.5, 0.5);

        if(shape.endsWith('left')) {
            step2.translate(0.25, stepTransformY, -0.25);
        } else if(shape.endsWith('right')) {
            step2.translate(-0.25, stepTransformY, -0.25)
        }
        geometry = mergeGeometries([base, step1, step2]);
    } else if(shape.startsWith('outer')) {
        // The one with the mostly flat surface except the quarter block bump in the corner
        let step = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        if(shape.endsWith('left')) {
            step.translate(0.25, stepTransformY, 0.25);
        } else if(shape.endsWith('right')) {
            step.translate(-0.25, stepTransformY, 0.25);
        }
        geometry = mergeGeometries([base, step]);
    } else {
        // Shouldn't ever happen unless a new shape is added
        console.log('Unhandled stair block shape: ' + shape);
        geometry = new THREE.BoxGeometry(1, 1, 1);
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

function fence(blockData) {
    let parts = [];
    parts.push(new THREE.BoxGeometry(0.25, 1, 0.25)); // Center post
    const properties = blockData.properties;
    if(properties.north === 'true') {
        let upperBar = new THREE.BoxGeometry(2/16, 3/16, 8/16);
        upperBar.translate(0, 6/16, -4/16);
        parts.push(upperBar);
        let lowerBar = new THREE.BoxGeometry(2/16, 3/16, 8/16);
        lowerBar.translate(0, -1/16, -4/16);
        parts.push(lowerBar);
    }
    if(properties.south === 'true') {
        let upperBar = new THREE.BoxGeometry(2/16, 3/16, 8/16);
        upperBar.translate(0, 6/16, 4/16);
        parts.push(upperBar);
        let lowerBar = new THREE.BoxGeometry(2/16, 3/16, 8/16);
        lowerBar.translate(0, -1/16, 4/16);
        parts.push(lowerBar);
    }
    if(properties.east === 'true') {
        let upperBar = new THREE.BoxGeometry(8/16, 3/16, 2/16);
        upperBar.translate(4/16, 6/16, 0/16);
        parts.push(upperBar);
        let lowerBar = new THREE.BoxGeometry(8/16, 3/16, 2/16);
        lowerBar.translate(4/16, -1/16, 0/16);
        parts.push(lowerBar);
    }
    if(properties.west === 'true') {
        let upperBar = new THREE.BoxGeometry(8/16, 3/16, 2/16);
        upperBar.translate(-4/16, 6/16, 0/16);
        parts.push(upperBar);
        let lowerBar = new THREE.BoxGeometry(8/16, 3/16, 2/16);
        lowerBar.translate(-4/16, -1/16, 0/16);
        parts.push(lowerBar);
    }
    return mergeGeometries(parts);
}

function pane(blockData) {
    const properties = blockData.properties;

    if(properties.north === 'true' && properties.south === 'true') {
        return new THREE.BoxGeometry(2/16, 1, 1);
    }

    if(properties.east === 'true' && properties.west === 'true') {
        return new THREE.BoxGeometry(1, 1, 2/16);
    }

    let parts = [];
    parts.push(new THREE.BoxGeometry(2/16, 1, 2/16)) // Center post
    if(properties.north === 'true') {
        let pane = new THREE.BoxGeometry(2/16, 1, 0.5);
        pane.translate(0, 0, -0.25);
        parts.push(pane);
    }
    if(properties.south === 'true') {
        let pane = new THREE.BoxGeometry(2/16, 1, 0.5);
        pane.translate(0, 0, 0.25);
        parts.push(pane);
    }
    if(properties.east === 'true') {
        let pane = new THREE.BoxGeometry(0.5, 1, 2/16);
        pane.translate(0.25, 0, 0);
        parts.push(pane);
    }
    if(properties.west === 'true') {
        let pane = new THREE.BoxGeometry(0.5, 1, 2/16);
        pane.translate(-0.25, 0, 0);
        parts.push(pane);
    }
    return mergeGeometries(parts);
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
    stairs, slab, fence, pane
}
