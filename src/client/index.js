import "@babel/polyfill";
import { init, submitListener } from "./js/app";
import "./styles/styles.scss";

init();

document.getElementById("submitButton").addEventListener("click", submitListener);