"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
var core_1 = require("@haztivity/core");
require("jquery-ui-dist/jquery-ui.js");
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
//# sourceMappingURL=HzNavbarComponent.js.map