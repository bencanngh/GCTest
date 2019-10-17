import angular from "angular";
import { AppComponent } from "./app.component";
import "./app.scss";

export const AppModule = angular
  .module("GCTestApp", ["ngMaterial", "chart.js"])
  .component("appMain", AppComponent).name;
