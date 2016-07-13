'use strict';

import THREE from 'three';

const dummyMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000 } );

function slab(blockData) {
    return new THREE.BoxGeometry(1, 0.5, 1);
}

function stairs(blockData) {
    const base = slab(blockData);

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
