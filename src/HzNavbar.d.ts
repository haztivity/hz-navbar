/// <reference types="jquery" />
/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
import {Navigator, INavigatorPageData, ComponentController, PageManager} from "@haztivity/core";
export declare class HzNavbarComponent extends ComponentController {
    protected _Navigator: Navigator;
    protected _PageManager: PageManager;
    protected _DataOptions: any;
    static readonly NAMESPACE: string;
    protected static readonly PREFIX: string;
    static readonly PREFIX_LIST_DIALOG_OPTIONS: string;
    static readonly QUERY_ACTION_NEXT: string;
    static readonly QUERY_ACTION_PREV: string;
    static readonly QUERY_BAR: string;
    static readonly QUERY_PROGRESS: string;
    static readonly QUERY_ACTION_HOME: string;
    static readonly QUERY_ACTION_INDEX: string;
    static readonly QUERY_PAGE_CURRENT: string;
    static readonly QUERY_PAGE_TOTAL: string;
    static readonly QUERY_INDEX_LIST: string;
    static readonly QUERY_INDEX_LIST_ITEM: string;
    static readonly QUERY_INDEX_LIST_ITEM_CONTENT: string;
    static readonly CLASS_PAGE_VISITED: string;
    static readonly CLASS_PAGE_COMPLETED: string;
    static readonly CLASS_LIST_INDEX_DIALOG: string;
    static readonly DATA_PAGE: string;
    protected static readonly OPT_DIALOG_DEFAULTS: {
        autoOpen: boolean;
    };
    protected static readonly _DEFAULTS: {
        locale: {
            "es": {
                next: string;
                prev: string;
                currentPage: string;
                totalPages: string;
                home: string;
                showIndex: string;
                index: string;
            };
        };
        defaultLang: string;
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
    protected _currentPageIndex: number;
    protected _numPages: number;

    constructor(_$: JQueryStatic, _EventEmitterFactory: any, _Navigator: Navigator, _PageManager: PageManager, _DataOptions: any);
    init(options: any, config?: any): void;
    updatePaginator(): void;
    /**
     * Si se indica parámetro se establece el porcentaje. El número es redondeado a 2 decimales
     * Si no se indica parámetro, devuelve el porcentaje actual
     * @param {Number}      [value]         Valor a establecer
     * @returns {number}
     */
    progress(value?: number): number;
    /**
     * Establece un idioma
     * @param {string}  lang        Idioma. Si no tiene traducciones en options.locale se utiliza el idioma por defecto
     */
    setLang(lang: any): void;
    /**
     * Actualiza las traducciones
     */
    updateLocale(): void;
    /**
     * Establece un texto en uno o varios elementos
     * @param {string}      to      Se buscan los elementos que correspondan con el selector [data-hz-navbar-content=valor]
     * @param {string}      text    Texto a establecer
     * @private
     */
    protected _updateText(to: any, text: any): void;

    closeIndexList(): void;

    indexListIsOpen(): any;

    openIndexList(): void;

    protected _generateIndex(): void;

    updateIndex(): void;
    /**
     * Obtiene los elementos del DOM a utilizar
     * @protected
     */
    protected _getElements(): void;
    /**
     * Asigna los handlers a eventos
     * @protected
     */
    protected _assignEvents(): void;

    protected _onIndexListItemClick(e: any): void;
    /**
     * Invocado al hacerse click en el botón siguiente. Invoca a _Navigator#next
     * @param e
     * @private
     */
    protected _onNextClick(e: any): void;
    /**
     * Invocado al hacerse click en el botón anterior. Invoca a _Navigator#prev
     * @param e
     * @private
     */
    protected _onPrevClick(e: any): void;
    protected _onHomeClick(e: any): void;
    protected _onIndexClick(e: any): void;
    /**
     * Aplica el cambio de estilos a la barra de progreso y actualiza el texto de progreso
     * @param {Number}      value       Valora establecer
     * @protected
     */
    protected _updateProgressValue(value: number): void;
    /**
     * Invocado al comenzar el cambio de página. Deshabilita la navegación durante el proceso
     * @param e
     * @param newPage
     * @param oldPage
     * @private
     */
    protected _onPageChangeStart(e: any, newPage: INavigatorPageData, oldPage: INavigatorPageData): void;
    /**
     * Establece los estados de los botones de navegación en base a los datos de Navigator
     * @private
     */
    protected _updatePagerButtonState(): void;
    /**
     * Invocado al finalizarse el cambio de página. Actualiza el paginador y el estado de los botones de navegación
     * @param e
     * @param newPage
     * @param oldPage
     * @private
     */
    protected _onPageChangeEnd(e: any, newPage: INavigatorPageData, oldPage: INavigatorPageData): void;
    /**
     * Invocado al completarse la página. Actualiza el estado del botón siguiente
     * @param e
     * @param completed
     * @private
     */
    protected _onPageCompleteChange(e: any, completed: any): void;
    /**
     * Establece el valor a la cantidad de páginas y actualiza el texto del elemento
     * @param {Number}  value       Cantidad de páginas
     * @private
     */
    protected _setNumPages(value: any): void;
    /**
     * Establece el valor de la página actual y actualiza el texto del elemento. Se espera recibir el índice de la página comenzando por 0
     * @param {Number}  value       Índice de la página actual
     * @private
     */
    protected _setCurrentPage(value: any): void;
    protected _onDisabled(e: any): void;
    protected _onEnabled(e: any): void;
}
