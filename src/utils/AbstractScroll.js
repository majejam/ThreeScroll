import NormalizeWheel from './normalizeWheel.js';
import {
    PointerdownSupport,
    PointermoveSupport
} from './support.js';

export default class abstractCustomScroll {
    constructor(distance, multiplyWheel = 1, $el = window, cb = {}) {
        this.distance = distance
        this.cb = cb;

        this.multiplyWheel = multiplyWheel
        this.$el = $el

        this.isTouch = ('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0);

        this.isEnable = true;

        this.isAtEnd = false;

        this.scrollX = 0;
        this.scrollY = 0;

        this.x = 0;
        this.y = 0;
        this.lastX = null;
        this.lastY = null;

        this.isScroll = false;
        this.isScrollEnd = false;
        this.hasScroll = false;

        this.update = this.update.bind(this);
        this.onWheel = this.onWheel.bind(this);
        this.enable = this.enable.bind(this);
        this.disable = this.disable.bind(this);


        this.raf = null;

        console.log(this.isTouch);



        this.raf = window.requestAnimationFrame(this.update);

        if (this.isTouch) {
            window.addEventListener(PointerdownSupport(), this.onTouchStart.bind(this), false);
            window.addEventListener(PointermoveSupport(), this.onTouchMove.bind(this), false);
        } else {
            window.addEventListener('wheel', this.onWheel)
        }

    }

    resize(distance) {
        this.distance = distance
    }

    reset() {
        this.scrollX = 0;
        this.scrollY = 0;

        this.x = 0;
        this.y = 0;
        this.lastX = null;
        this.lastY = null;
    }

    enable() {
        this.isEnable = true;
    }

    disable() {
        this.isEnable = false;
    }

    onWheel(event) {

        if (!this.isEnable) return;

        this.wheelVal = NormalizeWheel(event, this.pixelStep, this.lineHeight, this.pageHeight);
        //this.wheelVal = event

        // Scroll X
        // -----
        this.scrollX += this.wheelVal.pixelX * this.multiplyWheel;



        if (this.scrollX > this.distance.x) {
            this.scrollX = this.distance.x;
        }
        if (this.scrollX < 0) {
            this.scrollX = 0;
        }

        // Scroll Y
        // -----
        this.scrollY += this.wheelVal.pixelY * this.multiplyWheel;

        if (this.scrollY > this.distance.y) {
            this.scrollY = this.distance.y;
        }
        if (this.scrollY < 0) {
            this.scrollY = 0;
        }

    }

    onTouchStart(event) {
        this.pointerEvent = event.touches[0];
        this.oldDeltaY = this.scrollY;
        this.startDeltaY = this.pointerEvent.pageY;

        this.oldDeltaX = this.scrollX;
        this.startDeltaX = this.pointerEvent.pageX;

    }

    onTouchMove(event) {

        this.pointerEvent = event.touches[0];

        // Scroll Y
        // -----
        this.scrollY = this.oldDeltaY - (this.pointerEvent.pageY - this.startDeltaY) * 2;


        if (this.scrollY > this.distance.y) {
            this.scrollY = this.distance.y;
        }
        if (this.scrollY < 0) {
            this.scrollY = 0;
        }

        // Scroll X
        // -----
        this.scrollX = this.oldDeltaX - (this.pointerEvent.pageX - this.startDeltaX) * 2;

        if (this.scrollX > this.distance.x) {
            this.scrollX = this.distance.x;
        }
        if (this.scrollX < 0) {
            this.scrollX = 0;
        }
    }


    goToScroll(x, y) {
        this.scrollX = x;
        this.scrollY = y;

        // Scroll X
        // -----
        if (this.scrollX > this.distance.x) {
            this.scrollX = this.distance.x;
        }
        if (this.scrollX < 0) {
            this.scrollX = 0;
        }

        // Scroll Y
        // -----
        if (this.scrollY > this.distance.y) {
            this.scrollY = this.distance.y;
        }
        if (this.scrollY < 0) {
            this.scrollY = 0;
        }
    }


    update() {
        if (this.isEnable) {
            if (Math.abs(this.scrollX - this.x) > 0.1) {
                this.x += (this.scrollX - this.x) * 0.1;
            }
            if (Math.abs(this.scrollY - this.y) > 0.1) {
                this.y += (this.scrollY - this.y) * 0.1;
            }

            if ((this.distance.y) - this.y < 2) {
                if (!this.isAtEnd) this.isAtEnd = true;
            } else {
                if (this.isAtEnd) this.isAtEnd = false;
            }
            if (this.lastX !== this.x || this.lastY !== this.y) {
                this.cb(this.x, this.y);

                this.lastX = this.x;
                this.lastY = this.y;
            }
        }

        this.raf = window.requestAnimationFrame(this.update);
    }


    destroy() {
        if (!!this.raf) cancelAnimationFrame(this.raf);

        this.$el.removeEventListener(PointerdownSupport(), this.onTouchStart, false);
        this.$el.removeEventListener(PointermoveSupport(), this.onTouchMove, false);
    }
}