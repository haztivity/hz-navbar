System.register(["davinchi_finsi"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            function __() {
                this.constructor = d;
            }

            d.prototype = b === null
                ? Object.create(b)
                : (__.prototype = b.prototype, new __());
        };
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
            var c = arguments.length, r = c < 3
                ? target
                : desc === null
                                              ? desc = Object.getOwnPropertyDescriptor(target, key)
                                              : desc, d;
            if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
            else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3
                    ? d(r)
                    : c > 3
                                                                                                  ? d(target, key, r)
                                                                                                  : d(target, key)) || r;
            return c > 3 && r && Object.defineProperty(target, key, r), r;
        };
    var davinchi_finsi_1;
    var HzButton;
    return {
        setters: [
            function (davinchi_finsi_1_1) {
                davinchi_finsi_1 = davinchi_finsi_1_1;
            }],
        execute: function () {
            HzButton = (function (_super) {
                __extends(HzButton, _super);
                function HzButton() {
                    _super.apply(this, arguments);
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
                HzButton = __decorate([
                    davinchi_finsi_1.Resource({
                        name: "hzButton",
                        dependencies: [
                            davinchi_finsi_1.$,
                            davinchi_finsi_1.EventEmitterFactory
                        ]
                    })
                ], HzButton);
                return HzButton;
            }(davinchi_finsi_1.ResourceController));
            exports_1("HzButton", HzButton);
        }
    }
});
//# sourceMappingURL=hzButton.js.map