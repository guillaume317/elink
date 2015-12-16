angular
    .module('elinkApp', ['ngCookies', 'ngMessages', 'LocalStorageModule', 'ngMaterial', 'ngMdIcons',  'ui.router.state', 'ui.router', 'pascalprecht.translate', 'firebase', 'el1.model', 'el1.services.commun', 'el1.accueil', 'el1.icdc', 'el1.bibli', 'el1.login', 'el1.cercle', 'el1.gestion', 'el1.error'])

        .run(function ($rootScope, $location, $window, $http, $state, $translate, $cookies, Env, AuthService, UserModel, localStorageService, UsersManager) {

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


            // En cas de F5, stocker / replace les élements entre les scopes et le localstorage
            if (Env.isMock()) {
                var mockUser= new UserModel();
                $rootScope.user = mockUser;
                Env.setUser(mockUser);
            } else {
                $rootScope.user = localStorageService.get('user');
                Env.setUser(localStorageService.get('user'));
            }

    })

    .constant('RESTBACKEND', 'http://localhost:8080/banconet/api/v1')

    .constant('FBURL', 'https://elink.firebaseio.com/')

    .constant('GOOGLEAUTHSCOPE', 'email, profile')

    .constant('USERFIREBASEPROFILEKEY', 'firebase:session::elink')

    .config(function($stateProvider, $urlRouterProvider, $httpProvider, $translateProvider , $mdThemingProvider, $mdDateLocaleProvider ){

        // URL par défaut

        $urlRouterProvider.otherwise('/home');

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
