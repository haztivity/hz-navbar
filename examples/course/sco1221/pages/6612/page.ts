/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
import * as Prism "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-pug";
import {PageFactory, PageRegister, PageController, NavigatorService} from "@haztivity/core";
import  template from "./page.pug";
export let page: PageRegister = PageFactory.createPage(
    {
        title: "Manipulation",
        name: "6612",
        resources: [],
        template: template,
        isHeader:false
    }
);
page.on(
    PageController.ON_SHOW, null, (eventObject, $page, $oldPage, oldPageRelativePosition, pageController) => {
        Prism.highlightAll(false);
        let navigatorService:NavigatorService = pageController.InjectorService.get(NavigatorService);
        navigatorService.disable();
        $page.find("#next").on("click",()=>{
            navigatorService.enable();
            navigatorService.next();
        });
        $page.find("#enable").on("click",()=>{
            navigatorService.enable();
        });
        $page.find("#disable").on("click",()=>{
            navigatorService.disable();
        });
    }
);