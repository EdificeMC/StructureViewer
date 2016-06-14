'use strict';

import THREE from 'three';
import get from 'lodash.get';
import merge from 'lodash.merge';

import mappings from './mappings.json';

const assetsURL = 'http://assets.edificemc.com';

const loader = new THREE.TextureLoader();
loader.crossOrigin = ''; // Allow cross origin requests

export function init(structureSchematic) {
    let scene = new THREE.Scene();

    for (let block of structureSchematic.blocks) {
        let geometry = new THREE.BoxGeometry(1, 1, 1);
        geometry.translate(block.Position.X, block.Position.Y, block.Position.Z);

        let mesh = new THREE.Mesh(geometry, getMaterial(block));
        scene.add(mesh)
    }

    scene.add(new THREE.AmbientLight(0xcccccc))

    return scene;
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
