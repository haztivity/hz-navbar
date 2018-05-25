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
var core_1 = require("@haztivity/core");
require("jquery-ui-dist/jquery-ui");
var Hammer = require("hammerjs");
var HzNavbarComponent = /** @class */ (function (_super) {
    __extends(HzNavbarComponent, _super);
    function HzNavbarComponent(_$, _EventEmitterFactory, _Navigator, _PageManager, _DataOptions) {
        var _this = _super.call(this, _$, _EventEmitterFactory) || this;
        _this._Navigator = _Navigator;
        _this._PageManager = _PageManager;
        _this._DataOptions = _DataOptions;
        _this._progress = 0;
        _this._currentPageIndex = 0;
        _this._numPages = 0;
        return _this;
    }
    HzNavbarComponent_1 = HzNavbarComponent;
    HzNavbarComponent.prototype.init = function (options, config) {
        this._options = core_1.$.extend(true, {}, HzNavbarComponent_1._DEFAULTS, options);
        this._getElements();
        this.updateLocale();
        this._initExitDialog();
        this.progress(this._Navigator.getProgressPercentage());
        this._assignEvents();
        this.updatePaginator();
        if (this._options.touch != false) {
            //this._touchRegion = new ZingTouch.Region(ScoFactory.getCurrentSco()._$context.get(0));
            this.hammerManager = new Hammer.Manager(core_1.ScoFactory.getCurrentSco()._$context.get(0), {
                touchAction: 'auto',
                inputClass: Hammer.SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchInput
            });
            this.hammerManager.add(new Hammer.Swipe({ direction: Hammer.DIRECTION_HORIZONTAL }));
            this.hammerManager.on("swipe", Hammer.bindFn(this._onSwipe, this));
        }
    };
    HzNavbarComponent.prototype._onSwipe = function (e) {
        debugger;
        //if target is navbar
        //else
        //if X is 0-50, and direction is right
        //else if x is window-50 and direction is lef
        if (!this._Navigator.isDisabled()) {
            // starting from left and counter clockwise
            //       90
            //   180     0/360
            //      270
            //right or down
            var goTo = void 0;
            if (this._$element.get(0) == e.target || this._$element.find(e.target).length > 0) {
                if (e.direction === Hammer.DIRECTION_RIGHT) {
                    goTo = 1;
                }
                else if (e.direction === Hammer.DIRECTION_LEFT) {
                    goTo = -1;
                }
            }
            else {
                var delta_x = e.deltaX, x = e.changedPointers[0].clientX - delta_x, maxWidth = core_1.$(document.body).width();
                if (x <= 100) {
                    // handle swipe from left edge e.t.c
                    goTo = 1;
                }
                else if (x >= maxWidth - 100) {
                    // handle other case
                    goTo = -1;
                }
            }
            if (goTo != undefined) {
                if (this._options.reverseSwipeNavigation) {
                    goTo /= -1;
                }
                if (goTo === 1 && !this._nextDisabled) {
                    this._Navigator.next();
                }
                else if (goTo === -1 && !this._prevDisabled) {
                    this._Navigator.prev();
                }
            }
        }
    };
    HzNavbarComponent.prototype._initExitDialog = function () {
        var locale = this._options.locale[this._options.lang] || this._options.locale[this._options.defaultLang];
        var options = this._DataOptions.getDataOptions(this._$exitDialog, "dialog");
        options = core_1.$.extend(true, options, {
            autoOpen: false,
            show: "fade",
            hide: "fade",
            resizable: false,
            modal: true,
            buttons: [
                {
                    text: locale.exitOk,
                    click: this._onConfirmExit.bind(this)
                },
                {
                    text: locale.exitKo,
                    click: this._onCancelExit.bind(this)
                }
            ]
        });
        if (options.dialogClass) {
            options.dialogClass += " " + HzNavbarComponent_1.CLASS_LIST_EXIT_DIALOG;
        }
        else {
            options.dialogClass = HzNavbarComponent_1.CLASS_LIST_EXIT_DIALOG;
        }
        this._$exitDialog.dialog(options);
        this._exitDialog = this._$exitDialog.dialog("instance");
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
        if (value != undefined) {
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
        }
        return result;
    };
    HzNavbarComponent.prototype.openIndexList = function (advanced) {
        if (advanced === void 0) { advanced = false; }
        if (this._indexListDialog) {
            this.updateIndex(advanced);
            this._indexListDialog.open();
        }
    };
    HzNavbarComponent.prototype._generateIndex = function () {
        if (this._$indexList && this._$indexList.length > 0 && this._$indexListItemTemplate && this._$indexListItemTemplate.length > 0) {
            this._$indexListItemTemplate.detach();
            var options = core_1.$.extend(true, {}, HzNavbarComponent_1.OPT_DIALOG_DEFAULTS, this._DataOptions.getDataOptions(this._$indexList, "dialog"));
            options.dialogClass = HzNavbarComponent_1.CLASS_LIST_INDEX_DIALOG;
            this._$indexList.dialog(options);
            this._$indexList.on("dialogclose", { instance: this }, this._onDialogClosed);
            this._indexListDialog = this._$indexList.data("ui-dialog");
        }
    };
    HzNavbarComponent.prototype.updateIndex = function (advanced) {
        if (advanced === void 0) { advanced = false; }
        if (this._$indexList && this._$indexList.length > 0 && this._$indexListItemTemplate && this._$indexListItemTemplate.length > 0) {
            this._$indexList.empty();
            var pages = [];
            var numPages = this._PageManager.count();
            for (var numPageIndex = 0; numPageIndex < numPages; numPageIndex++) {
                var currentPage = this._PageManager.getPage(numPageIndex), pageRegister = currentPage.getPage();
                var $page = this._$indexListItemTemplate.clone();
                $page.find(HzNavbarComponent_1.QUERY_INDEX_LIST_ITEM_CONTENT).html((advanced ? pageRegister.getName() + " - " : "") + pageRegister._options.title);
                $page.attr("data-page", pageRegister._options.name);
                if (this._currentPageIndex == numPageIndex) {
                    $page.addClass(HzNavbarComponent_1.CLASS_ACTIVE_PAGE);
                }
                if (currentPage._state.completed) {
                    $page.addClass(HzNavbarComponent_1.CLASS_PAGE_COMPLETED);
                }
                else if (currentPage._state.visited) {
                    $page.addClass(HzNavbarComponent_1.CLASS_PAGE_VISITED);
                }
                $page.data(HzNavbarComponent_1.DATA_PAGE, {
                    name: pageRegister.getName(),
                    index: numPageIndex
                });
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
        this._$exitBtn = this._$element.find(HzNavbarComponent_1.QUERY_ACTION_EXIT);
        this._$exitDialog = this._$element.find(HzNavbarComponent_1.QUERY_ACTION_EXIT_DIALOG);
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
        this._$exitBtn.on("click." + HzNavbarComponent_1.NAMESPACE, { instance: this }, this._onExitClick);
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
            if (e.altKey) {
                instance._Navigator.enableDev();
            }
            if (!!instance._Navigator.goTo(page.index)) {
                instance.closeIndexList();
            }
            instance._Navigator.disableDev();
        }
    };
    /**
     * Invocado al hacerse click en el botón siguiente. Invoca a _Navigator#next
     * @param e
     * @private
     */
    HzNavbarComponent.prototype._onNextClick = function (e) {
        var instance = e.data.instance;
        if (!instance._Navigator.isDisabled() && !instance._nextDisabled) {
            instance._Navigator.next();
        }
        else if (e.altKey) {
            instance._Navigator.enableDev();
            instance._Navigator.next();
            instance._Navigator.disableDev();
        }
    };
    /**
     * Invocado al hacerse click en el botón anterior. Invoca a _Navigator#prev
     * @param e
     * @private
     */
    HzNavbarComponent.prototype._onPrevClick = function (e) {
        var instance = e.data.instance;
        if (!instance._Navigator.isDisabled() && !instance._prevDisabled) {
            instance._Navigator.prev();
        }
        else if (e.altKey) {
            instance._Navigator.enableDev();
            instance._Navigator.prev();
            instance._Navigator.disableDev();
        }
    };
    HzNavbarComponent.prototype._onHomeClick = function (e) {
        var instance = e.data.instance;
        instance._Navigator.goTo(0);
    };
    HzNavbarComponent.prototype._onExitClick = function (e) {
        var instance = e.data.instance;
        instance._exitDialog.open();
    };
    HzNavbarComponent.prototype._onCancelExit = function () {
        this._exitDialog.close();
    };
    HzNavbarComponent.prototype._onConfirmExit = function () {
        this._exitDialog.close();
        this._exitDialog.destroy();
        if (this._indexListDialog) {
            this._indexListDialog.close();
            this._indexListDialog.destroy();
        }
        core_1.ScoFactory.getCurrentSco().exit();
    };
    HzNavbarComponent.prototype._onIndexClick = function (e) {
        var instance = e.data.instance;
        if (instance.indexListIsOpen()) {
            instance.closeIndexList();
        }
        else {
            instance.openIndexList(e.altKey);
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
    HzNavbarComponent.prototype._disableActions = function () {
        this._actionsDisabled = true;
        this._$homeBtn.addClass(HzNavbarComponent_1.CLASS_DISABLED).prop("disabled", true);
        this._$exitBtn.addClass(HzNavbarComponent_1.CLASS_DISABLED).prop("disabled", true);
        this._$indexBtn.addClass(HzNavbarComponent_1.CLASS_DISABLED).prop("disabled", true);
        if (this._indexListDialog) {
            this._indexListDialog.close();
            this._indexListDialog.disable();
        }
        if (this._exitDialog) {
            this._exitDialog.close();
            this._exitDialog.disable();
        }
    };
    HzNavbarComponent.prototype._enableActions = function () {
        this._$homeBtn.removeClass(HzNavbarComponent_1.CLASS_DISABLED).prop("disabled", false);
        this._$exitBtn.removeClass(HzNavbarComponent_1.CLASS_DISABLED).prop("disabled", false);
        this._$indexBtn.removeClass(HzNavbarComponent_1.CLASS_DISABLED).prop("disabled", false);
        if (this._indexListDialog) {
            this._indexListDialog.enable();
        }
        if (this._exitDialog) {
            this._exitDialog.enable();
        }
        this._actionsDisabled = false;
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
            instance._disableActions();
            if (oldPage) {
                var pageImplementation = instance._PageManager.getPage(oldPage.index), page = pageImplementation.getPage();
                page.off("." + HzNavbarComponent_1.NAMESPACE);
            }
            instance._setCurrentPage(newPage.index);
            instance._$prevBtn.addClass(HzNavbarComponent_1.CLASS_BTN_DISABLED);
            instance._nextDisabled = true;
            instance._$nextBtn.addClass(HzNavbarComponent_1.CLASS_BTN_DISABLED);
            instance._prevDisabled = true;
        }
    };
    /**
     * Establece los estados de los botones de navegación en base a los datos de Navigator
     * @private
     */
    HzNavbarComponent.prototype._updatePagerButtonState = function () {
        if (!this._Navigator.isDisabled()) {
            if (this._currentPageIndex === 0) {
                this._$prevBtn.addClass(HzNavbarComponent_1.CLASS_BTN_DISABLED);
                this._prevDisabled = true;
                this._$nextBtn.removeClass(HzNavbarComponent_1.CLASS_BTN_DISABLED);
                this._nextDisabled = false;
            }
            else if (this._currentPageIndex === this._numPages - 1) {
                this._$nextBtn.addClass(HzNavbarComponent_1.CLASS_BTN_DISABLED);
                this._nextDisabled = true;
                this._$prevBtn.removeClass(HzNavbarComponent_1.CLASS_BTN_DISABLED);
                this._prevDisabled = false;
            }
            else {
                this._$nextBtn.removeClass(HzNavbarComponent_1.CLASS_BTN_DISABLED);
                this._nextDisabled = false;
                this._$prevBtn.removeClass(HzNavbarComponent_1.CLASS_BTN_DISABLED);
                this._prevDisabled = false;
            }
            if (!this._$nextBtn.prop("disabled")) {
                if (this._Navigator.getCurrentPage().getController().isCompleted()) {
                    this._$nextBtn.removeClass(HzNavbarComponent_1.CLASS_BTN_DISABLED);
                    this._nextDisabled = false;
                }
                else {
                    this._$nextBtn.addClass(HzNavbarComponent_1.CLASS_BTN_DISABLED);
                    this._nextDisabled = true;
                }
            }
        }
        else {
            this._$prevBtn.addClass(HzNavbarComponent_1.CLASS_BTN_DISABLED);
            this._prevDisabled = true;
            this._$nextBtn.addClass(HzNavbarComponent_1.CLASS_BTN_DISABLED);
            this._nextDisabled = true;
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
        var pageImplementation = instance._Navigator.getCurrentPage(), page = pageImplementation.getPage();
        instance._enableActions();
        if (pageImplementation.isCompleted()) {
            instance.progress(instance._Navigator.getProgressPercentage());
        }
        else {
            page.off("." + HzNavbarComponent_1.NAMESPACE).on(core_1.PageController.ON_COMPLETE_CHANGE + "." + HzNavbarComponent_1.NAMESPACE, { instance: instance }, instance._onPageCompleteChange);
        }
    };
    /**
     * Invocado al completarse la página. Actualiza el estado del botón siguiente y del % de avance
     * @param e
     * @param completed
     * @private
     */
    HzNavbarComponent.prototype._onPageCompleteChange = function (e, completed) {
        if (completed) {
            var instance = e.data.instance;
            instance.progress(instance._Navigator.getProgressPercentage());
            var pageImplementation = instance._Navigator.getCurrentPage(), page = pageImplementation.getPage();
            if (instance._PageManager.getPageIndex(page.getName()) !== instance._PageManager.count() - 1) {
                if (pageImplementation.getController().isCompleted()) {
                    instance._$nextBtn.removeClass(HzNavbarComponent_1.CLASS_BTN_DISABLED);
                    instance._nextDisabled = false;
                }
                else {
                    instance._$nextBtn.addClass(HzNavbarComponent_1.CLASS_BTN_DISABLED);
                    instance._nextDisabled = true;
                }
            }
        }
    };
    /**
     * Invocado al cerrarse el dialogo. Restablece estilos
     */
    HzNavbarComponent.prototype._onDialogClosed = function (e) {
        var instance = e.data.instance;
        instance._indexListDialog.uiDialog.css("top", "");
        instance._indexListDialog.uiDialog.css("left", "");
        instance._indexListDialog.uiDialog.css("bottom", "");
        instance._indexListDialog.uiDialog.css("right", "");
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
    HzNavbarComponent.NAMESPACE = "hzNavbar";
    HzNavbarComponent.PREFIX = "hz-navbar";
    HzNavbarComponent.QUERY_ACTION_NEXT = "[data-" + HzNavbarComponent_1.PREFIX + "-next]";
    HzNavbarComponent.QUERY_ACTION_PREV = "[data-" + HzNavbarComponent_1.PREFIX + "-prev]";
    HzNavbarComponent.QUERY_BAR = "[data-" + HzNavbarComponent_1.PREFIX + "-bar]";
    HzNavbarComponent.QUERY_PROGRESS = "[data-" + HzNavbarComponent_1.PREFIX + "-progress]";
    HzNavbarComponent.QUERY_ACTION_HOME = "[data-" + HzNavbarComponent_1.PREFIX + "-home]";
    HzNavbarComponent.QUERY_ACTION_INDEX = "[data-" + HzNavbarComponent_1.PREFIX + "-index]";
    HzNavbarComponent.QUERY_ACTION_EXIT = "[data-" + HzNavbarComponent_1.PREFIX + "-exit]";
    HzNavbarComponent.QUERY_ACTION_EXIT_DIALOG = "[data-" + HzNavbarComponent_1.PREFIX + "-exit-dialog]";
    HzNavbarComponent.QUERY_PAGE_CURRENT = "[data-" + HzNavbarComponent_1.PREFIX + "-current]";
    HzNavbarComponent.QUERY_PAGE_TOTAL = "[data-" + HzNavbarComponent_1.PREFIX + "-total]";
    HzNavbarComponent.QUERY_INDEX_LIST = "[data-" + HzNavbarComponent_1.PREFIX + "-index-list]";
    HzNavbarComponent.QUERY_INDEX_LIST_ITEM = "[data-" + HzNavbarComponent_1.PREFIX + "-index-list-item]";
    HzNavbarComponent.QUERY_INDEX_LIST_ITEM_CONTENT = "[data-" + HzNavbarComponent_1.PREFIX + "-index-list-item-content]";
    HzNavbarComponent.CLASS_PAGE_VISITED = "hz-navbar__page--visited";
    HzNavbarComponent.CLASS_PAGE_COMPLETED = "hz-navbar__page--completed";
    HzNavbarComponent.CLASS_ACTIVE_PAGE = "hz-navbar__page--active";
    HzNavbarComponent.CLASS_LIST_INDEX_DIALOG = "hz-navbar__dialog hz-navbar__index-list-dialog";
    HzNavbarComponent.CLASS_LIST_EXIT_DIALOG = "hz-navbar__dialog hz-navbar__index-list-dialog";
    HzNavbarComponent.CLASS_DISABLED = "hz-navbar--disabled";
    HzNavbarComponent.CLASS_BTN_DISABLED = "hz-navbar__btn--disabled";
    HzNavbarComponent.DATA_PAGE = "hzNavbarPage";
    HzNavbarComponent.OPT_DIALOG_DEFAULTS = {
        autoOpen: false,
        draggable: false,
        resizable: false,
        show: "fade",
        hide: "fade",
        position: { my: "center", at: "center" }
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
                index: "Índice",
                exit: "Salir",
                exitTitle: "Salir",
                exitMessage: "Va a salir del curso. ¿Desea guardar la puntuación y salir?",
                exitOk: "Salir",
                exitKo: "Cancelar"
            }
        },
        touch: true,
        maxRestTime: 2000,
        escapeVelocity: 0.1,
        defaultLang: "es",
        reverseSwipeNavigation: true
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
    return HzNavbarComponent;
    var HzNavbarComponent_1;
}(core_1.ComponentController));
exports.HzNavbarComponent = HzNavbarComponent;
//# sourceMappingURL=HzNavbarComponent.js.map