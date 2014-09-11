;(function (global, factory) {
    "use strict";

    var moduleName = "FastClick";

    if (typeof define === "function" && define.amd) {
        define(function () {
            return (global[moduleName] = factory(global));
        });
    } else if (typeof module === "object" && module.exports) {
        module.exports = (global[moduleName] = factory(global));
    } else {
        global[moduleName] = factory(global);
    }

}(this, function (global) {
    "use strict";

    var doc = global.document;

    var FastClick = {
        x: 0,
        y: 0,
        init: function () {
            global.addEventListener("click", this, true);
            global.addEventListener("touchstart", this, true);
        },
        pause: function () {
            this.isPause = true;
        },
        stop: function () {
            global.removeEventListener("touchstart", this, true);
        },
        handleEvent: function (evt) {
            if (this.isPause) return;
            switch (evt.type) {
                case "click":
                    if (evt.isTrusted || !("isTrusted" in evt)) {
                        evt.stopPropagation();
                        evt.stopImmediatePropagation && evt.stopImmediatePropagation();
                        evt.preventDefault();
                    }
                    break;
                case "touchstart":
                    if (evt.targetTouches.length > 1) {
                        return;
                    }
                    var touch = evt.targetTouches[0];
                    this.x = touch.clientX,
                    this.y = touch.clientY;
                    global.addEventListener("touchend", this, false);
                    global.addEventListener("touchcancel", this, false);
                    break;
                case "touchend":
                    global.removeEventListener("touchend", this, false);
                    global.removeEventListener("touchcancel", this, false);
                    var touch = evt.changedTouches[0];
                    if (Math.abs(this.x - touch.clientX) > 10 ||
                        Math.abs(this.y - touch.clientY) > 10) {
                        return;
                    }
                    this.x = 0;
                    this.y = 0;
                    this.click(evt);
                    break;
                case "touchcancel":
                    global.removeEventListener("touchend", this, false);
                    global.removeEventListener("touchcancel", this, false);
                    break;
            }
        },
        click: function (evt) {
            var touch = evt.changedTouches[0];
            var event = doc.createEvent("MouseEvent");
            event.initMouseEvent("click", true, true, doc.defaultView, evt.detail,
                touch.screenX, touch.screenY, touch.clientX, touch.clientY,
                evt.ctrlKey, evt.altKey, evt.shiftKey, evt.metaKey,
                0, null
            );
            if (!("isTrusted" in event)) {
                event.isTrusted = false;
            }
            setTimeout(function () {
                touch.target.dispatchEvent(event);
            }, 400);
        }
    };

    return FastClick;
}));
