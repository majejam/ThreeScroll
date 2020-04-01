import Scroll from './AbstractScroll'
import Debounce from './Debounce.js';
import * as THREE from 'three'

export default class ThreeScroll {
    constructor(container, offsets) {
        this.scroll = null
        this.container = container
        this.offsets = offsets
        this.sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        }
        this.distance = this.getBoundingHeight()

        this.init()
        this.events()
    }

    init() {
        this.resizeSmoothDebounced = Debounce(this._resize, 500);
        this.setOffsets()

        this.scroll = new Scroll({
            x: 0,
            y: this.distance + this.offsets.y + this.offsets.top + this.offsets.bottom
        }, 1, window, this.scrollHandler.bind(this))
    }

    _resize() {
        this.setSizes()
        this.update()
    }

    setOffsets() {
        this.container.position.x = this.offsets.x
        this.offsets.height = this.container.children[0].geometry.parameters.height ? this.container.children[0].geometry.parameters.height / 2 : 0
    }

    setSizes() {
        this.sizes.width = window.innerWidth
        this.sizes.height = window.innerHeight
    }

    scrollHandler(x, y) {
        this.container.position.y = y + this.sizes.height / 2 - this.offsets.y - this.offsets.height - this.offsets.top
    }

    getBoundingHeight() {
        let box = new THREE.Box3().setFromObject(this.container);
        return box.getSize(new THREE.Vector3()).y - this.sizes.height
    }

    updateOffset(params) {
        this.offsets = params
        this.update()
    }

    update() {
        this.distance = this.getBoundingHeight()
        this.setOffsets()
        this.scroll.resize({
            x: 0,
            y: this.distance + this.offsets.y + this.offsets.top + this.offsets.bottom
        })
        this.scroll.reset()
    }

    events() {
        window.addEventListener('resize', () => {
            this.resizeSmoothDebounced();
        });
    }
}