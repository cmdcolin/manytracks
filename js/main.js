define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'JBrowse/Plugin'
],
function (
    declare,
    lang,
    JBrowsePlugin
) {
    return declare(JBrowsePlugin, {
        constructor: function (args) {
            var browser = this.browser = args.browser;
            var thisB = this;

            browser.afterMilestone('completely initialized', function () {
                Object.keys(browser.config.manytracks).forEach(function (key) {
                    var many = browser.config.manytracks[key];
                    for (var j = 0; j < many.urlTemplates.length; j++) {
                        thisB.createManyTracks(lang.mixin(lang.clone(many), {
                            urlTemplate: many.urlTemplates[j],
                            label: key + '_' + many.urlTemplates[j]
                        }));
                    }
                });
            });

            console.log('ManyTracks plugin starting');
        },

        createManyTracks: function (conf) {
            var browser = this.browser;
            var storeConf = lang.mixin(lang.clone(conf), {
                browser: browser,
                refSeq: browser.refSeq,
                type: conf.storeClass,
                baseUrl: browser.config.baseUrl + browser.config.dataRoot + '/'
            });

            var storeName = browser.addStoreConfig(null, storeConf);
            storeConf.name = storeName;
            browser.getStore(storeName, function (/* store*/) {
                var trackConfig = lang.mixin(conf, {
                    store: storeName
                });
                // send out a message about how the user wants to create the new tracks
                browser.publish('/jbrowse/v1/v/tracks/new', [trackConfig]);
            });
        }
    });
});
