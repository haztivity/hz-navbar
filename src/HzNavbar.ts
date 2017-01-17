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
    protected _$nextBtn: JQuery;
    protected _$prevBtn: JQuery;

    constructor(_$: JQueryStatic, _EventEmitterFactory, protected _Navigator: Navigator, protected _PageManager: PageManager) {
        super(_$, _EventEmitterFactory);
    }

    init(options) {
        this._$nextBtn = this._$element.find(`[data-${HzNavbarComponent.PREFIX}-next]`);
        this._$prevBtn = this._$element.find(`[data-${HzNavbarComponent.PREFIX}-prev]`);
        this._assignEvents();
    }

    protected _assignEvents() {
        this._$nextBtn.on(`click.${HzNavbarComponent.NAMESPACE}`, {instance: this}, this._onNextClick);
        this._$prevBtn.on(`click.${HzNavbarComponent.NAMESPACE}`, {instance: this}, this._onPrevClick);
        this._Navigator.on(Navigator.ON_DISABLE, {instance: this}, this._onDisabled);
        this._Navigator.on(Navigator.ON_ENABLE, {instance: this}, this._onEnabled);
        this._Navigator.on(Navigator.ON_CHANGE_PAGE_START, {instance: this}, this._onPageChangeStart);
        this._Navigator.on(Navigator.ON_CHANGE_PAGE_END, {instance: this}, this._onPageChangeEnd);
    }

    protected _onNextClick(e) {
        let instance = e.data.instance;
        instance._Navigator.next();
    }

    protected _onPrevClick(e) {
        let instance = e.data.instance;
        instance._Navigator.prev();
    }

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

    protected _onPageChangeEnd(e, newPage: INavigatorPageData, oldPage: INavigatorPageData) {
        let instance = e.data.instance;
        if (newPage.index === 0) {
            instance._$prevBtn.attr("disabled", "disabled");
            instance._$nextBtn.removeAttr("disabled");
        } else if (newPage.index === instance._PageManager.count() - 1) {
            instance._$nextBtn.attr("disabled", "disabled");
            instance._$prevBtn.removeAttr("disabled");
        } else {
            instance._$nextBtn.removeAttr("disabled");
            instance._$prevBtn.removeAttr("disabled");
        }
        let pageImplementation = instance._Navigator.getCurrentPage(),
            page = pageImplementation.getPage();
        if (!instance._$nextBtn.prop("disabled")) {
            if (pageImplementation.getController().isCompleted()) {
                instance._$nextBtn.removeAttr("disabled");
            } else {
                instance._$nextBtn.attr("disabled", "disabled");
            }
        }
        page.off("." + HzNavbarComponent.NAMESPACE).on(
            `${PageController.ON_COMPLETE_CHANGE}.${HzNavbarComponent.NAMESPACE}`,
            {instance: instance},
            instance._onPageCompleteChange
        );
    }

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

    protected _onDisabled(e) {
        let instance = e.data.instance;
    }

    protected _onEnabled(e) {
        let instance = e.data.instance;
    }

    public enable() {
        this._Navigator.enable();
    }

    public disable() {
        this._Navigator.disable();
    }
}

