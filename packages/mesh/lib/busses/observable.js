"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ObservableBus = (function () {
    function ObservableBus() {
        this._messageBus = this.createMessageBus(this._observers = []);
    }
    ObservableBus.prototype.createMessageBus = function (observers) {
        return {
            dispatch: function (message) {
                for (var i = observers.length; i--;) {
                    observers[i].dispatch(message);
                }
            }
        };
    };
    ObservableBus.prototype.observe = function (listener) {
        this._observers.push(listener);
    };
    ObservableBus.prototype.unobserve = function (listener) {
        var index = this._observers.indexOf(listener);
        if (index !== -1)
            this._observers.splice(index, 1);
    };
    ObservableBus.prototype.dispatch = function (message) {
        return this._messageBus.dispatch(message);
    };
    return ObservableBus;
}());
exports.ObservableBus = ObservableBus;
//# sourceMappingURL=observable.js.map