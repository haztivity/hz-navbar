"use strict";
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
/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
var core_1 = require("@haztivity/core");
require("jquery-ui-dist/jquery-ui");
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJIek5hdmJhckNvbXBvbmVudC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG59O1xudmFyIF9fZGVjb3JhdGUgPSAodGhpcyAmJiB0aGlzLl9fZGVjb3JhdGUpIHx8IGZ1bmN0aW9uIChkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XG59O1xuLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IERhdmluY2hpLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICovXG52YXIgY29yZV8xID0gcmVxdWlyZShcIkBoYXp0aXZpdHkvY29yZVwiKTtcbnJlcXVpcmUoXCJqcXVlcnktdWktZGlzdC9qcXVlcnktdWlcIik7XG52YXIgSHpOYXZiYXJDb21wb25lbnQgPSBIek5hdmJhckNvbXBvbmVudF8xID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoSHpOYXZiYXJDb21wb25lbnQsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gSHpOYXZiYXJDb21wb25lbnQoXyQsIF9FdmVudEVtaXR0ZXJGYWN0b3J5LCBfTmF2aWdhdG9yLCBfUGFnZU1hbmFnZXIsIF9EYXRhT3B0aW9ucykge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBfJCwgX0V2ZW50RW1pdHRlckZhY3RvcnkpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLl9OYXZpZ2F0b3IgPSBfTmF2aWdhdG9yO1xuICAgICAgICBfdGhpcy5fUGFnZU1hbmFnZXIgPSBfUGFnZU1hbmFnZXI7XG4gICAgICAgIF90aGlzLl9EYXRhT3B0aW9ucyA9IF9EYXRhT3B0aW9ucztcbiAgICAgICAgX3RoaXMuX2N1cnJlbnRQYWdlSW5kZXggPSAwO1xuICAgICAgICBfdGhpcy5fbnVtUGFnZXMgPSAwO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIEh6TmF2YmFyQ29tcG9uZW50LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKG9wdGlvbnMsIGNvbmZpZykge1xuICAgICAgICB0aGlzLl9vcHRpb25zID0gY29yZV8xLiQuZXh0ZW5kKHRydWUsIHt9LCBIek5hdmJhckNvbXBvbmVudF8xLl9ERUZBVUxUUywgb3B0aW9ucyk7XG4gICAgICAgIHRoaXMuX2dldEVsZW1lbnRzKCk7XG4gICAgICAgIHRoaXMudXBkYXRlTG9jYWxlKCk7XG4gICAgICAgIHRoaXMucHJvZ3Jlc3MoMCk7XG4gICAgICAgIHRoaXMuX2Fzc2lnbkV2ZW50cygpO1xuICAgICAgICB0aGlzLnVwZGF0ZVBhZ2luYXRvcigpO1xuICAgIH07XG4gICAgSHpOYXZiYXJDb21wb25lbnQucHJvdG90eXBlLnVwZGF0ZVBhZ2luYXRvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG51bVBhZ2VzID0gdGhpcy5fUGFnZU1hbmFnZXIuY291bnQoKTtcbiAgICAgICAgdGhpcy5fc2V0TnVtUGFnZXMobnVtUGFnZXMpO1xuICAgICAgICB0aGlzLl9nZW5lcmF0ZUluZGV4KCk7XG4gICAgICAgIHZhciBjdXJyZW50UGFnZSA9IHRoaXMuX05hdmlnYXRvci5nZXRDdXJyZW50UGFnZUluZGV4KCkgfHwgMDtcbiAgICAgICAgdGhpcy5fc2V0Q3VycmVudFBhZ2UoY3VycmVudFBhZ2UpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogU2kgc2UgaW5kaWNhIHBhcsOhbWV0cm8gc2UgZXN0YWJsZWNlIGVsIHBvcmNlbnRhamUuIEVsIG7Dum1lcm8gZXMgcmVkb25kZWFkbyBhIDIgZGVjaW1hbGVzXG4gICAgICogU2kgbm8gc2UgaW5kaWNhIHBhcsOhbWV0cm8sIGRldnVlbHZlIGVsIHBvcmNlbnRhamUgYWN0dWFsXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9ICAgICAgW3ZhbHVlXSAgICAgICAgIFZhbG9yIGEgZXN0YWJsZWNlclxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgSHpOYXZiYXJDb21wb25lbnQucHJvdG90eXBlLnByb2dyZXNzID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgdmFsdWUgPSBwYXJzZUZsb2F0KHZhbHVlLnRvRml4ZWQoMikpO1xuICAgICAgICAgICAgaWYgKCFpc05hTih2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPj0gMCAmJiB2YWx1ZSA8PSAxMDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcHJvZ3Jlc3MgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlUHJvZ3Jlc3NWYWx1ZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Byb2dyZXNzO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBFc3RhYmxlY2UgdW4gaWRpb21hXG4gICAgICogQHBhcmFtIHtzdHJpbmd9ICBsYW5nICAgICAgICBJZGlvbWEuIFNpIG5vIHRpZW5lIHRyYWR1Y2Npb25lcyBlbiBvcHRpb25zLmxvY2FsZSBzZSB1dGlsaXphIGVsIGlkaW9tYSBwb3IgZGVmZWN0b1xuICAgICAqL1xuICAgIEh6TmF2YmFyQ29tcG9uZW50LnByb3RvdHlwZS5zZXRMYW5nID0gZnVuY3Rpb24gKGxhbmcpIHtcbiAgICAgICAgdGhpcy5fb3B0aW9ucy5sYW5nID0gbGFuZztcbiAgICAgICAgdGhpcy51cGRhdGVMb2NhbGUoKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEFjdHVhbGl6YSBsYXMgdHJhZHVjY2lvbmVzXG4gICAgICovXG4gICAgSHpOYXZiYXJDb21wb25lbnQucHJvdG90eXBlLnVwZGF0ZUxvY2FsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGxhbmcgPSB0aGlzLl9vcHRpb25zLmxhbmcsIGxvY2FsZSA9IHRoaXMuX29wdGlvbnMubG9jYWxlW2xhbmddIHx8IHRoaXMuX29wdGlvbnMubG9jYWxlW3RoaXMuX29wdGlvbnMuZGVmYXVsdExhbmddO1xuICAgICAgICBpZiAobG9jYWxlKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gbG9jYWxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlVGV4dChrZXksIGxvY2FsZVtrZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogRXN0YWJsZWNlIHVuIHRleHRvIGVuIHVubyBvIHZhcmlvcyBlbGVtZW50b3NcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gICAgICB0byAgICAgIFNlIGJ1c2NhbiBsb3MgZWxlbWVudG9zIHF1ZSBjb3JyZXNwb25kYW4gY29uIGVsIHNlbGVjdG9yIFtkYXRhLWh6LW5hdmJhci1jb250ZW50PXZhbG9yXVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSAgICAgIHRleHQgICAgVGV4dG8gYSBlc3RhYmxlY2VyXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBIek5hdmJhckNvbXBvbmVudC5wcm90b3R5cGUuX3VwZGF0ZVRleHQgPSBmdW5jdGlvbiAodG8sIHRleHQpIHtcbiAgICAgICAgaWYgKHRvKSB7XG4gICAgICAgICAgICB2YXIgJGVsZW1lbnQgPSB0aGlzLl8kZWxlbWVudC5maW5kKFwiW2RhdGEtaHotbmF2YmFyLWNvbnRlbnQ9XCIgKyB0byArIFwiXVwiKTtcbiAgICAgICAgICAgIGlmICgkZWxlbWVudC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgZWxlbWVudEluZGV4ID0gMCwgJGVsZW1lbnRMZW5ndGggPSAkZWxlbWVudC5sZW5ndGg7IGVsZW1lbnRJbmRleCA8ICRlbGVtZW50TGVuZ3RoOyBlbGVtZW50SW5kZXgrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgJGN1cnJlbnRFbGVtZW50ID0gY29yZV8xLiQoJGVsZW1lbnRbZWxlbWVudEluZGV4XSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJGN1cnJlbnRFbGVtZW50LmRhdGEoXCJoek5hdmJhckNvbnRlbnRUb1wiKSB8fCBcInRleHRcIjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGF0dHIgPT09IFwidGV4dFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkY3VycmVudEVsZW1lbnQudGV4dCh0ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRjdXJyZW50RWxlbWVudC5hdHRyKGF0dHIsIHRleHQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBIek5hdmJhckNvbXBvbmVudC5wcm90b3R5cGUuY2xvc2VJbmRleExpc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9pbmRleExpc3REaWFsb2cpIHtcbiAgICAgICAgICAgIHRoaXMuX2luZGV4TGlzdERpYWxvZy5jbG9zZSgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBIek5hdmJhckNvbXBvbmVudC5wcm90b3R5cGUuaW5kZXhMaXN0SXNPcGVuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcmVzdWx0O1xuICAgICAgICBpZiAodGhpcy5faW5kZXhMaXN0RGlhbG9nKSB7XG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLl9pbmRleExpc3REaWFsb2cuaXNPcGVuKCk7XG4gICAgICAgICAgICB0aGlzLl9pbmRleExpc3REaWFsb2cub3BlbigpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgICBIek5hdmJhckNvbXBvbmVudC5wcm90b3R5cGUub3BlbkluZGV4TGlzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2luZGV4TGlzdERpYWxvZykge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVJbmRleCgpO1xuICAgICAgICAgICAgdGhpcy5faW5kZXhMaXN0RGlhbG9nLm9wZW4oKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgSHpOYXZiYXJDb21wb25lbnQucHJvdG90eXBlLl9nZW5lcmF0ZUluZGV4ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5fJGluZGV4TGlzdCAmJiB0aGlzLl8kaW5kZXhMaXN0Lmxlbmd0aCA+IDAgJiYgdGhpcy5fJGluZGV4TGlzdEl0ZW1UZW1wbGF0ZSAmJiB0aGlzLl8kaW5kZXhMaXN0SXRlbVRlbXBsYXRlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuXyRpbmRleExpc3RJdGVtVGVtcGxhdGUuZGV0YWNoKCk7XG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IGNvcmVfMS4kLmV4dGVuZCh7fSwgSHpOYXZiYXJDb21wb25lbnRfMS5PUFRfRElBTE9HX0RFRkFVTFRTLCB0aGlzLl9EYXRhT3B0aW9ucy5nZXREYXRhT3B0aW9ucyh0aGlzLl8kaW5kZXhMaXN0LCBIek5hdmJhckNvbXBvbmVudF8xLlBSRUZJWF9MSVNUX0RJQUxPR19PUFRJT05TKSk7XG4gICAgICAgICAgICBvcHRpb25zLmRpYWxvZ0NsYXNzID0gSHpOYXZiYXJDb21wb25lbnRfMS5DTEFTU19MSVNUX0lOREVYX0RJQUxPRztcbiAgICAgICAgICAgIHRoaXMuXyRpbmRleExpc3QuZGlhbG9nKG9wdGlvbnMpO1xuICAgICAgICAgICAgdGhpcy5faW5kZXhMaXN0RGlhbG9nID0gdGhpcy5fJGluZGV4TGlzdC5kYXRhKFwidWktZGlhbG9nXCIpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBIek5hdmJhckNvbXBvbmVudC5wcm90b3R5cGUudXBkYXRlSW5kZXggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLl8kaW5kZXhMaXN0ICYmIHRoaXMuXyRpbmRleExpc3QubGVuZ3RoID4gMCAmJiB0aGlzLl8kaW5kZXhMaXN0SXRlbVRlbXBsYXRlICYmIHRoaXMuXyRpbmRleExpc3RJdGVtVGVtcGxhdGUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5fJGluZGV4TGlzdC5lbXB0eSgpO1xuICAgICAgICAgICAgdmFyIHBhZ2VzID0gW107XG4gICAgICAgICAgICB2YXIgbnVtUGFnZXMgPSB0aGlzLl9QYWdlTWFuYWdlci5jb3VudCgpLCBwcmV2aW91c1N0YXRlID0gdm9pZCAwO1xuICAgICAgICAgICAgZm9yICh2YXIgbnVtUGFnZUluZGV4ID0gMDsgbnVtUGFnZUluZGV4IDwgbnVtUGFnZXM7IG51bVBhZ2VJbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRQYWdlID0gdGhpcy5fUGFnZU1hbmFnZXIuZ2V0UGFnZShudW1QYWdlSW5kZXgpLCBwYWdlUmVnaXN0ZXIgPSBjdXJyZW50UGFnZS5nZXRQYWdlKCk7XG4gICAgICAgICAgICAgICAgdmFyICRwYWdlID0gdGhpcy5fJGluZGV4TGlzdEl0ZW1UZW1wbGF0ZS5jbG9uZSgpO1xuICAgICAgICAgICAgICAgICRwYWdlLmZpbmQoSHpOYXZiYXJDb21wb25lbnRfMS5RVUVSWV9JTkRFWF9MSVNUX0lURU1fQ09OVEVOVCkuaHRtbChwYWdlUmVnaXN0ZXIuX29wdGlvbnMudGl0bGUpO1xuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50UGFnZS5fc3RhdGUuY29tcGxldGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICRwYWdlLmFkZENsYXNzKEh6TmF2YmFyQ29tcG9uZW50XzEuQ0xBU1NfUEFHRV9DT01QTEVURUQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChjdXJyZW50UGFnZS5fc3RhdGUudmlzaXRlZCkge1xuICAgICAgICAgICAgICAgICAgICAkcGFnZS5hZGRDbGFzcyhIek5hdmJhckNvbXBvbmVudF8xLkNMQVNTX1BBR0VfVklTSVRFRCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChwcmV2aW91c1N0YXRlID09IHVuZGVmaW5lZCB8fCBwcmV2aW91c1N0YXRlLmNvbXBsZXRlZCkge1xuICAgICAgICAgICAgICAgICAgICAkcGFnZS5kYXRhKEh6TmF2YmFyQ29tcG9uZW50XzEuREFUQV9QQUdFLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBwYWdlUmVnaXN0ZXIuZ2V0TmFtZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXg6IG51bVBhZ2VJbmRleFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcHJldmlvdXNTdGF0ZSA9IGN1cnJlbnRQYWdlLl9zdGF0ZTtcbiAgICAgICAgICAgICAgICBwYWdlcy5wdXNoKCRwYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuXyRpbmRleExpc3QuYXBwZW5kKHBhZ2VzKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogT2J0aWVuZSBsb3MgZWxlbWVudG9zIGRlbCBET00gYSB1dGlsaXphclxuICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgKi9cbiAgICBIek5hdmJhckNvbXBvbmVudC5wcm90b3R5cGUuX2dldEVsZW1lbnRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl8kbmV4dEJ0biA9IHRoaXMuXyRlbGVtZW50LmZpbmQoSHpOYXZiYXJDb21wb25lbnRfMS5RVUVSWV9BQ1RJT05fTkVYVCk7XG4gICAgICAgIHRoaXMuXyRwcmV2QnRuID0gdGhpcy5fJGVsZW1lbnQuZmluZChIek5hdmJhckNvbXBvbmVudF8xLlFVRVJZX0FDVElPTl9QUkVWKTtcbiAgICAgICAgdGhpcy5fJGJhciA9IHRoaXMuXyRlbGVtZW50LmZpbmQoSHpOYXZiYXJDb21wb25lbnRfMS5RVUVSWV9CQVIpO1xuICAgICAgICB0aGlzLl8kcHJvZ3Jlc3MgPSB0aGlzLl8kZWxlbWVudC5maW5kKEh6TmF2YmFyQ29tcG9uZW50XzEuUVVFUllfUFJPR1JFU1MpO1xuICAgICAgICB0aGlzLl8kaG9tZUJ0biA9IHRoaXMuXyRlbGVtZW50LmZpbmQoSHpOYXZiYXJDb21wb25lbnRfMS5RVUVSWV9BQ1RJT05fSE9NRSk7XG4gICAgICAgIHRoaXMuXyRpbmRleEJ0biA9IHRoaXMuXyRlbGVtZW50LmZpbmQoSHpOYXZiYXJDb21wb25lbnRfMS5RVUVSWV9BQ1RJT05fSU5ERVgpO1xuICAgICAgICB0aGlzLl8kY3VycmVudFBhZ2VJbmRleCA9IHRoaXMuXyRlbGVtZW50LmZpbmQoSHpOYXZiYXJDb21wb25lbnRfMS5RVUVSWV9QQUdFX0NVUlJFTlQpO1xuICAgICAgICB0aGlzLl8kbnVtUGFnZXMgPSB0aGlzLl8kZWxlbWVudC5maW5kKEh6TmF2YmFyQ29tcG9uZW50XzEuUVVFUllfUEFHRV9UT1RBTCk7XG4gICAgICAgIHRoaXMuXyRpbmRleExpc3QgPSB0aGlzLl8kZWxlbWVudC5maW5kKEh6TmF2YmFyQ29tcG9uZW50XzEuUVVFUllfSU5ERVhfTElTVCk7XG4gICAgICAgIHRoaXMuXyRpbmRleExpc3RJdGVtVGVtcGxhdGUgPSB0aGlzLl8kaW5kZXhMaXN0LmZpbmQoSHpOYXZiYXJDb21wb25lbnRfMS5RVUVSWV9JTkRFWF9MSVNUX0lURU0pO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQXNpZ25hIGxvcyBoYW5kbGVycyBhIGV2ZW50b3NcbiAgICAgKiBAcHJvdGVjdGVkXG4gICAgICovXG4gICAgSHpOYXZiYXJDb21wb25lbnQucHJvdG90eXBlLl9hc3NpZ25FdmVudHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuXyRuZXh0QnRuLm9uKFwiY2xpY2suXCIgKyBIek5hdmJhckNvbXBvbmVudF8xLk5BTUVTUEFDRSwgeyBpbnN0YW5jZTogdGhpcyB9LCB0aGlzLl9vbk5leHRDbGljayk7XG4gICAgICAgIHRoaXMuXyRwcmV2QnRuLm9uKFwiY2xpY2suXCIgKyBIek5hdmJhckNvbXBvbmVudF8xLk5BTUVTUEFDRSwgeyBpbnN0YW5jZTogdGhpcyB9LCB0aGlzLl9vblByZXZDbGljayk7XG4gICAgICAgIHRoaXMuXyRob21lQnRuLm9uKFwiY2xpY2suXCIgKyBIek5hdmJhckNvbXBvbmVudF8xLk5BTUVTUEFDRSwgeyBpbnN0YW5jZTogdGhpcyB9LCB0aGlzLl9vbkhvbWVDbGljayk7XG4gICAgICAgIHRoaXMuXyRpbmRleEJ0bi5vbihcImNsaWNrLlwiICsgSHpOYXZiYXJDb21wb25lbnRfMS5OQU1FU1BBQ0UsIHsgaW5zdGFuY2U6IHRoaXMgfSwgdGhpcy5fb25JbmRleENsaWNrKTtcbiAgICAgICAgdGhpcy5fJGluZGV4TGlzdC5vbihcImNsaWNrLlwiICsgSHpOYXZiYXJDb21wb25lbnRfMS5OQU1FU1BBQ0UsIEh6TmF2YmFyQ29tcG9uZW50XzEuUVVFUllfSU5ERVhfTElTVF9JVEVNLCB7IGluc3RhbmNlOiB0aGlzIH0sIHRoaXMuX29uSW5kZXhMaXN0SXRlbUNsaWNrKTtcbiAgICAgICAgdGhpcy5fTmF2aWdhdG9yLm9uKGNvcmVfMS5OYXZpZ2F0b3IuT05fRElTQUJMRSwgeyBpbnN0YW5jZTogdGhpcyB9LCB0aGlzLl9vbkRpc2FibGVkKTtcbiAgICAgICAgdGhpcy5fTmF2aWdhdG9yLm9uKGNvcmVfMS5OYXZpZ2F0b3IuT05fRU5BQkxFLCB7IGluc3RhbmNlOiB0aGlzIH0sIHRoaXMuX29uRW5hYmxlZCk7XG4gICAgICAgIHRoaXMuX05hdmlnYXRvci5vbihjb3JlXzEuTmF2aWdhdG9yLk9OX0NIQU5HRV9QQUdFX1NUQVJULCB7IGluc3RhbmNlOiB0aGlzIH0sIHRoaXMuX29uUGFnZUNoYW5nZVN0YXJ0KTtcbiAgICAgICAgdGhpcy5fTmF2aWdhdG9yLm9uKGNvcmVfMS5OYXZpZ2F0b3IuT05fQ0hBTkdFX1BBR0VfRU5ELCB7IGluc3RhbmNlOiB0aGlzIH0sIHRoaXMuX29uUGFnZUNoYW5nZUVuZCk7XG4gICAgfTtcbiAgICBIek5hdmJhckNvbXBvbmVudC5wcm90b3R5cGUuX29uSW5kZXhMaXN0SXRlbUNsaWNrID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB2YXIgaW5zdGFuY2UgPSBlLmRhdGEuaW5zdGFuY2UsICRpdGVtID0gY29yZV8xLiQodGhpcyksIHBhZ2UgPSAkaXRlbS5kYXRhKEh6TmF2YmFyQ29tcG9uZW50XzEuREFUQV9QQUdFKTtcbiAgICAgICAgaWYgKHBhZ2UpIHtcbiAgICAgICAgICAgIGluc3RhbmNlLmNsb3NlSW5kZXhMaXN0KCk7XG4gICAgICAgICAgICBpbnN0YW5jZS5fTmF2aWdhdG9yLmdvVG8ocGFnZS5pbmRleCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEludm9jYWRvIGFsIGhhY2Vyc2UgY2xpY2sgZW4gZWwgYm90w7NuIHNpZ3VpZW50ZS4gSW52b2NhIGEgX05hdmlnYXRvciNuZXh0XG4gICAgICogQHBhcmFtIGVcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIEh6TmF2YmFyQ29tcG9uZW50LnByb3RvdHlwZS5fb25OZXh0Q2xpY2sgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgaW5zdGFuY2UgPSBlLmRhdGEuaW5zdGFuY2U7XG4gICAgICAgIGluc3RhbmNlLl9OYXZpZ2F0b3IubmV4dCgpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogSW52b2NhZG8gYWwgaGFjZXJzZSBjbGljayBlbiBlbCBib3TDs24gYW50ZXJpb3IuIEludm9jYSBhIF9OYXZpZ2F0b3IjcHJldlxuICAgICAqIEBwYXJhbSBlXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBIek5hdmJhckNvbXBvbmVudC5wcm90b3R5cGUuX29uUHJldkNsaWNrID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIGluc3RhbmNlID0gZS5kYXRhLmluc3RhbmNlO1xuICAgICAgICBpbnN0YW5jZS5fTmF2aWdhdG9yLnByZXYoKTtcbiAgICB9O1xuICAgIEh6TmF2YmFyQ29tcG9uZW50LnByb3RvdHlwZS5fb25Ib21lQ2xpY2sgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgaW5zdGFuY2UgPSBlLmRhdGEuaW5zdGFuY2U7XG4gICAgfTtcbiAgICBIek5hdmJhckNvbXBvbmVudC5wcm90b3R5cGUuX29uSW5kZXhDbGljayA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciBpbnN0YW5jZSA9IGUuZGF0YS5pbnN0YW5jZTtcbiAgICAgICAgaWYgKGluc3RhbmNlLmluZGV4TGlzdElzT3BlbigpKSB7XG4gICAgICAgICAgICBpbnN0YW5jZS5jbG9zZUluZGV4TGlzdCgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaW5zdGFuY2Uub3BlbkluZGV4TGlzdCgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBBcGxpY2EgZWwgY2FtYmlvIGRlIGVzdGlsb3MgYSBsYSBiYXJyYSBkZSBwcm9ncmVzbyB5IGFjdHVhbGl6YSBlbCB0ZXh0byBkZSBwcm9ncmVzb1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSAgICAgIHZhbHVlICAgICAgIFZhbG9yYSBlc3RhYmxlY2VyXG4gICAgICogQHByb3RlY3RlZFxuICAgICAqL1xuICAgIEh6TmF2YmFyQ29tcG9uZW50LnByb3RvdHlwZS5fdXBkYXRlUHJvZ3Jlc3NWYWx1ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICB0aGlzLl8kcHJvZ3Jlc3MudGV4dCh2YWx1ZSArIFwiJVwiKTtcbiAgICAgICAgdGhpcy5fJGJhci5jc3MoXCJ0cmFuc2Zvcm1cIiwgXCJzY2FsZVgoXCIgKyB2YWx1ZSAvIDEwMCArIFwiKVwiKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEludm9jYWRvIGFsIGNvbWVuemFyIGVsIGNhbWJpbyBkZSBww6FnaW5hLiBEZXNoYWJpbGl0YSBsYSBuYXZlZ2FjacOzbiBkdXJhbnRlIGVsIHByb2Nlc29cbiAgICAgKiBAcGFyYW0gZVxuICAgICAqIEBwYXJhbSBuZXdQYWdlXG4gICAgICogQHBhcmFtIG9sZFBhZ2VcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIEh6TmF2YmFyQ29tcG9uZW50LnByb3RvdHlwZS5fb25QYWdlQ2hhbmdlU3RhcnQgPSBmdW5jdGlvbiAoZSwgbmV3UGFnZSwgb2xkUGFnZSkge1xuICAgICAgICBpZiAoIWUuaXNEZWZhdWx0UHJldmVudGVkKCkpIHtcbiAgICAgICAgICAgIHZhciBpbnN0YW5jZSA9IGUuZGF0YS5pbnN0YW5jZTtcbiAgICAgICAgICAgIGlmIChvbGRQYWdlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhZ2VJbXBsZW1lbnRhdGlvbiA9IGluc3RhbmNlLl9QYWdlTWFuYWdlci5nZXRQYWdlKG9sZFBhZ2UuaW5kZXgpLCBwYWdlID0gcGFnZUltcGxlbWVudGF0aW9uLmdldFBhZ2UoKTtcbiAgICAgICAgICAgICAgICBwYWdlLm9mZihcIi5cIiArIEh6TmF2YmFyQ29tcG9uZW50XzEuTkFNRVNQQUNFKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGluc3RhbmNlLl9zZXRDdXJyZW50UGFnZShuZXdQYWdlLmluZGV4KTtcbiAgICAgICAgICAgIGluc3RhbmNlLl8kcHJldkJ0bi5hdHRyKFwiZGlzYWJsZWRcIiwgXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgIGluc3RhbmNlLl8kbmV4dEJ0bi5hdHRyKFwiZGlzYWJsZWRcIiwgXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogRXN0YWJsZWNlIGxvcyBlc3RhZG9zIGRlIGxvcyBib3RvbmVzIGRlIG5hdmVnYWNpw7NuIGVuIGJhc2UgYSBsb3MgZGF0b3MgZGUgTmF2aWdhdG9yXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBIek5hdmJhckNvbXBvbmVudC5wcm90b3R5cGUuX3VwZGF0ZVBhZ2VyQnV0dG9uU3RhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5fTmF2aWdhdG9yLmlzRGlzYWJsZWQoKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnRQYWdlSW5kZXggPT09IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLl8kcHJldkJ0bi5hdHRyKFwiZGlzYWJsZWRcIiwgXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLl8kbmV4dEJ0bi5yZW1vdmVBdHRyKFwiZGlzYWJsZWRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLl9jdXJyZW50UGFnZUluZGV4ID09PSB0aGlzLl9udW1QYWdlcyAtIDEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl8kbmV4dEJ0bi5hdHRyKFwiZGlzYWJsZWRcIiwgXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLl8kcHJldkJ0bi5yZW1vdmVBdHRyKFwiZGlzYWJsZWRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl8kbmV4dEJ0bi5yZW1vdmVBdHRyKFwiZGlzYWJsZWRcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5fJHByZXZCdG4ucmVtb3ZlQXR0cihcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCF0aGlzLl8kbmV4dEJ0bi5wcm9wKFwiZGlzYWJsZWRcIikpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fTmF2aWdhdG9yLmdldEN1cnJlbnRQYWdlKCkuZ2V0Q29udHJvbGxlcigpLmlzQ29tcGxldGVkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fJG5leHRCdG4ucmVtb3ZlQXR0cihcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fJG5leHRCdG4uYXR0cihcImRpc2FibGVkXCIsIFwiZGlzYWJsZWRcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fJHByZXZCdG4uYXR0cihcImRpc2FibGVkXCIsIFwiZGlzYWJsZWRcIik7XG4gICAgICAgICAgICB0aGlzLl8kbmV4dEJ0bi5hdHRyKFwiZGlzYWJsZWRcIiwgXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogSW52b2NhZG8gYWwgZmluYWxpemFyc2UgZWwgY2FtYmlvIGRlIHDDoWdpbmEuIEFjdHVhbGl6YSBlbCBwYWdpbmFkb3IgeSBlbCBlc3RhZG8gZGUgbG9zIGJvdG9uZXMgZGUgbmF2ZWdhY2nDs25cbiAgICAgKiBAcGFyYW0gZVxuICAgICAqIEBwYXJhbSBuZXdQYWdlXG4gICAgICogQHBhcmFtIG9sZFBhZ2VcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIEh6TmF2YmFyQ29tcG9uZW50LnByb3RvdHlwZS5fb25QYWdlQ2hhbmdlRW5kID0gZnVuY3Rpb24gKGUsIG5ld1BhZ2UsIG9sZFBhZ2UpIHtcbiAgICAgICAgdmFyIGluc3RhbmNlID0gZS5kYXRhLmluc3RhbmNlO1xuICAgICAgICBpbnN0YW5jZS5fdXBkYXRlUGFnZXJCdXR0b25TdGF0ZSgpO1xuICAgICAgICBpbnN0YW5jZS5wcm9ncmVzcygoaW5zdGFuY2UuX05hdmlnYXRvci5nZXRWaXNpdGVkUGFnZXMoKS5sZW5ndGggKiAxMDApIC8gaW5zdGFuY2UuX251bVBhZ2VzKTtcbiAgICAgICAgdmFyIHBhZ2VJbXBsZW1lbnRhdGlvbiA9IGluc3RhbmNlLl9OYXZpZ2F0b3IuZ2V0Q3VycmVudFBhZ2UoKSwgcGFnZSA9IHBhZ2VJbXBsZW1lbnRhdGlvbi5nZXRQYWdlKCk7XG4gICAgICAgIHBhZ2Uub2ZmKFwiLlwiICsgSHpOYXZiYXJDb21wb25lbnRfMS5OQU1FU1BBQ0UpLm9uKGNvcmVfMS5QYWdlQ29udHJvbGxlci5PTl9DT01QTEVURV9DSEFOR0UgKyBcIi5cIiArIEh6TmF2YmFyQ29tcG9uZW50XzEuTkFNRVNQQUNFLCB7IGluc3RhbmNlOiBpbnN0YW5jZSB9LCBpbnN0YW5jZS5fb25QYWdlQ29tcGxldGVDaGFuZ2UpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogSW52b2NhZG8gYWwgY29tcGxldGFyc2UgbGEgcMOhZ2luYS4gQWN0dWFsaXphIGVsIGVzdGFkbyBkZWwgYm90w7NuIHNpZ3VpZW50ZVxuICAgICAqIEBwYXJhbSBlXG4gICAgICogQHBhcmFtIGNvbXBsZXRlZFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgSHpOYXZiYXJDb21wb25lbnQucHJvdG90eXBlLl9vblBhZ2VDb21wbGV0ZUNoYW5nZSA9IGZ1bmN0aW9uIChlLCBjb21wbGV0ZWQpIHtcbiAgICAgICAgaWYgKGNvbXBsZXRlZCkge1xuICAgICAgICAgICAgdmFyIGluc3RhbmNlID0gZS5kYXRhLmluc3RhbmNlO1xuICAgICAgICAgICAgdmFyIHBhZ2VJbXBsZW1lbnRhdGlvbiA9IGluc3RhbmNlLl9OYXZpZ2F0b3IuZ2V0Q3VycmVudFBhZ2UoKSwgcGFnZSA9IHBhZ2VJbXBsZW1lbnRhdGlvbi5nZXRQYWdlKCk7XG4gICAgICAgICAgICBpZiAoaW5zdGFuY2UuX1BhZ2VNYW5hZ2VyLmdldFBhZ2VJbmRleChwYWdlLmdldE5hbWUoKSkgIT09IGluc3RhbmNlLl9QYWdlTWFuYWdlci5jb3VudCgpIC0gMSkge1xuICAgICAgICAgICAgICAgIGlmIChwYWdlSW1wbGVtZW50YXRpb24uZ2V0Q29udHJvbGxlcigpLmlzQ29tcGxldGVkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2UuXyRuZXh0QnRuLnJlbW92ZUF0dHIoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlLl8kbmV4dEJ0bi5hdHRyKFwiZGlzYWJsZWRcIiwgXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEVzdGFibGVjZSBlbCB2YWxvciBhIGxhIGNhbnRpZGFkIGRlIHDDoWdpbmFzIHkgYWN0dWFsaXphIGVsIHRleHRvIGRlbCBlbGVtZW50b1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSAgdmFsdWUgICAgICAgQ2FudGlkYWQgZGUgcMOhZ2luYXNcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIEh6TmF2YmFyQ29tcG9uZW50LnByb3RvdHlwZS5fc2V0TnVtUGFnZXMgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fbnVtUGFnZXMgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5fJG51bVBhZ2VzLnRleHQodmFsdWUpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogRXN0YWJsZWNlIGVsIHZhbG9yIGRlIGxhIHDDoWdpbmEgYWN0dWFsIHkgYWN0dWFsaXphIGVsIHRleHRvIGRlbCBlbGVtZW50by4gU2UgZXNwZXJhIHJlY2liaXIgZWwgw61uZGljZSBkZSBsYSBww6FnaW5hIGNvbWVuemFuZG8gcG9yIDBcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gIHZhbHVlICAgICAgIMONbmRpY2UgZGUgbGEgcMOhZ2luYSBhY3R1YWxcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIEh6TmF2YmFyQ29tcG9uZW50LnByb3RvdHlwZS5fc2V0Q3VycmVudFBhZ2UgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fY3VycmVudFBhZ2VJbmRleCA9IHZhbHVlO1xuICAgICAgICB0aGlzLl8kY3VycmVudFBhZ2VJbmRleC50ZXh0KHZhbHVlICsgMSk7XG4gICAgfTtcbiAgICBIek5hdmJhckNvbXBvbmVudC5wcm90b3R5cGUuX29uRGlzYWJsZWQgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgaW5zdGFuY2UgPSBlLmRhdGEuaW5zdGFuY2U7XG4gICAgICAgIGluc3RhbmNlLl91cGRhdGVQYWdlckJ1dHRvblN0YXRlKCk7XG4gICAgfTtcbiAgICBIek5hdmJhckNvbXBvbmVudC5wcm90b3R5cGUuX29uRW5hYmxlZCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciBpbnN0YW5jZSA9IGUuZGF0YS5pbnN0YW5jZTtcbiAgICAgICAgaW5zdGFuY2UuX3VwZGF0ZVBhZ2VyQnV0dG9uU3RhdGUoKTtcbiAgICB9O1xuICAgIHJldHVybiBIek5hdmJhckNvbXBvbmVudDtcbn0oY29yZV8xLkNvbXBvbmVudENvbnRyb2xsZXIpKTtcbkh6TmF2YmFyQ29tcG9uZW50Lk5BTUVTUEFDRSA9IFwiaHpOYXZiYXJcIjtcbkh6TmF2YmFyQ29tcG9uZW50LlBSRUZJWCA9IFwiaHotbmF2YmFyXCI7XG5Iek5hdmJhckNvbXBvbmVudC5QUkVGSVhfTElTVF9ESUFMT0dfT1BUSU9OUyA9IEh6TmF2YmFyQ29tcG9uZW50XzEuTkFNRVNQQUNFICsgXCJEaWFsb2dcIjtcbkh6TmF2YmFyQ29tcG9uZW50LlFVRVJZX0FDVElPTl9ORVhUID0gXCJbZGF0YS1cIiArIEh6TmF2YmFyQ29tcG9uZW50XzEuUFJFRklYICsgXCItbmV4dF1cIjtcbkh6TmF2YmFyQ29tcG9uZW50LlFVRVJZX0FDVElPTl9QUkVWID0gXCJbZGF0YS1cIiArIEh6TmF2YmFyQ29tcG9uZW50XzEuUFJFRklYICsgXCItcHJldl1cIjtcbkh6TmF2YmFyQ29tcG9uZW50LlFVRVJZX0JBUiA9IFwiW2RhdGEtXCIgKyBIek5hdmJhckNvbXBvbmVudF8xLlBSRUZJWCArIFwiLWJhcl1cIjtcbkh6TmF2YmFyQ29tcG9uZW50LlFVRVJZX1BST0dSRVNTID0gXCJbZGF0YS1cIiArIEh6TmF2YmFyQ29tcG9uZW50XzEuUFJFRklYICsgXCItcHJvZ3Jlc3NdXCI7XG5Iek5hdmJhckNvbXBvbmVudC5RVUVSWV9BQ1RJT05fSE9NRSA9IFwiW2RhdGEtXCIgKyBIek5hdmJhckNvbXBvbmVudF8xLlBSRUZJWCArIFwiLWhvbWVdXCI7XG5Iek5hdmJhckNvbXBvbmVudC5RVUVSWV9BQ1RJT05fSU5ERVggPSBcIltkYXRhLVwiICsgSHpOYXZiYXJDb21wb25lbnRfMS5QUkVGSVggKyBcIi1pbmRleF1cIjtcbkh6TmF2YmFyQ29tcG9uZW50LlFVRVJZX1BBR0VfQ1VSUkVOVCA9IFwiW2RhdGEtXCIgKyBIek5hdmJhckNvbXBvbmVudF8xLlBSRUZJWCArIFwiLWN1cnJlbnRdXCI7XG5Iek5hdmJhckNvbXBvbmVudC5RVUVSWV9QQUdFX1RPVEFMID0gXCJbZGF0YS1cIiArIEh6TmF2YmFyQ29tcG9uZW50XzEuUFJFRklYICsgXCItdG90YWxdXCI7XG5Iek5hdmJhckNvbXBvbmVudC5RVUVSWV9JTkRFWF9MSVNUID0gXCJbZGF0YS1cIiArIEh6TmF2YmFyQ29tcG9uZW50XzEuUFJFRklYICsgXCItaW5kZXgtbGlzdF1cIjtcbkh6TmF2YmFyQ29tcG9uZW50LlFVRVJZX0lOREVYX0xJU1RfSVRFTSA9IFwiW2RhdGEtXCIgKyBIek5hdmJhckNvbXBvbmVudF8xLlBSRUZJWCArIFwiLWluZGV4LWxpc3QtaXRlbV1cIjtcbkh6TmF2YmFyQ29tcG9uZW50LlFVRVJZX0lOREVYX0xJU1RfSVRFTV9DT05URU5UID0gXCJbZGF0YS1cIiArIEh6TmF2YmFyQ29tcG9uZW50XzEuUFJFRklYICsgXCItaW5kZXgtbGlzdC1pdGVtLWNvbnRlbnRdXCI7XG5Iek5hdmJhckNvbXBvbmVudC5DTEFTU19QQUdFX1ZJU0lURUQgPSBcImh6LW5hdmJhcl9fcGFnZS0tdmlzaXRlZFwiO1xuSHpOYXZiYXJDb21wb25lbnQuQ0xBU1NfUEFHRV9DT01QTEVURUQgPSBcImh6LW5hdmJhcl9fcGFnZS0tY29tcGxldGVkXCI7XG5Iek5hdmJhckNvbXBvbmVudC5DTEFTU19MSVNUX0lOREVYX0RJQUxPRyA9IFwiaHotbmF2YmFyX19pbmRleC1saXN0LWRpYWxvZ1wiO1xuSHpOYXZiYXJDb21wb25lbnQuREFUQV9QQUdFID0gXCJoek5hdmJhclBhZ2VcIjtcbkh6TmF2YmFyQ29tcG9uZW50Lk9QVF9ESUFMT0dfREVGQVVMVFMgPSB7XG4gICAgYXV0b09wZW46IGZhbHNlXG59O1xuSHpOYXZiYXJDb21wb25lbnQuX0RFRkFVTFRTID0ge1xuICAgIGxvY2FsZToge1xuICAgICAgICBcImVzXCI6IHtcbiAgICAgICAgICAgIG5leHQ6IFwiU2lndWllbnRlXCIsXG4gICAgICAgICAgICBwcmV2OiBcIkFudGVyaW9yXCIsXG4gICAgICAgICAgICBjdXJyZW50UGFnZTogXCJQw6FnaW5hIGFjdHVhbFwiLFxuICAgICAgICAgICAgdG90YWxQYWdlczogXCJQw6FnaW5hcyB0b3RhbGVzXCIsXG4gICAgICAgICAgICBob21lOiBcIklyIGFsIGluaWNpb1wiLFxuICAgICAgICAgICAgc2hvd0luZGV4OiBcIk1vc3RyYXIgw61uZGljZVwiLFxuICAgICAgICAgICAgaW5kZXg6IFwiw41uZGljZVwiXG4gICAgICAgIH1cbiAgICB9LFxuICAgIGRlZmF1bHRMYW5nOiBcImVzXCJcbn07XG5Iek5hdmJhckNvbXBvbmVudCA9IEh6TmF2YmFyQ29tcG9uZW50XzEgPSBfX2RlY29yYXRlKFtcbiAgICBjb3JlXzEuQ29tcG9uZW50KHtcbiAgICAgICAgbmFtZTogXCJIek5hdmJhclwiLFxuICAgICAgICBkZXBlbmRlbmNpZXM6IFtcbiAgICAgICAgICAgIGNvcmVfMS4kLFxuICAgICAgICAgICAgY29yZV8xLkV2ZW50RW1pdHRlckZhY3RvcnksXG4gICAgICAgICAgICBjb3JlXzEuTmF2aWdhdG9yLFxuICAgICAgICAgICAgY29yZV8xLlBhZ2VNYW5hZ2VyLFxuICAgICAgICAgICAgY29yZV8xLkRhdGFPcHRpb25zXG4gICAgICAgIF1cbiAgICB9KVxuXSwgSHpOYXZiYXJDb21wb25lbnQpO1xuZXhwb3J0cy5Iek5hdmJhckNvbXBvbmVudCA9IEh6TmF2YmFyQ29tcG9uZW50O1xudmFyIEh6TmF2YmFyQ29tcG9uZW50XzE7XG4iXSwiZmlsZSI6Ikh6TmF2YmFyQ29tcG9uZW50LmpzIn0=
