import './css/style.styl'

import './css/reset.styl'

import * as THREE from 'three'

import ThreeScroll from './utils/ThreeScroll'

var camera, scene, renderer, container;

let scroll = null

init();

function init() {
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -100, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    container = new THREE.Group

    for (let index = 0; index < 10; index++) {
        var geometryMarker = new THREE.PlaneGeometry(300, 200, 1);
        var materialMarker = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            side: THREE.DoubleSide
        });
        var marker = new THREE.Mesh(geometryMarker, materialMarker);
        marker.position.y = (-index) * 400
        container.add(marker);
    }

    scene.add(container);

    scroll = new ThreeScroll(container, {
        x: 100,
        y: 0,
        top: 100,
        bottom: 100
    })

    setTimeout(() => {
        scroll.updateOffset({
            x: -200,
            y: 500,
            top: 0,
            bottom: 0
        })
    }, 1000);
}



/**
 * Loop
 */
const loop = () => {
    window.requestAnimationFrame(loop)
    // Renderer
    renderer.render(scene, camera);
}
loop()

window.addEventListener('resize', () => {

    camera.left = window.innerWidth / -2;
    camera.right = window.innerWidth / 2;
    camera.top = window.innerHeight / 2;
    camera.bottom = window.innerHeight / -2;

    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})