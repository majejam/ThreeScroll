export function TouchSupport() {
    return ('ontouchstart' in window) /*|| (navigator.maxTouchPoints > 0)*/ || (navigator.msMaxTouchPoints > 0);
};
//IE11 Pointers
export function PointerSupport() {
    return !!window.navigator.pointerEnabled;
};
//IE10 Pointers
export function MsPointerSupport() {
    return !!window.navigator.msPointerEnabled;
};
export function PointerdownSupport() {
    return TouchSupport() ? 'touchstart' : (PointerSupport() ? 'pointerdown' : (MsPointerSupport() ? 'MSPointerDown' : 'mousedown'));
};
export function PointerupSupport() {
    return TouchSupport() ? 'touchend' : (PointerSupport() ? 'pointerup' : (MsPointerSupport() ? 'MSPointerUp' : 'mouseup'));
};
export function PointerleaveSupport() {
    return TouchSupport() ? 'touchend' : (PointerSupport() ? 'pointerleave' : (MsPointerSupport() ? 'MSPointerLeave' : 'mouseleave'));
};
export function PointermoveSupport() {
    return TouchSupport() ? 'touchmove' : (PointerSupport() ? 'pointermove' : (MsPointerSupport() ? 'MSPointerMove' : 'mousemove'));
}