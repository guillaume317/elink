/**
 * elink - v0.1.0-0 - 2015-12-22
 *
 * Copyright (c) 2015 ICDC
 */
angular.module('el1.accueil', [  'ngMaterial', 'ui.router', 'el1.services.commun', 'el1.model' ])
    .config(function ($stateProvider) {

        $stateProvider.state('home', {
            url: '/home',
            data:{ pageTitle: 'Home' },
            views: {
                "main": {
                    controller: 'toolbarController',
                    templateProvider: function($templateCache){
                        return $templateCache.get('app/accueil/accueil.tpl.html');
                    },
                    //templateUrl: 'src/app/accueil/accueil.tpl.html'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('commons');
                }],
                currentAuth: ['FBFactory', function(FBFactory) {
                    return FBFactory.auth().$requireAuth();
                }]
            }
        });


    });

(function(){

    angular
        .module('el1.accueil')
        .controller('toolbarController', [
            '$log', '$scope', '$rootScope', '$state',
            'AuthService',
            '$mdDialog', '$mdMedia',
            ToolbarController
        ])
        .controller('nouveauLienController', [
            '$log', '$scope', '$rootScope',
            'LiensService', 'SessionStorage', 'USERFIREBASEPROFILEKEY',
            '$mdDialog', '$mdMedia',
            NouveauLienController
        ]);

    /**
     */
    function ToolbarController($log, $scope, $rootScope, $state, AuthService, $mdDialog, $mdMedia ) {

        $scope.selectedIndex=0;

        $scope.isAdmin= true;

        $scope.$watch('selectedIndex', function(current, old) {
            switch (current) {
                case 0:
                    $state.go('bibli-nonLu');
                    break;
                case 1:
                    $state.go('bibli-lu');
                    break;
                case 2:
                    $state.go("cercle-view");
                    break;
                case 3:
                    $state.go("icdc-view");
                    break;
            }
        });

        $scope.admin = function() {
            $state.go('gestion-view');
        };

        $scope.nouveauLien = function(ev) {

            // passage en pop up

            $mdDialog.show({
                controller: NouveauLienController,
                templateUrl: 'src/app/accueil/views/el1-nouveauLien.tpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: {
                },
                clickOutsideToClose:true,
                fullscreen: $mdMedia('sm') && $scope.customFullscreen
            })
                .then(function(shareLink) {
                    // valider
                }, function() {
                    // cancel
                });

            $scope.$watch(function() {
                return $mdMedia('sm');
            }, function(sm) {
                $scope.customFullscreen = (sm === true);
            });

        };

        $scope.logout = function() {
            AuthService.logout();
            $state.go('showLogin');
            $rootScope.userAuthenticated = false;
            //delete $rootScope[userEmail];
        };
    }

    /**
     */
    function NouveauLienController($log, $scope, $rootScope, LiensService, SessionStorage, USERFIREBASEPROFILEKEY, $mdDialog, $mdMedia) {
        $scope.currentLien= {"url" : "http://", private: "nonlu"};
        $scope.alerts = [];

        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.validate= function() {
            if ($scope.currentForm.$valid) {
                LiensService.createLinkForUser($scope.currentLien, SessionStorage.get(USERFIREBASEPROFILEKEY).uid)
                    .then(function (newLink) {
                        LiensService.screenshotAndStore(newLink).then(function (linkScreen) {
                            var anId= newLink.$id;
                            $rootScope.images[anId]= linkScreen;
                        }, function (error) {
                            $log.error(error);
                        });

                        $mdDialog.hide(newLink);
                    }, function (error) {
                        $log.error(error);
                    }
                );

            }
        }

        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

    }

})();

angular.module('el1.model', []);

angular.module('el1.services.commun',[ 'el1.model' ] );

angular
    .module('elinkApp', ['templates-app', 'ngCookies', 'ngMessages', 'ngMaterial', 'ngMdIcons',  'ui.router.state', 'ui.router', 'pascalprecht.translate', 'firebase', 'el1.model', 'el1.services.commun', 'el1.accueil', 'el1.icdc', 'el1.bibli', 'el1.login', 'el1.cercle', 'el1.gestion', 'el1.error'])

        .run(function ($rootScope, $location, $window, $http, $state, $translate, Env, AuthService, UserModel, $cookieStore, UsersManager) {
            $rootScope.images= [];
            $rootScope.userAuthenticated = false;

            $rootScope.$on('$stateChangeError',
                function(event, toState, toParams, fromState, fromParams, error) {
                    if (error === 'AUTH_REQUIRED') {
                        $state.go('showLogin');
                    }
            });
            $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
                $rootScope.toState = toState;
                $rootScope.toStateParams = toStateParams;
            });

            $rootScope.$on('$stateChangeSuccess',  function(event, toState, toParams, fromState, fromParams) {
                var titleKey = 'global.title' ;

                $rootScope.previousStateName = fromState.name;
                $rootScope.previousStateParams = fromParams;

                // Set the page title key to the one configured in state or use default one
                if (toState.data.pageTitle) {
                    titleKey = toState.data.pageTitle;
                }

                $translate(titleKey).then(function (title) {
                    // Change window title with translated one
                    $window.document.title = title;
                });

            });

            $rootScope.back = function() {
                // If previous state is 'activate' or do not exist go to 'home'
                if ($rootScope.previousStateName === 'activate' || $state.get($rootScope.previousStateName) === null) {
                    $state.go('home');
                } else {
                    $state.go($rootScope.previousStateName, $rootScope.previousStateParams);
                }
            };

            // init des variables d'environnement et du token

            $http.get('appconf/environment.json').then(function (response) {
                Env.init(response.data);
            });


            // En cas de F5, stocker / replace les élements entre les scopes
            if (Env.isMock()) {
                var mockUser= new UserModel();
                $rootScope.user = mockUser;
                Env.setUser(mockUser);
            } else {
                $rootScope.user =$cookieStore.get('user');
                if ($rootScope.user) {
                    $rootScope.userAuthenticated = true;
                    Env.setUser($rootScope.user);
                }
            }

    })

    .constant('RESTBACKEND', 'http://localhost:8080/banconet/api/v1')

    .constant('FBURL', 'https://elink.firebaseio.com/')

    .constant('GOOGLEAUTHSCOPE', 'email, profile')

    .constant('USERFIREBASEPROFILEKEY', 'firebase:session::elink')

    .config(function($stateProvider, $urlRouterProvider, $httpProvider, $translateProvider , $mdThemingProvider, $mdDateLocaleProvider ){

        // URL par défaut

        $urlRouterProvider.otherwise('/showLogin');

        // positionnement des intercepteurs

        //$httpProvider.interceptors.push('authExpiredInterceptor');
        $httpProvider.interceptors.push('errorHandlerInterceptor');

        // Init angular-translate

        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: 'src/i18n/{lang}/{part}.json'
        });

        $translateProvider.preferredLanguage('fr');
        $translateProvider.useCookieStorage();
        $translateProvider.useSanitizeValueStrategy('escaped');
        $translateProvider.addInterpolation('$translateMessageFormatInterpolation');


        // Extend the red theme with a few different colors
        var neonRedMap = $mdThemingProvider.extendPalette('red', {
            '500': 'b71c1c'
        });
        // Register the new color palette map with the name <code>neonRed</code>
        $mdThemingProvider.definePalette('neonRed', neonRedMap);


        $mdThemingProvider.theme('default')
            .primaryPalette('neonRed');
        //.backgroundPalette('');

        $mdDateLocaleProvider.parseDate = function(dateString) {
            var m = new Date(dateString);
            return (m == 'Invalid Date') ? m : Date.now();
        };

        $mdDateLocaleProvider.formatDate = function(date) {
            if (!date )
                return "";
            if (date == 'Invalid Date')
                return "Date non valide";
            var m= new Date(date);
            return  m.formatDate("dd/MM/yyyy");
        };
        
    });

(function(module){

    'use strict';
    module.config(function ($stateProvider) {

        $stateProvider.state('bibli-nonLu', {
            url: '/bibli/nonLu',
            data : {
                title :"view"
            },
            views: {
                "main": {
                    controller: 'bibliController',
                    templateProvider: function($templateCache){
                        return $templateCache.get('app/bibli/views/el1-nonLu.tpl.html');
                    },
                    //templateUrl: 'src/app/bibli/views/el1-nonLu.tpl.html',
                    resolve: {
                        liensNonLus : ['$rootScope', 'LiensService', 'SessionStorage', 'USERFIREBASEPROFILEKEY',
                            function($rootScope, LiensService,  SessionStorage ,USERFIREBASEPROFILEKEY) {
                                return LiensService.findNotReadLinksByUser(SessionStorage.get(USERFIREBASEPROFILEKEY).uid);
                        }],
                        liensLus : ['$rootScope', 'LiensService', 'SessionStorage', 'USERFIREBASEPROFILEKEY',
                            function($rootScope, LiensService, SessionStorage ,USERFIREBASEPROFILEKEY) {
                            return LiensService.findReadLinksByUser(SessionStorage.get(USERFIREBASEPROFILEKEY).uid);
                        }],
                        allMyCercles :  ['$rootScope', 'UsersManager', 'SessionStorage', 'USERFIREBASEPROFILEKEY',
                            function($rootScope, UsersManager, SessionStorage ,USERFIREBASEPROFILEKEY) {
                                return UsersManager.findCerclesByUser(SessionStorage.get(USERFIREBASEPROFILEKEY).uid);
                        }],
                        allCategories : ['LiensService', function(LiensService) {
                            return LiensService.findCategories();
                        }]
                    }
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('commons');
                    $translatePartialLoader.addPart('el1-view');
                    return $translate.refresh();
                }],
                currentAuth: ['FBFactory', function(FBFactory) {
                    return FBFactory.auth().$requireAuth();
                }]
            }
        });

        $stateProvider.state('bibli-lu', {
            url: '/bibli/lu',
            data : {
                    title :"view"
            },
            views: {
                "main": {
                    controller: 'bibliController',
                    templateProvider: function($templateCache){
                        return $templateCache.get('app/bibli/views/el1-lu.tpl.html');
                    },
                    //templateUrl: 'src/app/bibli/views/el1-lu.tpl.html',
                    resolve: {
                        liensNonLus : ['$rootScope', 'LiensService', 'SessionStorage', 'USERFIREBASEPROFILEKEY',
                            function($rootScope, LiensService,  SessionStorage ,USERFIREBASEPROFILEKEY) {
                                return LiensService.findNotReadLinksByUser(SessionStorage.get(USERFIREBASEPROFILEKEY).uid);
                            }],
                        liensLus : ['$rootScope', 'LiensService', 'SessionStorage', 'USERFIREBASEPROFILEKEY',
                            function($rootScope, LiensService,SessionStorage ,USERFIREBASEPROFILEKEY) {
                                return LiensService.findReadLinksByUser(SessionStorage.get(USERFIREBASEPROFILEKEY).uid);
                            }],
                        allMyCercles :  ['$rootScope', 'UsersManager', 'SessionStorage', 'USERFIREBASEPROFILEKEY',
                            function($rootScope, UsersManager, SessionStorage ,USERFIREBASEPROFILEKEY) {
                                return UsersManager.findCerclesByUser(SessionStorage.get(USERFIREBASEPROFILEKEY).uid);
                            }],
                        allCategories : ['LiensService', function(LiensService) {
                            return LiensService.findCategories();
                        }]
                   }
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('commons');
                    $translatePartialLoader.addPart('el1-view');
                    return $translate.refresh();
                }],
                currentAuth: ['FBFactory', function(FBFactory) {
                    return FBFactory.auth().$requireAuth();
                }]
            }
        });


        

    });

}(angular.module('el1.bibli', [ 'ngMaterial', 'ui.router', 'el1.services.commun', 'el1.model' ] )));

(function(){

    angular
        .module('el1.bibli')
        .controller('bibliController', [
            '$log', '$scope', '$state',
            'commonsService', 'LiensService',
            'liensNonLus', 'liensLus', 'allMyCercles', 'allCategories',
            '$mdDialog', '$mdMedia', '$mdToast',
            BibliController
            ])
        .controller('shareController', [
            '$log', '$scope', '$cookieStore',
            'GestionService',
            'linkToShare', 'allCategories', 'allMyCercles', 'listeLiens',
            'SessionStorage', 'USERFIREBASEPROFILEKEY',
            '$mdDialog', '$mdMedia',
            ShareController
        ]);

    /**
     */
    function BibliController($log, $scope, $state, commonsService, LiensService, liensNonLus, liensLus, allMyCercles, allCategories, $mdDialog, $mdMedia, $mdToast ) {

        $scope.customFullscreen = $mdMedia('sm');
        //liens : liens non lus ou biblio selon le cas

        if ($state.current.name === 'bibli-nonLu') {
            $scope.liens = liensNonLus;
        } else {
            $scope.liens = liensLus;
        }

        $scope.showURL= function(lien) {
            window.open(lien.url, '_blank');
        }

        $scope.canShare= function() {
            return allMyCercles && allMyCercles[0];
        };

        $scope.deleteLink= function(lien) {
            // $scope.liens est synchronisé avec la base
            LiensService.deleteLinkScreen(lien);
            $scope.liens.$remove(lien);
            commonsService.showSuccessToast($mdToast, "Le lien a été supprimé");
        };

        $scope.moveTo = function(lien) {
            // on conserve l'id original du lien dans keyOri
            if (!lien.keyOri)
                lien.keyOri= lien.$id;

            //cas des liens non lus
            if ($state.current.name === 'bibli-nonLu') {
                //Ajout dans biblio
                liensLus.$add(lien);
            } else {
                //Ajout dans non lus
                liensNonLus.$add(lien);
            }
            //Suppression du lien de la liste
            $scope.deleteLink(lien);

            commonsService.showSuccessToast($mdToast, "Le lien a été déplacé");
        };

        $scope.share= function(ev, lien) {

            $mdDialog.show({
                controller: ShareController,
                templateUrl: 'src/app/bibli/views/el1-share.tpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: {
                    linkToShare: lien,
                    allCategories: allCategories,
                    allMyCercles: allMyCercles,
                    listeLiens :  $scope.liens
                },
                clickOutsideToClose:true,
                fullscreen: $mdMedia('sm') && $scope.customFullscreen
            })
                .then(function(shareLink) {
                    // valider
                    commonsService.showSuccessToast($mdToast, "Le lien a bien été partagé avec le cercle " + shareLink.cercleName);
                }, function() {
                    // cancel
                });

            $scope.$watch(function() {
                return $mdMedia('sm');
            }, function(sm) {
                $scope.customFullscreen = (sm === true);
            });

        };

    }

    /**
     */
    function ShareController($log, $scope, $cookieStore, GestionService, linkToShare, allCategories, allMyCercles, listeLiens, SessionStorage, USERFIREBASEPROFILEKEY, $mdDialog, $mdMedia ) {

        $scope.categories= allCategories;
        $scope.cercles= allMyCercles;
        $scope.linkToShare = linkToShare;

        // on trace l'id original
        var keyOri;
        if (linkToShare.keyOri)
            keyOri= linkToShare.keyOri;
        else keyOri= linkToShare.$id;

        var cercleName= allMyCercles[0].$id;
        var category= allCategories[0];
        if ($cookieStore.get('selectedCategory')) {
            category= $cookieStore.get('selectedCategory');
        }
        if ($cookieStore.get('selectedCercle')) {
            cercleName=$cookieStore.get('selectedCercle').$id;
        }

        //Initialisation du lien à basculer vers un cercle donné pour une catégorie donnée
        $scope.shareLink=  {
            title: linkToShare.title,
            teasing: linkToShare.teasing,
            createdOn : linkToShare.createdOn,
            url : linkToShare.url,
            cercleName: cercleName,
            category: category,
            keyOri: keyOri
        }

        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.validate = function(shareLink) {

            if ($scope.currentForm.$valid) {
                //Lorsque le lien est partagé :
                //   il est supprimé de read ou notRead
                //   il est déplacé vers le cercle cible (cercleLinks)
                //   il est associé à une catégorie (attribut category)
                GestionService.shareLien(shareLink, SessionStorage.get(USERFIREBASEPROFILEKEY))
                    .then(function() {
                        listeLiens.$remove(linkToShare);
                        $mdDialog.hide(shareLink);
                    })
                    .catch (function(error) {
                        $log.error(error);
                    })
            }
        };
    }

})();
(function(module){

    'use strict';
    module.config(function ($stateProvider) {

        

        $stateProvider.state('cercle-view', {
            url: '/cercle/view',
            data : {
                    title :"view"
            },
            views: {
                "main": {
                    controller: 'cercleController',
                    templateProvider: function($templateCache){
                        return $templateCache.get('app/cercle/views/el1-view.tpl.html');
                    },
                    //templateUrl: 'src/app/cercle/views/el1-view.tpl.html',
                    resolve: {
                        liens : ['$log', '$cookieStore', 'LiensService', 'UsersManager', 'SessionStorage', 'USERFIREBASEPROFILEKEY',
                            function($log, $cookieStore, LiensService, UsersManager, SessionStorage, USERFIREBASEPROFILEKEY) {
                                if ($cookieStore.get('selectedCercle')) {
                                    var cercleName = $cookieStore.get('selectedCercle');
                                    if (cercleName.$id)
                                        return LiensService.findLinksByCerlceName(cercleName.$id);
                                }

                                // sinon on prend le premier
                                return UsersManager.findCerclesByUser(SessionStorage.get(USERFIREBASEPROFILEKEY).uid)
                                    .then(function (cercles) {
                                        if (cercles.length > 0) {
                                            return LiensService.findLinksByCerlceName(cercles[0].$id);
                                        } else {
                                            return [];
                                        }
                                    });
                        }],
                        allMyCercles :  ['UsersManager', 'SessionStorage', 'USERFIREBASEPROFILEKEY',
                            function(UsersManager, SessionStorage, USERFIREBASEPROFILEKEY) {
                                return UsersManager.findCerclesByUser(SessionStorage.get(USERFIREBASEPROFILEKEY).uid);
                        }],
                        allCategories : ['LiensService', function(LiensService) {
                            return LiensService.findCategories();
                        }]
                    }
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('commons');
                    $translatePartialLoader.addPart('el1-view');
                    return $translate.refresh();
                }],
                currentAuth: ['FBFactory', function(FBFactory) {
                    return FBFactory.auth().$requireAuth();
                }]
            }
        });


        

    });

}(angular.module('el1.cercle', [ 'ngMaterial', 'ui.router', 'el1.services.commun', 'el1.model' ] )));

(function(){

    angular
        .module('el1.cercle')
        .controller('cercleController', [
            '$log', '$scope', '$cookieStore',
            'commonsService',
            'LiensService',
            'liens',
            'allCategories',
            'allMyCercles',
            'SessionStorage',
            'USERFIREBASEPROFILEKEY',
            '$mdToast',
            CercleController
            ])
    ;

    /**
     */
    function CercleController($log, $scope, $cookieStore, commonsService, LiensService, liens, allCategories, allMyCercles, SessionStorage, USERFIREBASEPROFILEKEY, $mdToast) {
        $scope.allLiens = liens;
        $scope.categories = allCategories;
        $scope.cercles = allMyCercles;
        $scope.filter = {"category": ""};
        $scope.isLikeDisabled = false;

        if ($cookieStore.get('selectedCategory')) {
            $scope.filter.category= $cookieStore.get('selectedCategory');
        } else {
            $scope.filter.category = "";
        }

        if ($cookieStore.get('selectedCercle')) {
            $scope.selectedCercle= $cookieStore.get('selectedCercle');
        } else if (allMyCercles[0]) {
            $scope.selectedCercle = allMyCercles[0];
        }

        $scope.changeCategory = function (category) {
            $log.info("change " + category );
            $scope.filter.category= category;
            $cookieStore.put('selectedCategory', category);
        }

        $scope.changeCercle = function (cercle) {
            $scope.selectedCercle =cercle;
            LiensService.findLinksByCerlceName(cercle.$id)
                .then(function (links) {
                    $scope.allLiens = links;
                });
            $cookieStore.put('selectedCercle', cercle);
        };

        $scope.showURL= function(lien) {
            window.open(lien.url, '_blank');
        }

        $scope.moveToBiblio= function(lien) {
            lien.private = "biblio";
            LiensService.createLinkForUser(lien, SessionStorage.get(USERFIREBASEPROFILEKEY).uid);
            commonsService.showSuccessToast($mdToast, "Le lien a été ajouté à votre biblio");
        };

        $scope.like = function (lien) {
            //Bloque tous les liens !
            //$scope.isLikeDisabled = true;
            LiensService.addLike($scope.selectedCercle.$id, lien.$id);
            commonsService.showSuccessToast($mdToast, "'Like' pris en compte");
        };

    }
})();
angular.module('el1.error', [ 'ui.router' ])
    .config(function ($stateProvider) {

        $stateProvider.state('pageErreur', {
            url: '/erreurs',
            views: {
                "main": {
                    controller: 'ErrorController',
                    templateUrl: 'src/app/error/error.tpl.html'
                }
            }
        });

    })
    .controller('ErrorController', function($rootScope, $scope, $http, $location, AuthService) {

    });
(function(module){

    'use strict';
    module.config(function ($stateProvider) {

        

        $stateProvider.state('gestion-view', {
            url: '/gestion/view',
            data : {
                title :"gestion"
            },
            views: {
                "main": {
                    controller: 'gestionController',
                    templateProvider: function($templateCache){
                        return $templateCache.get('app/gestionCercles/views/el1-gestion.tpl.html');
                    },
                    //templateUrl: 'src/app/gestionCercles/views/el1-gestion.tpl.html',
                    resolve: {
                        personnesDuCercle : ['GestionService', 'UsersManager', 'SessionStorage', 'USERFIREBASEPROFILEKEY',
                            function(GestionService, UsersManager, SessionStorage, USERFIREBASEPROFILEKEY) {
                                //Recherches des cercles sont je suis membre
                                //Pour le premier d'entre eux, je recherche les personnes de ce cercle.
                                return UsersManager.findCerclesByUser(SessionStorage.get(USERFIREBASEPROFILEKEY).uid)
                                    .then (function(cerclesIndex) {
                                    //return [];
                                        if (cerclesIndex && cerclesIndex.length > 0) {
                                            return GestionService.findPersonnesByCercle(cerclesIndex[0]);
                                        } else {
                                            return [];
                                        }
                                });
                        }],
                        mesInvitations : ['UsersManager', 'SessionStorage', 'USERFIREBASEPROFILEKEY',
                            function(UsersManager, SessionStorage, USERFIREBASEPROFILEKEY) {
                                //Recherche des cercles sont je ne suis pas encore membre
                              return UsersManager.findInvitationsByUser(SessionStorage.get(USERFIREBASEPROFILEKEY).uid);
                        }],
                        mesCercles : ['UsersManager', 'SessionStorage', 'USERFIREBASEPROFILEKEY',
                            function(UsersManager, SessionStorage, USERFIREBASEPROFILEKEY) {
                                //Recherche des cercles dont je suis membre
                                return UsersManager.findCerclesByUser(SessionStorage.get(USERFIREBASEPROFILEKEY).uid);
                        }],
                        usersEmail : ['UsersManager', 'SessionStorage', 'USERFIREBASEPROFILEKEY',
                            function(UsersManager, SessionStorage, USERFIREBASEPROFILEKEY){
                                return UsersManager.getUsersEmail(SessionStorage.get(USERFIREBASEPROFILEKEY).uid)
                                    .then(function(users) {
                                        return users;
                                    })

                        }]
                    }
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('commons');
                    $translatePartialLoader.addPart('el1-gestion');
                    return $translate.refresh();
                }],
                currentAuth: ['FBFactory', function(FBFactory) {
                    return FBFactory.auth().$requireAuth();
                }]
            }
        });

        

    });

}(angular.module('el1.gestion', [ 'ngMaterial', 'ui.router', 'el1.services.commun', 'el1.model' ] )));

(function(){

    angular
        .module('el1.gestion')
        .controller('gestionController', [
            '$log', '$scope', '$cookieStore', '$q', '$timeout',
            '$translate',
            'GestionService', 'UsersManager',  'commonsService',
            'mesInvitations', 'personnesDuCercle', 'mesCercles', 'usersEmail',
            'SessionStorage', 'USERFIREBASEPROFILEKEY',
            '$mdDialog', '$mdMedia', '$mdToast',
            GestionController
        ])
        .controller('nouveauCercleController', [
            '$log', '$scope',
            'GestionService',
            'CercleModel',
            '$mdDialog', '$mdMedia',
            NouveauCercleController
        ]);

    /**
     */
    function GestionController($log, $scope, $cookieStore, $q, $timeout, $translate, GestionService, UsersManager, commonsService, mesInvitations, personnesDuCercle, mesCercles, usersEmail, SessionStorage, USERFIREBASEPROFILEKEY, $mdDialog, $mdMedia, $mdToast ) {

        $scope.mesInvitations= mesInvitations;
        $scope.personnes= personnesDuCercle;
        $scope.cercles= mesCercles;
        $scope.users = usersEmail;

        $scope.selectedItemChange = selectedItemChange;
        $scope.searchTextChange   = searchTextChange;
        $scope.querySearch   = querySearch;
        $scope.selectedItem = null;
        $scope.invited = [];
        $scope.invitedDisplay = "";

        if ($cookieStore.get('selectedCercle')) {
            $scope.selectedCercle= $cookieStore.get('selectedCercle');
        } else if (mesCercles[0]) {
            $scope.selectedCercle = mesCercles[0];
        }

        //Functions utilis�e par le select box autocomplete
        function querySearch (query) {
            var results = query ? $scope.users.filter( createFilterFor(query) ) : $scope.users,
                deferred;
            deferred = $q.defer();
            $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
            return deferred.promise;

        }

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(user) {
                return (user.email.indexOf(lowercaseQuery) === 0);
            };
        }

        function searchTextChange(text) {
            $log.info('Text changed to ' + text);
        }
        function selectedItemChange(user) {
            //s�lection d'un �l�menta dans la liste
            $log.info('Item changed to ' + JSON.stringify(user));
            //si l'objet a �t� s�lectionn�, il n'est pas vide
            /**if (Object.keys(user).length > 0) {
                $scope.selectedUser= user;
            } else {
                $scope.selectedUser= null;
            }*/
        }

        $scope.nouveauCercle = function(ev) {

            $mdDialog.show({
                controller: NouveauCercleController,
                templateUrl: 'src/app/gestionCercles/views/el1-nouveauCercle.tpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: {
                },
                clickOutsideToClose:true,
                fullscreen: $mdMedia('sm') && $scope.customFullscreen
            })
                .then(function(cercle) {
                    // valider
                    $scope.changeCercle(cercle)
                }, function() {
                    // cancel
                });

            $scope.$watch(function() {
                return $mdMedia('sm');
            }, function(sm) {
                $scope.customFullscreen = (sm === true);
            });

        };

        $scope.changeCercle= function(cercleSelected) {
            //Changement de cercle
            //==> r�cup�ration des personnes du cercle choisi
            GestionService.findPersonnesByCercle(cercleSelected)
                .then(function (personnes) {
                    $scope.selectedCercle = cercleSelected;
                    $scope.personnes = personnes;
                })
                .catch(function (error) {
                    $log.error(error);
                })

            $cookieStore.put('selectedCercle', cercleSelected);
        }

        $scope.inviter= function(invite) {

            if (invite !== null) {
                //L'utilisateur connect� invite un utilisateur � rejoindre le cercle s�lectionn�
                UsersManager.inviter(invite.uid, $scope.selectedCercle.$id)
                    .then(function (username) {
                        $scope.invited.push(invite.email);
                        $scope.invitedDisplay = $scope.invited.join(', ');
                        $scope.selectedItem = null;
                        $scope.searchText = null;
                    })
                    .catch(function (error) {
                        $log.error(error);
                    })
            }
        }

        $scope.accepterInvitation= function(invitation) {
            // Si l'utilisateur connect� accepte l'invitation
            // ==> Ajout du cercle au niveau du user.
            // ==> Ajout de l'utilisateur au niveau des membres du cercle
            // ==> Suppression de l'invitation en attente
            // ==> Recharcher la liste ?
            GestionService.accepterInvitation(SessionStorage.get(USERFIREBASEPROFILEKEY).uid, invitation.$id)
                .then(function(cerclename) {
                    commonsService.showSuccessToast($mdToast, $translate.instant('gestion.message.accepterInvitation'));
                })
                .catch(function(error) {
                    $log.error(error);
                });
        }

    }

    /**
     */
    function NouveauCercleController($log, $scope, GestionService, CercleModel, $mdDialog, $mdMedia) {
        $scope.currentCercle= new CercleModel();
        $scope.alerts = [];

        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.validate= function(currentCercle) {
            if ($scope.currentForm.$valid) {
                GestionService.createCercle(currentCercle).then(
                    function (ref) {
                        currentCercle.$id= ref;
                        $mdDialog.hide(currentCercle);
                    }, function (error) {
                        $log.error(error);
                    }
                );

            }
        }

        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

    }

})();

(function(module){

    'use strict';
    module.config(function ($stateProvider) {

        

        $stateProvider.state('icdc-view', {
            url: '/icdc/view',
            data : {
                    title :"ICDC"
            },
            views: {
                "main": {
                    controller: 'icdcController',
                    templateProvider: function($templateCache){
                        return $templateCache.get('app/icdc/views/el1-view.tpl.html');
                    },
                    //templateUrl: 'src/app/icdc/views/el1-view.tpl.html',
                    resolve: {
                        allCategories : ['LiensService', function(LiensService) {
                            return LiensService.findCategories();
                        }],
                        topTen : ['LiensService', function(LiensService) {
                            return LiensService.findTopTenLinks();
                        }]
                    }
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('commons');
                    $translatePartialLoader.addPart('el1-view');
                    return $translate.refresh();
                }],
                currentAuth: ['FBFactory', function(FBFactory) {
                    return FBFactory.auth().$requireAuth();
                }]
            }
        });


        

    });

}(angular.module('el1.icdc', [ 'ngMaterial', 'ui.router', 'el1.services.commun', 'el1.model' ] )));

(function(){

    angular
        .module('el1.icdc')
        .controller('icdcController', [
            '$log', '$scope', '$cookieStore', '$mdToast', 'commonsService',
            'LiensService',
            'allCategories',
            'topTen',
            'SessionStorage',
            'USERFIREBASEPROFILEKEY',
            ICDCController
            ])
    ;

    /**
     */
    function ICDCController($log, $scope, $cookieStore, $mdToast, commonsService, LiensService, allCategories, topTen, SessionStorage, USERFIREBASEPROFILEKEY) {
        $scope.topTen= topTen;
        $scope.categories= allCategories;
        $scope.filter= { "category" : "" };

        if ($cookieStore.get('selectedCategory')) {
            $scope.filter.category= $cookieStore.get('selectedCategory');
        } else {
            $scope.filter.category = "";
        }

        $scope.showURL= function(lien) {
            window.open(lien.url, '_blank');
        }

        $scope.changeCategory = function (category) {
            $scope.filter.category= category;
            $cookieStore.put('selectedCategory', category);
        }

        $scope.moveToBiblio= function(lien) {
            //On duplique le lien dans biblio
            lien.private = "biblio";
            LiensService.createLinkForUser(lien, SessionStorage.get(USERFIREBASEPROFILEKEY).uid);
            commonsService.showSuccessToast($mdToast, "Le lien a été ajouté à votre biblio");
        };

    }

})();
angular.module('el1.login', ['el1.services.commun', 'el1.model', 'ngCookies'])
    .config(function ($stateProvider) {

        $stateProvider.state('showLogin', {
            url: '/showLogin',
            data:{ pageTitle: 'Login' },
            views: {
                "main": {
                    controller: 'LoginCtrl',
                    templateProvider: function($templateCache){
                        return $templateCache.get('app/login/login.tpl.html');
                    }
                    //templateUrl: 'src/app/login/login.tpl.html'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('commons');
                    $translatePartialLoader.addPart('login');
                    return $translate.refresh();
                }]
            }
        });


    })
    .controller('LoginCtrl', function($q, $state, $rootScope, $scope, $log, FBURL, $cookieStore, $firebaseAuth, GOOGLEAUTHSCOPE, UsersManager) {

        var ref = new Firebase(FBURL);
        var auth = $firebaseAuth(ref);

        $scope.login = function () {

            // login with Google
            /**
             {
                 "provider":"google",
                 "uid":"google:101057261296257366646",
                 "google":{
                 "id":"101057261296257366646",
                     "accessToken":"ya29.RwJdbjoUQcUYnK1Q47kfKWeQaI3PzPjJ22khRnCziNP5uo0YDR5oYSKyyuxih4xPJC0q",
                     "displayName":"Matthieu Guillemette",
                     "email":"matguillem37@gmail.com",
                     "cachedUserProfile":{
                     "id":"101057261296257366646",
                         "email":"matguillem37@gmail.com",
                         "verified_email":true,
                         "name":"Matthieu Guillemette",
                         "given_name":"Matthieu",
                         "family_name":"Guillemette",
                         "link":"https://plus.google.com/101057261296257366646",
                         "picture":"https://lh5.googleusercontent.com/-P5f4pPq_mUw/AAAAAAAAAAI/AAAAAAAAGKs/4Xo0LqHkan4/photo.jpg",
                         "locale":"fr"
                 },
                 "profileImageURL":"https://lh5.googleusercontent.com/-P5f4pPq_mUw/AAAAAAAAAAI/AAAAAAAAGKs/4Xo0LqHkan4/photo.jpg"
             },
                 "token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2IjowLCJkIjp7InVpZCI6Imdvb2dsZToxMDEwNTcyNjEyOTYyNTczNjY2NDYiLCJwcm92aWRlciI6Imdvb2dsZSJ9LCJpYXQiOjE0NDk4MzA5NDh9.MrQcVmJ1WJ9W16J5_x3XEYUxS4KKqSVDQGgVtp7pRBg",
                 "auth":{
                 "uid":"google:101057261296257366646",
                     "provider":"google"
             },
                 "expires":1449917348
             }*/

            auth.$authWithOAuthPopup("google", {remember: "sessionOnly",scope: GOOGLEAUTHSCOPE})
                .then(function (authData) {
                    return $q.when(authData);
                })
                .then(function(authData) {
                    return UsersManager.addUser(authData);
                })
                .then(function(userConnected) {
                    return UsersManager.addUserEmail(userConnected);
                })
                .then(function(userConnected) {
                    $rootScope.userAuthenticated = true;
                    $cookieStore.put('user', userConnected);
                    $rootScope.userEmail = userConnected.email;
                    return $q.when(userConnected);
                })
                .then (function(userConnected) {
                    $state.go('home');
                })
                .catch(function (error) {
                    $log.info("Authentication failed:", error);
                });
        }

    });
'use strict';

angular.module('elinkApp')
    .directive('cdcAlertError', function(AlertService, $rootScope, $translate) {
		return {
            restrict: 'E',

            template:
                '<div ng-repeat="alert in alerts" class="alert" ng-class="[\'alert-\' + (alert.type || \'warning\'), alert.closeable ? \'alert-dismissible\' : null]" role="alert">' +
                    '<div layout="row">' +
                        '<div>{{ alert.msg }}</div>' +
                        '<button ng-show="alert.closeable" type="button" class="close" ng-click="alert.close({$event: $event})">' +
                            '<span aria-hidden="true">&times;</span>' +
                            '<span class="sr-only">Close</span>' +
                        '</button>' +
                    '</div>' +
                '</div>',

			controller: ['$scope',
	            function($scope) {
	                $scope.alerts = AlertService.get();

					var cleanHttpErrorListener = $rootScope.$on('httpError', function (event, httpResponse) {
					    var i;
					    event.stopPropagation();
					    switch (httpResponse.status) {
					        // connection refused, server not reachable
					        case -1:
					            addErrorAlert("Server not reachable",'error.serverNotReachable');
					            break;
							case 0:
								addErrorAlert("Server not reachable",'error.serverNotReachable');
								break;

					        case 400:
					            if (httpResponse.data && httpResponse.data.fieldErrors) {
					                for (i = 0; i < httpResponse.data.fieldErrors.length; i++) {
					                    var fieldError = httpResponse.data.fieldErrors[i];
					                    var fieldName = fieldError.fieldname;
					                    // var fieldNameI18n = $translate.instant('webjhipsApp.' + fieldError.objectName + '.' + convertedField);
					                    addErrorAlert(fieldName + ':' + fieldError.message);
					                }
					            } else if (httpResponse.data && httpResponse.data.message) {
					              addErrorAlert(httpResponse.data.message, httpResponse.data.message, httpResponse.data);
					            } else {
					              addErrorAlert(httpResponse.data);
					            }
					            break;

					        default:
					            if (httpResponse.data && httpResponse.data.message) {
					                addErrorAlert(httpResponse.data.message);
					            } else {
					                addErrorAlert(JSON.stringify(httpResponse));
					            }
					    }
					});

					$scope.$on('$destroy', function () {
					    if(cleanHttpErrorListener !== undefined && cleanHttpErrorListener !== null){
							cleanHttpErrorListener();
						}
					});

					var addErrorAlert = function (message, key, data) {

						key = key && key != null ? key : message;
						AlertService.error(key, data);

					}

	            }
	        ]
        }
    });

'use strict';

angular.module('elinkApp')
    .factory('AlertService', function ($timeout, $sce,$translate) {
        var exports = {
                factory: factory,
                add: addAlert,
                closeAlert: closeAlert,
                closeAlertByIndex: closeAlertByIndex,
                clear: clear,
                get: get,
                success: success,
                error: error,
                info: info,
                warning : warning
            },
            alertId = 0, // unique id for each alert. Starts from 0.
            alerts = [],
            timeout = 30000; // default timeout

        function clear() {
            alerts = [];
        }

        function get() {
            return alerts;
        }

        function success(msg, params) {
            this.add({
                type: "success",
                msg: msg,
                params: params,
                timeout: timeout,
                closeable : true
            });
        }

        function error(msg, params) {
            this.add({
                type: "danger",
                msg: msg,
                params: params,
                timeout: timeout,
                closeable : true
            });
        }

        function warning(msg, params) {
            this.add({
                type: "warning",
                msg: msg,
                params: params,
                timeout: timeout,
                closeable : true
            });
        }

        function info(msg, params) {
            this.add({
                type: "info",
                msg: msg,
                params: params,
                timeout: timeout,
                closeable : true
            });
        }

        function factory(alertOptions) {
            return alerts.push({
                type: alertOptions.type,
                msg: $sce.trustAsHtml(alertOptions.msg),
                id: alertOptions.alertId,
                timeout: alertOptions.timeout,
                closeable : true,
                close: function () {
                    return exports.closeAlert(this.id);
                }
            });
        }

        function addAlert(alertOptions) {
            alertOptions.alertId = alertId++;
            alertOptions.msg = $translate.instant(alertOptions.msg, alertOptions.params);
            var that = this;
            this.factory(alertOptions);
            if (alertOptions.timeout && alertOptions.timeout > 0) {
                $timeout(function () {
                    that.closeAlert(alertOptions.alertId);
                }, alertOptions.timeout);
            }
        }

        function closeAlert(id) {
            return this.closeAlertByIndex(alerts.map(function(e) { return e.id; }).indexOf(id));
        }

        function closeAlertByIndex(index) {
            return alerts.splice(index, 1);
        }

        return exports;

    });
'use strict';

angular.module('elinkApp')
    .directive('hasRole', ['Env', 'AuthService', function (Env, AuthService) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {

                var setVisible = function () {
                        element.removeClass('hidden');
                    },
                    setHidden = function () {
                        element.addClass('hidden');
                    },
                    defineVisibility = function (role) {
                        if (Env.getUser() && AuthService.isInRole(role)) {
                            setVisible();
                        } else
                            setHidden();
                    },
                    role = attrs.hasRole.replace(/\s+/g, '');

                scope.$watch('user', function(newValue, oldValue) {
                    if (role.length > 0) {
                        defineVisibility(role);
                    }
                });
            }
        };
    }]);

'use strict';

angular.module('elinkApp')
    .directive('pict', function($rootScope) {
		return {
            restrict: 'E',

            template:
				'<div flex="15"><img ng-src="{{ imgsrc }}" style="width:450%" ></div>'
			,

			controller: ['$scope', 'LiensService',
	            function($scope, LiensService) {
					LiensService.findLinkScreen($scope.lien).then(function (payload) {
						if (payload) {
							$scope.imgsrc = 'data:image/jpeg;base64,' + payload;
						} else {

							var unregister= $scope.$watch(function() {
								var anId= $scope.lien.$id;
								return $rootScope.images[anId];
							}, function() {
								var anId= $scope.lien.$id;
								var linkScreen= $rootScope.images[anId]
								if (linkScreen) {
									if (linkScreen.$value) {
										$scope.imgsrc = 'data:image/jpeg;base64,' + linkScreen.$value;
										unregister();
									}
								}
							});

						}
					}, function (error) {
						// pas grave
					});
	            }
	        ]
        }
    });

'use strict';

angular.module('elinkApp')
    .factory('authExpiredInterceptor', function ($rootScope, $q, $injector) {
        return {
            responseError: function(response) {
                // If we have an unauthorized request we redirect to the login page
                // Don't do this check on the account API to avoid infinite loop
                if (response.status == 401 && response.data.path !== undefined && response.data.path.indexOf("login") == -1){
                    var $state = $injector.get('$state');
                    var to = $rootScope.toState;
                    var params = $rootScope.toStateParams;

                    $rootScope.authenticated = false;
                    $rootScope.returnToState = to;
                    $rootScope.returnToStateParams = params;

                    $state.go('showLogin');
                }
                return $q.reject(response);
            }
        };
    });
'use strict';

angular.module('elinkApp')
    .factory('errorHandlerInterceptor', function ($q, $rootScope) {
        return {
            'responseError': function (response) {
                if (!(response.status == 401 && response.data.path.indexOf("/login") == 0 )){
	                $rootScope.$emit('httpError', response);
	            }
                return $q.reject(response);
            }
        };
    });
angular.module('el1.model')

    .factory('CercleModel', function () {
        // constructor
        function CercleModel(data) {
            angular.copy(data, this); 
            this.toString = function toString() {
                return " " + this.label +  " ";
            }
        }
        return CercleModel;
    })

    .factory('CerclesModel', [ 'CercleModel', function (CercleModel) {
        // constructor
        function CerclesModel(data) {
            this.items = new Array(data.length);
            for (var i in data) {
                this.items[i] = new CercleModel(data[i]);
            }
        }

        return CerclesModel;
    }]);

'use strict';
angular.module('el1.model')

    .factory('Env', function Env() {
        var _backend, _user, _backendfirebase;

        return {
            init: function (data) {
                _backend = data.backend;
                _backendfirebase = data.backendfirebase;
            },
            backend: function() {
                return _backend;
            },
            backendfirebase : function() {
                return _backendfirebase;
            },
            setUser: function(user) {
                _user= user;
            },
            getUser: function() {
                return _user;
            },
            isAuthenticated: function () {
                return _user !== null;
            },
            isAdmin: function () {
                return _user !== null && _user.admin;
            },
            isMock: function() {
                return false;
            }
        };

    })

;
angular.module('el1.model')

    .factory('LienModel', function () {
        // constructor
        function LienModel(data) {
            angular.copy(data, this); 
            this.toString = function toString() {
                return " " + this.lu + " " + this.private + " " + this.url +  " ";
            }
        }
        return LienModel;
    })

    .factory('LiensModel', [ 'LienModel', function (LienModel) {
        // constructor
        function LiensModel(data) {
            this.items = new Array(data.length);
            for (var i in data) {
                this.items[i] = new LienModel(data[i]);
            }
        }

        return LiensModel;
    }]);

angular.module('el1.model')

    .factory('PersonneModel', function () {
        // constructor
        function PersonneModel(data) {
            angular.copy(data, this);
            this.toString = function toString() {
                return " " + this.email + " " + this.nom + " " + this.prenom +  " ";
            }
        }
        return PersonneModel;
    })

    .factory('PersonnesModel', [ 'PersonneModel', function (PersonneModel) {
        // constructor
        function PersonnesModel(data) {
            this.items = new Array(data.length);
            for (var i in data) {
                this.items[i] = new PersonneModel(data[i]);
            }
        }

        return PersonnesModel;
    }]);

angular.module('el1.model')

    .factory('UserModel', function () {
        // constructor
        function UserModel(data) {
            angular.copy(data, this);
        }

        return UserModel;

    })

;

(function(){
    'use strict';

    angular.module('el1.services.commun')
        .service('AuthService', ['FBURL', AuthService]);

    /**
     *
     */
    function AuthService(FBURL){

        return {

            logout : function () {
                var ref = new Firebase(FBURL);
                ref.unauth();
                return;
            }
        };

    }

})();

(function(){
    'use strict';

    angular.module('el1.services.commun')
        .service('commonsService', ['$q', '$http', CommonsService])
        .service('EscapeUtils', EscapeUtils)
        .factory('FBFactory', ['$firebaseAuth', '$firebaseArray', 'FBURL', FBFactory])
        .factory('LocalStorage', [LocalStorage])
        .factory('SessionStorage', [SessionStorage]);


    function EscapeUtils() {

        this.escapeEmail = function (email) {
            return (email || '').replace('.', ',');
        }

        this.unescapeEmail = function (email) {
            return (email || '').replace(',', '.');
        }
    }


    /**
     *
     */
    function CommonsService($q, $http){

        return {
            flatModel : function(aModel) {
                var result = "";
                var index= 0;
                for (var prop in aModel) {

                    if(typeof aModel[prop] != "function" && typeof aModel[prop] != "object"){
                        if (aModel[prop] != undefined) {
                            if (index != 0)
                                result = result + "|";
                            result = result + prop + "::" + aModel[prop];
                            index= index + 1;
                        }
                    }

                }// for

                return result;
            }, // flatModel
            showSuccessToast : function($mdToast, message) {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent(message)
                        .position('bottom right')
                        .hideDelay(3000)
                );
            }
        };

    }

    function FBFactory ($firebaseAuth, $firebaseArray, FBURL) {

            return {
                auth: function() {
                    var FBRef = new Firebase(FBURL);
                    return $firebaseAuth(FBRef);
                }
            };
        }

    function LocalStorage() {

        return {

            set: function(key, value) {
                return localStorage.setItem(key,
                    JSON.stringify(value));
            },
            get: function(key) {
                return JSON.parse(localStorage.getItem(key));
            },
            remove: function(key) {
                return localStorage.removeItem(key);
            }
        };
    }

    function SessionStorage() {

        return {

            set: function(key, value) {
                return sessionStorage.setItem(key,
                    JSON.stringify(value));
            },
            get: function(key) {
                return JSON.parse(sessionStorage.getItem(key));
            },
            remove: function(key) {
                return sessionStorage.removeItem(key);
            }
        };
    }

})();


Date.prototype.formatDate = function (format) {
    var date = this,
        day = date.getDate(),
        month = date.getMonth() + 1,
        year = date.getFullYear(),
        hours = date.getHours(),
        minutes = date.getMinutes(),
        seconds = date.getSeconds();

    if (!format) {
        format = "MM/dd/yyyy";
    }

    format = format.replace("MM", month.toString().replace(/^(\d)$/, '0$1'));

    if (format.indexOf("yyyy") > -1) {
        format = format.replace("yyyy", year.toString());
    } else if (format.indexOf("yy") > -1) {
        format = format.replace("yy", year.toString().substr(2, 2));
    }

    format = format.replace("dd", day.toString().replace(/^(\d)$/, '0$1'));

    if (format.indexOf("t") > -1) {
        if (hours > 11) {
            format = format.replace("t", "pm");
        } else {
            format = format.replace("t", "am");
        }
    }

    if (format.indexOf("HH") > -1) {
        format = format.replace("HH", hours.toString().replace(/^(\d)$/, '0$1'));
    }

    if (format.indexOf("hh") > -1) {
        if (hours > 12) {
            hours -= 12;
        }

        if (hours === 0) {
            hours = 12;
        }
        format = format.replace("hh", hours.toString().replace(/^(\d)$/, '0$1'));
    }

    if (format.indexOf("mm") > -1) {
        format = format.replace("mm", minutes.toString().replace(/^(\d)$/, '0$1'));
    }

    if (format.indexOf("ss") > -1) {
        format = format.replace("ss", seconds.toString().replace(/^(\d)$/, '0$1'));
    }

    return format;
};

(function(){
    'use strict';

    angular.module('el1.services.commun')
        .service('GestionService', ['$q', '$firebaseObject', '$firebaseArray', 'PersonnesModel', 'FBURL', 'UsersManager', 'SessionStorage', 'USERFIREBASEPROFILEKEY', GestionService]);

    /**
     *
     */
    function GestionService($q, $firebaseObject, $firebaseArray, PersonnesModel, FBURL, UsersManager, SessionStorage, USERFIREBASEPROFILEKEY) {

        var ref = new Firebase(FBURL);

        function saveCercle (cercleName, cercleDescription, username) {

            var deferred = $q.defer();

            var cercleRef = ref.child('cercles').child(cercleName);
            var cercle = $firebaseObject(cercleRef);

            cercle.$loaded()
                .then(function () {
                    if (cercle.$value !== null) {
                        deferred.reject(new Error("le cercle existe d�j� !"));
                    } else {

                        cercle.user = username;
                        //cercle.created = new Date().getTime();
                        cercle.created = Firebase.ServerValue.TIMESTAMP;
                        cercle.description = cercleDescription;

                        cercle.$save()
                            .then(function () {
                                deferred.resolve(cercle);
                            })
                            .catch(function (error) {
                                deferred.reject(error);
                            });
                    }
                })
                .catch(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;

        }
        function saveCercleMember (cerclename, username) {

            var deferred = $q.defer();

            var cercleMemberRef = ref.child('cercleMembers').child(cerclename).child(username);
            var cercleMember = $firebaseObject(cercleMemberRef);

            cercleMember.$loaded()
                .then(function() {
                    cercleMember.$value = true;
                    cercleMember.$save()
                        .then(function () {
                            deferred.resolve(cerclename);
                        })
                        .catch(function (error) {
                            deferred.reject(error);
                        });
                })
                .catch(function(error) {
                    deferred.reject(error);
                });

            return deferred.promise;

        }

        function getCercleUsers(usersIndex) {

            var promises = [];

            angular.forEach(usersIndex,  function(userIndex, index) {
                promises.push(UsersManager.getUser(userIndex.$id));
            });

            return $q.all(promises);
        }



        return {
            createCercle : function (aCercleModel) {

                return saveCercle(aCercleModel.label, aCercleModel.description, SessionStorage.get(USERFIREBASEPROFILEKEY).uid)
                    .then(function(cercle){
                        return saveCercleMember (cercle.$id, SessionStorage.get(USERFIREBASEPROFILEKEY).uid);
                    })
                    .then(function(cerclename){
                        return UsersManager.addCercle(SessionStorage.get(USERFIREBASEPROFILEKEY).uid, cerclename)
                    });

            },
            accepterInvitation : function(username, cerclename) {
                // ==> Ajout du cercle au niveau du user.
                // ==> Ajout de l'utilisateur au niveau des membres du cercle
                // ==> Suppression de l'invitation en attente
                return saveCercleMember(cerclename, username)
                    .then( function(cercleName) {
                        return UsersManager.addCercle(username, cerclename)
                    })
                    .then(function(user) {
                        return UsersManager.removeInvitation(username, cerclename)
                    });
            },

            findPersonnesByCercle : function (cercle) {

                var deferred = $q.defer();

                var membersRef = ref.child('cercleMembers').child(cercle.$id);
                var membersIndex = $firebaseArray(membersRef);

                membersIndex.$loaded()
                    .then(function() {
                        return getCercleUsers(membersIndex)
                    })
                    .then(function(users) {
                        deferred.resolve(users);
                    })
                    .catch(function(error) {
                        deferred.reject(error);
                    });

                return deferred.promise;

            },

            shareLien : function(shareLink, userConnected) {

                var deferred = $q.defer();

                var cercleLinksRef = ref.child('cercleLinks').child(shareLink.cercleName);
                var cercleLinksIndex = $firebaseArray(cercleLinksRef);

                cercleLinksIndex.$loaded()
                    .then(function() {

                        var newCercle = {
                            title: shareLink.title,
                            teasing: shareLink.teasing,
                            createdOn : Firebase.ServerValue.TIMESTAMP,
                            url : shareLink.url,
                            category: shareLink.category,
                            sharedBy: userConnected.google.cachedUserProfile.name,
                            keyOri: shareLink.keyOri
                        };
                        cercleLinksIndex.$add(newCercle)
                            .then(function() {
                                deferred.resolve(newCercle);
                            })
                    })
                    .catch(function(error) {
                        deferred.reject(error);
                    });

                return deferred.promise;

            }

        };

    }

})();

(function(){
    'use strict';

    angular.module('el1.services.commun')
        .service('LiensService', ['$log', '$q', '$http', 'FBURL', '$firebaseArray', '$firebaseObject', 'Env', LiensService]);

    /**
     *
     */
    function LiensService($log, $q, $http, FBURL, $firebaseArray, $firebaseObject, Env){

        var ref = new Firebase(FBURL);

        return {

            findLinkScreen : function(lien) {
                var deferred = $q.defer();
                // le screenschot est enregistre au moment de la creation du lien
                // puis on ne change pas cette clef, même si le lien se déplace (lu/nonLu) ou se duplique (partage)
                // dans ces derniers cas, l'id original du lien est stocké dans keyOri
                // afin de retrouver la clef du screenshot
                var screenKey= lien.$id;
                if (lien.keyOri) {
                    screenKey= lien.keyOri;
                }

                var linkScreens = ref.child('linkScreens').child(screenKey);
                linkScreens.once('value', function(snap) {
                    var payload = snap.val();
                    if (payload != null) {
                        deferred.resolve(payload);
                    } else {
                        $log.info("image introuvable")
                        deferred.resolve(undefined);
                    }
                });

                return deferred.promise;
            },

            screenshotAndStore : function (lien) {

                var deferred = $q.defer();
                var _that = this;
                var config={};
                config.headers = config.headers || {};
                config.headers.Accept = 'application/json';

                $http.get('https://www.googleapis.com/pagespeedonline/v1/runPagespeed?url=' + lien.url + '&screenshot=true', config)
                    .then(
                    function(response) {
                        var data= response.data;
                        _that.addLinkScreen(lien.$id, data)
                            .then(function(linkScreen) {
                                deferred.resolve(linkScreen);
                            })
                            .catch (function(error) {
                                deferred.reject(error);
                            })
                    },
                    function(error) {
                        deferred.reject(error);
                    }
                );

                return deferred.promise;

            },

            addLinkScreen: function(linkId, dataScreen){
                var deferred = $q.defer();

                var linkScreenRef = ref.child('linkScreens').child(linkId);
                var linkScreen = $firebaseObject(linkScreenRef);
                linkScreen.$loaded()
                    .then(function () {
                        linkScreen.$value = dataScreen.screenshot.data.replace(/_/g, '/').replace(/-/g, '+');
                        linkScreen.$save();
                        deferred.resolve(linkScreen);
                    }).catch(function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            },

            deleteLinkScreen: function(link){
                var linkScreenId;
                if (link.keyOri)
                    linkScreenId= link.keyOri;
                else
                    linkScreenId= link.$id;

                if (linkScreenId) {
                    var linkScreenRef = ref.child('linkScreens').child(linkScreenId);
                    if (linkScreenRef)
                        linkScreenRef.remove();
                }
            },

            createLinkForUser : function(lien, username) {
                var deferred = $q.defer();

                var userLinksRef;
                if (lien.private==="biblio") {
                    userLinksRef = ref.child('usersLinks').child(username).child('read');
                } else {
                    userLinksRef = ref.child('usersLinks').child(username).child('notread');
                }
                var userLinks = $firebaseArray(userLinksRef);
                userLinks.$loaded()
                    .then(function () {
                        var newLink = {};
                        newLink.createdOn = Firebase.ServerValue.TIMESTAMP;
                        newLink.title = lien.title ? lien.title : lien.url.substring(0, 100);
                        newLink.url = lien.url;
                        newLink.teasing = "";

                        userLinks.$add(newLink)
                            .then(function (linkAdded) {
                                newLink.$id= linkAdded.key();
                                deferred.resolve(newLink);
                            });

                    }).catch(function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            },

            findNotReadLinksByUser : function(username) {
                var deferred = $q.defer();

                var userLinksNotReadRef = ref.child('usersLinks').child(username).child('notread');
                var userLinksNotRead = $firebaseArray(userLinksNotReadRef);
                userLinksNotRead.$loaded()
                    .then(function () {
                        deferred.resolve(userLinksNotRead);
                    }).catch(function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            },

            findReadLinksByUser : function(username) {
                var deferred = $q.defer();

                var userLinksReadRef = ref.child('usersLinks').child(username).child('read');
                var userLinksRead = $firebaseArray(userLinksReadRef);
                userLinksRead.$loaded()
                    .then(function () {
                        deferred.resolve(userLinksRead);
                    }).catch(function (error) {

                        deferred.reject(error);
                    });

                return deferred.promise;
            },

            /**
             * Recherche des liens d'un cercle appartenant à un utilisateur
             * La liste des cercles d'un utilisateur doit être connue avant
             * @param cercleName
             * @returns {*}
             */
            findLinksByCerlceName : function(cercleName) {

                var deferred = $q.defer();

                var cercleLinksRef = ref.child('cercleLinks').child(cercleName);
                var cercleLinks = $firebaseArray(cercleLinksRef);
                cercleLinks.$loaded()
                    .then(function () {
                        deferred.resolve(cercleLinks);
                    }).catch(function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;

            },

            findLinksByCerlceNameAndIdLink : function(cercleName, idLink) {

                var deferred = $q.defer();

                var cercleLinkRef = ref.child('cercleLinks').child(cercleName).child(idLink);
                var cercleLink = $firebaseObject(cercleLinkRef);
                cercleLink.$loaded()
                    .then(function () {
                        deferred.resolve(cercleLink);
                    }).catch(function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;

            },

            addLike : function(cercleName, idLink) {


                var deferred = $q.defer();

                // a noter : idLink format K4cGFb8ts5teWMJq4PC
                // Pour le cercle CCMT, on obtient l'identifiant CCMT-K4cGFb8ts5teWMJq4PC
                // Le nom du cercle est nécessaire pour récupérer le détail de l'article par la suite
                var cercleLinkLikeRef = ref.child('cercleLinksLike').child(cercleName + idLink);
                var cercleLinkLike = $firebaseObject(cercleLinkLikeRef);
                cercleLinkLike.$loaded()
                    .then(function () {
                        cercleLinkLike.$value = cercleLinkLike.$value === null ? 1 : cercleLinkLike.$value + 1;
                        cercleLinkLike.$save();
                        deferred.resolve(cercleLinkLike);
                    }).catch(function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            },

            findTopTenLinks : function() {

                var deferred = $q.defer();
                var _that = this;

                var likeRef =  new Firebase(FBURL + 'cercleLinksLike');

                //A noter : le tri est ascendant. On prend donc les 10 derniers
                likeRef.orderByValue().limitToLast(10).on("value", function(snapshot) {

                    var topTen = [];

                    // key[0] : nom du cercle
                    // key[1] : identifiant de l'article'
                    snapshot.forEach(function(data) {

                        // key[0] : nom du cercle
                        // key[1] : identifiant de l'article
                        var key = data.key();
                        var keyValue = key.split('-');
                        var cptLike = data.val();

                        //jointure avec le lien pour récupérer sa description
                        _that.findLinksByCerlceNameAndIdLink(keyValue[0], '-'+keyValue[1])
                            .then(function(aLink){
                                topTen.push(angular.extend({},
                                    {
                                        link: aLink,
                                        cpt: cptLike,
                                        cercleName: keyValue[0]
                                    }
                                ));
                            })


                    });

                    deferred.resolve(topTen);
                });

                return deferred.promise;

            },

            /* toutes les catgories */
            findCategories: function () {
                // features/feature-01-oauth
                var deferred = $q.defer();

                //TODO Once() function
                var ref = new Firebase(Env.backendfirebase() + "categories");
                var categories = $firebaseArray(ref);

                categories.$loaded().then(
                    function() {
                        //obtention d'un tableau d'objet
                        // [Object
                        //      $id: "0"
                        //      $priority: null
                        //      $value: "devops"
                        //On itere sur ce dernier pour recuperer la liste
                        var array = [];
                        categories.forEach(function(obj) {
                            array.push(obj.$value);
                        })
                        deferred.resolve(array);
                    }).catch(function(error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            },
            /* toutes les cercles auquels le user appaertient */
            findMyCercles: function () {
                // features/feature-01-oauth
                var deferred = $q.defer();

                var ref = new Firebase(Env.backendfirebase() + "cercles");
                var cercles = $firebaseArray(ref);
                cercles.$loaded().then(
                    function() {
                        //obtention d'un tableau d'objet
                        // [Object
                        //      $id: "CCMT"
                        //On itere sur ce dernier pour recuperer la liste
                        var array = [];
                        cercles.forEach(function(obj) {
                            array.push(obj.$id);
                        })
                        deferred.resolve(array);
                    }).catch(function(error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            }

        };

    }

})();

/**
 * Created by Guillemette on 08/12/2015.
 */
(function () {
    'use strict';

    angular.module('el1.services.commun')
        .service('UsersManager', ['$firebaseObject', '$firebaseArray', '$q', 'FBURL', 'EscapeUtils', UsersManager]);

    function UsersManager($firebaseObject, $firebaseArray, $q, FBURL, EscapeUtils) {

        var ref = new Firebase(FBURL);

        return {
             /**
             {
                 "provider":"google",
                 "uid":"google:101057261296257366646",
                 "google":{
                     "id":"101057261296257366646",
                     "accessToken":"ya29.RwJdbjoUQcUYnK1Q47kfKWeQaI3PzPjJ22khRnCziNP5uo0YDR5oYSKyyuxih4xPJC0q",
                     "displayName":"Matthieu Guillemette",
                     "email":"matguillem37@gmail.com",
                     "cachedUserProfile":{
                        "id":"101057261296257366646",
                         "email":"matguillem37@gmail.com",
                         "verified_email":true,
                         "name":"Matthieu Guillemette",
                         "given_name":"Matthieu",
                         "family_name":"Guillemette",
                         "link":"https://plus.google.com/101057261296257366646",
                         "picture":"https://lh5.googleusercontent.com/-P5f4pPq_mUw/AAAAAAAAAAI/AAAAAAAAGKs/4Xo0LqHkan4/photo.jpg",
                         "locale":"fr"
                 },
                 "profileImageURL":"https://lh5.googleusercontent.com/-P5f4pPq_mUw/AAAAAAAAAAI/AAAAAAAAGKs/4Xo0LqHkan4/photo.jpg"
             },
                 "token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2IjowLCJkIjp7InVpZCI6Imdvb2dsZToxMDEwNTcyNjEyOTYyNTczNjY2NDYiLCJwcm92aWRlciI6Imdvb2dsZSJ9LCJpYXQiOjE0NDk4MzA5NDh9.MrQcVmJ1WJ9W16J5_x3XEYUxS4KKqSVDQGgVtp7pRBg",
                 "auth":{
                 "uid":"google:101057261296257366646",
                     "provider":"google"
             },
                 "expires":1449917348
             }*/
            addUser: function (authData) {

                var deferred = $q.defer();

                var userRef = ref.child('users').child(authData.uid);
                var user = $firebaseObject(userRef);

                user.$loaded()
                    .then(function () {
                        if (user.email) {
                            deferred.resolve(user);
                        } else {
                            user.uid = authData.uid;
                            user.email = authData.google.cachedUserProfile.email;
                            user.fullname = authData.google.cachedUserProfile.name;
                            user.firstname = authData.google.cachedUserProfile.given_name;
                            user.lastname = authData.google.cachedUserProfile.family_name;
                            user.picture = authData.google.cachedUserProfile.picture;
                            user.$save()
                                .then(function () {
                                    deferred.resolve(user);
                                });
                        }
                    }).catch(function (error) {
                        deferred.reject(error);
                    });
                return deferred.promise;
            },

            addUserEmail : function(userEmail) {
                var deferred = $q.defer();

                var userEmailRef = ref.child('usersEmail').child(EscapeUtils.escapeEmail(userEmail.email));
                var userEmail = $firebaseObject(userEmailRef);

                userEmail.$loaded()
                    .then(function () {
                        if (userEmail.$value) {
                            deferred.resolve(userEmail);
                        } else {
                            userEmail.$value = userEmail.$id;
                            userEmail.$save()
                                .then(function () {
                                    deferred.resolve(userEmail);
                                });
                        }
                    }).catch(function (error) {
                        deferred.reject(error);
                    });
                return deferred.promise;
            },

            getUsersEmail :  function(idUserConnected) {
                var deferred = $q.defer();

                var usersEmailRef = ref.child('usersEmail');
                var usersEmail = $firebaseArray(usersEmailRef);
                usersEmail.$loaded()
                    .then(function () {
                        var users = [];
                        if (usersEmail.length>0) {
                            usersEmail.forEach(function(user) {
                                //l'utilisateur connect� n'est pas ajout� � la liste
                                if (user.$value !== idUserConnected) {
                                    users.push({uid: user.$value, email: EscapeUtils.unescapeEmail(user.$id)});
                                }
                            })
                        }
                        deferred.resolve(users);
                    }).catch(function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;

            },

            getUser: function (username) {

                var userRef = ref.child('users').child(username);
                var user = $firebaseObject(userRef);

                return user.$loaded();
            },

            getUserFullname: function (userIndex) {

                var deferred = $q.defer();
                var userRef = ref.child('users').child(userIndex.$id).child('fullname');

                var user = $firebaseObject(userRef);

                user.$loaded()
                    .then(function () {
                        deferred.resolve(user.$value);
                    }).catch(function (error) {
                        deferred.reject(error);
                    });
                return deferred.promise;
            },

            /**
             *
             * @param userIndex Utiliosateur connect�
             * @param cercleName
             * @returns {*|a}
             */
            removeCercle: function (username, cercleName) {

                var deferred = $q.defer();

                var userCercleMemberRef = ref.child('users').child(username).child('cercles').child(cercleName);
                var user = $firebaseObject(userCercleMemberRef);
                //return promise
                user.$remove()
                    .then(function () {
                        deferred.resolve("OK");
                    })
                    .catch(function (error) {
                        deferred.reject(error);
                    })

                return deferred.promise;
            },

            /**
             * Cr�ation association utilisateur -> cercles
             * @param userIndex Utilisateur connect�
             * @param cercleName nom du cercle � ajouter
             */
            addCercle: function (username, cerclename) {

                var deferred = $q.defer();

                var userCercleMemberRef = ref.child('users').child(username).child('cercles').child(cerclename);
                var userCercles = $firebaseObject(userCercleMemberRef);
                userCercles.$loaded()
                    .then(function () {
                        userCercles.$value = true;
                        userCercles.$save().then(function (ref) {
                            deferred.resolve(ref.key());
                        })
                    }).catch(function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            },

            findCerclesByUser: function (username) {
                var deferred = $q.defer();

                var userCerclesRef = ref.child('users').child(username).child('cercles');
                var userCercles = $firebaseArray(userCerclesRef);
                userCercles.$loaded()
                    .then(function () {
                        deferred.resolve(userCercles);
                    }).catch(function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;

            },

            findInvitationsByUser: function (username) {

                var deferred = $q.defer();

                var usersInvitationRef = ref.child('usersInvitation').child(username);
                var userInvitations = $firebaseArray(usersInvitationRef);
                userInvitations.$loaded()
                    .then(function () {
                        deferred.resolve(userInvitations);
                    }).catch(function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            },

            inviter: function (username, cerclename) {

                var deferred = $q.defer();

                var usersInvitationRef = ref.child('usersInvitation').child(username).child(cerclename);
                var userInvitation = $firebaseObject(usersInvitationRef);
                userInvitation.$loaded()
                    .then(function () {
                        userInvitation.$value = true;
                        userInvitation.$save()
                            .then(function () {
                                deferred.resolve(username);
                            })
                    }).catch(function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;

            },

            removeInvitation: function (username, cerclename) {

                var deferred = $q.defer();

                var usersInvitationRef = ref.child('usersInvitation').child(username).child(cerclename);
                var userInvitation = $firebaseObject(usersInvitationRef);
                userInvitation.$loaded()
                    .then(function () {
                        userInvitation.$remove()
                            .then(function () {
                                deferred.resolve(username);
                            })
                    }).catch(function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;

            }
        }
    }
})()