"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observable = (function () {
    function Observable() {
        this._messageBus = this.createMessageBus(this._observers = []);
    }
    Observable.prototype.createMessageBus = function (observers) {
        return {
            dispatch: function (message) {
                for (var i = observers.length; i--;) {
                    observers[i].dispatch(message);
                }
            }
        };
    };
    Observable.prototype.observe = function (dispatcher) {
        this._observers.push(dispatcher);
    };
    Observable.prototype.unobserve = function (dispatcher) {
        var index = this._observers.indexOf(dispatcher);
        if (index !== -1)
            this._observers.splice(index, 1);
    };
    Observable.prototype.dispatch = function (message) {
        return this._messageBus.dispatch(message);
    };
    return Observable;
}());
exports.Observable = Observable;
//# sourceMappingURL=observable.js.map