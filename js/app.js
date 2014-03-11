angular.module('app', [
    'app.controllers',
    'chieffancypants.loadingBar',
    'ui.bootstrap'
])

.config(function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
})