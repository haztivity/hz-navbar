/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
import template from "./sco.pug";
import "./main.scss";
import {ScoFactory, Sco, ISco} from "@haztivity/core";
import {HzNavbarComponent} from "../components/HzNavbar/HzNavbar";
import {page as page6611} from "./pages/6611/page";
import {page as page6612} from "./pages/6612/page";
import {page as page6613} from "./pages/6613/page";
let sco: ISco = ScoFactory.createSco(
    {
        name: "1221",
        template:template,
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