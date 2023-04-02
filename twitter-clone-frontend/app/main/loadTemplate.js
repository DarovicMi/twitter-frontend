"use strict";
const favicon = document.createElement("link");
favicon.rel = "icon";
favicon.type = "image/x-icon";
favicon.href = "../../../assets/favicon.ico";

const resetLink = document.createElement("link");
resetLink.rel = "stylesheet";
resetLink.href = "../reset.css";

const variablesLink = document.createElement("link");
variablesLink.rel = "stylesheet";
variablesLink.href = "../variables.css";

const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href = "style.css";

const fontApi_1 = document.createElement("link");
fontApi_1.rel = "preconnect";
fontApi_1.href = "https://fonts.googleapis.com";

const fontApi_2 = document.createElement("link");
fontApi_2.rel = "preconnect";
fontApi_2.href = "https://fonts.gstatic.com";

const fontStyle = document.createElement("link");
fontStyle.rel = "stylesheet";
fontStyle.href =
  "https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600;700&display=swap";

const ioniconScript_1 = document.createElement("script");
ioniconScript_1.type = "module";
ioniconScript_1.src =
  "https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js";

const ioniconScript_2 = document.createElement("script");
ioniconScript_2.setAttribute("nomodule", "");
ioniconScript_2.src =
  "https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js";

const head = document.querySelectorAll("head")[0];

head.appendChild(favicon);
head.appendChild(resetLink);
head.appendChild(variablesLink);
head.appendChild(styleLink);
head.appendChild(fontApi_1);
head.appendChild(fontApi_2);
head.appendChild(fontStyle);
head.appendChild(ioniconScript_1);
head.appendChild(ioniconScript_2);
