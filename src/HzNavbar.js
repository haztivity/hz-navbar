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
        define(["require", "exports", "@haztivity/core", "jquery-ui/ui/widgets/dialog"], factory);
    }
})(function (require, exports) {
    "use strict";
    /**
     * @license
     * Copyright Davinchi. All Rights Reserved.
     */
    var core_1 = require("@haztivity/core");
    var dialog = require("jquery-ui/ui/widgets/dialog");
    dialog;
    var HzNavbarComponent = HzNavbarComponent_1 = (function (_super) {
        __extends(HzNavbarComponent, _super);
        function HzNavbarComponent(_$, _EventEmitterFactory, _Navigator, _PageManager, _DataOptions) {
            var _this = _super.call(this, _$, _EventEmitterFactory) || this;
            _this._Navigator = _Navigator;
            _this._PageManager = _PageManager;
            _this._DataOptions = _DataOptions;
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
            this._generateIndex();
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
        HzNavbarComponent.prototype.closeIndexList = function () {
            if (this._indexListDialog) {
                this._indexListDialog.close();
            }
        };
        HzNavbarComponent.prototype.indexListIsOpen = function () {
            var result;
            if (this._indexListDialog) {
                result = this._indexListDialog.isOpen();
                this._indexListDialog.open();
            }
            return result;
        };
        HzNavbarComponent.prototype.openIndexList = function () {
            if (this._indexListDialog) {
                this.updateIndex();
                this._indexListDialog.open();
            }
        };
        HzNavbarComponent.prototype._generateIndex = function () {
            if (this._$indexList && this._$indexList.length > 0 && this._$indexListItemTemplate && this._$indexListItemTemplate.length > 0) {
                this._$indexListItemTemplate.detach();
                var options = core_1.$.extend({}, HzNavbarComponent_1.OPT_DIALOG_DEFAULTS, this._DataOptions.getDataOptions(this._$indexList, HzNavbarComponent_1.PREFIX_LIST_DIALOG_OPTIONS));
                options.dialogClass = HzNavbarComponent_1.CLASS_LIST_INDEX_DIALOG;
                this._$indexList.dialog(options);
                this._indexListDialog = this._$indexList.data("ui-dialog");
            }
        };
        HzNavbarComponent.prototype.updateIndex = function () {
            if (this._$indexList && this._$indexList.length > 0 && this._$indexListItemTemplate && this._$indexListItemTemplate.length > 0) {
                this._$indexList.empty();
                var pages = [];
                var numPages = this._PageManager.count(), previousState = void 0;
                for (var numPageIndex = 0; numPageIndex < numPages; numPageIndex++) {
                    var currentPage = this._PageManager.getPage(numPageIndex), pageRegister = currentPage.getPage();
                    var $page = this._$indexListItemTemplate.clone();
                    $page.find(HzNavbarComponent_1.QUERY_INDEX_LIST_ITEM_CONTENT).html(pageRegister._options.title);
                    if (currentPage._state.completed) {
                        $page.addClass(HzNavbarComponent_1.CLASS_PAGE_COMPLETED);
                    }
                    else if (currentPage._state.visited) {
                        $page.addClass(HzNavbarComponent_1.CLASS_PAGE_VISITED);
                    }
                    if (previousState == undefined || previousState.completed) {
                        $page.data(HzNavbarComponent_1.DATA_PAGE, {
                            name: pageRegister.getName(),
                            index: numPageIndex
                        });
                    }
                    previousState = currentPage._state;
                    pages.push($page);
                }
                this._$indexList.append(pages);
            }
        };
        /**
         * Obtiene los elementos del DOM a utilizar
         * @protected
         */
        HzNavbarComponent.prototype._getElements = function () {
            this._$nextBtn = this._$element.find(HzNavbarComponent_1.QUERY_ACTION_NEXT);
            this._$prevBtn = this._$element.find(HzNavbarComponent_1.QUERY_ACTION_PREV);
            this._$bar = this._$element.find(HzNavbarComponent_1.QUERY_BAR);
            this._$progress = this._$element.find(HzNavbarComponent_1.QUERY_PROGRESS);
            this._$homeBtn = this._$element.find(HzNavbarComponent_1.QUERY_ACTION_HOME);
            this._$indexBtn = this._$element.find(HzNavbarComponent_1.QUERY_ACTION_INDEX);
            this._$currentPageIndex = this._$element.find(HzNavbarComponent_1.QUERY_PAGE_CURRENT);
            this._$numPages = this._$element.find(HzNavbarComponent_1.QUERY_PAGE_TOTAL);
            this._$indexList = this._$element.find(HzNavbarComponent_1.QUERY_INDEX_LIST);
            this._$indexListItemTemplate = this._$indexList.find(HzNavbarComponent_1.QUERY_INDEX_LIST_ITEM);
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
            this._$indexList.on("click." + HzNavbarComponent_1.NAMESPACE, HzNavbarComponent_1.QUERY_INDEX_LIST_ITEM, { instance: this }, this._onIndexListItemClick);
            this._Navigator.on(core_1.Navigator.ON_DISABLE, { instance: this }, this._onDisabled);
            this._Navigator.on(core_1.Navigator.ON_ENABLE, { instance: this }, this._onEnabled);
            this._Navigator.on(core_1.Navigator.ON_CHANGE_PAGE_START, { instance: this }, this._onPageChangeStart);
            this._Navigator.on(core_1.Navigator.ON_CHANGE_PAGE_END, { instance: this }, this._onPageChangeEnd);
        };
        HzNavbarComponent.prototype._onIndexListItemClick = function (e) {
            e.preventDefault();
            var instance = e.data.instance, $item = core_1.$(this), page = $item.data(HzNavbarComponent_1.DATA_PAGE);
            if (page) {
                instance.closeIndexList();
                instance._Navigator.goTo(page.index);
            }
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
            if (instance.indexListIsOpen()) {
                instance.closeIndexList();
            }
            else {
                instance.openIndexList();
            }
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
    HzNavbarComponent.PREFIX_LIST_DIALOG_OPTIONS = HzNavbarComponent_1.NAMESPACE + "Dialog";
    HzNavbarComponent.QUERY_ACTION_NEXT = "[data-" + HzNavbarComponent_1.PREFIX + "-next]";
    HzNavbarComponent.QUERY_ACTION_PREV = "[data-" + HzNavbarComponent_1.PREFIX + "-prev]";
    HzNavbarComponent.QUERY_BAR = "[data-" + HzNavbarComponent_1.PREFIX + "-bar]";
    HzNavbarComponent.QUERY_PROGRESS = "[data-" + HzNavbarComponent_1.PREFIX + "-progress]";
    HzNavbarComponent.QUERY_ACTION_HOME = "[data-" + HzNavbarComponent_1.PREFIX + "-home]";
    HzNavbarComponent.QUERY_ACTION_INDEX = "[data-" + HzNavbarComponent_1.PREFIX + "-index]";
    HzNavbarComponent.QUERY_PAGE_CURRENT = "[data-" + HzNavbarComponent_1.PREFIX + "-current]";
    HzNavbarComponent.QUERY_PAGE_TOTAL = "[data-" + HzNavbarComponent_1.PREFIX + "-total]";
    HzNavbarComponent.QUERY_INDEX_LIST = "[data-" + HzNavbarComponent_1.PREFIX + "-index-list]";
    HzNavbarComponent.QUERY_INDEX_LIST_ITEM = "[data-" + HzNavbarComponent_1.PREFIX + "-index-list-item]";
    HzNavbarComponent.QUERY_INDEX_LIST_ITEM_CONTENT = "[data-" + HzNavbarComponent_1.PREFIX + "-index-list-item-content]";
    HzNavbarComponent.CLASS_PAGE_VISITED = "hz-navbar__page--visited";
    HzNavbarComponent.CLASS_PAGE_COMPLETED = "hz-navbar__page--completed";
    HzNavbarComponent.CLASS_LIST_INDEX_DIALOG = "hz-navbar__index-list-dialog";
    HzNavbarComponent.DATA_PAGE = "hzNavbarPage";
    HzNavbarComponent.OPT_DIALOG_DEFAULTS = {
        autoOpen: false
    };
    HzNavbarComponent._DEFAULTS = {
        locale: {
            "es": {
                next: "Siguiente",
                prev: "Anterior",
                currentPage: "Página actual",
                totalPages: "Páginas totales",
                home: "Ir al inicio",
                showIndex: "Mostrar índice",
                index: "Índice"
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
                core_1.PageManager,
                core_1.DataOptions
            ]
        })
    ], HzNavbarComponent);
    exports.HzNavbarComponent = HzNavbarComponent;
    var HzNavbarComponent_1;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJIek5hdmJhci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xufTtcbnZhciBfX2RlY29yYXRlID0gKHRoaXMgJiYgdGhpcy5fX2RlY29yYXRlKSB8fCBmdW5jdGlvbiAoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xufTtcbihmdW5jdGlvbiAoZmFjdG9yeSkge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICB2YXIgdiA9IGZhY3RvcnkocmVxdWlyZSwgZXhwb3J0cyk7XG4gICAgICAgIGlmICh2ICE9PSB1bmRlZmluZWQpIG1vZHVsZS5leHBvcnRzID0gdjtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKFtcInJlcXVpcmVcIiwgXCJleHBvcnRzXCIsIFwiQGhhenRpdml0eS9jb3JlXCIsIFwianF1ZXJ5LXVpL3VpL3dpZGdldHMvZGlhbG9nXCJdLCBmYWN0b3J5KTtcbiAgICB9XG59KShmdW5jdGlvbiAocmVxdWlyZSwgZXhwb3J0cykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIC8qKlxuICAgICAqIEBsaWNlbnNlXG4gICAgICogQ29weXJpZ2h0IERhdmluY2hpLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICAgICAqL1xuICAgIHZhciBjb3JlXzEgPSByZXF1aXJlKFwiQGhhenRpdml0eS9jb3JlXCIpO1xuICAgIHZhciBkaWFsb2cgPSByZXF1aXJlKFwianF1ZXJ5LXVpL3VpL3dpZGdldHMvZGlhbG9nXCIpO1xuICAgIGRpYWxvZztcbiAgICB2YXIgSHpOYXZiYXJDb21wb25lbnQgPSBIek5hdmJhckNvbXBvbmVudF8xID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICAgICAgX19leHRlbmRzKEh6TmF2YmFyQ29tcG9uZW50LCBfc3VwZXIpO1xuICAgICAgICBmdW5jdGlvbiBIek5hdmJhckNvbXBvbmVudChfJCwgX0V2ZW50RW1pdHRlckZhY3RvcnksIF9OYXZpZ2F0b3IsIF9QYWdlTWFuYWdlciwgX0RhdGFPcHRpb25zKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBfJCwgX0V2ZW50RW1pdHRlckZhY3RvcnkpIHx8IHRoaXM7XG4gICAgICAgICAgICBfdGhpcy5fTmF2aWdhdG9yID0gX05hdmlnYXRvcjtcbiAgICAgICAgICAgIF90aGlzLl9QYWdlTWFuYWdlciA9IF9QYWdlTWFuYWdlcjtcbiAgICAgICAgICAgIF90aGlzLl9EYXRhT3B0aW9ucyA9IF9EYXRhT3B0aW9ucztcbiAgICAgICAgICAgIF90aGlzLl9jdXJyZW50UGFnZUluZGV4ID0gMDtcbiAgICAgICAgICAgIF90aGlzLl9udW1QYWdlcyA9IDA7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgICAgIH1cbiAgICAgICAgSHpOYXZiYXJDb21wb25lbnQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAob3B0aW9ucywgY29uZmlnKSB7XG4gICAgICAgICAgICB0aGlzLl9vcHRpb25zID0gY29yZV8xLiQuZXh0ZW5kKHRydWUsIHt9LCBIek5hdmJhckNvbXBvbmVudF8xLl9ERUZBVUxUUywgb3B0aW9ucyk7XG4gICAgICAgICAgICB0aGlzLl9nZXRFbGVtZW50cygpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVMb2NhbGUoKTtcbiAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3MoMCk7XG4gICAgICAgICAgICB0aGlzLl9hc3NpZ25FdmVudHMoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUGFnaW5hdG9yKCk7XG4gICAgICAgIH07XG4gICAgICAgIEh6TmF2YmFyQ29tcG9uZW50LnByb3RvdHlwZS51cGRhdGVQYWdpbmF0b3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbnVtUGFnZXMgPSB0aGlzLl9QYWdlTWFuYWdlci5jb3VudCgpO1xuICAgICAgICAgICAgdGhpcy5fc2V0TnVtUGFnZXMobnVtUGFnZXMpO1xuICAgICAgICAgICAgdGhpcy5fZ2VuZXJhdGVJbmRleCgpO1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRQYWdlID0gdGhpcy5fTmF2aWdhdG9yLmdldEN1cnJlbnRQYWdlSW5kZXgoKSB8fCAwO1xuICAgICAgICAgICAgdGhpcy5fc2V0Q3VycmVudFBhZ2UoY3VycmVudFBhZ2UpO1xuICAgICAgICB9O1xuICAgICAgICAvKipcbiAgICAgICAgICogU2kgc2UgaW5kaWNhIHBhcsOhbWV0cm8gc2UgZXN0YWJsZWNlIGVsIHBvcmNlbnRhamUuIEVsIG7Dum1lcm8gZXMgcmVkb25kZWFkbyBhIDIgZGVjaW1hbGVzXG4gICAgICAgICAqIFNpIG5vIHNlIGluZGljYSBwYXLDoW1ldHJvLCBkZXZ1ZWx2ZSBlbCBwb3JjZW50YWplIGFjdHVhbFxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gICAgICBbdmFsdWVdICAgICAgICAgVmFsb3IgYSBlc3RhYmxlY2VyXG4gICAgICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICBIek5hdmJhckNvbXBvbmVudC5wcm90b3R5cGUucHJvZ3Jlc3MgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gcGFyc2VGbG9hdCh2YWx1ZS50b0ZpeGVkKDIpKTtcbiAgICAgICAgICAgICAgICBpZiAoIWlzTmFOKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUgPj0gMCAmJiB2YWx1ZSA8PSAxMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3Byb2dyZXNzID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVQcm9ncmVzc1ZhbHVlKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9wcm9ncmVzcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEVzdGFibGVjZSB1biBpZGlvbWFcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9ICBsYW5nICAgICAgICBJZGlvbWEuIFNpIG5vIHRpZW5lIHRyYWR1Y2Npb25lcyBlbiBvcHRpb25zLmxvY2FsZSBzZSB1dGlsaXphIGVsIGlkaW9tYSBwb3IgZGVmZWN0b1xuICAgICAgICAgKi9cbiAgICAgICAgSHpOYXZiYXJDb21wb25lbnQucHJvdG90eXBlLnNldExhbmcgPSBmdW5jdGlvbiAobGFuZykge1xuICAgICAgICAgICAgdGhpcy5fb3B0aW9ucy5sYW5nID0gbGFuZztcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTG9jYWxlKCk7XG4gICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBY3R1YWxpemEgbGFzIHRyYWR1Y2Npb25lc1xuICAgICAgICAgKi9cbiAgICAgICAgSHpOYXZiYXJDb21wb25lbnQucHJvdG90eXBlLnVwZGF0ZUxvY2FsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBsYW5nID0gdGhpcy5fb3B0aW9ucy5sYW5nLCBsb2NhbGUgPSB0aGlzLl9vcHRpb25zLmxvY2FsZVtsYW5nXSB8fCB0aGlzLl9vcHRpb25zLmxvY2FsZVt0aGlzLl9vcHRpb25zLmRlZmF1bHRMYW5nXTtcbiAgICAgICAgICAgIGlmIChsb2NhbGUpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gbG9jYWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVRleHQoa2V5LCBsb2NhbGVba2V5XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICAvKipcbiAgICAgICAgICogRXN0YWJsZWNlIHVuIHRleHRvIGVuIHVubyBvIHZhcmlvcyBlbGVtZW50b3NcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9ICAgICAgdG8gICAgICBTZSBidXNjYW4gbG9zIGVsZW1lbnRvcyBxdWUgY29ycmVzcG9uZGFuIGNvbiBlbCBzZWxlY3RvciBbZGF0YS1oei1uYXZiYXItY29udGVudD12YWxvcl1cbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9ICAgICAgdGV4dCAgICBUZXh0byBhIGVzdGFibGVjZXJcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIEh6TmF2YmFyQ29tcG9uZW50LnByb3RvdHlwZS5fdXBkYXRlVGV4dCA9IGZ1bmN0aW9uICh0bywgdGV4dCkge1xuICAgICAgICAgICAgaWYgKHRvKSB7XG4gICAgICAgICAgICAgICAgdmFyICRlbGVtZW50ID0gdGhpcy5fJGVsZW1lbnQuZmluZChcIltkYXRhLWh6LW5hdmJhci1jb250ZW50PVwiICsgdG8gKyBcIl1cIik7XG4gICAgICAgICAgICAgICAgaWYgKCRlbGVtZW50Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgZWxlbWVudEluZGV4ID0gMCwgJGVsZW1lbnRMZW5ndGggPSAkZWxlbWVudC5sZW5ndGg7IGVsZW1lbnRJbmRleCA8ICRlbGVtZW50TGVuZ3RoOyBlbGVtZW50SW5kZXgrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyICRjdXJyZW50RWxlbWVudCA9IGNvcmVfMS4kKCRlbGVtZW50W2VsZW1lbnRJbmRleF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAkY3VycmVudEVsZW1lbnQuZGF0YShcImh6TmF2YmFyQ29udGVudFRvXCIpIHx8IFwidGV4dFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGF0dHIgPT09IFwidGV4dFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGN1cnJlbnRFbGVtZW50LnRleHQodGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkY3VycmVudEVsZW1lbnQuYXR0cihhdHRyLCB0ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgSHpOYXZiYXJDb21wb25lbnQucHJvdG90eXBlLmNsb3NlSW5kZXhMaXN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2luZGV4TGlzdERpYWxvZykge1xuICAgICAgICAgICAgICAgIHRoaXMuX2luZGV4TGlzdERpYWxvZy5jbG9zZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBIek5hdmJhckNvbXBvbmVudC5wcm90b3R5cGUuaW5kZXhMaXN0SXNPcGVuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdDtcbiAgICAgICAgICAgIGlmICh0aGlzLl9pbmRleExpc3REaWFsb2cpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB0aGlzLl9pbmRleExpc3REaWFsb2cuaXNPcGVuKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5faW5kZXhMaXN0RGlhbG9nLm9wZW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH07XG4gICAgICAgIEh6TmF2YmFyQ29tcG9uZW50LnByb3RvdHlwZS5vcGVuSW5kZXhMaXN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2luZGV4TGlzdERpYWxvZykge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlSW5kZXgoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9pbmRleExpc3REaWFsb2cub3BlbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBIek5hdmJhckNvbXBvbmVudC5wcm90b3R5cGUuX2dlbmVyYXRlSW5kZXggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fJGluZGV4TGlzdCAmJiB0aGlzLl8kaW5kZXhMaXN0Lmxlbmd0aCA+IDAgJiYgdGhpcy5fJGluZGV4TGlzdEl0ZW1UZW1wbGF0ZSAmJiB0aGlzLl8kaW5kZXhMaXN0SXRlbVRlbXBsYXRlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLl8kaW5kZXhMaXN0SXRlbVRlbXBsYXRlLmRldGFjaCgpO1xuICAgICAgICAgICAgICAgIHZhciBvcHRpb25zID0gY29yZV8xLiQuZXh0ZW5kKHt9LCBIek5hdmJhckNvbXBvbmVudF8xLk9QVF9ESUFMT0dfREVGQVVMVFMsIHRoaXMuX0RhdGFPcHRpb25zLmdldERhdGFPcHRpb25zKHRoaXMuXyRpbmRleExpc3QsIEh6TmF2YmFyQ29tcG9uZW50XzEuUFJFRklYX0xJU1RfRElBTE9HX09QVElPTlMpKTtcbiAgICAgICAgICAgICAgICBvcHRpb25zLmRpYWxvZ0NsYXNzID0gSHpOYXZiYXJDb21wb25lbnRfMS5DTEFTU19MSVNUX0lOREVYX0RJQUxPRztcbiAgICAgICAgICAgICAgICB0aGlzLl8kaW5kZXhMaXN0LmRpYWxvZyhvcHRpb25zKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9pbmRleExpc3REaWFsb2cgPSB0aGlzLl8kaW5kZXhMaXN0LmRhdGEoXCJ1aS1kaWFsb2dcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIEh6TmF2YmFyQ29tcG9uZW50LnByb3RvdHlwZS51cGRhdGVJbmRleCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl8kaW5kZXhMaXN0ICYmIHRoaXMuXyRpbmRleExpc3QubGVuZ3RoID4gMCAmJiB0aGlzLl8kaW5kZXhMaXN0SXRlbVRlbXBsYXRlICYmIHRoaXMuXyRpbmRleExpc3RJdGVtVGVtcGxhdGUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuXyRpbmRleExpc3QuZW1wdHkoKTtcbiAgICAgICAgICAgICAgICB2YXIgcGFnZXMgPSBbXTtcbiAgICAgICAgICAgICAgICB2YXIgbnVtUGFnZXMgPSB0aGlzLl9QYWdlTWFuYWdlci5jb3VudCgpLCBwcmV2aW91c1N0YXRlID0gdm9pZCAwO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIG51bVBhZ2VJbmRleCA9IDA7IG51bVBhZ2VJbmRleCA8IG51bVBhZ2VzOyBudW1QYWdlSW5kZXgrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY3VycmVudFBhZ2UgPSB0aGlzLl9QYWdlTWFuYWdlci5nZXRQYWdlKG51bVBhZ2VJbmRleCksIHBhZ2VSZWdpc3RlciA9IGN1cnJlbnRQYWdlLmdldFBhZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyICRwYWdlID0gdGhpcy5fJGluZGV4TGlzdEl0ZW1UZW1wbGF0ZS5jbG9uZSgpO1xuICAgICAgICAgICAgICAgICAgICAkcGFnZS5maW5kKEh6TmF2YmFyQ29tcG9uZW50XzEuUVVFUllfSU5ERVhfTElTVF9JVEVNX0NPTlRFTlQpLmh0bWwocGFnZVJlZ2lzdGVyLl9vcHRpb25zLnRpdGxlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRQYWdlLl9zdGF0ZS5jb21wbGV0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRwYWdlLmFkZENsYXNzKEh6TmF2YmFyQ29tcG9uZW50XzEuQ0xBU1NfUEFHRV9DT01QTEVURUQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGN1cnJlbnRQYWdlLl9zdGF0ZS52aXNpdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkcGFnZS5hZGRDbGFzcyhIek5hdmJhckNvbXBvbmVudF8xLkNMQVNTX1BBR0VfVklTSVRFRCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHByZXZpb3VzU3RhdGUgPT0gdW5kZWZpbmVkIHx8IHByZXZpb3VzU3RhdGUuY29tcGxldGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkcGFnZS5kYXRhKEh6TmF2YmFyQ29tcG9uZW50XzEuREFUQV9QQUdFLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogcGFnZVJlZ2lzdGVyLmdldE5hbWUoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleDogbnVtUGFnZUluZGV4XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBwcmV2aW91c1N0YXRlID0gY3VycmVudFBhZ2UuX3N0YXRlO1xuICAgICAgICAgICAgICAgICAgICBwYWdlcy5wdXNoKCRwYWdlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fJGluZGV4TGlzdC5hcHBlbmQocGFnZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICAvKipcbiAgICAgICAgICogT2J0aWVuZSBsb3MgZWxlbWVudG9zIGRlbCBET00gYSB1dGlsaXphclxuICAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICAqL1xuICAgICAgICBIek5hdmJhckNvbXBvbmVudC5wcm90b3R5cGUuX2dldEVsZW1lbnRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5fJG5leHRCdG4gPSB0aGlzLl8kZWxlbWVudC5maW5kKEh6TmF2YmFyQ29tcG9uZW50XzEuUVVFUllfQUNUSU9OX05FWFQpO1xuICAgICAgICAgICAgdGhpcy5fJHByZXZCdG4gPSB0aGlzLl8kZWxlbWVudC5maW5kKEh6TmF2YmFyQ29tcG9uZW50XzEuUVVFUllfQUNUSU9OX1BSRVYpO1xuICAgICAgICAgICAgdGhpcy5fJGJhciA9IHRoaXMuXyRlbGVtZW50LmZpbmQoSHpOYXZiYXJDb21wb25lbnRfMS5RVUVSWV9CQVIpO1xuICAgICAgICAgICAgdGhpcy5fJHByb2dyZXNzID0gdGhpcy5fJGVsZW1lbnQuZmluZChIek5hdmJhckNvbXBvbmVudF8xLlFVRVJZX1BST0dSRVNTKTtcbiAgICAgICAgICAgIHRoaXMuXyRob21lQnRuID0gdGhpcy5fJGVsZW1lbnQuZmluZChIek5hdmJhckNvbXBvbmVudF8xLlFVRVJZX0FDVElPTl9IT01FKTtcbiAgICAgICAgICAgIHRoaXMuXyRpbmRleEJ0biA9IHRoaXMuXyRlbGVtZW50LmZpbmQoSHpOYXZiYXJDb21wb25lbnRfMS5RVUVSWV9BQ1RJT05fSU5ERVgpO1xuICAgICAgICAgICAgdGhpcy5fJGN1cnJlbnRQYWdlSW5kZXggPSB0aGlzLl8kZWxlbWVudC5maW5kKEh6TmF2YmFyQ29tcG9uZW50XzEuUVVFUllfUEFHRV9DVVJSRU5UKTtcbiAgICAgICAgICAgIHRoaXMuXyRudW1QYWdlcyA9IHRoaXMuXyRlbGVtZW50LmZpbmQoSHpOYXZiYXJDb21wb25lbnRfMS5RVUVSWV9QQUdFX1RPVEFMKTtcbiAgICAgICAgICAgIHRoaXMuXyRpbmRleExpc3QgPSB0aGlzLl8kZWxlbWVudC5maW5kKEh6TmF2YmFyQ29tcG9uZW50XzEuUVVFUllfSU5ERVhfTElTVCk7XG4gICAgICAgICAgICB0aGlzLl8kaW5kZXhMaXN0SXRlbVRlbXBsYXRlID0gdGhpcy5fJGluZGV4TGlzdC5maW5kKEh6TmF2YmFyQ29tcG9uZW50XzEuUVVFUllfSU5ERVhfTElTVF9JVEVNKTtcbiAgICAgICAgfTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFzaWduYSBsb3MgaGFuZGxlcnMgYSBldmVudG9zXG4gICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgICovXG4gICAgICAgIEh6TmF2YmFyQ29tcG9uZW50LnByb3RvdHlwZS5fYXNzaWduRXZlbnRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5fJG5leHRCdG4ub24oXCJjbGljay5cIiArIEh6TmF2YmFyQ29tcG9uZW50XzEuTkFNRVNQQUNFLCB7IGluc3RhbmNlOiB0aGlzIH0sIHRoaXMuX29uTmV4dENsaWNrKTtcbiAgICAgICAgICAgIHRoaXMuXyRwcmV2QnRuLm9uKFwiY2xpY2suXCIgKyBIek5hdmJhckNvbXBvbmVudF8xLk5BTUVTUEFDRSwgeyBpbnN0YW5jZTogdGhpcyB9LCB0aGlzLl9vblByZXZDbGljayk7XG4gICAgICAgICAgICB0aGlzLl8kaG9tZUJ0bi5vbihcImNsaWNrLlwiICsgSHpOYXZiYXJDb21wb25lbnRfMS5OQU1FU1BBQ0UsIHsgaW5zdGFuY2U6IHRoaXMgfSwgdGhpcy5fb25Ib21lQ2xpY2spO1xuICAgICAgICAgICAgdGhpcy5fJGluZGV4QnRuLm9uKFwiY2xpY2suXCIgKyBIek5hdmJhckNvbXBvbmVudF8xLk5BTUVTUEFDRSwgeyBpbnN0YW5jZTogdGhpcyB9LCB0aGlzLl9vbkluZGV4Q2xpY2spO1xuICAgICAgICAgICAgdGhpcy5fJGluZGV4TGlzdC5vbihcImNsaWNrLlwiICsgSHpOYXZiYXJDb21wb25lbnRfMS5OQU1FU1BBQ0UsIEh6TmF2YmFyQ29tcG9uZW50XzEuUVVFUllfSU5ERVhfTElTVF9JVEVNLCB7IGluc3RhbmNlOiB0aGlzIH0sIHRoaXMuX29uSW5kZXhMaXN0SXRlbUNsaWNrKTtcbiAgICAgICAgICAgIHRoaXMuX05hdmlnYXRvci5vbihjb3JlXzEuTmF2aWdhdG9yLk9OX0RJU0FCTEUsIHsgaW5zdGFuY2U6IHRoaXMgfSwgdGhpcy5fb25EaXNhYmxlZCk7XG4gICAgICAgICAgICB0aGlzLl9OYXZpZ2F0b3Iub24oY29yZV8xLk5hdmlnYXRvci5PTl9FTkFCTEUsIHsgaW5zdGFuY2U6IHRoaXMgfSwgdGhpcy5fb25FbmFibGVkKTtcbiAgICAgICAgICAgIHRoaXMuX05hdmlnYXRvci5vbihjb3JlXzEuTmF2aWdhdG9yLk9OX0NIQU5HRV9QQUdFX1NUQVJULCB7IGluc3RhbmNlOiB0aGlzIH0sIHRoaXMuX29uUGFnZUNoYW5nZVN0YXJ0KTtcbiAgICAgICAgICAgIHRoaXMuX05hdmlnYXRvci5vbihjb3JlXzEuTmF2aWdhdG9yLk9OX0NIQU5HRV9QQUdFX0VORCwgeyBpbnN0YW5jZTogdGhpcyB9LCB0aGlzLl9vblBhZ2VDaGFuZ2VFbmQpO1xuICAgICAgICB9O1xuICAgICAgICBIek5hdmJhckNvbXBvbmVudC5wcm90b3R5cGUuX29uSW5kZXhMaXN0SXRlbUNsaWNrID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHZhciBpbnN0YW5jZSA9IGUuZGF0YS5pbnN0YW5jZSwgJGl0ZW0gPSBjb3JlXzEuJCh0aGlzKSwgcGFnZSA9ICRpdGVtLmRhdGEoSHpOYXZiYXJDb21wb25lbnRfMS5EQVRBX1BBR0UpO1xuICAgICAgICAgICAgaWYgKHBhZ2UpIHtcbiAgICAgICAgICAgICAgICBpbnN0YW5jZS5jbG9zZUluZGV4TGlzdCgpO1xuICAgICAgICAgICAgICAgIGluc3RhbmNlLl9OYXZpZ2F0b3IuZ29UbyhwYWdlLmluZGV4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEludm9jYWRvIGFsIGhhY2Vyc2UgY2xpY2sgZW4gZWwgYm90w7NuIHNpZ3VpZW50ZS4gSW52b2NhIGEgX05hdmlnYXRvciNuZXh0XG4gICAgICAgICAqIEBwYXJhbSBlXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBIek5hdmJhckNvbXBvbmVudC5wcm90b3R5cGUuX29uTmV4dENsaWNrID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHZhciBpbnN0YW5jZSA9IGUuZGF0YS5pbnN0YW5jZTtcbiAgICAgICAgICAgIGluc3RhbmNlLl9OYXZpZ2F0b3IubmV4dCgpO1xuICAgICAgICB9O1xuICAgICAgICAvKipcbiAgICAgICAgICogSW52b2NhZG8gYWwgaGFjZXJzZSBjbGljayBlbiBlbCBib3TDs24gYW50ZXJpb3IuIEludm9jYSBhIF9OYXZpZ2F0b3IjcHJldlxuICAgICAgICAgKiBAcGFyYW0gZVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgSHpOYXZiYXJDb21wb25lbnQucHJvdG90eXBlLl9vblByZXZDbGljayA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICB2YXIgaW5zdGFuY2UgPSBlLmRhdGEuaW5zdGFuY2U7XG4gICAgICAgICAgICBpbnN0YW5jZS5fTmF2aWdhdG9yLnByZXYoKTtcbiAgICAgICAgfTtcbiAgICAgICAgSHpOYXZiYXJDb21wb25lbnQucHJvdG90eXBlLl9vbkhvbWVDbGljayA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICB2YXIgaW5zdGFuY2UgPSBlLmRhdGEuaW5zdGFuY2U7XG4gICAgICAgIH07XG4gICAgICAgIEh6TmF2YmFyQ29tcG9uZW50LnByb3RvdHlwZS5fb25JbmRleENsaWNrID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHZhciBpbnN0YW5jZSA9IGUuZGF0YS5pbnN0YW5jZTtcbiAgICAgICAgICAgIGlmIChpbnN0YW5jZS5pbmRleExpc3RJc09wZW4oKSkge1xuICAgICAgICAgICAgICAgIGluc3RhbmNlLmNsb3NlSW5kZXhMaXN0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpbnN0YW5jZS5vcGVuSW5kZXhMaXN0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBcGxpY2EgZWwgY2FtYmlvIGRlIGVzdGlsb3MgYSBsYSBiYXJyYSBkZSBwcm9ncmVzbyB5IGFjdHVhbGl6YSBlbCB0ZXh0byBkZSBwcm9ncmVzb1xuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gICAgICB2YWx1ZSAgICAgICBWYWxvcmEgZXN0YWJsZWNlclxuICAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICAqL1xuICAgICAgICBIek5hdmJhckNvbXBvbmVudC5wcm90b3R5cGUuX3VwZGF0ZVByb2dyZXNzVmFsdWUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuXyRwcm9ncmVzcy50ZXh0KHZhbHVlICsgXCIlXCIpO1xuICAgICAgICAgICAgdGhpcy5fJGJhci5jc3MoXCJ0cmFuc2Zvcm1cIiwgXCJzY2FsZVgoXCIgKyB2YWx1ZSAvIDEwMCArIFwiKVwiKTtcbiAgICAgICAgfTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEludm9jYWRvIGFsIGNvbWVuemFyIGVsIGNhbWJpbyBkZSBww6FnaW5hLiBEZXNoYWJpbGl0YSBsYSBuYXZlZ2FjacOzbiBkdXJhbnRlIGVsIHByb2Nlc29cbiAgICAgICAgICogQHBhcmFtIGVcbiAgICAgICAgICogQHBhcmFtIG5ld1BhZ2VcbiAgICAgICAgICogQHBhcmFtIG9sZFBhZ2VcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIEh6TmF2YmFyQ29tcG9uZW50LnByb3RvdHlwZS5fb25QYWdlQ2hhbmdlU3RhcnQgPSBmdW5jdGlvbiAoZSwgbmV3UGFnZSwgb2xkUGFnZSkge1xuICAgICAgICAgICAgaWYgKCFlLmlzRGVmYXVsdFByZXZlbnRlZCgpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGluc3RhbmNlID0gZS5kYXRhLmluc3RhbmNlO1xuICAgICAgICAgICAgICAgIGlmIChvbGRQYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwYWdlSW1wbGVtZW50YXRpb24gPSBpbnN0YW5jZS5fUGFnZU1hbmFnZXIuZ2V0UGFnZShvbGRQYWdlLmluZGV4KSwgcGFnZSA9IHBhZ2VJbXBsZW1lbnRhdGlvbi5nZXRQYWdlKCk7XG4gICAgICAgICAgICAgICAgICAgIHBhZ2Uub2ZmKFwiLlwiICsgSHpOYXZiYXJDb21wb25lbnRfMS5OQU1FU1BBQ0UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpbnN0YW5jZS5fc2V0Q3VycmVudFBhZ2UobmV3UGFnZS5pbmRleCk7XG4gICAgICAgICAgICAgICAgaW5zdGFuY2UuXyRwcmV2QnRuLmF0dHIoXCJkaXNhYmxlZFwiLCBcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgICAgIGluc3RhbmNlLl8kbmV4dEJ0bi5hdHRyKFwiZGlzYWJsZWRcIiwgXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEVzdGFibGVjZSBsb3MgZXN0YWRvcyBkZSBsb3MgYm90b25lcyBkZSBuYXZlZ2FjacOzbiBlbiBiYXNlIGEgbG9zIGRhdG9zIGRlIE5hdmlnYXRvclxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgSHpOYXZiYXJDb21wb25lbnQucHJvdG90eXBlLl91cGRhdGVQYWdlckJ1dHRvblN0YXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9OYXZpZ2F0b3IuaXNEaXNhYmxlZCgpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnRQYWdlSW5kZXggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fJHByZXZCdG4uYXR0cihcImRpc2FibGVkXCIsIFwiZGlzYWJsZWRcIik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuXyRuZXh0QnRuLnJlbW92ZUF0dHIoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5fY3VycmVudFBhZ2VJbmRleCA9PT0gdGhpcy5fbnVtUGFnZXMgLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuXyRuZXh0QnRuLmF0dHIoXCJkaXNhYmxlZFwiLCBcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl8kcHJldkJ0bi5yZW1vdmVBdHRyKFwiZGlzYWJsZWRcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl8kbmV4dEJ0bi5yZW1vdmVBdHRyKFwiZGlzYWJsZWRcIik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuXyRwcmV2QnRuLnJlbW92ZUF0dHIoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl8kbmV4dEJ0bi5wcm9wKFwiZGlzYWJsZWRcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX05hdmlnYXRvci5nZXRDdXJyZW50UGFnZSgpLmdldENvbnRyb2xsZXIoKS5pc0NvbXBsZXRlZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl8kbmV4dEJ0bi5yZW1vdmVBdHRyKFwiZGlzYWJsZWRcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl8kbmV4dEJ0bi5hdHRyKFwiZGlzYWJsZWRcIiwgXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuXyRwcmV2QnRuLmF0dHIoXCJkaXNhYmxlZFwiLCBcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuXyRuZXh0QnRuLmF0dHIoXCJkaXNhYmxlZFwiLCBcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICAvKipcbiAgICAgICAgICogSW52b2NhZG8gYWwgZmluYWxpemFyc2UgZWwgY2FtYmlvIGRlIHDDoWdpbmEuIEFjdHVhbGl6YSBlbCBwYWdpbmFkb3IgeSBlbCBlc3RhZG8gZGUgbG9zIGJvdG9uZXMgZGUgbmF2ZWdhY2nDs25cbiAgICAgICAgICogQHBhcmFtIGVcbiAgICAgICAgICogQHBhcmFtIG5ld1BhZ2VcbiAgICAgICAgICogQHBhcmFtIG9sZFBhZ2VcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIEh6TmF2YmFyQ29tcG9uZW50LnByb3RvdHlwZS5fb25QYWdlQ2hhbmdlRW5kID0gZnVuY3Rpb24gKGUsIG5ld1BhZ2UsIG9sZFBhZ2UpIHtcbiAgICAgICAgICAgIHZhciBpbnN0YW5jZSA9IGUuZGF0YS5pbnN0YW5jZTtcbiAgICAgICAgICAgIGluc3RhbmNlLl91cGRhdGVQYWdlckJ1dHRvblN0YXRlKCk7XG4gICAgICAgICAgICBpbnN0YW5jZS5wcm9ncmVzcygoaW5zdGFuY2UuX05hdmlnYXRvci5nZXRWaXNpdGVkUGFnZXMoKS5sZW5ndGggKiAxMDApIC8gaW5zdGFuY2UuX251bVBhZ2VzKTtcbiAgICAgICAgICAgIHZhciBwYWdlSW1wbGVtZW50YXRpb24gPSBpbnN0YW5jZS5fTmF2aWdhdG9yLmdldEN1cnJlbnRQYWdlKCksIHBhZ2UgPSBwYWdlSW1wbGVtZW50YXRpb24uZ2V0UGFnZSgpO1xuICAgICAgICAgICAgcGFnZS5vZmYoXCIuXCIgKyBIek5hdmJhckNvbXBvbmVudF8xLk5BTUVTUEFDRSkub24oY29yZV8xLlBhZ2VDb250cm9sbGVyLk9OX0NPTVBMRVRFX0NIQU5HRSArIFwiLlwiICsgSHpOYXZiYXJDb21wb25lbnRfMS5OQU1FU1BBQ0UsIHsgaW5zdGFuY2U6IGluc3RhbmNlIH0sIGluc3RhbmNlLl9vblBhZ2VDb21wbGV0ZUNoYW5nZSk7XG4gICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbnZvY2FkbyBhbCBjb21wbGV0YXJzZSBsYSBww6FnaW5hLiBBY3R1YWxpemEgZWwgZXN0YWRvIGRlbCBib3TDs24gc2lndWllbnRlXG4gICAgICAgICAqIEBwYXJhbSBlXG4gICAgICAgICAqIEBwYXJhbSBjb21wbGV0ZWRcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIEh6TmF2YmFyQ29tcG9uZW50LnByb3RvdHlwZS5fb25QYWdlQ29tcGxldGVDaGFuZ2UgPSBmdW5jdGlvbiAoZSwgY29tcGxldGVkKSB7XG4gICAgICAgICAgICBpZiAoY29tcGxldGVkKSB7XG4gICAgICAgICAgICAgICAgdmFyIGluc3RhbmNlID0gZS5kYXRhLmluc3RhbmNlO1xuICAgICAgICAgICAgICAgIHZhciBwYWdlSW1wbGVtZW50YXRpb24gPSBpbnN0YW5jZS5fTmF2aWdhdG9yLmdldEN1cnJlbnRQYWdlKCksIHBhZ2UgPSBwYWdlSW1wbGVtZW50YXRpb24uZ2V0UGFnZSgpO1xuICAgICAgICAgICAgICAgIGlmIChpbnN0YW5jZS5fUGFnZU1hbmFnZXIuZ2V0UGFnZUluZGV4KHBhZ2UuZ2V0TmFtZSgpKSAhPT0gaW5zdGFuY2UuX1BhZ2VNYW5hZ2VyLmNvdW50KCkgLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYWdlSW1wbGVtZW50YXRpb24uZ2V0Q29udHJvbGxlcigpLmlzQ29tcGxldGVkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc3RhbmNlLl8kbmV4dEJ0bi5yZW1vdmVBdHRyKFwiZGlzYWJsZWRcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZS5fJG5leHRCdG4uYXR0cihcImRpc2FibGVkXCIsIFwiZGlzYWJsZWRcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBFc3RhYmxlY2UgZWwgdmFsb3IgYSBsYSBjYW50aWRhZCBkZSBww6FnaW5hcyB5IGFjdHVhbGl6YSBlbCB0ZXh0byBkZWwgZWxlbWVudG9cbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9ICB2YWx1ZSAgICAgICBDYW50aWRhZCBkZSBww6FnaW5hc1xuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgSHpOYXZiYXJDb21wb25lbnQucHJvdG90eXBlLl9zZXROdW1QYWdlcyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fbnVtUGFnZXMgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuXyRudW1QYWdlcy50ZXh0KHZhbHVlKTtcbiAgICAgICAgfTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEVzdGFibGVjZSBlbCB2YWxvciBkZSBsYSBww6FnaW5hIGFjdHVhbCB5IGFjdHVhbGl6YSBlbCB0ZXh0byBkZWwgZWxlbWVudG8uIFNlIGVzcGVyYSByZWNpYmlyIGVsIMOtbmRpY2UgZGUgbGEgcMOhZ2luYSBjb21lbnphbmRvIHBvciAwXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSAgdmFsdWUgICAgICAgw41uZGljZSBkZSBsYSBww6FnaW5hIGFjdHVhbFxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgSHpOYXZiYXJDb21wb25lbnQucHJvdG90eXBlLl9zZXRDdXJyZW50UGFnZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fY3VycmVudFBhZ2VJbmRleCA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5fJGN1cnJlbnRQYWdlSW5kZXgudGV4dCh2YWx1ZSArIDEpO1xuICAgICAgICB9O1xuICAgICAgICBIek5hdmJhckNvbXBvbmVudC5wcm90b3R5cGUuX29uRGlzYWJsZWQgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgdmFyIGluc3RhbmNlID0gZS5kYXRhLmluc3RhbmNlO1xuICAgICAgICAgICAgaW5zdGFuY2UuX3VwZGF0ZVBhZ2VyQnV0dG9uU3RhdGUoKTtcbiAgICAgICAgfTtcbiAgICAgICAgSHpOYXZiYXJDb21wb25lbnQucHJvdG90eXBlLl9vbkVuYWJsZWQgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgdmFyIGluc3RhbmNlID0gZS5kYXRhLmluc3RhbmNlO1xuICAgICAgICAgICAgaW5zdGFuY2UuX3VwZGF0ZVBhZ2VyQnV0dG9uU3RhdGUoKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIEh6TmF2YmFyQ29tcG9uZW50O1xuICAgIH0oY29yZV8xLkNvbXBvbmVudENvbnRyb2xsZXIpKTtcbiAgICBIek5hdmJhckNvbXBvbmVudC5OQU1FU1BBQ0UgPSBcImh6TmF2YmFyXCI7XG4gICAgSHpOYXZiYXJDb21wb25lbnQuUFJFRklYID0gXCJoei1uYXZiYXJcIjtcbiAgICBIek5hdmJhckNvbXBvbmVudC5QUkVGSVhfTElTVF9ESUFMT0dfT1BUSU9OUyA9IEh6TmF2YmFyQ29tcG9uZW50XzEuTkFNRVNQQUNFICsgXCJEaWFsb2dcIjtcbiAgICBIek5hdmJhckNvbXBvbmVudC5RVUVSWV9BQ1RJT05fTkVYVCA9IFwiW2RhdGEtXCIgKyBIek5hdmJhckNvbXBvbmVudF8xLlBSRUZJWCArIFwiLW5leHRdXCI7XG4gICAgSHpOYXZiYXJDb21wb25lbnQuUVVFUllfQUNUSU9OX1BSRVYgPSBcIltkYXRhLVwiICsgSHpOYXZiYXJDb21wb25lbnRfMS5QUkVGSVggKyBcIi1wcmV2XVwiO1xuICAgIEh6TmF2YmFyQ29tcG9uZW50LlFVRVJZX0JBUiA9IFwiW2RhdGEtXCIgKyBIek5hdmJhckNvbXBvbmVudF8xLlBSRUZJWCArIFwiLWJhcl1cIjtcbiAgICBIek5hdmJhckNvbXBvbmVudC5RVUVSWV9QUk9HUkVTUyA9IFwiW2RhdGEtXCIgKyBIek5hdmJhckNvbXBvbmVudF8xLlBSRUZJWCArIFwiLXByb2dyZXNzXVwiO1xuICAgIEh6TmF2YmFyQ29tcG9uZW50LlFVRVJZX0FDVElPTl9IT01FID0gXCJbZGF0YS1cIiArIEh6TmF2YmFyQ29tcG9uZW50XzEuUFJFRklYICsgXCItaG9tZV1cIjtcbiAgICBIek5hdmJhckNvbXBvbmVudC5RVUVSWV9BQ1RJT05fSU5ERVggPSBcIltkYXRhLVwiICsgSHpOYXZiYXJDb21wb25lbnRfMS5QUkVGSVggKyBcIi1pbmRleF1cIjtcbiAgICBIek5hdmJhckNvbXBvbmVudC5RVUVSWV9QQUdFX0NVUlJFTlQgPSBcIltkYXRhLVwiICsgSHpOYXZiYXJDb21wb25lbnRfMS5QUkVGSVggKyBcIi1jdXJyZW50XVwiO1xuICAgIEh6TmF2YmFyQ29tcG9uZW50LlFVRVJZX1BBR0VfVE9UQUwgPSBcIltkYXRhLVwiICsgSHpOYXZiYXJDb21wb25lbnRfMS5QUkVGSVggKyBcIi10b3RhbF1cIjtcbiAgICBIek5hdmJhckNvbXBvbmVudC5RVUVSWV9JTkRFWF9MSVNUID0gXCJbZGF0YS1cIiArIEh6TmF2YmFyQ29tcG9uZW50XzEuUFJFRklYICsgXCItaW5kZXgtbGlzdF1cIjtcbiAgICBIek5hdmJhckNvbXBvbmVudC5RVUVSWV9JTkRFWF9MSVNUX0lURU0gPSBcIltkYXRhLVwiICsgSHpOYXZiYXJDb21wb25lbnRfMS5QUkVGSVggKyBcIi1pbmRleC1saXN0LWl0ZW1dXCI7XG4gICAgSHpOYXZiYXJDb21wb25lbnQuUVVFUllfSU5ERVhfTElTVF9JVEVNX0NPTlRFTlQgPSBcIltkYXRhLVwiICsgSHpOYXZiYXJDb21wb25lbnRfMS5QUkVGSVggKyBcIi1pbmRleC1saXN0LWl0ZW0tY29udGVudF1cIjtcbiAgICBIek5hdmJhckNvbXBvbmVudC5DTEFTU19QQUdFX1ZJU0lURUQgPSBcImh6LW5hdmJhcl9fcGFnZS0tdmlzaXRlZFwiO1xuICAgIEh6TmF2YmFyQ29tcG9uZW50LkNMQVNTX1BBR0VfQ09NUExFVEVEID0gXCJoei1uYXZiYXJfX3BhZ2UtLWNvbXBsZXRlZFwiO1xuICAgIEh6TmF2YmFyQ29tcG9uZW50LkNMQVNTX0xJU1RfSU5ERVhfRElBTE9HID0gXCJoei1uYXZiYXJfX2luZGV4LWxpc3QtZGlhbG9nXCI7XG4gICAgSHpOYXZiYXJDb21wb25lbnQuREFUQV9QQUdFID0gXCJoek5hdmJhclBhZ2VcIjtcbiAgICBIek5hdmJhckNvbXBvbmVudC5PUFRfRElBTE9HX0RFRkFVTFRTID0ge1xuICAgICAgICBhdXRvT3BlbjogZmFsc2VcbiAgICB9O1xuICAgIEh6TmF2YmFyQ29tcG9uZW50Ll9ERUZBVUxUUyA9IHtcbiAgICAgICAgbG9jYWxlOiB7XG4gICAgICAgICAgICBcImVzXCI6IHtcbiAgICAgICAgICAgICAgICBuZXh0OiBcIlNpZ3VpZW50ZVwiLFxuICAgICAgICAgICAgICAgIHByZXY6IFwiQW50ZXJpb3JcIixcbiAgICAgICAgICAgICAgICBjdXJyZW50UGFnZTogXCJQw6FnaW5hIGFjdHVhbFwiLFxuICAgICAgICAgICAgICAgIHRvdGFsUGFnZXM6IFwiUMOhZ2luYXMgdG90YWxlc1wiLFxuICAgICAgICAgICAgICAgIGhvbWU6IFwiSXIgYWwgaW5pY2lvXCIsXG4gICAgICAgICAgICAgICAgc2hvd0luZGV4OiBcIk1vc3RyYXIgw61uZGljZVwiLFxuICAgICAgICAgICAgICAgIGluZGV4OiBcIsONbmRpY2VcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBkZWZhdWx0TGFuZzogXCJlc1wiXG4gICAgfTtcbiAgICBIek5hdmJhckNvbXBvbmVudCA9IEh6TmF2YmFyQ29tcG9uZW50XzEgPSBfX2RlY29yYXRlKFtcbiAgICAgICAgY29yZV8xLkNvbXBvbmVudCh7XG4gICAgICAgICAgICBuYW1lOiBcIkh6TmF2YmFyXCIsXG4gICAgICAgICAgICBkZXBlbmRlbmNpZXM6IFtcbiAgICAgICAgICAgICAgICBjb3JlXzEuJCxcbiAgICAgICAgICAgICAgICBjb3JlXzEuRXZlbnRFbWl0dGVyRmFjdG9yeSxcbiAgICAgICAgICAgICAgICBjb3JlXzEuTmF2aWdhdG9yLFxuICAgICAgICAgICAgICAgIGNvcmVfMS5QYWdlTWFuYWdlcixcbiAgICAgICAgICAgICAgICBjb3JlXzEuRGF0YU9wdGlvbnNcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSlcbiAgICBdLCBIek5hdmJhckNvbXBvbmVudCk7XG4gICAgZXhwb3J0cy5Iek5hdmJhckNvbXBvbmVudCA9IEh6TmF2YmFyQ29tcG9uZW50O1xuICAgIHZhciBIek5hdmJhckNvbXBvbmVudF8xO1xufSk7XG4iXSwiZmlsZSI6Ikh6TmF2YmFyLmpzIn0=
