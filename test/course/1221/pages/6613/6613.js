System.register(["@haztivity/core", "./6613.html!text"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var core_1, _6613_html_text_1, page;
    return {
        setters: [
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (_6613_html_text_1_1) {
                _6613_html_text_1 = _6613_html_text_1_1;
            }
        ],
        execute: function () {
            page = core_1.PageFactory.createPage({
                title: "Página 6613",
                name: "6613",
                resources: [],
                template: _6613_html_text_1.default
            });
            exports_1("page6613", page);
            page.on(core_1.PageController.ON_RENDERING, null, function (eventObject, template, pageController) {
                console.log(pageController.options.name + " rendering");
            });
            page.on(core_1.PageController.ON_RENDERED, null, function (eventObject, template, pageController) {
                console.log(pageController.options.name + " rendered");
            });
            page.on(core_1.PageController.ON_SHOW, null, function (eventObject, $page, $oldPage, oldPageRelativePosition, pageController) {
                console.log(pageController.options.name + " show start");
            });
            page.on(core_1.PageController.ON_SHOWN, null, function (eventObject, $page, $oldPage, oldPageRelativePosition, pageController) {
                console.log(pageController.options.name + " show end");
            });
            page.on(core_1.PageController.ON_COMPLETE, null, function (eventObject, $page, pageController) {
                console.log(pageController.options.name + " complete");
            });
            page.on(core_1.PageController.ON_DESTROY, null, function (eventObject, $page, pageController) {
                console.log(pageController.options.name + " destroy");
            });
        }
    };
});
//# sourceMappingURL=6613.js.map