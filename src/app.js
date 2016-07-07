// Camera manipulation code derived from https://github.com/mrdoob/three.js/blob/master/examples/webgl_materials_cubemap_dynamic2.html

'use strict';

import THREE from 'three';
import get from 'lodash.get';
import merge from 'lodash.merge';
import mappings from './mappings.json';

const assetsURL = 'https://assets.edificemc.com';

let doPassiveSpinning;
let scene, camera, renderer;
let loader = new THREE.TextureLoader();
loader.crossOrigin = ''; // Allow cross origin requests
let fov = 10;
let onMouseDownMouseX = 0;
let onMouseDownMouseY = 0;
let lon = 0;
let lat = 0;
let onMouseDownLon = 0;
let onMouseDownLat = 0;
let phi = 0;
let theta = 0;
let cameraFocus;

export default function(canvas, structureSchematic, spinning) {
    doPassiveSpinning = spinning
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 0;

    let count = 0;
    let sumX = 0;
    let sumY = 0;
    let sumZ = 0;
    for (let block of structureSchematic.blocks) {
        let geometry = new THREE.BoxGeometry(1, 1, 1);
        geometry.translate(block.Position.X, block.Position.Y, block.Position.Z);

        let mesh = new THREE.Mesh(geometry, getMaterial(block));
        scene.add(mesh);
        
        count++;
        sumX += block.Position.X;
        sumY += block.Position.Y;
        sumZ += block.Position.Z;
    }
    // Focus the camera on the middle of the structure
    cameraFocus = new THREE.Vector3(sumX / count, sumY / count, sumZ / count);

    scene.add(new THREE.AmbientLight(0xcccccc))

    renderer = new THREE.WebGLRenderer({
        canvas,
        preserveDrawingBuffer: true
    });
    renderer.setClearColor(0xbfd1e5);

    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('wheel', onDocumentMouseWheel, false);

    animate();
}

function getMaterial(block) {
    const rawType = get(block, 'BlockState.BlockState');
    const blockData = parseBlockType(rawType);
    const baseType = blockData.baseType;
    const properties = blockData.properties;

    let blockMapping = mappings[baseType];
    if (!blockMapping) {
        console.log('No mapping found for ' + baseType)
            // Material is the no texture material by default
        return new THREE.MeshPhongMaterial({
            map: loader.load(assetsURL + '/notexture.png')
        });
    }

    // texturePath can potentially be an array of paths instead of a single string
    let texturePath, materialProperties;
    if (blockMapping instanceof Object) {
        if (properties) {
            for (let key in properties) {
                if (!blockMapping[key]) {
                    // The property is unimportant concerning textures, such as direction
                    continue;
                }
                texturePath = blockMapping[key][properties[key]];
            }
        } else {
            // The mapping is an object just to specify 3.js related properties, like transparency
            texturePath = blockMapping.path;
        }
        materialProperties = blockMapping.materialProperties || {};
    } else {
        texturePath = blockMapping;
        materialProperties = {};
    }

    if (Array.isArray(texturePath)) {
        // There are different textures for each side of the block
        texturePath = texturePath.map(path => new THREE.MeshPhongMaterial(merge({
            map: getBlockTexture(path)
        }, materialProperties)))
        return new THREE.MeshFaceMaterial(texturePath);
    } else {
        // Same texture for every side;
        return new THREE.MeshPhongMaterial(merge({
            map: getBlockTexture(texturePath)
        }, materialProperties));
    }
}

function parseBlockType(rawType) {
    const bracketInd = rawType.indexOf('[');
    // Check for the opening square bracket on blocks w/ extra properties
    if (bracketInd === -1) {
        return {
            baseType: rawType,
            properties: null
        }
    }

    // Split up the raw type into the base type ('minecraft:quartz_block') and properties ('variant=default')
    const baseType = rawType.substring(0, bracketInd);
    const propertiesString = rawType.substring(bracketInd + 1, rawType.length - 1);
    const propertiesStringArray = propertiesString.split(',');
    let properties = {};
    for (const property of propertiesStringArray) {
        // Parse each 'key=value' property
        let eqInd = property.indexOf('=');
        const key = property.substring(0, eqInd);
        const value = property.substring(eqInd + 1, property.length);
        properties[key] = value;
    }

    return {
        baseType,
        properties
    };
}

function getBlockTexture(texturePath) {
    return loader.load(assetsURL + '/R3D.CRAFT/blocks/' + texturePath + '.png');
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
        fov -= event.wheelDeltaY * 0.01;
        // If FOV is negative, it inverts the structure
        fov = fov <= 0 ? 1 : fov;
        // If FOV goes above ~180, it inverts the structure
        fov = fov > 150 ? 150 : fov;
    } else if (event.wheelDelta) {
        // Opera / Explorer 9
        fov -= event.wheelDelta * 0.01;
        fov = fov <= 0 ? 1 : fov;
        fov = fov > 150 ? 150 : fov;
    } else if (event.detail) {
        // Firefox
        fov += event.detail * 0.2;
        fov = fov <= 0 ? 1 : fov;
        fov = fov > 150 ? 150 : fov;
    }
    camera.projectionMatrix.makePerspective(fov, window.innerWidth / window.innerHeight, 1, 1100);
}

function animate() {
    requestAnimationFrame(animate);

    if(doPassiveSpinning) {
        lon += .15;
    }

    lat = Math.max(-85, Math.min(85, lat));
    phi = THREE.Math.degToRad(90 - lat);
    theta = THREE.Math.degToRad(lon);

    camera.position.x = 100 * Math.sin(phi) * Math.cos(theta);
    camera.position.y = 100 * Math.cos(phi);
    camera.position.z = 100 * Math.sin(phi) * Math.sin(theta);
    camera.lookAt(cameraFocus);

    renderer.render(scene, camera);

}
