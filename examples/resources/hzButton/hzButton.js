"use strict";
var __extends = (this && this.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({__proto__: []} instanceof Array && function (d, b) {
                d.__proto__ = b;
            }) ||
            function (d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    })();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
Object.defineProperty(exports, "__esModule", {value: true});
/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
var core_1 = require("@haztivity/core");
var HzButton = (function (_super) {
    __extends(HzButton, _super);
    function HzButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }

    HzButton.prototype.init = function (options, config) {
        this._options = options;
        this._$element.text(this._options.content);
        this._$element.one("click", {instance: this}, this._onClick);
    };
    HzButton.prototype._onClick = function (e) {
        var instance = e.data.instance;
        instance.disable();
        instance._markAsCompleted();
    };
    HzButton.prototype.disable = function () {
        this._$element.attr("disabled", "disabled");
    };
    HzButton.prototype.getInstance = function () {
        return this;
    };
    return HzButton;
}(core_1.ResourceController));
HzButton = __decorate([
    core_1.Resource({
        name: "hzButton",
        dependencies: [
            core_1.$,
            core_1.EventEmitterFactory
        ]
    })
], HzButton);
exports.HzButton = HzButton;
//# sourceMappingURL=hzButton.js.map