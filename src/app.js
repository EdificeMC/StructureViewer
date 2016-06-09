// Camera manipulation code derived from https://github.com/mrdoob/three.js/blob/master/examples/webgl_materials_cubemap_dynamic2.html

'use strict';

import THREE from 'three';

let scene, camera, renderer;

let onMouseDownMouseX = 0,
    onMouseDownMouseY = 0,
    lon = 0,
    lat = 0,
    onMouseDownLon = 0,
    onMouseDownLat = 0,
    phi = 0,
    theta = 0;

const structureSchematic = {"_id":"572012ffc476014968eb1ef0","creatorUUID":"5d30e92c-5ae2-4284-a3ee-74bc15077439","name":"Awesome Temple","width":5,"length":5,"height":7,"direction":"SOUTH","finalized":true,"images":[{"deletehash":"scDmXQ2KuwxCr6u","url":"http://i.imgur.com/fUbYcJt.png"}],"blocks":[{"BlockState":{"BlockState":"minecraft:gold_block","ContentVersion":2},"Position":{"X":-4,"Y":0,"Z":0},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:gold_block","ContentVersion":2},"Position":{"X":-4,"Y":0,"Z":1},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:gold_block","ContentVersion":2},"Position":{"X":-4,"Y":0,"Z":2},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:gold_block","ContentVersion":2},"Position":{"X":-4,"Y":0,"Z":3},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:gold_block","ContentVersion":2},"Position":{"X":-4,"Y":0,"Z":4},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:diamond_block","ContentVersion":2},"Position":{"X":-4,"Y":1,"Z":0},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:glass","ContentVersion":2},"Position":{"X":-4,"Y":1,"Z":1},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:glass","ContentVersion":2},"Position":{"X":-4,"Y":1,"Z":3},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:diamond_block","ContentVersion":2},"Position":{"X":-4,"Y":1,"Z":4},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:diamond_block","ContentVersion":2},"Position":{"X":-4,"Y":2,"Z":0},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:glass","ContentVersion":2},"Position":{"X":-4,"Y":2,"Z":1},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:glass","ContentVersion":2},"Position":{"X":-4,"Y":2,"Z":3},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:diamond_block","ContentVersion":2},"Position":{"X":-4,"Y":2,"Z":4},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:diamond_block","ContentVersion":2},"Position":{"X":-4,"Y":3,"Z":0},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:glass","ContentVersion":2},"Position":{"X":-4,"Y":3,"Z":1},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:glass","ContentVersion":2},"Position":{"X":-4,"Y":3,"Z":2},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:glass","ContentVersion":2},"Position":{"X":-4,"Y":3,"Z":3},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:diamond_block","ContentVersion":2},"Position":{"X":-4,"Y":3,"Z":4},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:diamond_block","ContentVersion":2},"Position":{"X":-4,"Y":4,"Z":0},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:diamond_block","ContentVersion":2},"Position":{"X":-4,"Y":4,"Z":1},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:diamond_block","ContentVersion":2},"Position":{"X":-4,"Y":4,"Z":2},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:diamond_block","ContentVersion":2},"Position":{"X":-4,"Y":4,"Z":3},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:diamond_block","ContentVersion":2},"Position":{"X":-4,"Y":4,"Z":4},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:gold_block","ContentVersion":2},"Position":{"X":-3,"Y":0,"Z":0},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:gold_block","ContentVersion":2},"Position":{"X":-3,"Y":0,"Z":1},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:gold_block","ContentVersion":2},"Position":{"X":-3,"Y":0,"Z":2},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:gold_block","ContentVersion":2},"Position":{"X":-3,"Y":0,"Z":3},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:gold_block","ContentVersion":2},"Position":{"X":-3,"Y":0,"Z":4},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:glass","ContentVersion":2},"Position":{"X":-3,"Y":1,"Z":0},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:glass","ContentVersion":2},"Position":{"X":-3,"Y":1,"Z":4},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:glass","ContentVersion":2},"Position":{"X":-3,"Y":2,"Z":0},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:glass","ContentVersion":2},"Position":{"X":-3,"Y":2,"Z":4},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:glass","ContentVersion":2},"Position":{"X":-3,"Y":3,"Z":0},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:glass","ContentVersion":2},"Position":{"X":-3,"Y":3,"Z":4},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:diamond_block","ContentVersion":2},"Position":{"X":-3,"Y":4,"Z":0},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:quartz_block[variant=default]","ContentVersion":2},"Position":{"X":-3,"Y":4,"Z":1},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:quartz_block[variant=default]","ContentVersion":2},"Position":{"X":-3,"Y":4,"Z":2},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:quartz_block[variant=default]","ContentVersion":2},"Position":{"X":-3,"Y":4,"Z":3},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:diamond_block","ContentVersion":2},"Position":{"X":-3,"Y":4,"Z":4},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:emerald_block","ContentVersion":2},"Position":{"X":-3,"Y":5,"Z":1},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:emerald_block","ContentVersion":2},"Position":{"X":-3,"Y":5,"Z":2},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:emerald_block","ContentVersion":2},"Position":{"X":-3,"Y":5,"Z":3},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:gold_block","ContentVersion":2},"Position":{"X":-2,"Y":0,"Z":0},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:gold_block","ContentVersion":2},"Position":{"X":-2,"Y":0,"Z":1},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:gold_block","ContentVersion":2},"Position":{"X":-2,"Y":0,"Z":2},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:gold_block","ContentVersion":2},"Position":{"X":-2,"Y":0,"Z":3},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:gold_block","ContentVersion":2},"Position":{"X":-2,"Y":0,"Z":4},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:glass","ContentVersion":2},"Position":{"X":-2,"Y":3,"Z":0},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:glass","ContentVersion":2},"Position":{"X":-2,"Y":3,"Z":4},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:diamond_block","ContentVersion":2},"Position":{"X":-2,"Y":4,"Z":0},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:quartz_block[variant=default]","ContentVersion":2},"Position":{"X":-2,"Y":4,"Z":1},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:lit_redstone_lamp","ContentVersion":2},"Position":{"X":-2,"Y":4,"Z":2},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:quartz_block[variant=default]","ContentVersion":2},"Position":{"X":-2,"Y":4,"Z":3},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:diamond_block","ContentVersion":2},"Position":{"X":-2,"Y":4,"Z":4},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:emerald_block","ContentVersion":2},"Position":{"X":-2,"Y":5,"Z":1},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:redstone_block","ContentVersion":2},"Position":{"X":-2,"Y":5,"Z":2},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:emerald_block","ContentVersion":2},"Position":{"X":-2,"Y":5,"Z":3},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:emerald_block","ContentVersion":2},"Position":{"X":-2,"Y":6,"Z":2},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:gold_block","ContentVersion":2},"Position":{"X":-1,"Y":0,"Z":0},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:gold_block","ContentVersion":2},"Position":{"X":-1,"Y":0,"Z":1},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:gold_block","ContentVersion":2},"Position":{"X":-1,"Y":0,"Z":2},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:gold_block","ContentVersion":2},"Position":{"X":-1,"Y":0,"Z":3},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:gold_block","ContentVersion":2},"Position":{"X":-1,"Y":0,"Z":4},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:glass","ContentVersion":2},"Position":{"X":-1,"Y":1,"Z":0},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:glass","ContentVersion":2},"Position":{"X":-1,"Y":1,"Z":4},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:glass","ContentVersion":2},"Position":{"X":-1,"Y":2,"Z":0},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:glass","ContentVersion":2},"Position":{"X":-1,"Y":2,"Z":4},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:glass","ContentVersion":2},"Position":{"X":-1,"Y":3,"Z":0},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:glass","ContentVersion":2},"Position":{"X":-1,"Y":3,"Z":4},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:diamond_block","ContentVersion":2},"Position":{"X":-1,"Y":4,"Z":0},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:quartz_block[variant=default]","ContentVersion":2},"Position":{"X":-1,"Y":4,"Z":1},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:quartz_block[variant=default]","ContentVersion":2},"Position":{"X":-1,"Y":4,"Z":2},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:quartz_block[variant=default]","ContentVersion":2},"Position":{"X":-1,"Y":4,"Z":3},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:diamond_block","ContentVersion":2},"Position":{"X":-1,"Y":4,"Z":4},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:emerald_block","ContentVersion":2},"Position":{"X":-1,"Y":5,"Z":1},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:emerald_block","ContentVersion":2},"Position":{"X":-1,"Y":5,"Z":2},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:emerald_block","ContentVersion":2},"Position":{"X":-1,"Y":5,"Z":3},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:gold_block","ContentVersion":2},"Position":{"X":0,"Y":0,"Z":0},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:gold_block","ContentVersion":2},"Position":{"X":0,"Y":0,"Z":1},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:gold_block","ContentVersion":2},"Position":{"X":0,"Y":0,"Z":2},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:gold_block","ContentVersion":2},"Position":{"X":0,"Y":0,"Z":3},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:gold_block","ContentVersion":2},"Position":{"X":0,"Y":0,"Z":4},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:diamond_block","ContentVersion":2},"Position":{"X":0,"Y":1,"Z":0},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:glass","ContentVersion":2},"Position":{"X":0,"Y":1,"Z":1},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:glass","ContentVersion":2},"Position":{"X":0,"Y":1,"Z":3},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:diamond_block","ContentVersion":2},"Position":{"X":0,"Y":1,"Z":4},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:diamond_block","ContentVersion":2},"Position":{"X":0,"Y":2,"Z":0},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:glass","ContentVersion":2},"Position":{"X":0,"Y":2,"Z":1},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:glass","ContentVersion":2},"Position":{"X":0,"Y":2,"Z":3},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:diamond_block","ContentVersion":2},"Position":{"X":0,"Y":2,"Z":4},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:diamond_block","ContentVersion":2},"Position":{"X":0,"Y":3,"Z":0},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:glass","ContentVersion":2},"Position":{"X":0,"Y":3,"Z":1},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:glass","ContentVersion":2},"Position":{"X":0,"Y":3,"Z":2},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:glass","ContentVersion":2},"Position":{"X":0,"Y":3,"Z":3},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:diamond_block","ContentVersion":2},"Position":{"X":0,"Y":3,"Z":4},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:diamond_block","ContentVersion":2},"Position":{"X":0,"Y":4,"Z":0},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:diamond_block","ContentVersion":2},"Position":{"X":0,"Y":4,"Z":1},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:diamond_block","ContentVersion":2},"Position":{"X":0,"Y":4,"Z":2},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:diamond_block","ContentVersion":2},"Position":{"X":0,"Y":4,"Z":3},"ContentVersion":1},{"BlockState":{"BlockState":"minecraft:diamond_block","ContentVersion":2},"Position":{"X":0,"Y":4,"Z":4},"ContentVersion":1}]};

init();
animate();

function init() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 15;

    let loader = new THREE.TextureLoader();
    let texture = loader.load('assets/gold_block.png');
    for (let block of structureSchematic.blocks) {
        let geometry = new THREE.BoxGeometry(1, 1, 1);
        geometry.translate(block.Position.X, block.Position.Y, block.Position.Z);

        let material = new THREE.MeshPhongMaterial( { map: texture } );
        let mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh)
    }
    
    scene.add(new THREE.AmbientLight(0xcccccc))

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xbfd1e5);
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);
    
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );

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

function animate() {
    requestAnimationFrame( animate );
    
    lon += .15;
	lat = Math.max( - 85, Math.min( 85, lat ) );
	phi = THREE.Math.degToRad( 90 - lat );
	theta = THREE.Math.degToRad( lon );
    
    camera.position.x = 100 * Math.sin( phi ) * Math.cos( theta );
	camera.position.y = 100 * Math.cos( phi );
	camera.position.z = 100 * Math.sin( phi ) * Math.sin( theta );
	camera.lookAt( scene.position );

    renderer.render( scene, camera );

}
