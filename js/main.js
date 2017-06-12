define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/Deferred',
    'JBrowse/Plugin'
],
function (
    declare,
    lang,
    Deferred,
    JBrowsePlugin
) {
    return declare(JBrowsePlugin, {
        constructor: function (args) {
            var browser = this.browser = args.browser;
            var thisB = this;

            browser.afterMilestone('completely initialized', function() {
                Object.keys(browser.config.manytracks).forEach(function(key) {
                    var many = browser.config.manytracks[key];
                    for(var j = 0; j < many.urlTemplates.length; j++) {
                        thisB.createManyTracks(lang.mixin(lang.clone(many), {
                            urlTemplate: many.urlTemplates[j],
                            label: key+'_'+many.urlTemplates[j]
                        }));
                    }
                });
            });

            // do anything you need to initialize your plugin here
            console.log('ManyTracks plugin starting');
        },

        createManyTracks: function(conf) {
            var d = new Deferred();
            var browser = this.browser;
            var storeConf = {
                browser: browser,
                refSeq: browser.refSeq,
                type: conf.storeClass,
            };
            var storeName = browser.addStoreConfig(undefined, conf);
            storeConf.name = storeName;
            browser.getStore(storeName, function(store) {
                d.resolve(true);
            });
            d.promise.then(function(){
                console.log('hi',storeName)
                
                var myTrackConfig = {
                    type: conf.type,
                    label: conf.label,
                    store: storeName
                };
                // send out a message about how the user wants to create the new tracks
                browser.publish( '/jbrowse/v1/v/tracks/new', [myTrackConfig] );
            });
        }
    });
});
