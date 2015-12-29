angular.module('templates-app', ['app/accueil/accueil.tpl.html', 'app/accueil/views/el1-nouveauLien.tpl.html', 'app/bibli/views/el1-lu.tpl.html', 'app/bibli/views/el1-nonLu.tpl.html', 'app/bibli/views/el1-share.tpl.html', 'app/cercle/views/el1-view.tpl.html', 'app/common/debug.tpl.html', 'app/error/error.tpl.html', 'app/gestionCercles/views/el1-gestion.tpl.html', 'app/gestionCercles/views/el1-nouveauCercle.tpl.html', 'app/icdc/views/el1-view.tpl.html', 'app/login/login.tpl.html']);

angular.module("app/accueil/accueil.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/accueil/accueil.tpl.html",
    "<h1>Challenge digital</h1>");
}]);

angular.module("app/accueil/views/el1-nouveauLien.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/accueil/views/el1-nouveauLien.tpl.html",
    "<md-dialog aria-label=\"{{'view.nouveauLien.title' | translate}}\" ng-cloak flex=\"50\">\n" +
    "\n" +
    "    <form name=\"currentForm\">\n" +
    "\n" +
    "        <md-toolbar>\n" +
    "            <div class=\"md-toolbar-tools\">\n" +
    "                <h2><span translate=\"view.nouveauLien.title\"></span></h2>\n" +
    "            </div>\n" +
    "        </md-toolbar>\n" +
    "\n" +
    "        <md-dialog-content>\n" +
    "            <div class=\"md-dialog-content\">\n" +
    "\n" +
    "                <cdc-alert-error></cdc-alert-error>\n" +
    "\n" +
    "                <div layout=\"row\">\n" +
    "                    <md-input-container flex=\"grow\">\n" +
    "                        <label translate=\"view.Lien.url\"></label>\n" +
    "                        <input name=\"url\" type=\"url\" ng-model=\"currentLien.url\" required autofocus>\n" +
    "                        <div role=\"alert\"><span class=\"error\" ng-show=\"currentForm.url.$error.required\"> <span translate=\"view.error.required\"/></span></div>\n" +
    "                        <div role=\"alert\"><span class=\"error\" ng-show=\"currentForm.url.$error.url\"> <span translate=\"view.error.url\"/></span></div>\n" +
    "                    </md-input-container>\n" +
    "                </div>\n" +
    "\n" +
    "                <div layout=\"row\">\n" +
    "                    <md-input-container flex=\"grow\">\n" +
    "                        <label translate=\"view.Lien.title\"></label>\n" +
    "                        <input name=\"text\" type=\"text\" ng-model=\"currentLien.title\" maxlength=\"100\">\n" +
    "                    </md-input-container>\n" +
    "                </div>\n" +
    "\n" +
    "                <div layout=\"row\">\n" +
    "                    <md-input-container flex>\n" +
    "                        <md-radio-group ng-model=\"currentLien.private\" layout=\"row\" layout-align=\"start center\">\n" +
    "                            <md-radio-button value=\"biblio\"> <span translate=\"view.Lien.biblio\"/> </md-radio-button>\n" +
    "                            <md-radio-button value=\"nonlu\"> <span translate=\"view.Lien.nonLu\"/> </md-radio-button>\n" +
    "                        </md-radio-group>\n" +
    "                    </md-input-container>\n" +
    "                </div>\n" +
    "\n" +
    "            </div>\n" +
    "        </md-dialog-content>\n" +
    "\n" +
    "        <md-dialog-actions layout=\"row\" layout-sm=\"column\" layout-align=\"center center\" layout-wrap>\n" +
    "            <md-button class=\"md-raised md-primary\" ng-click=\"validate(currentLien)\" aria-label=\"{{'action.validate' | translate}}\" translate=\"action.validate\"></md-button>\n" +
    "            <md-button class=\"md-raised\" ng-click=\"cancel()\" aria-label=\"{{'action.cancel' | translate}}\" translate=\"action.cancel\"></md-button>\n" +
    "        </md-dialog-actions>\n" +
    "\n" +
    "    </form>\n" +
    "\n" +
    "</md-dialog>");
}]);

angular.module("app/bibli/views/el1-lu.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/bibli/views/el1-lu.tpl.html",
    "<section class=\"canevas\">\n" +
    "    <cdc-alert-error></cdc-alert-error>\n" +
    "\n" +
    "    <div ng-hide=\"liens[0]\" class=\"errormessage warning\">\n" +
    "        <div style=\"text-align: center\">\n" +
    "            <h4>{{'list.empty' | translate}}</h4>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <md-list>\n" +
    "        <md-list-item ng-repeat=\"lien in liens | orderBy: title\">\n" +
    "            <md-card flex=\"auto\" layout=\"row\">\n" +
    "                <div flex=\"80\" class=\"md-list-item-text lien-card\" flex=\"auto\" layout=\"row\" ng-click=\"showURL(lien)\" >\n" +
    "\n" +
    "                    <pict hide-md hide-sm hide-xs></pict>\n" +
    "\n" +
    "                    <div flex-gt-md=\"85\" flex=\"50\" layout=\"column\">\n" +
    "                        <h3>{{lien.title}}</h3>\n" +
    "                        {{lien.teasing}}\n" +
    "                        <br/><br/>\n" +
    "                        <div layout=\"row\">\n" +
    "                            <div hide show-gt-sm  flex=\"3\"><ng-md-icon icon=\"link\"></ng-md-icon></div>\n" +
    "                            <div class=\"lien\" flex>{{lien.url.substring(0, 60)}}<md-tooltip>{{lien.url}}</md-tooltip></div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div flex-gt-md=\"20\" flex=\"50\" layout=\"row\"  layout-align=\"center center\">\n" +
    "                    <md-button class=\"md-fab md-primary md-icon-button\" ng-click=\"deleteLink(lien)\" aria-label=\"{{'view.action.delete' | translate}}\"><ng-md-icon icon=\"delete\" size=\"30\" ></ng-md-icon> <md-tooltip>{{'view.action.delete' | translate}}</md-tooltip></md-button>\n" +
    "                    <md-button class=\"md-fab md-primary md-icon-button\" ng-click=\"moveTo(lien)\" aria-label=\"{{'view.action.unread' | translate}}\"><ng-md-icon icon=\"markunread\" size=\"30\" ></ng-md-icon> <md-tooltip>{{'view.action.unread' | translate}}</md-tooltip></md-button>\n" +
    "                    <md-button class=\"md-fab md-primary md-icon-button\" ng-show=\"canShare()\" ng-click=\"share($event, lien)\" aria-label=\"{{'view.action.share' | translate}}\"><ng-md-icon icon=\"share\" size=\"30\"></ng-md-icon> <md-tooltip>{{'view.action.share' | translate}}</md-tooltip></md-button>\n" +
    "                </div>\n" +
    "            </md-card>\n" +
    "        </md-list-item>\n" +
    "    </md-list>\n" +
    "\n" +
    "</section>\n" +
    "");
}]);

angular.module("app/bibli/views/el1-nonLu.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/bibli/views/el1-nonLu.tpl.html",
    "<section class=\"canevas\">\n" +
    "\n" +
    "    <div ng-hide=\"liens[0]\" class=\"errormessage warning\">\n" +
    "        <div style=\"text-align: center\">\n" +
    "            <h4>{{'list.empty' | translate}}</h4>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <md-list>\n" +
    "        <md-list-item ng-repeat=\"lien in liens | orderBy: title\" >\n" +
    "            <md-card flex=\"auto\" layout=\"row\">\n" +
    "                <div flex=\"80\" class=\"md-list-item-text lien-card\" layout=\"row\" ng-click=\"showURL(lien)\">\n" +
    "\n" +
    "                    <pict hide-md hide-sm hide-xs></pict>\n" +
    "\n" +
    "                    <div flex-gt-md=\"85\" flex=\"50\" layout=\"column\">\n" +
    "\n" +
    "                        <h3>{{lien.title.substring(0, 100)}}</h3>\n" +
    "                        {{lien.teasing}}\n" +
    "                        <br/><br/>\n" +
    "                        <div layout=\"row\">\n" +
    "                            <div hide show-gt-sm flex=\"3\"><ng-md-icon icon=\"link\"></ng-md-icon></div>\n" +
    "                            <div class=\"lien\" flex>{{lien.url.substring(0, 60)}}<md-tooltip>{{lien.url}}</md-tooltip></div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div flex-gt-md=\"20\" flex=\"50\" layout=\"row\" layout-align=\"center center\">\n" +
    "                    <md-button class=\"md-fab md-primary md-icon-button\" ng-click=\"deleteLink(lien)\" aria-label=\"{{'view.action.delete' | translate}}\"><ng-md-icon icon=\"delete\" size=\"30\" ></ng-md-icon> <md-tooltip>{{'view.action.delete' | translate}}</md-tooltip></md-button>\n" +
    "                    <md-button class=\"md-fab md-primary md-icon-button\" ng-click=\"moveTo(lien)\" aria-label=\"{{'view.action.read' | translate}}\"><ng-md-icon icon=\"archive\" size=\"30\" ></ng-md-icon> <md-tooltip>{{'view.action.read' | translate}}</md-tooltip></md-button>\n" +
    "                    <md-button class=\"md-fab md-primary md-icon-button\" ng-show=\"canShare()\" ng-click=\"share($event, lien)\" aria-label=\"{{'view.action.share' | translate}}\"><ng-md-icon icon=\"share\" size=\"30\" ></ng-md-icon> <md-tooltip>{{'view.action.share' | translate}}</md-tooltip></md-button>\n" +
    "                </div>\n" +
    "            </md-card>\n" +
    "        </md-list-item>\n" +
    "    </md-list>\n" +
    "\n" +
    "</section>\n" +
    "");
}]);

angular.module("app/bibli/views/el1-share.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/bibli/views/el1-share.tpl.html",
    "<md-dialog aria-label=\"{{'view.share.form' | translate}}\" ng-cloak flex=\"50\">\n" +
    "\n" +
    "    <form name=\"currentForm\">\n" +
    "\n" +
    "        <md-toolbar>\n" +
    "            <div class=\"md-toolbar-tools\">\n" +
    "                <h2><span translate=\"view.share.form\"></span> {{ link.title }} (url : {{shareLink.url}})</h2>\n" +
    "            </div>\n" +
    "        </md-toolbar>\n" +
    "\n" +
    "        <md-dialog-content>\n" +
    "            <div class=\"md-dialog-content\">\n" +
    "\n" +
    "                <cdc-alert-error></cdc-alert-error>\n" +
    "\n" +
    "                <div layout=\"row\">\n" +
    "                    <md-input-container flex=\"grow\">\n" +
    "                        <label translate=\"view.share.title\"></label>\n" +
    "                        <input name=\"title\" type=\"text\" ng-model=\"shareLink.title\" required>\n" +
    "                        <div role=\"alert\"><span class=\"error\" ng-show=\"currentForm.title.$error.required\"> <span translate=\"view.error.required\"/></span></div>\n" +
    "                    </md-input-container>\n" +
    "                </div>\n" +
    "\n" +
    "                <div layout=\"row\">\n" +
    "                    <md-input-container flex=\"grow\">\n" +
    "                        <label translate=\"view.share.teasing\"></label>\n" +
    "                        <textarea name=\"teasing\" rows=\"10\" cols=\"50\"  ng-model=\"shareLink.teasing\"></textarea>\n" +
    "                    </md-input-container>\n" +
    "                </div>\n" +
    "\n" +
    "                <div layout=\"row\">\n" +
    "                    <md-input-container flex=\"grow\">\n" +
    "                        <label translate=\"view.share.category\"></label>\n" +
    "                        <md-select ng-model=\"shareLink.category\">\n" +
    "                            <md-option ng-repeat=\"cat in categories\" value=\"{{cat}}\">\n" +
    "                                {{cat}}\n" +
    "                            </md-option>\n" +
    "                        </md-select>\n" +
    "                    </md-input-container>\n" +
    "                </div>\n" +
    "\n" +
    "                <div layout=\"row\">\n" +
    "                    <md-input-container flex=\"grow\">\n" +
    "                        <label translate=\"view.share.cercle\"></label>\n" +
    "                        <md-select ng-model=\"shareLink.cercleName\">\n" +
    "                            <md-option ng-repeat=\"cercl in cercles\" value=\"{{cercl.$id}}\">\n" +
    "                                {{cercl.$id}}\n" +
    "                            </md-option>\n" +
    "                        </md-select>\n" +
    "                    </md-input-container>\n" +
    "                </div>\n" +
    "\n" +
    "            </div>\n" +
    "        </md-dialog-content>\n" +
    "\n" +
    "        <md-dialog-actions layout=\"row\" layout-sm=\"column\" layout-align=\"center center\" layout-wrap>\n" +
    "                <md-button class=\"md-raised md-primary\" ng-click=\"validate(shareLink)\" aria-label=\"{{'action.validate' | translate}}\" translate=\"action.validate\"></md-button>\n" +
    "                <md-button class=\"md-raised\" ng-click=\"cancel()\" aria-label=\"{{'action.cancel' | translate}}\" translate=\"action.cancel\"></md-button>\n" +
    "        </md-dialog-actions>\n" +
    "\n" +
    "    </form>\n" +
    "\n" +
    "\n" +
    "</md-dialog>\n" +
    "");
}]);

angular.module("app/cercle/views/el1-view.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/cercle/views/el1-view.tpl.html",
    "<section class=\"canevas\">\n" +
    "\n" +
    "    <div flex=\"auto\" layout=\"row\" layout-align=\"space-around center\">\n" +
    "        <md-input-container>\n" +
    "            <label >Catégorie</label>\n" +
    "            <md-select ng-model=\"filter.category\">\n" +
    "                <md-option value=\"\" ng-click=\"changeCategory('')\">{{'view.cercle.toutes' | translate}}</md-option>\n" +
    "                <md-option  ng-repeat=\"cat in categories\" value=\"{{cat}}\" ng-click=\"changeCategory(cat)\">\n" +
    "                    {{cat}}\n" +
    "                </md-option>\n" +
    "            </md-select>\n" +
    "        </md-input-container>\n" +
    "\n" +
    "        <md-input-container>\n" +
    "            <label ng-show=\"cercles[0]\">Mes cercles</label>\n" +
    "            <label ng-hide=\"cercles[0]\">{{'view.message.empty' | translate}}</label>\n" +
    "            <md-select ng-model=\"selectedCercle\"\n" +
    "                       ng-model-options=\"{trackBy: '$value.$id'}\">\n" +
    "                <md-option ng-value=\"cercl\" ng-click=\"changeCercle(cercl)\" ng-repeat=\"cercl in cercles\">\n" +
    "                    {{cercl.$id}}\n" +
    "                </md-option>\n" +
    "            </md-select>\n" +
    "        </md-input-container>\n" +
    "    </div>\n" +
    "\n" +
    "    <md-divider></md-divider>\n" +
    "\n" +
    "    <div ng-hide=\"allLiens[0]\" class=\"errormessage warning\">\n" +
    "        <div style=\"text-align: center\">\n" +
    "            <h4>{{'list.empty' | translate}}</h4>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <md-list>\n" +
    "        <md-list-item ng-repeat=\"lien in allLiens | filter:filter.category | orderBy: title \" >\n" +
    "            <md-card flex=\"auto\" layout=\"row\">\n" +
    "                <div flex=\"80\" class=\"md-list-item-text lien-card\" ng-click=\"showURL(lien)\" layout=\"row\">\n" +
    "                    <pict hide-md hide-sm hide-xs></pict>\n" +
    "\n" +
    "                    <div flex-gt-md=\"85\" flex=\"50\" layout=\"column\">\n" +
    "                        <h3>{{lien.title}}</h3>\n" +
    "                        {{lien.teasing}}\n" +
    "                        <br/><br/>\n" +
    "                        <div  layout=\"row\" layout-sm=\"column\" layout-xs=\"column\" layout-md=\"column\">\n" +
    "                            <span flex=\"15\"><b>{{lien.category}}</b></span>\n" +
    "                            <span flex=\"30\" layout=\"row\"><div hide show-gt-md flex=\"3\"><div class=\"profil-share-img\" ng-style=\"{'background-image': 'url(' + lien.sharedByPicture + ')'}\"></div></div>{{lien.sharedBy}}</span>\n" +
    "                            <div flex=\"40\" layout=\"row\">\n" +
    "                                <div hide show-gt-md flex=\"3\"><ng-md-icon icon=\"link\"></ng-md-icon></div>\n" +
    "                                <div class=\"lien\" flex>{{lien.url.substring(0, 30)}}<md-tooltip>{{lien.url}}</md-tooltip></div>\n" +
    "                            </div>\n" +
    "                            <div flex=\"initial\">\n" +
    "                                 <ng-md-icon icon=\"thumb_up\" size=\"20\" ></ng-md-icon> {{lien.like}}\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div flex-gt-md=\"20\" flex=\"50\" layout=\"row\" layout-align=\"center center\">\n" +
    "                <md-button class=\"md-fab md-primary md-icon-button\" ng-click=\"moveToBiblio(lien)\" aria-label=\"{{'view.action.read' | translate}}\"><ng-md-icon icon=\"archive\" size=\"30\" ></ng-md-icon> <md-tooltip>{{'view.action.read' | translate}}</md-tooltip></md-button>\n" +
    "                <md-button ng-disabled=\"isLikeDisabled\" class=\"md-fab md-primary md-icon-button\" ng-click=\"like(lien)\" aria-label=\"{{'view.action.like' | translate}}\"><ng-md-icon icon=\"thumb_up\" size=\"30\" ></ng-md-icon> <md-tooltip>{{'view.action.like' | translate}}</md-tooltip></md-button>\n" +
    "                </div>\n" +
    "            </md-card>\n" +
    "        </md-list-item>\n" +
    "    </md-list>\n" +
    "\n" +
    "</section>\n" +
    "");
}]);

angular.module("app/common/debug.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/common/debug.tpl.html",
    "<pre>\n" +
    "      profile = {{ profile}}\n" +
    "      $state = {{$state.current.name}}\n" +
    "      $stateParams = {{$stateParams}}\n" +
    "      $state full url = {{ $state.$current.url.source }}\n" +
    "</pre>\n" +
    "");
}]);

angular.module("app/error/error.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/error/error.tpl.html",
    "<h1>Erreur</h1>\n" +
    "");
}]);

angular.module("app/gestionCercles/views/el1-gestion.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/gestionCercles/views/el1-gestion.tpl.html",
    "<section class=\"canevas\">\n" +
    "\n" +
    "    <div flex=\"auto\" layout=\"row\" layout-align=\"space-around center\">\n" +
    "\n" +
    "        <md-input-container>\n" +
    "            <label ng-show=\"cercles[0]\">{{'gestion.message.selectbox' | translate}}</label>\n" +
    "            <label ng-hide=\"cercles[0]\">{{'gestion.message.empty' | translate}}</label>\n" +
    "            <md-select ng-model=\"selectedCercle\"\n" +
    "                       ng-model-options=\"{trackBy: '$value.$id'}\">\n" +
    "                <md-option ng-value=\"cercl\" ng-click=\"changeCercle(cercl)\" ng-repeat=\"cercl in cercles\">\n" +
    "                    {{cercl.$id}}\n" +
    "                </md-option>\n" +
    "            </md-select>\n" +
    "        </md-input-container>\n" +
    "\n" +
    "        <md-button class=\"md-raised md-primary\" ng-click=\"nouveauCercle($event)\"\n" +
    "                   aria-label=\"{{'action.validate' | translate}}\"\n" +
    "                   translate=\"gestion.action.nouveauCercle\"></md-button>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <md-divider></md-divider>\n" +
    "    <md-subheader><span translate=\"gestion.dashboard.invite\"/></md-subheader>\n" +
    "\n" +
    "    <div layout=\"row\">\n" +
    "        <div flex>&nbsp;</div>\n" +
    "    </div>\n" +
    "\n" +
    "    <form name=\"currentForm\" layout=\"row\">\n" +
    "\n" +
    "        <md-autocomplete\n" +
    "                ng-disabled=\"false\"\n" +
    "                md-no-cache=\"false\"\n" +
    "                md-selected-item=\"selectedItem\"\n" +
    "                md-search-text-change=\"searchTextChange(searchText)\"\n" +
    "                md-search-text=\"searchText\"\n" +
    "                md-items=\"user in querySearch(searchText)\"\n" +
    "                md-selected-item-change=\"selectedItemChange(user)\"\n" +
    "                md-item-text=\"user.email\"\n" +
    "                md-min-length=\"0\"\n" +
    "                placeholder=\"email\">\n" +
    "            <md-item-template>\n" +
    "                <span md-highlight-text=\"searchText\" md-highlight-flags=\"^i\">{{user.email}}</span>\n" +
    "            </md-item-template>\n" +
    "            <md-not-found>\n" +
    "                Aucune correspondance trouvée pour \"{{searchText}}\".\n" +
    "            </md-not-found>\n" +
    "        </md-autocomplete>\n" +
    "\n" +
    "        <!-- translate=\"gestion.action.invite\" -->\n" +
    "        <md-button class=\"md-fab md-primary md-icon-button\"  aria-label=\"{{'gestion.action.inviteTool' | translate}}\"  ng-click=\"inviter(selectedItem)\">\n" +
    "            <ng-md-icon icon=\"send\"  size=\"30\"></ng-md-icon>\n" +
    "            <md-tooltip>{{'gestion.action.inviteTool' | translate}}</md-tooltip>\n" +
    "        </md-button>\n" +
    "\n" +
    "    </form>\n" +
    "\n" +
    "    <div layout=\"row\">\n" +
    "        <div flex>&nbsp;</div>\n" +
    "    </div>\n" +
    "    <div layout=\"row\" ng-show=\"invited && invited.length>0\">\n" +
    "        <div flex><strong>Invitation(s) envoyée(s) à : </strong> {{invitedDisplay}}</div>\n" +
    "    </div>\n" +
    "    <div layout=\"row\">\n" +
    "        <div flex>&nbsp;</div>\n" +
    "    </div>\n" +
    "\n" +
    "    <md-divider></md-divider>\n" +
    "    <md-subheader><span translate=\"gestion.dashboard.personnes\"></span> {{selectedCercle.$id}}</md-subheader>\n" +
    "\n" +
    "    <div ng-hide=\"personnes[0]\" class=\"errormessage warning\" translate=\"list.empty\"></div>\n" +
    "\n" +
    "    <md-list>\n" +
    "        <md-list-item ng-repeat=\"personne in personnes | orderBy: fullname\">\n" +
    "            <div flex=\"auto\" class=\"md-list-item-text\" layout=\"column\">\n" +
    "                    <span><b>{{personne.fullname}} ({{personne.email}})</b></span>\n" +
    "            </div>\n" +
    "        </md-list-item>\n" +
    "    </md-list>\n" +
    "\n" +
    "    <md-divider></md-divider>\n" +
    "    <md-subheader><span translate=\"gestion.dashboard.invitations\"/></md-subheader>\n" +
    "\n" +
    "    <div ng-hide=\"mesInvitations[0]\" class=\"errormessage warning\" translate=\"list.empty\"></div>\n" +
    "\n" +
    "    <md-list>\n" +
    "        <md-list-item ng-repeat=\"invitation in mesInvitations | orderBy: $id \">\n" +
    "            <div flex=\"50\" class=\"md-list-item-text\" layout=\"column\">\n" +
    "                <strong>{{invitation.$id}}</strong>\n" +
    "            </div>\n" +
    "            <div flex=\"50\" layout=\"row\">\n" +
    "                <md-button class=\"md-fab md-primary md-icon-button\" ng-click=\"accepterInvitation(invitation)\"\n" +
    "                           aria-label=\"{{'view.action.read' | translate}}\">\n" +
    "                    <ng-md-icon icon=\"thumb_up\" size=\"30\"></ng-md-icon>\n" +
    "                    <md-tooltip>{{'gestion.action.accept' | translate}}</md-tooltip>\n" +
    "                </md-button>\n" +
    "            </div>\n" +
    "        </md-list-item>\n" +
    "    </md-list>\n" +
    "\n" +
    "</section>\n" +
    "");
}]);

angular.module("app/gestionCercles/views/el1-nouveauCercle.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/gestionCercles/views/el1-nouveauCercle.tpl.html",
    "<md-dialog aria-label=\"{{'view.nouveauLien.title' | translate}}\" ng-cloak flex=\"50\">\n" +
    "\n" +
    "    <form name=\"currentForm\">\n" +
    "\n" +
    "        <md-toolbar>\n" +
    "            <div class=\"md-toolbar-tools\">\n" +
    "                <h2><span translate=\"gestion.nouveauCercle.title\"></span></h2>\n" +
    "            </div>\n" +
    "        </md-toolbar>\n" +
    "\n" +
    "        <md-dialog-content>\n" +
    "            <div class=\"md-dialog-content\">\n" +
    "\n" +
    "                <cdc-alert-error></cdc-alert-error>\n" +
    "\n" +
    "                <div layout=\"row\">\n" +
    "                    <md-input-container flex=\"grow\">\n" +
    "                        <label translate=\"gestion.Cercle.label\"></label>\n" +
    "                        <input name=\"label\" type=\"text\" ng-model=\"currentCercle.label\" required>\n" +
    "                        <div role=\"alert\"><span class=\"error\" ng-show=\"currentForm.label.$error.required\"> <span translate=\"gestion.error.required\"/></span></div>\n" +
    "                    </md-input-container>\n" +
    "                    <md-input-container flex=\"grow\">\n" +
    "                        <label translate=\"gestion.Cercle.description\"></label>\n" +
    "                        <input name=\"description\" type=\"text\" ng-model=\"currentCercle.description\" required>\n" +
    "                        <div role=\"alert\"><span class=\"error\" ng-show=\"currentForm.description.$error.required\"> <span translate=\"gestion.error.required\"/></span></div>\n" +
    "                    </md-input-container>\n" +
    "\n" +
    "                </div>\n" +
    "\n" +
    "            </div>\n" +
    "        </md-dialog-content>\n" +
    "\n" +
    "        <md-dialog-actions layout=\"row\" layout-sm=\"column\" layout-align=\"center center\" layout-wrap>\n" +
    "            <md-button class=\"md-raised md-primary\" ng-click=\"validate(currentCercle)\" aria-label=\"{{'action.validate' | translate}}\" translate=\"action.validate\"></md-button>\n" +
    "            <md-button class=\"md-raised\" ng-click=\"cancel()\" aria-label=\"{{'action.cancel' | translate}}\" translate=\"action.cancel\"></md-button>\n" +
    "        </md-dialog-actions>\n" +
    "\n" +
    "    </form>\n" +
    "\n" +
    "</md-dialog>");
}]);

angular.module("app/icdc/views/el1-view.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/icdc/views/el1-view.tpl.html",
    "<section class=\"canevas\">\n" +
    "\n" +
    "    <div flex=\"auto\" layout=\"row\" layout-align=\"space-around center\">\n" +
    "        <md-input-container>\n" +
    "            <label >Catégorie</label>\n" +
    "            <md-select ng-model=\"filter.category\">\n" +
    "                <md-option value=\"\" ng-click=\"changeCategory('')\">{{'view.cercle.toutes' | translate}}</md-option>\n" +
    "                <md-option ng-repeat=\"cat in categories\" value=\"{{cat}}\" ng-click=\"changeCategory(cat)\">\n" +
    "                    {{cat}}\n" +
    "                </md-option>\n" +
    "            </md-select>\n" +
    "        </md-input-container>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <md-divider></md-divider>\n" +
    "\n" +
    "    <div ng-hide=\"topTen[0]\" class=\"errormessage warning\">\n" +
    "        <div style=\"text-align: center\">\n" +
    "            <h4>{{'list.empty' | translate}}</h4>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <md-list>\n" +
    "        <md-list-item ng-repeat=\"like in topTen | filter:filter.category | orderBy: '-cpt' \" >\n" +
    "            <md-card flex=\"auto\" layout=\"row\" ng-init=\"lien= like.link\">\n" +
    "                <div flex=\"80\" class=\"md-list-item-text lien-card\" ng-click=\"showURL(like.link)\" layout=\"row\">\n" +
    "\n" +
    "                    <pict hide-md hide-sm hide-xs></pict>\n" +
    "\n" +
    "                    <div flex-gt-md=\"85\" flex=\"50\" layout=\"column\">\n" +
    "                        <h3>{{like.link.title}}</h3>\n" +
    "                        {{like.link.teasing}}\n" +
    "                        <br/><br/>\n" +
    "                        <div  layout=\"row\" layout-sm=\"column\" layout-xs=\"column\" layout-md=\"column\">\n" +
    "                            <span flex=\"15\"><b>{{like.link.category}}</b></span>\n" +
    "                            <span flex=\"30\" layout=\"row\"><div hide show-gt-md flex=\"3\"><div class=\"profil-share-img\" ng-style=\"{'background-image': 'url(' + like.link.sharedByPicture + ')'}\"></div></div>{{like.link.sharedBy}}</span>\n" +
    "                            <div flex=\"40\" layout=\"row\">\n" +
    "                                <div hide show-gt-md flex=\"3\"><ng-md-icon icon=\"link\"></ng-md-icon></div>\n" +
    "                                <div class=\"lien\" flex>{{like.link.url.substring(0, 30)}}</div>\n" +
    "                            </div>\n" +
    "                            <div>\n" +
    "                                <ng-md-icon icon=\"thumb_up\" size=\"20\" ></ng-md-icon> {{like.cpt}}\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div flex-gt-md=\"20\" flex=\"50\" layout=\"row\" layout-align=\"center center\">\n" +
    "                    <md-button class=\"md-fab md-primary md-icon-button\" ng-click=\"moveToBiblio(like.link)\" aria-label=\"{{'view.action.read' | translate}}\"><ng-md-icon icon=\"archive\" size=\"30\" ></ng-md-icon> <md-tooltip>{{'view.action.read' | translate}}</md-tooltip></md-button>\n" +
    "                </div>\n" +
    "            </md-card>\n" +
    "        </md-list-item>\n" +
    "    </md-list>\n" +
    "\n" +
    "</section>\n" +
    "");
}]);

angular.module("app/login/login.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/login/login.tpl.html",
    "<section class=\"canevas\" layout=\"row\"  layout-align=\"center center\">\n" +
    "\n" +
    "        <md-card flex=\"70\">\n" +
    "\n" +
    "            <div layout=\"row\" style=\"padding: 50px 20px 50px 20px\">\n" +
    "                <div hide-sm hide-xs  flex=\"30\" style=\"padding: 10px\">\n" +
    "                    <img src=\"./src/img/arton.jpg\">\n" +
    "                </div>\n" +
    "                <div flex=\"initial\">\n" +
    "                    eLink reprend le principe des applications de partage d'informations et participe à une veille collaborative.\n" +
    "                    Vous pouvez partager et échanger les meilleurs articles du web et lire leur contenu sur desktop ou mobile.\n" +
    "\n" +
    "                    <br/><br/>\n" +
    "                    Techniquement, eLink repose sur notre socle AngularJs (desktop) et Ionic (Android). Les données sont stockées\n" +
    "                    dans une base noSQL temps réel, le navigateur est également synchronisé en temps réel grâce aux web sockets.<br/>\n" +
    "                    La charte repose sur material design et supporte uniquement les navigateurs récents (Chrome, Firefox, IE11, Edge).\n" +
    "\n" +
    "                    <br/><br/>\n" +
    "                    Pour utiliser l'application, vous devez vous authentifier par Google via OAuth, cela nécessite la création d'un\n" +
    "                    <a href=\"https://accounts.google.com/login?hl=fr\" target=\"_blank\">compte</a> si vous n'en avez pas.\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"alert alert-danger\" ng-show=\"authenticationError\">\n" +
    "                <strong translate=\"login.failed.strong\"></strong> <span translate=\"login.failed.msg\"></span>\n" +
    "            </div>\n" +
    "\n" +
    "            <div layout=\"row\" layout-sm=\"column\" layout-align=\"space-around center\" layout-wrap style=\"margin-bottom: 15px\">\n" +
    "                <img flex=\"30\" src=\"./src/img/android.jpg\" ng-click=\"android()\" class=\"profil\">\n" +
    "                <md-button aria-label=\"{{'login.valider' | translate}}\" flex=\"30\" style=\"line-height: 5em\" class=\"md-raised md-primary \" ng-click=\"login()\"><ng-md-icon icon=\"google-plus\" size=\"20\"></ng-md-icon> <span translate=\"login.valider\"></span></md-button>\n" +
    "            </div>\n" +
    "\n" +
    "        </md-card>\n" +
    "\n" +
    "</section>");
}]);
