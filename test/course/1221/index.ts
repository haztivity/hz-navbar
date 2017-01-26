/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
import 'font-awesome';
import {ScoFactory, Sco, ISco} from "@haztivity/core";
import {HzNavbarComponent} from "../../../src/HzNavbar";
import {page6611} from "./pages/6611/6611";
import {page6612} from "./pages/6612/6612";
import {page6613} from "./pages/6613/6613";
let sco: ISco = ScoFactory.createSco(
    {
        name: "1221",
        pages: [
            page6611,
            page6612,
            page6613
        ],
        components: [
            HzNavbarComponent
        ]
    }
);
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