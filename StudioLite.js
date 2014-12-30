/**
 StudioLite MediaSignage Inc (c) open source digital signage project.
 Visit Github for licenses and docs: http://git.digitalsignage.com
 @class StudioLite
 @constructor
 @return {Object} instantiated StudioLite
 **/
define(['underscore', 'jquery', 'backbone', 'bootstrap', 'backbone.controller', 'ComBroker', 'Lib', 'Pepper', 'PepperHelper', 'Elements', 'bootbox', 'platform'], function (_, $, Backbone, Bootstrap, backbonecontroller, ComBroker, Lib, Pepper, PepperHelper, Elements, bootbox, platform) {
    var StudioLite = Backbone.Controller.extend({

        // app init
        initialize: function () {
            var self = this;

            window.BB = Backbone;
            window.bootbox = bootbox;
            BB.globs = {};
            BB.globs['CREDENTIALS'] = '';
            BB.SERVICES = {};
            BB.EVENTS = {};
            BB.CONSTS = {};
            BB.globs['UNIQUE_COUNTER'] = 0;
            BB.globs['RC4KEY'] = '226a3a42f34ddd778ed2c3ba56644315';
            BB.lib = new Lib();
            BB.lib.addBackboneViewOptions();
            BB.lib.addBackboneCollectionSave();
            BB.lib.selectionSwitcher();
            BB.comBroker = new ComBroker();
            BB.comBroker.name = 'AppBroker';
            BB.Pepper = new Pepper();
            _.extend(BB.Pepper, BB.comBroker);
            BB.Pepper.clearServices();
            BB.Pepper.name = 'JalapenoBroker';
            BB.PepperHelper = new PepperHelper();
            window.pepper = BB.Pepper;
            window.log = BB.lib.log;
            BB.platform = platform;
            BB.lib.forceBrowserCompatibility();
            BB.lib.promptOnExit();
            $.ajaxSetup({
                cache: false,
                timeout: 3000
            });

            _.templateSettings = {
                interpolate: /\{\{(.+?)\}\}/g
            };

            // localization
            require(['LanguageSelectorView', 'Elements'], function (LanguageSelectorView, Elements) {
                new LanguageSelectorView({appendTo: Elements.LANGUAGE_SELECTION_LOGIN});
            });

            // theme
            require(['simplestorage'], function (simplestorage) {
                var theme = simplestorage.get('theme');
                if (theme && theme != 'light')
                    BB.lib.loadCss('style_' + theme + '.css');
                BB.CONSTS['THEME'] = _.isUndefined(theme) ? 'light' : theme;
            });

            var mode = window.location.href.match(RegExp("(mode=)(.*)(&param=)(.*)"));

            // Customer Terminal
            if (!_.isNull(mode) && mode[2] == 'customerTerminal') {
                require(['FasterQTerminalRouter', 'Events'], function (FasterQTerminalRouter) {
                    var fasterQTerminalRouter = new FasterQTerminalRouter({
                        param: mode[4]
                    });
                    //BB.history.start();
                    //LayoutRouter.navigate('authenticate/_/_', {trigger: true});
                });
                return;
            }

            // StudioLite
            require(['LayoutRouter', 'Events'], function (LayoutRouter) {
                var LayoutRouter = new LayoutRouter();
                BB.history.start();
                LayoutRouter.navigate('authenticate/_/_', {trigger: true});
            });


        }
    });

    return StudioLite;
});