var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@haztivity/core"], factory);
    }
})(function (require, exports) {
    "use strict";
    /**
     * @license
     * Copyright Davinchi. All Rights Reserved.
     */
    var core_1 = require("@haztivity/core");
    var HzNavbarComponent = HzNavbarComponent_1 = (function (_super) {
        __extends(HzNavbarComponent, _super);
        function HzNavbarComponent(_$, _EventEmitterFactory, _Navigator, _PageManager) {
            var _this = _super.call(this, _$, _EventEmitterFactory) || this;
            _this._Navigator = _Navigator;
            _this._PageManager = _PageManager;
            _this._currentPageIndex = 0;
            _this._numPages = 0;
            return _this;
        }
        HzNavbarComponent.prototype.init = function (options, config) {
            this._options = core_1.$.extend(true, {}, HzNavbarComponent_1._DEFAULTS, options);
            this._getElements();
            this.updateLocale();
            this.progress(0);
            this._assignEvents();
            this.updatePaginator();
        };
        HzNavbarComponent.prototype.updatePaginator = function () {
            var numPages = this._PageManager.count();
            this._setNumPages(numPages);
            var currentPage = this._Navigator.getCurrentPageIndex() || 0;
            this._setCurrentPage(currentPage);
        };
        /**
         * Si se indica parámetro se establece el porcentaje. El número es redondeado a 2 decimales
         * Si no se indica parámetro, devuelve el porcentaje actual
         * @param {Number}      [value]         Valor a establecer
         * @returns {number}
         */
        HzNavbarComponent.prototype.progress = function (value) {
            if (value) {
                value = parseFloat(value.toFixed(2));
                if (!isNaN(value)) {
                    if (value >= 0 && value <= 100) {
                        this._progress = value;
                        this._updateProgressValue(value);
                    }
                }
            }
            else {
                return this._progress;
            }
        };
        /**
         * Establece un idioma
         * @param {string}  lang        Idioma. Si no tiene traducciones en options.locale se utiliza el idioma por defecto
         */
        HzNavbarComponent.prototype.setLang = function (lang) {
            this._options.lang = lang;
            this.updateLocale();
        };
        /**
         * Actualiza las traducciones
         */
        HzNavbarComponent.prototype.updateLocale = function () {
            var lang = this._options.lang, locale = this._options.locale[lang] || this._options.locale[this._options.defaultLang];
            if (locale) {
                for (var key in locale) {
                    this._updateText(key, locale[key]);
                }
            }
        };
        /**
         * Establece un texto en uno o varios elementos
         * @param {string}      to      Se buscan los elementos que correspondan con el selector [data-hz-navbar-content=valor]
         * @param {string}      text    Texto a establecer
         * @private
         */
        HzNavbarComponent.prototype._updateText = function (to, text) {
            if (to) {
                var $element = this._$element.find("[data-hz-navbar-content=" + to + "]");
                if ($element.length > 0) {
                    for (var elementIndex = 0, $elementLength = $element.length; elementIndex < $elementLength; elementIndex++) {
                        var $currentElement = core_1.$($element[elementIndex]);
                        var attr = $currentElement.data("hzNavbarContentTo") || "text";
                        if (attr === "text") {
                            $currentElement.text(text);
                        }
                        else {
                            $currentElement.attr(attr, text);
                        }
                    }
                }
            }
        };
        /**
         * Obtiene los elementos del DOM a utilizar
         * @protected
         */
        HzNavbarComponent.prototype._getElements = function () {
            this._$nextBtn = this._$element.find("[data-" + HzNavbarComponent_1.PREFIX + "-next]");
            this._$prevBtn = this._$element.find("[data-" + HzNavbarComponent_1.PREFIX + "-prev]");
            this._$bar = this._$element.find("[data-" + HzNavbarComponent_1.PREFIX + "-bar]");
            this._$progress = this._$element.find("[data-" + HzNavbarComponent_1.PREFIX + "-progress]");
            this._$homeBtn = this._$element.find("[data-" + HzNavbarComponent_1.PREFIX + "-home]");
            this._$indexBtn = this._$element.find("[data-" + HzNavbarComponent_1.PREFIX + "-index]");
            this._$currentPageIndex = this._$element.find("[data-" + HzNavbarComponent_1.PREFIX + "-current]");
            this._$numPages = this._$element.find("[data-" + HzNavbarComponent_1.PREFIX + "-total]");
        };
        /**
         * Asigna los handlers a eventos
         * @protected
         */
        HzNavbarComponent.prototype._assignEvents = function () {
            this._$nextBtn.on("click." + HzNavbarComponent_1.NAMESPACE, { instance: this }, this._onNextClick);
            this._$prevBtn.on("click." + HzNavbarComponent_1.NAMESPACE, { instance: this }, this._onPrevClick);
            this._$homeBtn.on("click." + HzNavbarComponent_1.NAMESPACE, { instance: this }, this._onHomeClick);
            this._$indexBtn.on("click." + HzNavbarComponent_1.NAMESPACE, { instance: this }, this._onIndexClick);
            this._Navigator.on(core_1.Navigator.ON_DISABLE, { instance: this }, this._onDisabled);
            this._Navigator.on(core_1.Navigator.ON_ENABLE, { instance: this }, this._onEnabled);
            this._Navigator.on(core_1.Navigator.ON_CHANGE_PAGE_START, { instance: this }, this._onPageChangeStart);
            this._Navigator.on(core_1.Navigator.ON_CHANGE_PAGE_END, { instance: this }, this._onPageChangeEnd);
        };
        /**
         * Invocado al hacerse click en el botón siguiente. Invoca a _Navigator#next
         * @param e
         * @private
         */
        HzNavbarComponent.prototype._onNextClick = function (e) {
            var instance = e.data.instance;
            instance._Navigator.next();
        };
        /**
         * Invocado al hacerse click en el botón anterior. Invoca a _Navigator#prev
         * @param e
         * @private
         */
        HzNavbarComponent.prototype._onPrevClick = function (e) {
            var instance = e.data.instance;
            instance._Navigator.prev();
        };
        HzNavbarComponent.prototype._onHomeClick = function (e) {
            var instance = e.data.instance;
        };
        HzNavbarComponent.prototype._onIndexClick = function (e) {
            var instance = e.data.instance;
        };
        /**
         * Aplica el cambio de estilos a la barra de progreso y actualiza el texto de progreso
         * @param {Number}      value       Valora establecer
         * @protected
         */
        HzNavbarComponent.prototype._updateProgressValue = function (value) {
            this._$progress.text(value + "%");
            this._$bar.css("transform", "scaleX(" + value / 100 + ")");
        };
        /**
         * Invocado al comenzar el cambio de página. Deshabilita la navegación durante el proceso
         * @param e
         * @param newPage
         * @param oldPage
         * @private
         */
        HzNavbarComponent.prototype._onPageChangeStart = function (e, newPage, oldPage) {
            if (!e.isDefaultPrevented()) {
                var instance = e.data.instance;
                if (oldPage) {
                    var pageImplementation = instance._PageManager.getPage(oldPage.index), page = pageImplementation.getPage();
                    page.off("." + HzNavbarComponent_1.NAMESPACE);
                }
                instance._setCurrentPage(newPage.index);
                instance._$prevBtn.attr("disabled", "disabled");
                instance._$nextBtn.attr("disabled", "disabled");
            }
        };
        /**
         * Establece los estados de los botones de navegación en base a los datos de Navigator
         * @private
         */
        HzNavbarComponent.prototype._updatePagerButtonState = function () {
            if (!this._Navigator.isDisabled()) {
                if (this._currentPageIndex === 0) {
                    this._$prevBtn.attr("disabled", "disabled");
                    this._$nextBtn.removeAttr("disabled");
                }
                else if (this._currentPageIndex === this._numPages - 1) {
                    this._$nextBtn.attr("disabled", "disabled");
                    this._$prevBtn.removeAttr("disabled");
                }
                else {
                    this._$nextBtn.removeAttr("disabled");
                    this._$prevBtn.removeAttr("disabled");
                }
                if (!this._$nextBtn.prop("disabled")) {
                    if (this._Navigator.getCurrentPage().getController().isCompleted()) {
                        this._$nextBtn.removeAttr("disabled");
                    }
                    else {
                        this._$nextBtn.attr("disabled", "disabled");
                    }
                }
            }
            else {
                this._$prevBtn.attr("disabled", "disabled");
                this._$nextBtn.attr("disabled", "disabled");
            }
        };
        /**
         * Invocado al finalizarse el cambio de página. Actualiza el paginador y el estado de los botones de navegación
         * @param e
         * @param newPage
         * @param oldPage
         * @private
         */
        HzNavbarComponent.prototype._onPageChangeEnd = function (e, newPage, oldPage) {
            var instance = e.data.instance;
            instance._updatePagerButtonState();
            instance.progress((instance._Navigator.getVisitedPages().length * 100) / instance._numPages);
            var pageImplementation = instance._Navigator.getCurrentPage(), page = pageImplementation.getPage();
            page.off("." + HzNavbarComponent_1.NAMESPACE).on(core_1.PageController.ON_COMPLETE_CHANGE + "." + HzNavbarComponent_1.NAMESPACE, { instance: instance }, instance._onPageCompleteChange);
        };
        /**
         * Invocado al completarse la página. Actualiza el estado del botón siguiente
         * @param e
         * @param completed
         * @private
         */
        HzNavbarComponent.prototype._onPageCompleteChange = function (e, completed) {
            if (completed) {
                var instance = e.data.instance;
                var pageImplementation = instance._Navigator.getCurrentPage(), page = pageImplementation.getPage();
                if (instance._PageManager.getPageIndex(page.getName()) !== instance._PageManager.count() - 1) {
                    if (pageImplementation.getController().isCompleted()) {
                        instance._$nextBtn.removeAttr("disabled");
                    }
                    else {
                        instance._$nextBtn.attr("disabled", "disabled");
                    }
                }
            }
        };
        /**
         * Establece el valor a la cantidad de páginas y actualiza el texto del elemento
         * @param {Number}  value       Cantidad de páginas
         * @private
         */
        HzNavbarComponent.prototype._setNumPages = function (value) {
            this._numPages = value;
            this._$numPages.text(value);
        };
        /**
         * Establece el valor de la página actual y actualiza el texto del elemento. Se espera recibir el índice de la página comenzando por 0
         * @param {Number}  value       Índice de la página actual
         * @private
         */
        HzNavbarComponent.prototype._setCurrentPage = function (value) {
            this._currentPageIndex = value;
            this._$currentPageIndex.text(value + 1);
        };
        HzNavbarComponent.prototype._onDisabled = function (e) {
            var instance = e.data.instance;
            instance._updatePagerButtonState();
        };
        HzNavbarComponent.prototype._onEnabled = function (e) {
            var instance = e.data.instance;
            instance._updatePagerButtonState();
        };
        return HzNavbarComponent;
    }(core_1.ComponentController));
    HzNavbarComponent.NAMESPACE = "hzNavbar";
    HzNavbarComponent.PREFIX = "hz-navbar";
    HzNavbarComponent._DEFAULTS = {
        locale: {
            "es": {
                next: "Siguiente",
                prev: "Anterior",
                currentPage: "Página actual",
                totalPages: "Páginas totales",
                home: "Ir al inicio",
                index: "Mostrar índice"
            }
        },
        defaultLang: "es"
    };
    HzNavbarComponent = HzNavbarComponent_1 = __decorate([
        core_1.Component({
            name: "HzNavbar",
            dependencies: [
                core_1.$,
                core_1.EventEmitterFactory,
                core_1.Navigator,
                core_1.PageManager
            ]
        })
    ], HzNavbarComponent);
    exports.HzNavbarComponent = HzNavbarComponent;
    var HzNavbarComponent_1;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJIek5hdmJhci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xufTtcbnZhciBfX2RlY29yYXRlID0gKHRoaXMgJiYgdGhpcy5fX2RlY29yYXRlKSB8fCBmdW5jdGlvbiAoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xufTtcbihmdW5jdGlvbiAoZmFjdG9yeSkge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICB2YXIgdiA9IGZhY3RvcnkocmVxdWlyZSwgZXhwb3J0cyk7XG4gICAgICAgIGlmICh2ICE9PSB1bmRlZmluZWQpIG1vZHVsZS5leHBvcnRzID0gdjtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKFtcInJlcXVpcmVcIiwgXCJleHBvcnRzXCIsIFwiQGhhenRpdml0eS9jb3JlXCJdLCBmYWN0b3J5KTtcbiAgICB9XG59KShmdW5jdGlvbiAocmVxdWlyZSwgZXhwb3J0cykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIC8qKlxuICAgICAqIEBsaWNlbnNlXG4gICAgICogQ29weXJpZ2h0IERhdmluY2hpLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICAgICAqL1xuICAgIHZhciBjb3JlXzEgPSByZXF1aXJlKFwiQGhhenRpdml0eS9jb3JlXCIpO1xuICAgIHZhciBIek5hdmJhckNvbXBvbmVudCA9IEh6TmF2YmFyQ29tcG9uZW50XzEgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgICAgICBfX2V4dGVuZHMoSHpOYXZiYXJDb21wb25lbnQsIF9zdXBlcik7XG4gICAgICAgIGZ1bmN0aW9uIEh6TmF2YmFyQ29tcG9uZW50KF8kLCBfRXZlbnRFbWl0dGVyRmFjdG9yeSwgX05hdmlnYXRvciwgX1BhZ2VNYW5hZ2VyKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBfJCwgX0V2ZW50RW1pdHRlckZhY3RvcnkpIHx8IHRoaXM7XG4gICAgICAgICAgICBfdGhpcy5fTmF2aWdhdG9yID0gX05hdmlnYXRvcjtcbiAgICAgICAgICAgIF90aGlzLl9QYWdlTWFuYWdlciA9IF9QYWdlTWFuYWdlcjtcbiAgICAgICAgICAgIF90aGlzLl9jdXJyZW50UGFnZUluZGV4ID0gMDtcbiAgICAgICAgICAgIF90aGlzLl9udW1QYWdlcyA9IDA7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgICAgIH1cbiAgICAgICAgSHpOYXZiYXJDb21wb25lbnQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAob3B0aW9ucywgY29uZmlnKSB7XG4gICAgICAgICAgICB0aGlzLl9vcHRpb25zID0gY29yZV8xLiQuZXh0ZW5kKHRydWUsIHt9LCBIek5hdmJhckNvbXBvbmVudF8xLl9ERUZBVUxUUywgb3B0aW9ucyk7XG4gICAgICAgICAgICB0aGlzLl9nZXRFbGVtZW50cygpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVMb2NhbGUoKTtcbiAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3MoMCk7XG4gICAgICAgICAgICB0aGlzLl9hc3NpZ25FdmVudHMoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUGFnaW5hdG9yKCk7XG4gICAgICAgIH07XG4gICAgICAgIEh6TmF2YmFyQ29tcG9uZW50LnByb3RvdHlwZS51cGRhdGVQYWdpbmF0b3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbnVtUGFnZXMgPSB0aGlzLl9QYWdlTWFuYWdlci5jb3VudCgpO1xuICAgICAgICAgICAgdGhpcy5fc2V0TnVtUGFnZXMobnVtUGFnZXMpO1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRQYWdlID0gdGhpcy5fTmF2aWdhdG9yLmdldEN1cnJlbnRQYWdlSW5kZXgoKSB8fCAwO1xuICAgICAgICAgICAgdGhpcy5fc2V0Q3VycmVudFBhZ2UoY3VycmVudFBhZ2UpO1xuICAgICAgICB9O1xuICAgICAgICAvKipcbiAgICAgICAgICogU2kgc2UgaW5kaWNhIHBhcsOhbWV0cm8gc2UgZXN0YWJsZWNlIGVsIHBvcmNlbnRhamUuIEVsIG7Dum1lcm8gZXMgcmVkb25kZWFkbyBhIDIgZGVjaW1hbGVzXG4gICAgICAgICAqIFNpIG5vIHNlIGluZGljYSBwYXLDoW1ldHJvLCBkZXZ1ZWx2ZSBlbCBwb3JjZW50YWplIGFjdHVhbFxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gICAgICBbdmFsdWVdICAgICAgICAgVmFsb3IgYSBlc3RhYmxlY2VyXG4gICAgICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICBIek5hdmJhckNvbXBvbmVudC5wcm90b3R5cGUucHJvZ3Jlc3MgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gcGFyc2VGbG9hdCh2YWx1ZS50b0ZpeGVkKDIpKTtcbiAgICAgICAgICAgICAgICBpZiAoIWlzTmFOKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUgPj0gMCAmJiB2YWx1ZSA8PSAxMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3Byb2dyZXNzID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVQcm9ncmVzc1ZhbHVlKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9wcm9ncmVzcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEVzdGFibGVjZSB1biBpZGlvbWFcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9ICBsYW5nICAgICAgICBJZGlvbWEuIFNpIG5vIHRpZW5lIHRyYWR1Y2Npb25lcyBlbiBvcHRpb25zLmxvY2FsZSBzZSB1dGlsaXphIGVsIGlkaW9tYSBwb3IgZGVmZWN0b1xuICAgICAgICAgKi9cbiAgICAgICAgSHpOYXZiYXJDb21wb25lbnQucHJvdG90eXBlLnNldExhbmcgPSBmdW5jdGlvbiAobGFuZykge1xuICAgICAgICAgICAgdGhpcy5fb3B0aW9ucy5sYW5nID0gbGFuZztcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTG9jYWxlKCk7XG4gICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBY3R1YWxpemEgbGFzIHRyYWR1Y2Npb25lc1xuICAgICAgICAgKi9cbiAgICAgICAgSHpOYXZiYXJDb21wb25lbnQucHJvdG90eXBlLnVwZGF0ZUxvY2FsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBsYW5nID0gdGhpcy5fb3B0aW9ucy5sYW5nLCBsb2NhbGUgPSB0aGlzLl9vcHRpb25zLmxvY2FsZVtsYW5nXSB8fCB0aGlzLl9vcHRpb25zLmxvY2FsZVt0aGlzLl9vcHRpb25zLmRlZmF1bHRMYW5nXTtcbiAgICAgICAgICAgIGlmIChsb2NhbGUpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gbG9jYWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVRleHQoa2V5LCBsb2NhbGVba2V5XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICAvKipcbiAgICAgICAgICogRXN0YWJsZWNlIHVuIHRleHRvIGVuIHVubyBvIHZhcmlvcyBlbGVtZW50b3NcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9ICAgICAgdG8gICAgICBTZSBidXNjYW4gbG9zIGVsZW1lbnRvcyBxdWUgY29ycmVzcG9uZGFuIGNvbiBlbCBzZWxlY3RvciBbZGF0YS1oei1uYXZiYXItY29udGVudD12YWxvcl1cbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9ICAgICAgdGV4dCAgICBUZXh0byBhIGVzdGFibGVjZXJcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIEh6TmF2YmFyQ29tcG9uZW50LnByb3RvdHlwZS5fdXBkYXRlVGV4dCA9IGZ1bmN0aW9uICh0bywgdGV4dCkge1xuICAgICAgICAgICAgaWYgKHRvKSB7XG4gICAgICAgICAgICAgICAgdmFyICRlbGVtZW50ID0gdGhpcy5fJGVsZW1lbnQuZmluZChcIltkYXRhLWh6LW5hdmJhci1jb250ZW50PVwiICsgdG8gKyBcIl1cIik7XG4gICAgICAgICAgICAgICAgaWYgKCRlbGVtZW50Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgZWxlbWVudEluZGV4ID0gMCwgJGVsZW1lbnRMZW5ndGggPSAkZWxlbWVudC5sZW5ndGg7IGVsZW1lbnRJbmRleCA8ICRlbGVtZW50TGVuZ3RoOyBlbGVtZW50SW5kZXgrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyICRjdXJyZW50RWxlbWVudCA9IGNvcmVfMS4kKCRlbGVtZW50W2VsZW1lbnRJbmRleF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAkY3VycmVudEVsZW1lbnQuZGF0YShcImh6TmF2YmFyQ29udGVudFRvXCIpIHx8IFwidGV4dFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGF0dHIgPT09IFwidGV4dFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGN1cnJlbnRFbGVtZW50LnRleHQodGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkY3VycmVudEVsZW1lbnQuYXR0cihhdHRyLCB0ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIE9idGllbmUgbG9zIGVsZW1lbnRvcyBkZWwgRE9NIGEgdXRpbGl6YXJcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKi9cbiAgICAgICAgSHpOYXZiYXJDb21wb25lbnQucHJvdG90eXBlLl9nZXRFbGVtZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuXyRuZXh0QnRuID0gdGhpcy5fJGVsZW1lbnQuZmluZChcIltkYXRhLVwiICsgSHpOYXZiYXJDb21wb25lbnRfMS5QUkVGSVggKyBcIi1uZXh0XVwiKTtcbiAgICAgICAgICAgIHRoaXMuXyRwcmV2QnRuID0gdGhpcy5fJGVsZW1lbnQuZmluZChcIltkYXRhLVwiICsgSHpOYXZiYXJDb21wb25lbnRfMS5QUkVGSVggKyBcIi1wcmV2XVwiKTtcbiAgICAgICAgICAgIHRoaXMuXyRiYXIgPSB0aGlzLl8kZWxlbWVudC5maW5kKFwiW2RhdGEtXCIgKyBIek5hdmJhckNvbXBvbmVudF8xLlBSRUZJWCArIFwiLWJhcl1cIik7XG4gICAgICAgICAgICB0aGlzLl8kcHJvZ3Jlc3MgPSB0aGlzLl8kZWxlbWVudC5maW5kKFwiW2RhdGEtXCIgKyBIek5hdmJhckNvbXBvbmVudF8xLlBSRUZJWCArIFwiLXByb2dyZXNzXVwiKTtcbiAgICAgICAgICAgIHRoaXMuXyRob21lQnRuID0gdGhpcy5fJGVsZW1lbnQuZmluZChcIltkYXRhLVwiICsgSHpOYXZiYXJDb21wb25lbnRfMS5QUkVGSVggKyBcIi1ob21lXVwiKTtcbiAgICAgICAgICAgIHRoaXMuXyRpbmRleEJ0biA9IHRoaXMuXyRlbGVtZW50LmZpbmQoXCJbZGF0YS1cIiArIEh6TmF2YmFyQ29tcG9uZW50XzEuUFJFRklYICsgXCItaW5kZXhdXCIpO1xuICAgICAgICAgICAgdGhpcy5fJGN1cnJlbnRQYWdlSW5kZXggPSB0aGlzLl8kZWxlbWVudC5maW5kKFwiW2RhdGEtXCIgKyBIek5hdmJhckNvbXBvbmVudF8xLlBSRUZJWCArIFwiLWN1cnJlbnRdXCIpO1xuICAgICAgICAgICAgdGhpcy5fJG51bVBhZ2VzID0gdGhpcy5fJGVsZW1lbnQuZmluZChcIltkYXRhLVwiICsgSHpOYXZiYXJDb21wb25lbnRfMS5QUkVGSVggKyBcIi10b3RhbF1cIik7XG4gICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBc2lnbmEgbG9zIGhhbmRsZXJzIGEgZXZlbnRvc1xuICAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICAqL1xuICAgICAgICBIek5hdmJhckNvbXBvbmVudC5wcm90b3R5cGUuX2Fzc2lnbkV2ZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuXyRuZXh0QnRuLm9uKFwiY2xpY2suXCIgKyBIek5hdmJhckNvbXBvbmVudF8xLk5BTUVTUEFDRSwgeyBpbnN0YW5jZTogdGhpcyB9LCB0aGlzLl9vbk5leHRDbGljayk7XG4gICAgICAgICAgICB0aGlzLl8kcHJldkJ0bi5vbihcImNsaWNrLlwiICsgSHpOYXZiYXJDb21wb25lbnRfMS5OQU1FU1BBQ0UsIHsgaW5zdGFuY2U6IHRoaXMgfSwgdGhpcy5fb25QcmV2Q2xpY2spO1xuICAgICAgICAgICAgdGhpcy5fJGhvbWVCdG4ub24oXCJjbGljay5cIiArIEh6TmF2YmFyQ29tcG9uZW50XzEuTkFNRVNQQUNFLCB7IGluc3RhbmNlOiB0aGlzIH0sIHRoaXMuX29uSG9tZUNsaWNrKTtcbiAgICAgICAgICAgIHRoaXMuXyRpbmRleEJ0bi5vbihcImNsaWNrLlwiICsgSHpOYXZiYXJDb21wb25lbnRfMS5OQU1FU1BBQ0UsIHsgaW5zdGFuY2U6IHRoaXMgfSwgdGhpcy5fb25JbmRleENsaWNrKTtcbiAgICAgICAgICAgIHRoaXMuX05hdmlnYXRvci5vbihjb3JlXzEuTmF2aWdhdG9yLk9OX0RJU0FCTEUsIHsgaW5zdGFuY2U6IHRoaXMgfSwgdGhpcy5fb25EaXNhYmxlZCk7XG4gICAgICAgICAgICB0aGlzLl9OYXZpZ2F0b3Iub24oY29yZV8xLk5hdmlnYXRvci5PTl9FTkFCTEUsIHsgaW5zdGFuY2U6IHRoaXMgfSwgdGhpcy5fb25FbmFibGVkKTtcbiAgICAgICAgICAgIHRoaXMuX05hdmlnYXRvci5vbihjb3JlXzEuTmF2aWdhdG9yLk9OX0NIQU5HRV9QQUdFX1NUQVJULCB7IGluc3RhbmNlOiB0aGlzIH0sIHRoaXMuX29uUGFnZUNoYW5nZVN0YXJ0KTtcbiAgICAgICAgICAgIHRoaXMuX05hdmlnYXRvci5vbihjb3JlXzEuTmF2aWdhdG9yLk9OX0NIQU5HRV9QQUdFX0VORCwgeyBpbnN0YW5jZTogdGhpcyB9LCB0aGlzLl9vblBhZ2VDaGFuZ2VFbmQpO1xuICAgICAgICB9O1xuICAgICAgICAvKipcbiAgICAgICAgICogSW52b2NhZG8gYWwgaGFjZXJzZSBjbGljayBlbiBlbCBib3TDs24gc2lndWllbnRlLiBJbnZvY2EgYSBfTmF2aWdhdG9yI25leHRcbiAgICAgICAgICogQHBhcmFtIGVcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIEh6TmF2YmFyQ29tcG9uZW50LnByb3RvdHlwZS5fb25OZXh0Q2xpY2sgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgdmFyIGluc3RhbmNlID0gZS5kYXRhLmluc3RhbmNlO1xuICAgICAgICAgICAgaW5zdGFuY2UuX05hdmlnYXRvci5uZXh0KCk7XG4gICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbnZvY2FkbyBhbCBoYWNlcnNlIGNsaWNrIGVuIGVsIGJvdMOzbiBhbnRlcmlvci4gSW52b2NhIGEgX05hdmlnYXRvciNwcmV2XG4gICAgICAgICAqIEBwYXJhbSBlXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBIek5hdmJhckNvbXBvbmVudC5wcm90b3R5cGUuX29uUHJldkNsaWNrID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHZhciBpbnN0YW5jZSA9IGUuZGF0YS5pbnN0YW5jZTtcbiAgICAgICAgICAgIGluc3RhbmNlLl9OYXZpZ2F0b3IucHJldigpO1xuICAgICAgICB9O1xuICAgICAgICBIek5hdmJhckNvbXBvbmVudC5wcm90b3R5cGUuX29uSG9tZUNsaWNrID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHZhciBpbnN0YW5jZSA9IGUuZGF0YS5pbnN0YW5jZTtcbiAgICAgICAgfTtcbiAgICAgICAgSHpOYXZiYXJDb21wb25lbnQucHJvdG90eXBlLl9vbkluZGV4Q2xpY2sgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgdmFyIGluc3RhbmNlID0gZS5kYXRhLmluc3RhbmNlO1xuICAgICAgICB9O1xuICAgICAgICAvKipcbiAgICAgICAgICogQXBsaWNhIGVsIGNhbWJpbyBkZSBlc3RpbG9zIGEgbGEgYmFycmEgZGUgcHJvZ3Jlc28geSBhY3R1YWxpemEgZWwgdGV4dG8gZGUgcHJvZ3Jlc29cbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9ICAgICAgdmFsdWUgICAgICAgVmFsb3JhIGVzdGFibGVjZXJcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKi9cbiAgICAgICAgSHpOYXZiYXJDb21wb25lbnQucHJvdG90eXBlLl91cGRhdGVQcm9ncmVzc1ZhbHVlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl8kcHJvZ3Jlc3MudGV4dCh2YWx1ZSArIFwiJVwiKTtcbiAgICAgICAgICAgIHRoaXMuXyRiYXIuY3NzKFwidHJhbnNmb3JtXCIsIFwic2NhbGVYKFwiICsgdmFsdWUgLyAxMDAgKyBcIilcIik7XG4gICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbnZvY2FkbyBhbCBjb21lbnphciBlbCBjYW1iaW8gZGUgcMOhZ2luYS4gRGVzaGFiaWxpdGEgbGEgbmF2ZWdhY2nDs24gZHVyYW50ZSBlbCBwcm9jZXNvXG4gICAgICAgICAqIEBwYXJhbSBlXG4gICAgICAgICAqIEBwYXJhbSBuZXdQYWdlXG4gICAgICAgICAqIEBwYXJhbSBvbGRQYWdlXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBIek5hdmJhckNvbXBvbmVudC5wcm90b3R5cGUuX29uUGFnZUNoYW5nZVN0YXJ0ID0gZnVuY3Rpb24gKGUsIG5ld1BhZ2UsIG9sZFBhZ2UpIHtcbiAgICAgICAgICAgIGlmICghZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkge1xuICAgICAgICAgICAgICAgIHZhciBpbnN0YW5jZSA9IGUuZGF0YS5pbnN0YW5jZTtcbiAgICAgICAgICAgICAgICBpZiAob2xkUGFnZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcGFnZUltcGxlbWVudGF0aW9uID0gaW5zdGFuY2UuX1BhZ2VNYW5hZ2VyLmdldFBhZ2Uob2xkUGFnZS5pbmRleCksIHBhZ2UgPSBwYWdlSW1wbGVtZW50YXRpb24uZ2V0UGFnZSgpO1xuICAgICAgICAgICAgICAgICAgICBwYWdlLm9mZihcIi5cIiArIEh6TmF2YmFyQ29tcG9uZW50XzEuTkFNRVNQQUNFKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaW5zdGFuY2UuX3NldEN1cnJlbnRQYWdlKG5ld1BhZ2UuaW5kZXgpO1xuICAgICAgICAgICAgICAgIGluc3RhbmNlLl8kcHJldkJ0bi5hdHRyKFwiZGlzYWJsZWRcIiwgXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgICAgICBpbnN0YW5jZS5fJG5leHRCdG4uYXR0cihcImRpc2FibGVkXCIsIFwiZGlzYWJsZWRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBFc3RhYmxlY2UgbG9zIGVzdGFkb3MgZGUgbG9zIGJvdG9uZXMgZGUgbmF2ZWdhY2nDs24gZW4gYmFzZSBhIGxvcyBkYXRvcyBkZSBOYXZpZ2F0b3JcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIEh6TmF2YmFyQ29tcG9uZW50LnByb3RvdHlwZS5fdXBkYXRlUGFnZXJCdXR0b25TdGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fTmF2aWdhdG9yLmlzRGlzYWJsZWQoKSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jdXJyZW50UGFnZUluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuXyRwcmV2QnRuLmF0dHIoXCJkaXNhYmxlZFwiLCBcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl8kbmV4dEJ0bi5yZW1vdmVBdHRyKFwiZGlzYWJsZWRcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuX2N1cnJlbnRQYWdlSW5kZXggPT09IHRoaXMuX251bVBhZ2VzIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl8kbmV4dEJ0bi5hdHRyKFwiZGlzYWJsZWRcIiwgXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fJHByZXZCdG4ucmVtb3ZlQXR0cihcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fJG5leHRCdG4ucmVtb3ZlQXR0cihcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl8kcHJldkJ0bi5yZW1vdmVBdHRyKFwiZGlzYWJsZWRcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5fJG5leHRCdG4ucHJvcChcImRpc2FibGVkXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9OYXZpZ2F0b3IuZ2V0Q3VycmVudFBhZ2UoKS5nZXRDb250cm9sbGVyKCkuaXNDb21wbGV0ZWQoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fJG5leHRCdG4ucmVtb3ZlQXR0cihcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fJG5leHRCdG4uYXR0cihcImRpc2FibGVkXCIsIFwiZGlzYWJsZWRcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl8kcHJldkJ0bi5hdHRyKFwiZGlzYWJsZWRcIiwgXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLl8kbmV4dEJ0bi5hdHRyKFwiZGlzYWJsZWRcIiwgXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEludm9jYWRvIGFsIGZpbmFsaXphcnNlIGVsIGNhbWJpbyBkZSBww6FnaW5hLiBBY3R1YWxpemEgZWwgcGFnaW5hZG9yIHkgZWwgZXN0YWRvIGRlIGxvcyBib3RvbmVzIGRlIG5hdmVnYWNpw7NuXG4gICAgICAgICAqIEBwYXJhbSBlXG4gICAgICAgICAqIEBwYXJhbSBuZXdQYWdlXG4gICAgICAgICAqIEBwYXJhbSBvbGRQYWdlXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBIek5hdmJhckNvbXBvbmVudC5wcm90b3R5cGUuX29uUGFnZUNoYW5nZUVuZCA9IGZ1bmN0aW9uIChlLCBuZXdQYWdlLCBvbGRQYWdlKSB7XG4gICAgICAgICAgICB2YXIgaW5zdGFuY2UgPSBlLmRhdGEuaW5zdGFuY2U7XG4gICAgICAgICAgICBpbnN0YW5jZS5fdXBkYXRlUGFnZXJCdXR0b25TdGF0ZSgpO1xuICAgICAgICAgICAgaW5zdGFuY2UucHJvZ3Jlc3MoKGluc3RhbmNlLl9OYXZpZ2F0b3IuZ2V0VmlzaXRlZFBhZ2VzKCkubGVuZ3RoICogMTAwKSAvIGluc3RhbmNlLl9udW1QYWdlcyk7XG4gICAgICAgICAgICB2YXIgcGFnZUltcGxlbWVudGF0aW9uID0gaW5zdGFuY2UuX05hdmlnYXRvci5nZXRDdXJyZW50UGFnZSgpLCBwYWdlID0gcGFnZUltcGxlbWVudGF0aW9uLmdldFBhZ2UoKTtcbiAgICAgICAgICAgIHBhZ2Uub2ZmKFwiLlwiICsgSHpOYXZiYXJDb21wb25lbnRfMS5OQU1FU1BBQ0UpLm9uKGNvcmVfMS5QYWdlQ29udHJvbGxlci5PTl9DT01QTEVURV9DSEFOR0UgKyBcIi5cIiArIEh6TmF2YmFyQ29tcG9uZW50XzEuTkFNRVNQQUNFLCB7IGluc3RhbmNlOiBpbnN0YW5jZSB9LCBpbnN0YW5jZS5fb25QYWdlQ29tcGxldGVDaGFuZ2UpO1xuICAgICAgICB9O1xuICAgICAgICAvKipcbiAgICAgICAgICogSW52b2NhZG8gYWwgY29tcGxldGFyc2UgbGEgcMOhZ2luYS4gQWN0dWFsaXphIGVsIGVzdGFkbyBkZWwgYm90w7NuIHNpZ3VpZW50ZVxuICAgICAgICAgKiBAcGFyYW0gZVxuICAgICAgICAgKiBAcGFyYW0gY29tcGxldGVkXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBIek5hdmJhckNvbXBvbmVudC5wcm90b3R5cGUuX29uUGFnZUNvbXBsZXRlQ2hhbmdlID0gZnVuY3Rpb24gKGUsIGNvbXBsZXRlZCkge1xuICAgICAgICAgICAgaWYgKGNvbXBsZXRlZCkge1xuICAgICAgICAgICAgICAgIHZhciBpbnN0YW5jZSA9IGUuZGF0YS5pbnN0YW5jZTtcbiAgICAgICAgICAgICAgICB2YXIgcGFnZUltcGxlbWVudGF0aW9uID0gaW5zdGFuY2UuX05hdmlnYXRvci5nZXRDdXJyZW50UGFnZSgpLCBwYWdlID0gcGFnZUltcGxlbWVudGF0aW9uLmdldFBhZ2UoKTtcbiAgICAgICAgICAgICAgICBpZiAoaW5zdGFuY2UuX1BhZ2VNYW5hZ2VyLmdldFBhZ2VJbmRleChwYWdlLmdldE5hbWUoKSkgIT09IGluc3RhbmNlLl9QYWdlTWFuYWdlci5jb3VudCgpIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFnZUltcGxlbWVudGF0aW9uLmdldENvbnRyb2xsZXIoKS5pc0NvbXBsZXRlZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZS5fJG5leHRCdG4ucmVtb3ZlQXR0cihcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2UuXyRuZXh0QnRuLmF0dHIoXCJkaXNhYmxlZFwiLCBcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICAvKipcbiAgICAgICAgICogRXN0YWJsZWNlIGVsIHZhbG9yIGEgbGEgY2FudGlkYWQgZGUgcMOhZ2luYXMgeSBhY3R1YWxpemEgZWwgdGV4dG8gZGVsIGVsZW1lbnRvXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSAgdmFsdWUgICAgICAgQ2FudGlkYWQgZGUgcMOhZ2luYXNcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIEh6TmF2YmFyQ29tcG9uZW50LnByb3RvdHlwZS5fc2V0TnVtUGFnZXMgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX251bVBhZ2VzID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLl8kbnVtUGFnZXMudGV4dCh2YWx1ZSk7XG4gICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBFc3RhYmxlY2UgZWwgdmFsb3IgZGUgbGEgcMOhZ2luYSBhY3R1YWwgeSBhY3R1YWxpemEgZWwgdGV4dG8gZGVsIGVsZW1lbnRvLiBTZSBlc3BlcmEgcmVjaWJpciBlbCDDrW5kaWNlIGRlIGxhIHDDoWdpbmEgY29tZW56YW5kbyBwb3IgMFxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gIHZhbHVlICAgICAgIMONbmRpY2UgZGUgbGEgcMOhZ2luYSBhY3R1YWxcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIEh6TmF2YmFyQ29tcG9uZW50LnByb3RvdHlwZS5fc2V0Q3VycmVudFBhZ2UgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRQYWdlSW5kZXggPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuXyRjdXJyZW50UGFnZUluZGV4LnRleHQodmFsdWUgKyAxKTtcbiAgICAgICAgfTtcbiAgICAgICAgSHpOYXZiYXJDb21wb25lbnQucHJvdG90eXBlLl9vbkRpc2FibGVkID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHZhciBpbnN0YW5jZSA9IGUuZGF0YS5pbnN0YW5jZTtcbiAgICAgICAgICAgIGluc3RhbmNlLl91cGRhdGVQYWdlckJ1dHRvblN0YXRlKCk7XG4gICAgICAgIH07XG4gICAgICAgIEh6TmF2YmFyQ29tcG9uZW50LnByb3RvdHlwZS5fb25FbmFibGVkID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHZhciBpbnN0YW5jZSA9IGUuZGF0YS5pbnN0YW5jZTtcbiAgICAgICAgICAgIGluc3RhbmNlLl91cGRhdGVQYWdlckJ1dHRvblN0YXRlKCk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBIek5hdmJhckNvbXBvbmVudDtcbiAgICB9KGNvcmVfMS5Db21wb25lbnRDb250cm9sbGVyKSk7XG4gICAgSHpOYXZiYXJDb21wb25lbnQuTkFNRVNQQUNFID0gXCJoek5hdmJhclwiO1xuICAgIEh6TmF2YmFyQ29tcG9uZW50LlBSRUZJWCA9IFwiaHotbmF2YmFyXCI7XG4gICAgSHpOYXZiYXJDb21wb25lbnQuX0RFRkFVTFRTID0ge1xuICAgICAgICBsb2NhbGU6IHtcbiAgICAgICAgICAgIFwiZXNcIjoge1xuICAgICAgICAgICAgICAgIG5leHQ6IFwiU2lndWllbnRlXCIsXG4gICAgICAgICAgICAgICAgcHJldjogXCJBbnRlcmlvclwiLFxuICAgICAgICAgICAgICAgIGN1cnJlbnRQYWdlOiBcIlDDoWdpbmEgYWN0dWFsXCIsXG4gICAgICAgICAgICAgICAgdG90YWxQYWdlczogXCJQw6FnaW5hcyB0b3RhbGVzXCIsXG4gICAgICAgICAgICAgICAgaG9tZTogXCJJciBhbCBpbmljaW9cIixcbiAgICAgICAgICAgICAgICBpbmRleDogXCJNb3N0cmFyIMOtbmRpY2VcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBkZWZhdWx0TGFuZzogXCJlc1wiXG4gICAgfTtcbiAgICBIek5hdmJhckNvbXBvbmVudCA9IEh6TmF2YmFyQ29tcG9uZW50XzEgPSBfX2RlY29yYXRlKFtcbiAgICAgICAgY29yZV8xLkNvbXBvbmVudCh7XG4gICAgICAgICAgICBuYW1lOiBcIkh6TmF2YmFyXCIsXG4gICAgICAgICAgICBkZXBlbmRlbmNpZXM6IFtcbiAgICAgICAgICAgICAgICBjb3JlXzEuJCxcbiAgICAgICAgICAgICAgICBjb3JlXzEuRXZlbnRFbWl0dGVyRmFjdG9yeSxcbiAgICAgICAgICAgICAgICBjb3JlXzEuTmF2aWdhdG9yLFxuICAgICAgICAgICAgICAgIGNvcmVfMS5QYWdlTWFuYWdlclxuICAgICAgICAgICAgXVxuICAgICAgICB9KVxuICAgIF0sIEh6TmF2YmFyQ29tcG9uZW50KTtcbiAgICBleHBvcnRzLkh6TmF2YmFyQ29tcG9uZW50ID0gSHpOYXZiYXJDb21wb25lbnQ7XG4gICAgdmFyIEh6TmF2YmFyQ29tcG9uZW50XzE7XG59KTtcbiJdLCJmaWxlIjoiSHpOYXZiYXIuanMifQ==
