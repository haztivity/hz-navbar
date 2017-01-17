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
    PageController
} from "davinchi_finsi";
@Component(
    {
        name: "HzNavbar",
        dependencies: [
            $,
            EventEmitterFactory,
            Navigator,
            PageManager
        ]
    }
)
export class HzNavbarComponent extends ComponentController {
    public static readonly NAMESPACE = "hzNavbar";
    protected static readonly PREFIX = "hz-navbar";
    protected static readonly _DEFAULTS = {
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
    protected _$nextBtn: JQuery;
    protected _$prevBtn: JQuery;
    protected _$bar: JQuery;
    protected _$progress: JQuery;
    protected _$homeBtn: JQuery;
    protected _$indexBtn: JQuery;
    protected _$currentPageIndex: JQuery;
    protected _$numPages: JQuery;
    protected _progress: number;
    protected _currentPageIndex: number = 0;
    protected _numPages: number = 0;
    constructor(_$: JQueryStatic, _EventEmitterFactory, protected _Navigator: Navigator, protected _PageManager: PageManager) {
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
    /**
     * Obtiene los elementos del DOM a utilizar
     * @protected
     */
    protected _getElements() {
        this._$nextBtn = this._$element.find(`[data-${HzNavbarComponent.PREFIX}-next]`);
        this._$prevBtn = this._$element.find(`[data-${HzNavbarComponent.PREFIX}-prev]`);
        this._$bar = this._$element.find(`[data-${HzNavbarComponent.PREFIX}-bar]`);
        this._$progress = this._$element.find(`[data-${HzNavbarComponent.PREFIX}-progress]`);
        this._$homeBtn = this._$element.find(`[data-${HzNavbarComponent.PREFIX}-home]`);
        this._$indexBtn = this._$element.find(`[data-${HzNavbarComponent.PREFIX}-index]`);
        this._$currentPageIndex = this._$element.find(`[data-${HzNavbarComponent.PREFIX}-current]`);
        this._$numPages = this._$element.find(`[data-${HzNavbarComponent.PREFIX}-total]`);
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
        this._Navigator.on(Navigator.ON_DISABLE, {instance: this}, this._onDisabled);
        this._Navigator.on(Navigator.ON_ENABLE, {instance: this}, this._onEnabled);
        this._Navigator.on(Navigator.ON_CHANGE_PAGE_START, {instance: this}, this._onPageChangeStart);
        this._Navigator.on(Navigator.ON_CHANGE_PAGE_END, {instance: this}, this._onPageChangeEnd);
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
        let instance = e.data.instance;
        if (oldPage) {
            let pageImplementation = instance._PageManager.getPage(oldPage.index),
                page = pageImplementation.getPage();
            page.off("." + HzNavbarComponent.NAMESPACE);
        }
        instance._$prevBtn.attr("disabled", "disabled");
        instance._$nextBtn.attr("disabled", "disabled");
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
        instance._setCurrentPage(newPage.index);
        instance._updatePagerButtonState();
        let pageImplementation = instance._Navigator.getCurrentPage(),
            page = pageImplementation.getPage();
        instance.progress((instance._Navigator.getVisitedPages().length * 100) / instance._numPages);
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

