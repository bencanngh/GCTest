import angular from "angular";
import { AppModule } from "./app.module";

angular.element(function() {
  angular.bootstrap(document, [AppModule], { strictDi: true });
});
