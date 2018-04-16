import {
    $,
    Navigator,
    INavigatorPageData,
    Component,
    ComponentController,
    EventEmitterFactory,
    PageManager,
    PageController,
    DataOptions,
    ScoFactory
} from "@haztivity/core";
import "jquery-ui-dist/jquery-ui";
import * as Hammer from "hammerjs";
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
    public static readonly QUERY_ACTION_NEXT = `[data-${HzNavbarComponent.PREFIX}-next]`;
    public static readonly QUERY_ACTION_PREV = `[data-${HzNavbarComponent.PREFIX}-prev]`;
    public static readonly QUERY_BAR = `[data-${HzNavbarComponent.PREFIX}-bar]`;
    public static readonly QUERY_PROGRESS = `[data-${HzNavbarComponent.PREFIX}-progress]`;
    public static readonly QUERY_ACTION_HOME = `[data-${HzNavbarComponent.PREFIX}-home]`;
    public static readonly QUERY_ACTION_INDEX = `[data-${HzNavbarComponent.PREFIX}-index]`;
    public static readonly QUERY_ACTION_EXIT = `[data-${HzNavbarComponent.PREFIX}-exit]`;
    public static readonly QUERY_ACTION_EXIT_DIALOG = `[data-${HzNavbarComponent.PREFIX}-exit-dialog]`;
    public static readonly QUERY_PAGE_CURRENT = `[data-${HzNavbarComponent.PREFIX}-current]`;
    public static readonly QUERY_PAGE_TOTAL = `[data-${HzNavbarComponent.PREFIX}-total]`;
    public static readonly QUERY_INDEX_LIST = `[data-${HzNavbarComponent.PREFIX}-index-list]`;
    public static readonly QUERY_INDEX_LIST_ITEM = `[data-${HzNavbarComponent.PREFIX}-index-list-item]`;
    public static readonly QUERY_INDEX_LIST_ITEM_CONTENT = `[data-${HzNavbarComponent.PREFIX}-index-list-item-content]`;
    public static readonly CLASS_PAGE_VISITED = "hz-navbar__page--visited";
    public static readonly CLASS_PAGE_COMPLETED = "hz-navbar__page--completed";
    public static readonly CLASS_ACTIVE_PAGE = "hz-navbar__page--active";
    public static readonly CLASS_LIST_INDEX_DIALOG = "hz-navbar__dialog hz-navbar__index-list-dialog";
    public static readonly CLASS_LIST_EXIT_DIALOG = "hz-navbar__dialog hz-navbar__index-list-dialog";
    public static readonly CLASS_DISABLED = "hz-navbar--disabled";
    public static readonly CLASS_BTN_DISABLED = "hz-navbar__btn--disabled";
    public static readonly DATA_PAGE = "hzNavbarPage";
    protected static readonly OPT_DIALOG_DEFAULTS = {
        autoOpen: false,
        show:"fade",
        hide:"fade",
        position:{my:"center",at:"center"}
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
                index: "Índice",
                exit: "Salir",
                exitTitle:"Salir",
                exitMessage:"Va a salir del curso. ¿Desea guardar la puntuación y salir?",
                exitOk:"Salir",
                exitKo:"Cancelar"
            }
        },
        touch:true,
        maxRestTime:2000,
        escapeVelocity:0.1,
        defaultLang: "es",
        reverseSwipeNavigation:true
    };
    protected _$nextBtn: JQuery;
    protected _$prevBtn: JQuery;
    protected _$bar: JQuery;
    protected _$progress: JQuery;
    protected _$homeBtn: JQuery;
    protected _$indexBtn: JQuery;
    protected _$exitBtn: JQuery;
    protected _$exitDialog:JQuery;
    protected _$currentPageIndex: JQuery;
    protected _$numPages: JQuery;
    protected _$indexList: JQuery;
    protected _$indexListItemTemplate: JQuery;
    protected _progress: number = 0;
    protected _currentPageIndex: number = 0;
    protected _numPages: number = 0;
    protected _indexListDialog;
    protected _exitDialog;
    protected _actionsDisabled;
    protected _nextDisabled:boolean;
    protected _prevDisabled:boolean;
    protected _touchRegion;
    constructor(_$: JQueryStatic, _EventEmitterFactory, protected _Navigator: Navigator, protected _PageManager: PageManager, protected _DataOptions) {
        super(_$, _EventEmitterFactory);
    }

    init(options, config?) {
        this._options = $.extend(true, {}, HzNavbarComponent._DEFAULTS, options);
        this._getElements();
        this.updateLocale();
        this._initExitDialog();
        this.progress(this._Navigator.getProgressPercentage());
        this._assignEvents();
        this.updatePaginator();
        if(this._options.touch != false){
            //this._touchRegion = new ZingTouch.Region(ScoFactory.getCurrentSco()._$context.get(0));
            this.hammerManager = new Hammer.Manager(ScoFactory.getCurrentSco()._$context.get(0), {
                touchAction: 'auto',
                inputClass: Hammer.SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchInput
            });
            this.hammerManager.add( new Hammer.Swipe({ direction: Hammer.DIRECTION_HORIZONTAL}) );
            this.hammerManager.on("swipe", Hammer.bindFn(this._onSwipe, this));
        }
    }
    protected _onSwipe(e){
        debugger;

        //if target is navbar

        //else
        //if X is 0-50, and direction is right
        //else if x is window-50 and direction is lef

        if(!this._Navigator.isDisabled()) {
            // starting from left and counter clockwise
            //       90
            //   180     0/360
            //      270
            //right or down
            let goTo;
            if(this._$element.get(0) == e.target || this._$element.find(e.target).length > 0){
                if (e.direction === Hammer.DIRECTION_RIGHT) {
                    goTo = 1;
                } else if(e.direction === Hammer.DIRECTION_LEFT){
                    goTo = -1;
                }
            }else{
                const delta_x = e.deltaX,
                    x = e.changedPointers[0].clientX - delta_x,
                    maxWidth = $(document.body).width();
                if (x<=100) {
                    // handle swipe from left edge e.t.c
                    goTo = 1;
                }else if(x>= maxWidth-100){
                    // handle other case
                    goTo = -1;
                }
            }
            if(goTo != undefined){
                if(this._options.reverseSwipeNavigation){
                    goTo /= -1;
                }
                if(goTo === 1 && !this._nextDisabled){
                    this._Navigator.next();
                }else if(goTo === -1 && !this._prevDisabled){
                    this._Navigator.prev();
                }
            }
        }
    }
    protected _initExitDialog(){
        let locale = this._options.locale[this._options.lang] || this._options.locale[this._options.defaultLang];
        let options = this._DataOptions.getDataOptions(this._$exitDialog, "dialog");
        options = $.extend(true,options,{
            autoOpen:false,
            show:"fade",
            hide:"fade",
            resizable:false,
            modal:true,
            buttons: [
                {
                    text: locale.exitOk,
                    click:this._onConfirmExit.bind(this)
                },
                {
                    text: locale.exitKo,
                    click:this._onCancelExit.bind(this)
                }
            ]
        });
        if(options.dialogClass){
            options.dialogClass+=" "+HzNavbarComponent.CLASS_LIST_EXIT_DIALOG;
        }else{
            options.dialogClass = HzNavbarComponent.CLASS_LIST_EXIT_DIALOG;
        }
        this._$exitDialog.dialog(options);
        this._exitDialog = this._$exitDialog.dialog("instance");
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
        if (value != undefined) {
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
                true,
                {},
                HzNavbarComponent.OPT_DIALOG_DEFAULTS,
                this._DataOptions.getDataOptions(
                    this._$indexList,
                    "dialog"
                )
            );
            options.dialogClass = HzNavbarComponent.CLASS_LIST_INDEX_DIALOG;
            this._$indexList.dialog(options);
            this._$indexList.on("dialogclose",{instance:this},this._onDialogClosed);
            this._indexListDialog = this._$indexList.data("ui-dialog");
        }
    }

    public updateIndex() {
        if (this._$indexList && this._$indexList.length > 0 && this._$indexListItemTemplate && this._$indexListItemTemplate.length > 0) {
            this._$indexList.empty();
            let pages = [];
            let numPages = this._PageManager.count();
            for (let numPageIndex = 0; numPageIndex < numPages; numPageIndex++) {
                let currentPage = this._PageManager.getPage(numPageIndex),
                    pageRegister = currentPage.getPage();
                let $page: JQuery = this._$indexListItemTemplate.clone();
                $page.find(HzNavbarComponent.QUERY_INDEX_LIST_ITEM_CONTENT).html(pageRegister._options.title);
                $page.attr("data-page",pageRegister._options.name);
                if(this._currentPageIndex == numPageIndex){
                    $page.addClass(HzNavbarComponent.CLASS_ACTIVE_PAGE);
                }
                if (currentPage._state.completed) {
                    $page.addClass(HzNavbarComponent.CLASS_PAGE_COMPLETED);
                } else if (currentPage._state.visited) {
                    $page.addClass(HzNavbarComponent.CLASS_PAGE_VISITED);
                }
                $page.data(
                    HzNavbarComponent.DATA_PAGE, {
                        name: pageRegister.getName(),
                        index: numPageIndex
                    }
                );
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
        this._$exitBtn = this._$element.find(HzNavbarComponent.QUERY_ACTION_EXIT);
        this._$exitDialog = this._$element.find(HzNavbarComponent.QUERY_ACTION_EXIT_DIALOG);
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
        this._$exitBtn.on(`click.${HzNavbarComponent.NAMESPACE}`, {instance: this}, this._onExitClick);
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
            if(e.ctrlKey){
                instance._Navigator.enableDev();
            }
            if(!!instance._Navigator.goTo(page.index)){
                instance.closeIndexList();
            }
            instance._Navigator.disableDev();
        }
    }
    /**
     * Invocado al hacerse click en el botón siguiente. Invoca a _Navigator#next
     * @param e
     * @private
     */
    protected _onNextClick(e) {
        let instance = e.data.instance;
        if(!instance._Navigator.isDisabled() && !instance._nextDisabled) {
            instance._Navigator.next();
        }else if(e.ctrlKey){
            instance._Navigator.enableDev();
            instance._Navigator.next();
            instance._Navigator.disableDev();
        }
    }

    /**
     * Invocado al hacerse click en el botón anterior. Invoca a _Navigator#prev
     * @param e
     * @private
     */
    protected _onPrevClick(e) {
        let instance = e.data.instance;
        if(!instance._Navigator.isDisabled() && !instance._prevDisabled) {
            instance._Navigator.prev();
        }else if(e.ctrlKey){
            instance._Navigator.enableDev();
            instance._Navigator.prev();
            instance._Navigator.disableDev();
        }
    }

    protected _onHomeClick(e) {
        let instance = e.data.instance;
        instance._Navigator.goTo(0);
    }
    protected _onExitClick(e) {
        let instance = e.data.instance;
        instance._exitDialog.open();
    }
    protected _onCancelExit(){
        this._exitDialog.close();
    }
    protected _onConfirmExit(){
        this._exitDialog.close();
        this._exitDialog.destroy();
        if(this._indexListDialog) {
            this._indexListDialog.close();
            this._indexListDialog.destroy();
        }
        ScoFactory.getCurrentSco().exit();
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
    protected _disableActions(){
        this._actionsDisabled = true;
        this._$homeBtn.addClass(HzNavbarComponent.CLASS_DISABLED).prop("disabled",true);
        this._$exitBtn.addClass(HzNavbarComponent.CLASS_DISABLED).prop("disabled",true);
        this._$indexBtn.addClass(HzNavbarComponent.CLASS_DISABLED).prop("disabled",true);
        if(this._indexListDialog) {
            this._indexListDialog.close();
            this._indexListDialog.disable();
        }
        if(this._exitDialog) {
            this._exitDialog.close();
            this._exitDialog.disable();
        }
    }
    protected _enableActions(){
        this._$homeBtn.removeClass(HzNavbarComponent.CLASS_DISABLED).prop("disabled",false);
        this._$exitBtn.removeClass(HzNavbarComponent.CLASS_DISABLED).prop("disabled",false);
        this._$indexBtn.removeClass(HzNavbarComponent.CLASS_DISABLED).prop("disabled",false);
        if(this._indexListDialog) {
            this._indexListDialog.enable();
        }
        if(this._exitDialog) {
            this._exitDialog.enable();
        }
        this._actionsDisabled = false;
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
            instance._disableActions();
            if (oldPage) {
                let pageImplementation = instance._PageManager.getPage(oldPage.index),
                    page = pageImplementation.getPage();
                page.off("." + HzNavbarComponent.NAMESPACE);
            }
            instance._setCurrentPage(newPage.index);
            instance._$prevBtn.addClass(HzNavbarComponent.CLASS_BTN_DISABLED);
            instance._nextDisabled = true;
            instance._$nextBtn.addClass(HzNavbarComponent.CLASS_BTN_DISABLED);
            instance._prevDisabled = true;
        }
    }

    /**
     * Establece los estados de los botones de navegación en base a los datos de Navigator
     * @private
     */
    protected _updatePagerButtonState() {
        if (!this._Navigator.isDisabled()) {
            if (this._currentPageIndex === 0) {
                this._$prevBtn.addClass(HzNavbarComponent.CLASS_BTN_DISABLED);
                this._prevDisabled = true;
                this._$nextBtn.removeClass(HzNavbarComponent.CLASS_BTN_DISABLED);
                this._nextDisabled = false;
            } else if (this._currentPageIndex === this._numPages - 1) {
                this._$nextBtn.addClass(HzNavbarComponent.CLASS_BTN_DISABLED);
                this._nextDisabled = true;
                this._$prevBtn.removeClass(HzNavbarComponent.CLASS_BTN_DISABLED);
                this._prevDisabled = false;
            } else {
                this._$nextBtn.removeClass(HzNavbarComponent.CLASS_BTN_DISABLED);
                this._nextDisabled = false;
                this._$prevBtn.removeClass(HzNavbarComponent.CLASS_BTN_DISABLED);
                this._prevDisabled = false;
            }
            if (!this._$nextBtn.prop("disabled")) {
                if (this._Navigator.getCurrentPage().getController().isCompleted()) {
                    this._$nextBtn.removeClass(HzNavbarComponent.CLASS_BTN_DISABLED);
                    this._nextDisabled = false;
                } else {
                    this._$nextBtn.addClass(HzNavbarComponent.CLASS_BTN_DISABLED);
                    this._nextDisabled = true;
                }
            }
        } else {
            this._$prevBtn.addClass(HzNavbarComponent.CLASS_BTN_DISABLED);
            this._prevDisabled = true;
            this._$nextBtn.addClass(HzNavbarComponent.CLASS_BTN_DISABLED);
            this._nextDisabled = true;
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
        let pageImplementation = instance._Navigator.getCurrentPage(),
            page = pageImplementation.getPage();
        instance._enableActions();
        if(pageImplementation.isCompleted()){
            instance.progress(instance._Navigator.getProgressPercentage());
        }else {
            page.off("." + HzNavbarComponent.NAMESPACE).on(
                `${PageController.ON_COMPLETE_CHANGE}.${HzNavbarComponent.NAMESPACE}`,
                {instance: instance},
                instance._onPageCompleteChange
            );
        }
    }

    /**
     * Invocado al completarse la página. Actualiza el estado del botón siguiente y del % de avance
     * @param e
     * @param completed
     * @private
     */
    protected _onPageCompleteChange(e, completed) {
        if (completed) {
            let instance = e.data.instance;
            instance.progress(instance._Navigator.getProgressPercentage());
            let pageImplementation = instance._Navigator.getCurrentPage(),
                page = pageImplementation.getPage();
            if (instance._PageManager.getPageIndex(page.getName()) !== instance._PageManager.count() - 1) {
                if (pageImplementation.getController().isCompleted()) {
                    instance._$nextBtn.removeClass(HzNavbarComponent.CLASS_BTN_DISABLED);
                    instance._nextDisabled = false;
                } else {
                    instance._$nextBtn.addClass(HzNavbarComponent.CLASS_BTN_DISABLED);
                    instance._nextDisabled = true;
                }
            }
        }
    }

    /**
     * Invocado al cerrarse el dialogo. Restablece estilos
     */
    protected _onDialogClosed(e){
        const instance = e.data.instance;
        instance._indexListDialog.uiDialog.css("top","");
        instance._indexListDialog.uiDialog.css("left","");
        instance._indexListDialog.uiDialog.css("bottom","");
        instance._indexListDialog.uiDialog.css("right","");
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