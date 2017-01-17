System.register(["font-awesome", "davinchi_finsi", "../../../src/HzNavbar", "./pages/6611/6611", "./pages/6612/6612"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var davinchi_finsi_1, HzNavbar_1, _6611_1, _6612_1, sco;
    return {
        setters: [
            function (_1) {
            },
            function (davinchi_finsi_1_1) {
                davinchi_finsi_1 = davinchi_finsi_1_1;
            },
            function (HzNavbar_1_1) {
                HzNavbar_1 = HzNavbar_1_1;
            },
            function (_6611_1_1) {
                _6611_1 = _6611_1_1;
            },
            function (_6612_1_1) {
                _6612_1 = _6612_1_1;
            }
        ],
        execute: function () {
            sco = davinchi_finsi_1.ScoFactory.createSco({
                name: "1221",
                pages: [
                    _6611_1.page6611,
                    _6612_1.page6612
                ],
                components: [
                    HzNavbar_1.HzNavbarComponent
                ]
            });
            //pageChangeStart
            sco.on();
            //pageChangeEnd
            sco.on();
            //pageComplete
            sco.on();
            //sco end
            sco.on();
            //error
            sco.on();
            sco.run();
        }
    };
});
//# sourceMappingURL=index.js.map