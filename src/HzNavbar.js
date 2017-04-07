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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJIek5hdmJhci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG59O1xudmFyIF9fZGVjb3JhdGUgPSAodGhpcyAmJiB0aGlzLl9fZGVjb3JhdGUpIHx8IGZ1bmN0aW9uIChkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XG59O1xuLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IERhdmluY2hpLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICovXG52YXIgY29yZV8xID0gcmVxdWlyZShcIkBoYXp0aXZpdHkvY29yZVwiKTtcbnZhciBkaWFsb2cgPSByZXF1aXJlKFwianF1ZXJ5LXVpL3VpL3dpZGdldHMvZGlhbG9nXCIpO1xuZGlhbG9nO1xudmFyIEh6TmF2YmFyQ29tcG9uZW50ID0gSHpOYXZiYXJDb21wb25lbnRfMSA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKEh6TmF2YmFyQ29tcG9uZW50LCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIEh6TmF2YmFyQ29tcG9uZW50KF8kLCBfRXZlbnRFbWl0dGVyRmFjdG9yeSwgX05hdmlnYXRvciwgX1BhZ2VNYW5hZ2VyLCBfRGF0YU9wdGlvbnMpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgXyQsIF9FdmVudEVtaXR0ZXJGYWN0b3J5KSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy5fTmF2aWdhdG9yID0gX05hdmlnYXRvcjtcbiAgICAgICAgX3RoaXMuX1BhZ2VNYW5hZ2VyID0gX1BhZ2VNYW5hZ2VyO1xuICAgICAgICBfdGhpcy5fRGF0YU9wdGlvbnMgPSBfRGF0YU9wdGlvbnM7XG4gICAgICAgIF90aGlzLl9jdXJyZW50UGFnZUluZGV4ID0gMDtcbiAgICAgICAgX3RoaXMuX251bVBhZ2VzID0gMDtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICBIek5hdmJhckNvbXBvbmVudC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uIChvcHRpb25zLCBjb25maWcpIHtcbiAgICAgICAgdGhpcy5fb3B0aW9ucyA9IGNvcmVfMS4kLmV4dGVuZCh0cnVlLCB7fSwgSHpOYXZiYXJDb21wb25lbnRfMS5fREVGQVVMVFMsIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLl9nZXRFbGVtZW50cygpO1xuICAgICAgICB0aGlzLnVwZGF0ZUxvY2FsZSgpO1xuICAgICAgICB0aGlzLnByb2dyZXNzKDApO1xuICAgICAgICB0aGlzLl9hc3NpZ25FdmVudHMoKTtcbiAgICAgICAgdGhpcy51cGRhdGVQYWdpbmF0b3IoKTtcbiAgICB9O1xuICAgIEh6TmF2YmFyQ29tcG9uZW50LnByb3RvdHlwZS51cGRhdGVQYWdpbmF0b3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBudW1QYWdlcyA9IHRoaXMuX1BhZ2VNYW5hZ2VyLmNvdW50KCk7XG4gICAgICAgIHRoaXMuX3NldE51bVBhZ2VzKG51bVBhZ2VzKTtcbiAgICAgICAgdGhpcy5fZ2VuZXJhdGVJbmRleCgpO1xuICAgICAgICB2YXIgY3VycmVudFBhZ2UgPSB0aGlzLl9OYXZpZ2F0b3IuZ2V0Q3VycmVudFBhZ2VJbmRleCgpIHx8IDA7XG4gICAgICAgIHRoaXMuX3NldEN1cnJlbnRQYWdlKGN1cnJlbnRQYWdlKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFNpIHNlIGluZGljYSBwYXLDoW1ldHJvIHNlIGVzdGFibGVjZSBlbCBwb3JjZW50YWplLiBFbCBuw7ptZXJvIGVzIHJlZG9uZGVhZG8gYSAyIGRlY2ltYWxlc1xuICAgICAqIFNpIG5vIHNlIGluZGljYSBwYXLDoW1ldHJvLCBkZXZ1ZWx2ZSBlbCBwb3JjZW50YWplIGFjdHVhbFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSAgICAgIFt2YWx1ZV0gICAgICAgICBWYWxvciBhIGVzdGFibGVjZXJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIEh6TmF2YmFyQ29tcG9uZW50LnByb3RvdHlwZS5wcm9ncmVzcyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgIHZhbHVlID0gcGFyc2VGbG9hdCh2YWx1ZS50b0ZpeGVkKDIpKTtcbiAgICAgICAgICAgIGlmICghaXNOYU4odmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlID49IDAgJiYgdmFsdWUgPD0gMTAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Byb2dyZXNzID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVByb2dyZXNzVmFsdWUodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wcm9ncmVzcztcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogRXN0YWJsZWNlIHVuIGlkaW9tYVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSAgbGFuZyAgICAgICAgSWRpb21hLiBTaSBubyB0aWVuZSB0cmFkdWNjaW9uZXMgZW4gb3B0aW9ucy5sb2NhbGUgc2UgdXRpbGl6YSBlbCBpZGlvbWEgcG9yIGRlZmVjdG9cbiAgICAgKi9cbiAgICBIek5hdmJhckNvbXBvbmVudC5wcm90b3R5cGUuc2V0TGFuZyA9IGZ1bmN0aW9uIChsYW5nKSB7XG4gICAgICAgIHRoaXMuX29wdGlvbnMubGFuZyA9IGxhbmc7XG4gICAgICAgIHRoaXMudXBkYXRlTG9jYWxlKCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBBY3R1YWxpemEgbGFzIHRyYWR1Y2Npb25lc1xuICAgICAqL1xuICAgIEh6TmF2YmFyQ29tcG9uZW50LnByb3RvdHlwZS51cGRhdGVMb2NhbGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBsYW5nID0gdGhpcy5fb3B0aW9ucy5sYW5nLCBsb2NhbGUgPSB0aGlzLl9vcHRpb25zLmxvY2FsZVtsYW5nXSB8fCB0aGlzLl9vcHRpb25zLmxvY2FsZVt0aGlzLl9vcHRpb25zLmRlZmF1bHRMYW5nXTtcbiAgICAgICAgaWYgKGxvY2FsZSkge1xuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGxvY2FsZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVRleHQoa2V5LCBsb2NhbGVba2V5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEVzdGFibGVjZSB1biB0ZXh0byBlbiB1bm8gbyB2YXJpb3MgZWxlbWVudG9zXG4gICAgICogQHBhcmFtIHtzdHJpbmd9ICAgICAgdG8gICAgICBTZSBidXNjYW4gbG9zIGVsZW1lbnRvcyBxdWUgY29ycmVzcG9uZGFuIGNvbiBlbCBzZWxlY3RvciBbZGF0YS1oei1uYXZiYXItY29udGVudD12YWxvcl1cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gICAgICB0ZXh0ICAgIFRleHRvIGEgZXN0YWJsZWNlclxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgSHpOYXZiYXJDb21wb25lbnQucHJvdG90eXBlLl91cGRhdGVUZXh0ID0gZnVuY3Rpb24gKHRvLCB0ZXh0KSB7XG4gICAgICAgIGlmICh0bykge1xuICAgICAgICAgICAgdmFyICRlbGVtZW50ID0gdGhpcy5fJGVsZW1lbnQuZmluZChcIltkYXRhLWh6LW5hdmJhci1jb250ZW50PVwiICsgdG8gKyBcIl1cIik7XG4gICAgICAgICAgICBpZiAoJGVsZW1lbnQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGVsZW1lbnRJbmRleCA9IDAsICRlbGVtZW50TGVuZ3RoID0gJGVsZW1lbnQubGVuZ3RoOyBlbGVtZW50SW5kZXggPCAkZWxlbWVudExlbmd0aDsgZWxlbWVudEluZGV4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyICRjdXJyZW50RWxlbWVudCA9IGNvcmVfMS4kKCRlbGVtZW50W2VsZW1lbnRJbmRleF0pO1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICRjdXJyZW50RWxlbWVudC5kYXRhKFwiaHpOYXZiYXJDb250ZW50VG9cIikgfHwgXCJ0ZXh0XCI7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhdHRyID09PSBcInRleHRcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGN1cnJlbnRFbGVtZW50LnRleHQodGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkY3VycmVudEVsZW1lbnQuYXR0cihhdHRyLCB0ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgSHpOYXZiYXJDb21wb25lbnQucHJvdG90eXBlLmNsb3NlSW5kZXhMaXN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5faW5kZXhMaXN0RGlhbG9nKSB7XG4gICAgICAgICAgICB0aGlzLl9pbmRleExpc3REaWFsb2cuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgSHpOYXZiYXJDb21wb25lbnQucHJvdG90eXBlLmluZGV4TGlzdElzT3BlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHJlc3VsdDtcbiAgICAgICAgaWYgKHRoaXMuX2luZGV4TGlzdERpYWxvZykge1xuICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5faW5kZXhMaXN0RGlhbG9nLmlzT3BlbigpO1xuICAgICAgICAgICAgdGhpcy5faW5kZXhMaXN0RGlhbG9nLm9wZW4oKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gICAgSHpOYXZiYXJDb21wb25lbnQucHJvdG90eXBlLm9wZW5JbmRleExpc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9pbmRleExpc3REaWFsb2cpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlSW5kZXgoKTtcbiAgICAgICAgICAgIHRoaXMuX2luZGV4TGlzdERpYWxvZy5vcGVuKCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEh6TmF2YmFyQ29tcG9uZW50LnByb3RvdHlwZS5fZ2VuZXJhdGVJbmRleCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuXyRpbmRleExpc3QgJiYgdGhpcy5fJGluZGV4TGlzdC5sZW5ndGggPiAwICYmIHRoaXMuXyRpbmRleExpc3RJdGVtVGVtcGxhdGUgJiYgdGhpcy5fJGluZGV4TGlzdEl0ZW1UZW1wbGF0ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLl8kaW5kZXhMaXN0SXRlbVRlbXBsYXRlLmRldGFjaCgpO1xuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSBjb3JlXzEuJC5leHRlbmQoe30sIEh6TmF2YmFyQ29tcG9uZW50XzEuT1BUX0RJQUxPR19ERUZBVUxUUywgdGhpcy5fRGF0YU9wdGlvbnMuZ2V0RGF0YU9wdGlvbnModGhpcy5fJGluZGV4TGlzdCwgSHpOYXZiYXJDb21wb25lbnRfMS5QUkVGSVhfTElTVF9ESUFMT0dfT1BUSU9OUykpO1xuICAgICAgICAgICAgb3B0aW9ucy5kaWFsb2dDbGFzcyA9IEh6TmF2YmFyQ29tcG9uZW50XzEuQ0xBU1NfTElTVF9JTkRFWF9ESUFMT0c7XG4gICAgICAgICAgICB0aGlzLl8kaW5kZXhMaXN0LmRpYWxvZyhvcHRpb25zKTtcbiAgICAgICAgICAgIHRoaXMuX2luZGV4TGlzdERpYWxvZyA9IHRoaXMuXyRpbmRleExpc3QuZGF0YShcInVpLWRpYWxvZ1wiKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgSHpOYXZiYXJDb21wb25lbnQucHJvdG90eXBlLnVwZGF0ZUluZGV4ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5fJGluZGV4TGlzdCAmJiB0aGlzLl8kaW5kZXhMaXN0Lmxlbmd0aCA+IDAgJiYgdGhpcy5fJGluZGV4TGlzdEl0ZW1UZW1wbGF0ZSAmJiB0aGlzLl8kaW5kZXhMaXN0SXRlbVRlbXBsYXRlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuXyRpbmRleExpc3QuZW1wdHkoKTtcbiAgICAgICAgICAgIHZhciBwYWdlcyA9IFtdO1xuICAgICAgICAgICAgdmFyIG51bVBhZ2VzID0gdGhpcy5fUGFnZU1hbmFnZXIuY291bnQoKSwgcHJldmlvdXNTdGF0ZSA9IHZvaWQgMDtcbiAgICAgICAgICAgIGZvciAodmFyIG51bVBhZ2VJbmRleCA9IDA7IG51bVBhZ2VJbmRleCA8IG51bVBhZ2VzOyBudW1QYWdlSW5kZXgrKykge1xuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50UGFnZSA9IHRoaXMuX1BhZ2VNYW5hZ2VyLmdldFBhZ2UobnVtUGFnZUluZGV4KSwgcGFnZVJlZ2lzdGVyID0gY3VycmVudFBhZ2UuZ2V0UGFnZSgpO1xuICAgICAgICAgICAgICAgIHZhciAkcGFnZSA9IHRoaXMuXyRpbmRleExpc3RJdGVtVGVtcGxhdGUuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICAkcGFnZS5maW5kKEh6TmF2YmFyQ29tcG9uZW50XzEuUVVFUllfSU5ERVhfTElTVF9JVEVNX0NPTlRFTlQpLmh0bWwocGFnZVJlZ2lzdGVyLl9vcHRpb25zLnRpdGxlKTtcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudFBhZ2UuX3N0YXRlLmNvbXBsZXRlZCkge1xuICAgICAgICAgICAgICAgICAgICAkcGFnZS5hZGRDbGFzcyhIek5hdmJhckNvbXBvbmVudF8xLkNMQVNTX1BBR0VfQ09NUExFVEVEKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoY3VycmVudFBhZ2UuX3N0YXRlLnZpc2l0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgJHBhZ2UuYWRkQ2xhc3MoSHpOYXZiYXJDb21wb25lbnRfMS5DTEFTU19QQUdFX1ZJU0lURUQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocHJldmlvdXNTdGF0ZSA9PSB1bmRlZmluZWQgfHwgcHJldmlvdXNTdGF0ZS5jb21wbGV0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgJHBhZ2UuZGF0YShIek5hdmJhckNvbXBvbmVudF8xLkRBVEFfUEFHRSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogcGFnZVJlZ2lzdGVyLmdldE5hbWUoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4OiBudW1QYWdlSW5kZXhcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHByZXZpb3VzU3RhdGUgPSBjdXJyZW50UGFnZS5fc3RhdGU7XG4gICAgICAgICAgICAgICAgcGFnZXMucHVzaCgkcGFnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl8kaW5kZXhMaXN0LmFwcGVuZChwYWdlcyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIE9idGllbmUgbG9zIGVsZW1lbnRvcyBkZWwgRE9NIGEgdXRpbGl6YXJcbiAgICAgKiBAcHJvdGVjdGVkXG4gICAgICovXG4gICAgSHpOYXZiYXJDb21wb25lbnQucHJvdG90eXBlLl9nZXRFbGVtZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fJG5leHRCdG4gPSB0aGlzLl8kZWxlbWVudC5maW5kKEh6TmF2YmFyQ29tcG9uZW50XzEuUVVFUllfQUNUSU9OX05FWFQpO1xuICAgICAgICB0aGlzLl8kcHJldkJ0biA9IHRoaXMuXyRlbGVtZW50LmZpbmQoSHpOYXZiYXJDb21wb25lbnRfMS5RVUVSWV9BQ1RJT05fUFJFVik7XG4gICAgICAgIHRoaXMuXyRiYXIgPSB0aGlzLl8kZWxlbWVudC5maW5kKEh6TmF2YmFyQ29tcG9uZW50XzEuUVVFUllfQkFSKTtcbiAgICAgICAgdGhpcy5fJHByb2dyZXNzID0gdGhpcy5fJGVsZW1lbnQuZmluZChIek5hdmJhckNvbXBvbmVudF8xLlFVRVJZX1BST0dSRVNTKTtcbiAgICAgICAgdGhpcy5fJGhvbWVCdG4gPSB0aGlzLl8kZWxlbWVudC5maW5kKEh6TmF2YmFyQ29tcG9uZW50XzEuUVVFUllfQUNUSU9OX0hPTUUpO1xuICAgICAgICB0aGlzLl8kaW5kZXhCdG4gPSB0aGlzLl8kZWxlbWVudC5maW5kKEh6TmF2YmFyQ29tcG9uZW50XzEuUVVFUllfQUNUSU9OX0lOREVYKTtcbiAgICAgICAgdGhpcy5fJGN1cnJlbnRQYWdlSW5kZXggPSB0aGlzLl8kZWxlbWVudC5maW5kKEh6TmF2YmFyQ29tcG9uZW50XzEuUVVFUllfUEFHRV9DVVJSRU5UKTtcbiAgICAgICAgdGhpcy5fJG51bVBhZ2VzID0gdGhpcy5fJGVsZW1lbnQuZmluZChIek5hdmJhckNvbXBvbmVudF8xLlFVRVJZX1BBR0VfVE9UQUwpO1xuICAgICAgICB0aGlzLl8kaW5kZXhMaXN0ID0gdGhpcy5fJGVsZW1lbnQuZmluZChIek5hdmJhckNvbXBvbmVudF8xLlFVRVJZX0lOREVYX0xJU1QpO1xuICAgICAgICB0aGlzLl8kaW5kZXhMaXN0SXRlbVRlbXBsYXRlID0gdGhpcy5fJGluZGV4TGlzdC5maW5kKEh6TmF2YmFyQ29tcG9uZW50XzEuUVVFUllfSU5ERVhfTElTVF9JVEVNKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEFzaWduYSBsb3MgaGFuZGxlcnMgYSBldmVudG9zXG4gICAgICogQHByb3RlY3RlZFxuICAgICAqL1xuICAgIEh6TmF2YmFyQ29tcG9uZW50LnByb3RvdHlwZS5fYXNzaWduRXZlbnRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl8kbmV4dEJ0bi5vbihcImNsaWNrLlwiICsgSHpOYXZiYXJDb21wb25lbnRfMS5OQU1FU1BBQ0UsIHsgaW5zdGFuY2U6IHRoaXMgfSwgdGhpcy5fb25OZXh0Q2xpY2spO1xuICAgICAgICB0aGlzLl8kcHJldkJ0bi5vbihcImNsaWNrLlwiICsgSHpOYXZiYXJDb21wb25lbnRfMS5OQU1FU1BBQ0UsIHsgaW5zdGFuY2U6IHRoaXMgfSwgdGhpcy5fb25QcmV2Q2xpY2spO1xuICAgICAgICB0aGlzLl8kaG9tZUJ0bi5vbihcImNsaWNrLlwiICsgSHpOYXZiYXJDb21wb25lbnRfMS5OQU1FU1BBQ0UsIHsgaW5zdGFuY2U6IHRoaXMgfSwgdGhpcy5fb25Ib21lQ2xpY2spO1xuICAgICAgICB0aGlzLl8kaW5kZXhCdG4ub24oXCJjbGljay5cIiArIEh6TmF2YmFyQ29tcG9uZW50XzEuTkFNRVNQQUNFLCB7IGluc3RhbmNlOiB0aGlzIH0sIHRoaXMuX29uSW5kZXhDbGljayk7XG4gICAgICAgIHRoaXMuXyRpbmRleExpc3Qub24oXCJjbGljay5cIiArIEh6TmF2YmFyQ29tcG9uZW50XzEuTkFNRVNQQUNFLCBIek5hdmJhckNvbXBvbmVudF8xLlFVRVJZX0lOREVYX0xJU1RfSVRFTSwgeyBpbnN0YW5jZTogdGhpcyB9LCB0aGlzLl9vbkluZGV4TGlzdEl0ZW1DbGljayk7XG4gICAgICAgIHRoaXMuX05hdmlnYXRvci5vbihjb3JlXzEuTmF2aWdhdG9yLk9OX0RJU0FCTEUsIHsgaW5zdGFuY2U6IHRoaXMgfSwgdGhpcy5fb25EaXNhYmxlZCk7XG4gICAgICAgIHRoaXMuX05hdmlnYXRvci5vbihjb3JlXzEuTmF2aWdhdG9yLk9OX0VOQUJMRSwgeyBpbnN0YW5jZTogdGhpcyB9LCB0aGlzLl9vbkVuYWJsZWQpO1xuICAgICAgICB0aGlzLl9OYXZpZ2F0b3Iub24oY29yZV8xLk5hdmlnYXRvci5PTl9DSEFOR0VfUEFHRV9TVEFSVCwgeyBpbnN0YW5jZTogdGhpcyB9LCB0aGlzLl9vblBhZ2VDaGFuZ2VTdGFydCk7XG4gICAgICAgIHRoaXMuX05hdmlnYXRvci5vbihjb3JlXzEuTmF2aWdhdG9yLk9OX0NIQU5HRV9QQUdFX0VORCwgeyBpbnN0YW5jZTogdGhpcyB9LCB0aGlzLl9vblBhZ2VDaGFuZ2VFbmQpO1xuICAgIH07XG4gICAgSHpOYXZiYXJDb21wb25lbnQucHJvdG90eXBlLl9vbkluZGV4TGlzdEl0ZW1DbGljayA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdmFyIGluc3RhbmNlID0gZS5kYXRhLmluc3RhbmNlLCAkaXRlbSA9IGNvcmVfMS4kKHRoaXMpLCBwYWdlID0gJGl0ZW0uZGF0YShIek5hdmJhckNvbXBvbmVudF8xLkRBVEFfUEFHRSk7XG4gICAgICAgIGlmIChwYWdlKSB7XG4gICAgICAgICAgICBpbnN0YW5jZS5jbG9zZUluZGV4TGlzdCgpO1xuICAgICAgICAgICAgaW5zdGFuY2UuX05hdmlnYXRvci5nb1RvKHBhZ2UuaW5kZXgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBJbnZvY2FkbyBhbCBoYWNlcnNlIGNsaWNrIGVuIGVsIGJvdMOzbiBzaWd1aWVudGUuIEludm9jYSBhIF9OYXZpZ2F0b3IjbmV4dFxuICAgICAqIEBwYXJhbSBlXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBIek5hdmJhckNvbXBvbmVudC5wcm90b3R5cGUuX29uTmV4dENsaWNrID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIGluc3RhbmNlID0gZS5kYXRhLmluc3RhbmNlO1xuICAgICAgICBpbnN0YW5jZS5fTmF2aWdhdG9yLm5leHQoKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEludm9jYWRvIGFsIGhhY2Vyc2UgY2xpY2sgZW4gZWwgYm90w7NuIGFudGVyaW9yLiBJbnZvY2EgYSBfTmF2aWdhdG9yI3ByZXZcbiAgICAgKiBAcGFyYW0gZVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgSHpOYXZiYXJDb21wb25lbnQucHJvdG90eXBlLl9vblByZXZDbGljayA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciBpbnN0YW5jZSA9IGUuZGF0YS5pbnN0YW5jZTtcbiAgICAgICAgaW5zdGFuY2UuX05hdmlnYXRvci5wcmV2KCk7XG4gICAgfTtcbiAgICBIek5hdmJhckNvbXBvbmVudC5wcm90b3R5cGUuX29uSG9tZUNsaWNrID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIGluc3RhbmNlID0gZS5kYXRhLmluc3RhbmNlO1xuICAgIH07XG4gICAgSHpOYXZiYXJDb21wb25lbnQucHJvdG90eXBlLl9vbkluZGV4Q2xpY2sgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgaW5zdGFuY2UgPSBlLmRhdGEuaW5zdGFuY2U7XG4gICAgICAgIGlmIChpbnN0YW5jZS5pbmRleExpc3RJc09wZW4oKSkge1xuICAgICAgICAgICAgaW5zdGFuY2UuY2xvc2VJbmRleExpc3QoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGluc3RhbmNlLm9wZW5JbmRleExpc3QoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogQXBsaWNhIGVsIGNhbWJpbyBkZSBlc3RpbG9zIGEgbGEgYmFycmEgZGUgcHJvZ3Jlc28geSBhY3R1YWxpemEgZWwgdGV4dG8gZGUgcHJvZ3Jlc29cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gICAgICB2YWx1ZSAgICAgICBWYWxvcmEgZXN0YWJsZWNlclxuICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgKi9cbiAgICBIek5hdmJhckNvbXBvbmVudC5wcm90b3R5cGUuX3VwZGF0ZVByb2dyZXNzVmFsdWUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fJHByb2dyZXNzLnRleHQodmFsdWUgKyBcIiVcIik7XG4gICAgICAgIHRoaXMuXyRiYXIuY3NzKFwidHJhbnNmb3JtXCIsIFwic2NhbGVYKFwiICsgdmFsdWUgLyAxMDAgKyBcIilcIik7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBJbnZvY2FkbyBhbCBjb21lbnphciBlbCBjYW1iaW8gZGUgcMOhZ2luYS4gRGVzaGFiaWxpdGEgbGEgbmF2ZWdhY2nDs24gZHVyYW50ZSBlbCBwcm9jZXNvXG4gICAgICogQHBhcmFtIGVcbiAgICAgKiBAcGFyYW0gbmV3UGFnZVxuICAgICAqIEBwYXJhbSBvbGRQYWdlXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBIek5hdmJhckNvbXBvbmVudC5wcm90b3R5cGUuX29uUGFnZUNoYW5nZVN0YXJ0ID0gZnVuY3Rpb24gKGUsIG5ld1BhZ2UsIG9sZFBhZ2UpIHtcbiAgICAgICAgaWYgKCFlLmlzRGVmYXVsdFByZXZlbnRlZCgpKSB7XG4gICAgICAgICAgICB2YXIgaW5zdGFuY2UgPSBlLmRhdGEuaW5zdGFuY2U7XG4gICAgICAgICAgICBpZiAob2xkUGFnZSkge1xuICAgICAgICAgICAgICAgIHZhciBwYWdlSW1wbGVtZW50YXRpb24gPSBpbnN0YW5jZS5fUGFnZU1hbmFnZXIuZ2V0UGFnZShvbGRQYWdlLmluZGV4KSwgcGFnZSA9IHBhZ2VJbXBsZW1lbnRhdGlvbi5nZXRQYWdlKCk7XG4gICAgICAgICAgICAgICAgcGFnZS5vZmYoXCIuXCIgKyBIek5hdmJhckNvbXBvbmVudF8xLk5BTUVTUEFDRSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpbnN0YW5jZS5fc2V0Q3VycmVudFBhZ2UobmV3UGFnZS5pbmRleCk7XG4gICAgICAgICAgICBpbnN0YW5jZS5fJHByZXZCdG4uYXR0cihcImRpc2FibGVkXCIsIFwiZGlzYWJsZWRcIik7XG4gICAgICAgICAgICBpbnN0YW5jZS5fJG5leHRCdG4uYXR0cihcImRpc2FibGVkXCIsIFwiZGlzYWJsZWRcIik7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEVzdGFibGVjZSBsb3MgZXN0YWRvcyBkZSBsb3MgYm90b25lcyBkZSBuYXZlZ2FjacOzbiBlbiBiYXNlIGEgbG9zIGRhdG9zIGRlIE5hdmlnYXRvclxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgSHpOYXZiYXJDb21wb25lbnQucHJvdG90eXBlLl91cGRhdGVQYWdlckJ1dHRvblN0YXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMuX05hdmlnYXRvci5pc0Rpc2FibGVkKCkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9jdXJyZW50UGFnZUluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fJHByZXZCdG4uYXR0cihcImRpc2FibGVkXCIsIFwiZGlzYWJsZWRcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5fJG5leHRCdG4ucmVtb3ZlQXR0cihcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5fY3VycmVudFBhZ2VJbmRleCA9PT0gdGhpcy5fbnVtUGFnZXMgLSAxKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fJG5leHRCdG4uYXR0cihcImRpc2FibGVkXCIsIFwiZGlzYWJsZWRcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5fJHByZXZCdG4ucmVtb3ZlQXR0cihcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fJG5leHRCdG4ucmVtb3ZlQXR0cihcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuXyRwcmV2QnRuLnJlbW92ZUF0dHIoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghdGhpcy5fJG5leHRCdG4ucHJvcChcImRpc2FibGVkXCIpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX05hdmlnYXRvci5nZXRDdXJyZW50UGFnZSgpLmdldENvbnRyb2xsZXIoKS5pc0NvbXBsZXRlZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuXyRuZXh0QnRuLnJlbW92ZUF0dHIoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuXyRuZXh0QnRuLmF0dHIoXCJkaXNhYmxlZFwiLCBcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuXyRwcmV2QnRuLmF0dHIoXCJkaXNhYmxlZFwiLCBcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgdGhpcy5fJG5leHRCdG4uYXR0cihcImRpc2FibGVkXCIsIFwiZGlzYWJsZWRcIik7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEludm9jYWRvIGFsIGZpbmFsaXphcnNlIGVsIGNhbWJpbyBkZSBww6FnaW5hLiBBY3R1YWxpemEgZWwgcGFnaW5hZG9yIHkgZWwgZXN0YWRvIGRlIGxvcyBib3RvbmVzIGRlIG5hdmVnYWNpw7NuXG4gICAgICogQHBhcmFtIGVcbiAgICAgKiBAcGFyYW0gbmV3UGFnZVxuICAgICAqIEBwYXJhbSBvbGRQYWdlXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBIek5hdmJhckNvbXBvbmVudC5wcm90b3R5cGUuX29uUGFnZUNoYW5nZUVuZCA9IGZ1bmN0aW9uIChlLCBuZXdQYWdlLCBvbGRQYWdlKSB7XG4gICAgICAgIHZhciBpbnN0YW5jZSA9IGUuZGF0YS5pbnN0YW5jZTtcbiAgICAgICAgaW5zdGFuY2UuX3VwZGF0ZVBhZ2VyQnV0dG9uU3RhdGUoKTtcbiAgICAgICAgaW5zdGFuY2UucHJvZ3Jlc3MoKGluc3RhbmNlLl9OYXZpZ2F0b3IuZ2V0VmlzaXRlZFBhZ2VzKCkubGVuZ3RoICogMTAwKSAvIGluc3RhbmNlLl9udW1QYWdlcyk7XG4gICAgICAgIHZhciBwYWdlSW1wbGVtZW50YXRpb24gPSBpbnN0YW5jZS5fTmF2aWdhdG9yLmdldEN1cnJlbnRQYWdlKCksIHBhZ2UgPSBwYWdlSW1wbGVtZW50YXRpb24uZ2V0UGFnZSgpO1xuICAgICAgICBwYWdlLm9mZihcIi5cIiArIEh6TmF2YmFyQ29tcG9uZW50XzEuTkFNRVNQQUNFKS5vbihjb3JlXzEuUGFnZUNvbnRyb2xsZXIuT05fQ09NUExFVEVfQ0hBTkdFICsgXCIuXCIgKyBIek5hdmJhckNvbXBvbmVudF8xLk5BTUVTUEFDRSwgeyBpbnN0YW5jZTogaW5zdGFuY2UgfSwgaW5zdGFuY2UuX29uUGFnZUNvbXBsZXRlQ2hhbmdlKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEludm9jYWRvIGFsIGNvbXBsZXRhcnNlIGxhIHDDoWdpbmEuIEFjdHVhbGl6YSBlbCBlc3RhZG8gZGVsIGJvdMOzbiBzaWd1aWVudGVcbiAgICAgKiBAcGFyYW0gZVxuICAgICAqIEBwYXJhbSBjb21wbGV0ZWRcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIEh6TmF2YmFyQ29tcG9uZW50LnByb3RvdHlwZS5fb25QYWdlQ29tcGxldGVDaGFuZ2UgPSBmdW5jdGlvbiAoZSwgY29tcGxldGVkKSB7XG4gICAgICAgIGlmIChjb21wbGV0ZWQpIHtcbiAgICAgICAgICAgIHZhciBpbnN0YW5jZSA9IGUuZGF0YS5pbnN0YW5jZTtcbiAgICAgICAgICAgIHZhciBwYWdlSW1wbGVtZW50YXRpb24gPSBpbnN0YW5jZS5fTmF2aWdhdG9yLmdldEN1cnJlbnRQYWdlKCksIHBhZ2UgPSBwYWdlSW1wbGVtZW50YXRpb24uZ2V0UGFnZSgpO1xuICAgICAgICAgICAgaWYgKGluc3RhbmNlLl9QYWdlTWFuYWdlci5nZXRQYWdlSW5kZXgocGFnZS5nZXROYW1lKCkpICE9PSBpbnN0YW5jZS5fUGFnZU1hbmFnZXIuY291bnQoKSAtIDEpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFnZUltcGxlbWVudGF0aW9uLmdldENvbnRyb2xsZXIoKS5pc0NvbXBsZXRlZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlLl8kbmV4dEJ0bi5yZW1vdmVBdHRyKFwiZGlzYWJsZWRcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZS5fJG5leHRCdG4uYXR0cihcImRpc2FibGVkXCIsIFwiZGlzYWJsZWRcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBFc3RhYmxlY2UgZWwgdmFsb3IgYSBsYSBjYW50aWRhZCBkZSBww6FnaW5hcyB5IGFjdHVhbGl6YSBlbCB0ZXh0byBkZWwgZWxlbWVudG9cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gIHZhbHVlICAgICAgIENhbnRpZGFkIGRlIHDDoWdpbmFzXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBIek5hdmJhckNvbXBvbmVudC5wcm90b3R5cGUuX3NldE51bVBhZ2VzID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX251bVBhZ2VzID0gdmFsdWU7XG4gICAgICAgIHRoaXMuXyRudW1QYWdlcy50ZXh0KHZhbHVlKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEVzdGFibGVjZSBlbCB2YWxvciBkZSBsYSBww6FnaW5hIGFjdHVhbCB5IGFjdHVhbGl6YSBlbCB0ZXh0byBkZWwgZWxlbWVudG8uIFNlIGVzcGVyYSByZWNpYmlyIGVsIMOtbmRpY2UgZGUgbGEgcMOhZ2luYSBjb21lbnphbmRvIHBvciAwXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9ICB2YWx1ZSAgICAgICDDjW5kaWNlIGRlIGxhIHDDoWdpbmEgYWN0dWFsXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBIek5hdmJhckNvbXBvbmVudC5wcm90b3R5cGUuX3NldEN1cnJlbnRQYWdlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRQYWdlSW5kZXggPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5fJGN1cnJlbnRQYWdlSW5kZXgudGV4dCh2YWx1ZSArIDEpO1xuICAgIH07XG4gICAgSHpOYXZiYXJDb21wb25lbnQucHJvdG90eXBlLl9vbkRpc2FibGVkID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIGluc3RhbmNlID0gZS5kYXRhLmluc3RhbmNlO1xuICAgICAgICBpbnN0YW5jZS5fdXBkYXRlUGFnZXJCdXR0b25TdGF0ZSgpO1xuICAgIH07XG4gICAgSHpOYXZiYXJDb21wb25lbnQucHJvdG90eXBlLl9vbkVuYWJsZWQgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgaW5zdGFuY2UgPSBlLmRhdGEuaW5zdGFuY2U7XG4gICAgICAgIGluc3RhbmNlLl91cGRhdGVQYWdlckJ1dHRvblN0YXRlKCk7XG4gICAgfTtcbiAgICByZXR1cm4gSHpOYXZiYXJDb21wb25lbnQ7XG59KGNvcmVfMS5Db21wb25lbnRDb250cm9sbGVyKSk7XG5Iek5hdmJhckNvbXBvbmVudC5OQU1FU1BBQ0UgPSBcImh6TmF2YmFyXCI7XG5Iek5hdmJhckNvbXBvbmVudC5QUkVGSVggPSBcImh6LW5hdmJhclwiO1xuSHpOYXZiYXJDb21wb25lbnQuUFJFRklYX0xJU1RfRElBTE9HX09QVElPTlMgPSBIek5hdmJhckNvbXBvbmVudF8xLk5BTUVTUEFDRSArIFwiRGlhbG9nXCI7XG5Iek5hdmJhckNvbXBvbmVudC5RVUVSWV9BQ1RJT05fTkVYVCA9IFwiW2RhdGEtXCIgKyBIek5hdmJhckNvbXBvbmVudF8xLlBSRUZJWCArIFwiLW5leHRdXCI7XG5Iek5hdmJhckNvbXBvbmVudC5RVUVSWV9BQ1RJT05fUFJFViA9IFwiW2RhdGEtXCIgKyBIek5hdmJhckNvbXBvbmVudF8xLlBSRUZJWCArIFwiLXByZXZdXCI7XG5Iek5hdmJhckNvbXBvbmVudC5RVUVSWV9CQVIgPSBcIltkYXRhLVwiICsgSHpOYXZiYXJDb21wb25lbnRfMS5QUkVGSVggKyBcIi1iYXJdXCI7XG5Iek5hdmJhckNvbXBvbmVudC5RVUVSWV9QUk9HUkVTUyA9IFwiW2RhdGEtXCIgKyBIek5hdmJhckNvbXBvbmVudF8xLlBSRUZJWCArIFwiLXByb2dyZXNzXVwiO1xuSHpOYXZiYXJDb21wb25lbnQuUVVFUllfQUNUSU9OX0hPTUUgPSBcIltkYXRhLVwiICsgSHpOYXZiYXJDb21wb25lbnRfMS5QUkVGSVggKyBcIi1ob21lXVwiO1xuSHpOYXZiYXJDb21wb25lbnQuUVVFUllfQUNUSU9OX0lOREVYID0gXCJbZGF0YS1cIiArIEh6TmF2YmFyQ29tcG9uZW50XzEuUFJFRklYICsgXCItaW5kZXhdXCI7XG5Iek5hdmJhckNvbXBvbmVudC5RVUVSWV9QQUdFX0NVUlJFTlQgPSBcIltkYXRhLVwiICsgSHpOYXZiYXJDb21wb25lbnRfMS5QUkVGSVggKyBcIi1jdXJyZW50XVwiO1xuSHpOYXZiYXJDb21wb25lbnQuUVVFUllfUEFHRV9UT1RBTCA9IFwiW2RhdGEtXCIgKyBIek5hdmJhckNvbXBvbmVudF8xLlBSRUZJWCArIFwiLXRvdGFsXVwiO1xuSHpOYXZiYXJDb21wb25lbnQuUVVFUllfSU5ERVhfTElTVCA9IFwiW2RhdGEtXCIgKyBIek5hdmJhckNvbXBvbmVudF8xLlBSRUZJWCArIFwiLWluZGV4LWxpc3RdXCI7XG5Iek5hdmJhckNvbXBvbmVudC5RVUVSWV9JTkRFWF9MSVNUX0lURU0gPSBcIltkYXRhLVwiICsgSHpOYXZiYXJDb21wb25lbnRfMS5QUkVGSVggKyBcIi1pbmRleC1saXN0LWl0ZW1dXCI7XG5Iek5hdmJhckNvbXBvbmVudC5RVUVSWV9JTkRFWF9MSVNUX0lURU1fQ09OVEVOVCA9IFwiW2RhdGEtXCIgKyBIek5hdmJhckNvbXBvbmVudF8xLlBSRUZJWCArIFwiLWluZGV4LWxpc3QtaXRlbS1jb250ZW50XVwiO1xuSHpOYXZiYXJDb21wb25lbnQuQ0xBU1NfUEFHRV9WSVNJVEVEID0gXCJoei1uYXZiYXJfX3BhZ2UtLXZpc2l0ZWRcIjtcbkh6TmF2YmFyQ29tcG9uZW50LkNMQVNTX1BBR0VfQ09NUExFVEVEID0gXCJoei1uYXZiYXJfX3BhZ2UtLWNvbXBsZXRlZFwiO1xuSHpOYXZiYXJDb21wb25lbnQuQ0xBU1NfTElTVF9JTkRFWF9ESUFMT0cgPSBcImh6LW5hdmJhcl9faW5kZXgtbGlzdC1kaWFsb2dcIjtcbkh6TmF2YmFyQ29tcG9uZW50LkRBVEFfUEFHRSA9IFwiaHpOYXZiYXJQYWdlXCI7XG5Iek5hdmJhckNvbXBvbmVudC5PUFRfRElBTE9HX0RFRkFVTFRTID0ge1xuICAgIGF1dG9PcGVuOiBmYWxzZVxufTtcbkh6TmF2YmFyQ29tcG9uZW50Ll9ERUZBVUxUUyA9IHtcbiAgICBsb2NhbGU6IHtcbiAgICAgICAgXCJlc1wiOiB7XG4gICAgICAgICAgICBuZXh0OiBcIlNpZ3VpZW50ZVwiLFxuICAgICAgICAgICAgcHJldjogXCJBbnRlcmlvclwiLFxuICAgICAgICAgICAgY3VycmVudFBhZ2U6IFwiUMOhZ2luYSBhY3R1YWxcIixcbiAgICAgICAgICAgIHRvdGFsUGFnZXM6IFwiUMOhZ2luYXMgdG90YWxlc1wiLFxuICAgICAgICAgICAgaG9tZTogXCJJciBhbCBpbmljaW9cIixcbiAgICAgICAgICAgIHNob3dJbmRleDogXCJNb3N0cmFyIMOtbmRpY2VcIixcbiAgICAgICAgICAgIGluZGV4OiBcIsONbmRpY2VcIlxuICAgICAgICB9XG4gICAgfSxcbiAgICBkZWZhdWx0TGFuZzogXCJlc1wiXG59O1xuSHpOYXZiYXJDb21wb25lbnQgPSBIek5hdmJhckNvbXBvbmVudF8xID0gX19kZWNvcmF0ZShbXG4gICAgY29yZV8xLkNvbXBvbmVudCh7XG4gICAgICAgIG5hbWU6IFwiSHpOYXZiYXJcIixcbiAgICAgICAgZGVwZW5kZW5jaWVzOiBbXG4gICAgICAgICAgICBjb3JlXzEuJCxcbiAgICAgICAgICAgIGNvcmVfMS5FdmVudEVtaXR0ZXJGYWN0b3J5LFxuICAgICAgICAgICAgY29yZV8xLk5hdmlnYXRvcixcbiAgICAgICAgICAgIGNvcmVfMS5QYWdlTWFuYWdlcixcbiAgICAgICAgICAgIGNvcmVfMS5EYXRhT3B0aW9uc1xuICAgICAgICBdXG4gICAgfSlcbl0sIEh6TmF2YmFyQ29tcG9uZW50KTtcbmV4cG9ydHMuSHpOYXZiYXJDb21wb25lbnQgPSBIek5hdmJhckNvbXBvbmVudDtcbnZhciBIek5hdmJhckNvbXBvbmVudF8xO1xuIl0sImZpbGUiOiJIek5hdmJhci5qcyJ9
