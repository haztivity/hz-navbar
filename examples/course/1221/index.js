"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
require("font-awesome");
var core_1 = require("@haztivity/core");
var HzNavbar_1 = require("../../../src/HzNavbar");
var _6611_1 = require("./pages/6611/6611");
var _6612_1 = require("./pages/6612/6612");
var _6613_1 = require("./pages/6613/6613");
var sco = core_1.ScoFactory.createSco({
    name: "1221",
    pages: [
        _6611_1.page6611,
        _6612_1.page6612,
        _6613_1.page6613
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
//# sourceMappingURL=index.js.map