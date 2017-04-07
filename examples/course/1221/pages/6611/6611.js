"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
var core_1 = require("@haztivity/core");
var template = require("./6611.html!text");
var hzButton_1 = require("../../../../resources/hzButton/hzButton");
var page = core_1.PageFactory.createPage({
    title: "Página 6611",
    name: "6611",
    resources: [
        hzButton_1.HzButton
    ],
    template: template
});
exports.page6611 = page;
page.on(core_1.PageController.ON_RENDERING, null, function (eventObject, template, pageController) {
    console.log(pageController.options.name + " rendering");
});
page.on(core_1.PageController.ON_RENDERED, null, function (eventObject, $page, pageController) {
    console.log(pageController.options.name + " rendered");
});
page.on(core_1.PageController.ON_SHOW, null, function (eventObject, $page, $oldPage, oldPageRelativePosition, pageController) {
    console.log(pageController.options.name + " show start");
});
page.on(core_1.PageController.ON_SHOWN, null, function (eventObject, $page, $oldPage, oldPageRelativePosition, pageController) {
    console.log(pageController.options.name + " show end");
});
page.on(core_1.PageController.ON_COMPLETE_CHANGE, null, function (eventObject, isCompleted, $page, pageController) {
    console.log(pageController.options.name + " complete change");
});
page.on(core_1.PageController.ON_DESTROY, null, function (eventObject, $page, pageController) {
    console.log(pageController.options.name + " destroy");
});
//# sourceMappingURL=6611.js.map