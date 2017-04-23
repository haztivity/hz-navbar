/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
import {
    $,
    Navigator,
    INavigatorPageData,
    Component,
    ComponentController,
    EventEmitterFactory,
    PageManager,
    PageController,
    DataOptions
} from "@haztivity/core";
import "jquery-ui-dist/jquery-ui.js";
@Component(
    {
        name: "HzNavbar",
        dependencies: [
            $,
            EventEmitterFactory,
            Navigator,
            PageManager,
            DataOptions
        ]
    }
)
export class HzNavbarComponent extends ComponentController {
    public static readonly NAMESPACE = "hzNavbar";
    protected static readonly PREFIX = "hz-navbar";
    public static readonly PREFIX_LIST_DIALOG_OPTIONS = `${HzNavbarComponent.NAMESPACE}Dialog`;
    public static readonly QUERY_ACTION_NEXT = `[data-${HzNavbarComponent.PREFIX}-next]`;
    public static readonly QUERY_ACTION_PREV = `[data-${HzNavbarComponent.PREFIX}-prev]`;
    public static readonly QUERY_BAR = `[data-${HzNavbarComponent.PREFIX}-bar]`;
    public static readonly QUERY_PROGRESS = `[data-${HzNavbarComponent.PREFIX}-progress]`;
    public static readonly QUERY_ACTION_HOME = `[data-${HzNavbarComponent.PREFIX}-home]`;
    public static readonly QUERY_ACTION_INDEX = `[data-${HzNavbarComponent.PREFIX}-index]`;
    public static readonly QUERY_PAGE_CURRENT = `[data-${HzNavbarComponent.PREFIX}-current]`;
    public static readonly QUERY_PAGE_TOTAL = `[data-${HzNavbarComponent.PREFIX}-total]`;
    public static readonly QUERY_INDEX_LIST = `[data-${HzNavbarComponent.PREFIX}-index-list]`;
    public static readonly QUERY_INDEX_LIST_ITEM = `[data-${HzNavbarComponent.PREFIX}-index-list-item]`;
    public static readonly QUERY_INDEX_LIST_ITEM_CONTENT = `[data-${HzNavbarComponent.PREFIX}-index-list-item-content]`;
    public static readonly CLASS_PAGE_VISITED = "hz-navbar__page--visited";
    public static readonly CLASS_PAGE_COMPLETED = "hz-navbar__page--completed";
    public static readonly CLASS_LIST_INDEX_DIALOG = "hz-navbar__index-list-dialog";
    public static readonly DATA_PAGE = "hzNavbarPage";
    protected static readonly OPT_DIALOG_DEFAULTS = {
        autoOpen: false
    };
    protected static readonly _DEFAULTS = {
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
    protected _$nextBtn: JQuery;
    protected _$prevBtn: JQuery;
    protected _$bar: JQuery;
    protected _$progress: JQuery;
    protected _$homeBtn: JQuery;
    protected _$indexBtn: JQuery;
    protected _$currentPageIndex: JQuery;
    protected _$numPages: JQuery;
    protected _$indexList: JQuery;
    protected _$indexListItemTemplate: JQuery;
    protected _progress: number;
    protected _currentPageIndex: number = 0;
    protected _numPages: number = 0;
    protected _indexListDialog;
    constructor(_$: JQueryStatic, _EventEmitterFactory, protected _Navigator: Navigator, protected _PageManager: PageManager, protected _DataOptions) {
        super(_$, _EventEmitterFactory);
    }

    init(options, config?) {
        this._options = $.extend(true, {}, HzNavbarComponent._DEFAULTS, options);
        this._getElements();
        this.updateLocale();
        this.progress(0);
        this._assignEvents();
        this.updatePaginator();
    }

    public updatePaginator() {
        let numPages = this._PageManager.count();
        this._setNumPages(numPages);
        this._generateIndex();
        let currentPage = this._Navigator.getCurrentPageIndex() || 0;
        this._setCurrentPage(currentPage);
    }

    /**
     * Si se indica parámetro se establece el porcentaje. El número es redondeado a 2 decimales
     * Si no se indica parámetro, devuelve el porcentaje actual
     * @param {Number}      [value]         Valor a establecer
     * @returns {number}
     */
    public progress(value?: number): number {
        if (value) {
            value = parseFloat(value.toFixed(2));
            if (!isNaN(value)) {
                if (value >= 0 && value <= 100) {
                    this._progress = value;
                    this._updateProgressValue(value);
                }
            }
        } else {
            return this._progress;
        }
    }

    /**
     * Establece un idioma
     * @param {string}  lang        Idioma. Si no tiene traducciones en options.locale se utiliza el idioma por defecto
     */
    public setLang(lang) {
        this._options.lang = lang;
        this.updateLocale();
    }

    /**
     * Actualiza las traducciones
     */
    public updateLocale() {
        let lang = this._options.lang,
            locale = this._options.locale[lang] || this._options.locale[this._options.defaultLang];
        if (locale) {
            for (let key in locale) {
                this._updateText(key, locale[key]);
            }
        }
    }

    /**
     * Establece un texto en uno o varios elementos
     * @param {string}      to      Se buscan los elementos que correspondan con el selector [data-hz-navbar-content=valor]
     * @param {string}      text    Texto a establecer
     * @private
     */
    protected _updateText(to, text) {
        if (to) {
            let $element = this._$element.find(`[data-hz-navbar-content=${to}]`);
            if ($element.length > 0) {
                for (let elementIndex = 0, $elementLength = $element.length; elementIndex < $elementLength; elementIndex++) {
                    let $currentElement = $($element[elementIndex]);
                    let attr = $currentElement.data("hzNavbarContentTo") || "text";
                    if (attr === "text") {
                        $currentElement.text(text);
                    } else {
                        $currentElement.attr(attr, text);
                    }
                }

            }
        }
    }

    public closeIndexList() {
        if (this._indexListDialog) {
            this._indexListDialog.close();
        }
    }

    public indexListIsOpen() {
        let result;
        if (this._indexListDialog) {
            result = this._indexListDialog.isOpen();
            this._indexListDialog.open();
        }
        return result;
    }

    public openIndexList() {
        if (this._indexListDialog) {
            this.updateIndex();
            this._indexListDialog.open();
        }
    }

    protected _generateIndex() {
        if (this._$indexList && this._$indexList.length > 0 && this._$indexListItemTemplate && this._$indexListItemTemplate.length > 0) {
            this._$indexListItemTemplate.detach();
            let options = $.extend(
                {},
                HzNavbarComponent.OPT_DIALOG_DEFAULTS,
                this._DataOptions.getDataOptions(
                    this._$indexList,
                    HzNavbarComponent.PREFIX_LIST_DIALOG_OPTIONS
                )
            );
            options.dialogClass = HzNavbarComponent.CLASS_LIST_INDEX_DIALOG;
            this._$indexList.dialog(options);
            this._indexListDialog = this._$indexList.data("ui-dialog");
        }
    }

    public updateIndex() {
        if (this._$indexList && this._$indexList.length > 0 && this._$indexListItemTemplate && this._$indexListItemTemplate.length > 0) {
            this._$indexList.empty();
            let pages = [];
            let numPages = this._PageManager.count(),
                previousState;
            for (let numPageIndex = 0; numPageIndex < numPages; numPageIndex++) {
                let currentPage = this._PageManager.getPage(numPageIndex),
                    pageRegister = currentPage.getPage();
                let $page: JQuery = this._$indexListItemTemplate.clone();
                $page.find(HzNavbarComponent.QUERY_INDEX_LIST_ITEM_CONTENT).html(pageRegister._options.title);
                if (currentPage._state.completed) {
                    $page.addClass(HzNavbarComponent.CLASS_PAGE_COMPLETED);
                } else if (currentPage._state.visited) {
                    $page.addClass(HzNavbarComponent.CLASS_PAGE_VISITED);
                }
                if (previousState == undefined || previousState.completed) {
                    $page.data(
                        HzNavbarComponent.DATA_PAGE, {
                            name: pageRegister.getName(),
                            index: numPageIndex
                        }
                    );
                }
                previousState = currentPage._state;
                pages.push($page);
            }
            this._$indexList.append(pages);
        }
    }

    /**
     * Obtiene los elementos del DOM a utilizar
     * @protected
     */
    protected _getElements() {
        this._$nextBtn = this._$element.find(HzNavbarComponent.QUERY_ACTION_NEXT);
        this._$prevBtn = this._$element.find(HzNavbarComponent.QUERY_ACTION_PREV);
        this._$bar = this._$element.find(HzNavbarComponent.QUERY_BAR);
        this._$progress = this._$element.find(HzNavbarComponent.QUERY_PROGRESS);
        this._$homeBtn = this._$element.find(HzNavbarComponent.QUERY_ACTION_HOME);
        this._$indexBtn = this._$element.find(HzNavbarComponent.QUERY_ACTION_INDEX);
        this._$currentPageIndex = this._$element.find(HzNavbarComponent.QUERY_PAGE_CURRENT);
        this._$numPages = this._$element.find(HzNavbarComponent.QUERY_PAGE_TOTAL);
        this._$indexList = this._$element.find(HzNavbarComponent.QUERY_INDEX_LIST);
        this._$indexListItemTemplate = this._$indexList.find(HzNavbarComponent.QUERY_INDEX_LIST_ITEM);
    }

    /**
     * Asigna los handlers a eventos
     * @protected
     */
    protected _assignEvents() {
        this._$nextBtn.on(`click.${HzNavbarComponent.NAMESPACE}`, {instance: this}, this._onNextClick);
        this._$prevBtn.on(`click.${HzNavbarComponent.NAMESPACE}`, {instance: this}, this._onPrevClick);
        this._$homeBtn.on(`click.${HzNavbarComponent.NAMESPACE}`, {instance: this}, this._onHomeClick);
        this._$indexBtn.on(`click.${HzNavbarComponent.NAMESPACE}`, {instance: this}, this._onIndexClick);
        this._$indexList.on(
            `click.${HzNavbarComponent.NAMESPACE}`,
            HzNavbarComponent.QUERY_INDEX_LIST_ITEM,
            {instance: this},
            this._onIndexListItemClick
        );
        this._Navigator.on(Navigator.ON_DISABLE, {instance: this}, this._onDisabled);
        this._Navigator.on(Navigator.ON_ENABLE, {instance: this}, this._onEnabled);
        this._Navigator.on(Navigator.ON_CHANGE_PAGE_START, {instance: this}, this._onPageChangeStart);
        this._Navigator.on(Navigator.ON_CHANGE_PAGE_END, {instance: this}, this._onPageChangeEnd);
    }

    protected _onIndexListItemClick(e) {
        e.preventDefault();
        let instance = e.data.instance,
            $item = $(this),
            page = $item.data(HzNavbarComponent.DATA_PAGE);
        if (page) {
            instance.closeIndexList();
            instance._Navigator.goTo(page.index);
        }
    }
    /**
     * Invocado al hacerse click en el botón siguiente. Invoca a _Navigator#next
     * @param e
     * @private
     */
    protected _onNextClick(e) {
        let instance = e.data.instance;
        instance._Navigator.next();
    }

    /**
     * Invocado al hacerse click en el botón anterior. Invoca a _Navigator#prev
     * @param e
     * @private
     */
    protected _onPrevClick(e) {
        let instance = e.data.instance;
        instance._Navigator.prev();
    }

    protected _onHomeClick(e) {
        let instance = e.data.instance;
    }

    protected _onIndexClick(e) {
        let instance = e.data.instance;
        if (instance.indexListIsOpen()) {
            instance.closeIndexList();
        } else {
            instance.openIndexList();
        }
    }


    /**
     * Aplica el cambio de estilos a la barra de progreso y actualiza el texto de progreso
     * @param {Number}      value       Valora establecer
     * @protected
     */
    protected _updateProgressValue(value: number) {
        this._$progress.text(`${value}%`);
        this._$bar.css("transform", `scaleX(${value / 100})`);
    }

    /**
     * Invocado al comenzar el cambio de página. Deshabilita la navegación durante el proceso
     * @param e
     * @param newPage
     * @param oldPage
     * @private
     */
    protected _onPageChangeStart(e, newPage: INavigatorPageData, oldPage: INavigatorPageData) {
        if (!e.isDefaultPrevented()) {
            let instance = e.data.instance;
            if (oldPage) {
                let pageImplementation = instance._PageManager.getPage(oldPage.index),
                    page = pageImplementation.getPage();
                page.off("." + HzNavbarComponent.NAMESPACE);
            }
            instance._setCurrentPage(newPage.index);
            instance._$prevBtn.attr("disabled", "disabled");
            instance._$nextBtn.attr("disabled", "disabled");
        }
    }

    /**
     * Establece los estados de los botones de navegación en base a los datos de Navigator
     * @private
     */
    protected _updatePagerButtonState() {
        if (!this._Navigator.isDisabled()) {
            if (this._currentPageIndex === 0) {
                this._$prevBtn.attr("disabled", "disabled");
                this._$nextBtn.removeAttr("disabled");
            } else if (this._currentPageIndex === this._numPages - 1) {
                this._$nextBtn.attr("disabled", "disabled");
                this._$prevBtn.removeAttr("disabled");
            } else {
                this._$nextBtn.removeAttr("disabled");
                this._$prevBtn.removeAttr("disabled");
            }
            if (!this._$nextBtn.prop("disabled")) {
                if (this._Navigator.getCurrentPage().getController().isCompleted()) {
                    this._$nextBtn.removeAttr("disabled");
                } else {
                    this._$nextBtn.attr("disabled", "disabled");
                }
            }
        } else {
            this._$prevBtn.attr("disabled", "disabled");
            this._$nextBtn.attr("disabled", "disabled");
        }
    }

    /**
     * Invocado al finalizarse el cambio de página. Actualiza el paginador y el estado de los botones de navegación
     * @param e
     * @param newPage
     * @param oldPage
     * @private
     */
    protected _onPageChangeEnd(e, newPage: INavigatorPageData, oldPage: INavigatorPageData) {
        let instance = e.data.instance;
        instance._updatePagerButtonState();
        instance.progress((instance._Navigator.getVisitedPages().length * 100) / instance._numPages);
        let pageImplementation = instance._Navigator.getCurrentPage(),
            page = pageImplementation.getPage();
        page.off("." + HzNavbarComponent.NAMESPACE).on(
            `${PageController.ON_COMPLETE_CHANGE}.${HzNavbarComponent.NAMESPACE}`,
            {instance: instance},
            instance._onPageCompleteChange
        );
    }

    /**
     * Invocado al completarse la página. Actualiza el estado del botón siguiente
     * @param e
     * @param completed
     * @private
     */
    protected _onPageCompleteChange(e, completed) {
        if (completed) {
            let instance = e.data.instance;
            let pageImplementation = instance._Navigator.getCurrentPage(),
                page = pageImplementation.getPage();
            if (instance._PageManager.getPageIndex(page.getName()) !== instance._PageManager.count() - 1) {
                if (pageImplementation.getController().isCompleted()) {
                    instance._$nextBtn.removeAttr("disabled");
                } else {
                    instance._$nextBtn.attr("disabled", "disabled");
                }
            }
        }
    }

    /**
     * Establece el valor a la cantidad de páginas y actualiza el texto del elemento
     * @param {Number}  value       Cantidad de páginas
     * @private
     */
    protected _setNumPages(value) {
        this._numPages = value;
        this._$numPages.text(value);
    }

    /**
     * Establece el valor de la página actual y actualiza el texto del elemento. Se espera recibir el índice de la página comenzando por 0
     * @param {Number}  value       Índice de la página actual
     * @private
     */
    protected _setCurrentPage(value) {
        this._currentPageIndex = value;
        this._$currentPageIndex.text(value + 1);
    }

    protected _onDisabled(e) {
        let instance = e.data.instance;
        instance._updatePagerButtonState();
    }

    protected _onEnabled(e) {
        let instance = e.data.instance;
        instance._updatePagerButtonState();
    }
}

