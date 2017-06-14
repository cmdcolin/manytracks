define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'JBrowse/Plugin',
    'JBrowse/ConfigAdaptor/JB_json_v1'
],
function (
    declare,
    lang,
    JBrowsePlugin,
    Config
) {
    return declare(JBrowsePlugin, {
        constructor: function (args) {
            var browser = this.browser = args.browser;
            var thisB = this;
            var conf = {
                tracks: []
            };
            Object.keys(browser.config.manytracks).forEach(function (key) {
                var many = browser.config.manytracks[key];
                for (var j = 0; j < many.urlTemplates.length; j++) {
                    conf.tracks.push(lang.mixin(lang.clone(many), {
                        urlTemplate: many.urlTemplates[j],
                        urlTemplates: null,
                        baseUrl: browser.config.baseUrl + browser.config.dataRoot + '/',
                        label: key + '_' + many.urlTemplates[j]
                    }));
                }
            });
            var adapter = new Config()
            var newconf =  adapter.regularizeTrackConfigs(conf)
            lang.mixin(browser.config.stores, newconf.stores)
            browser.config.tracks = browser.config.tracks.concat(newconf.tracks)
            for(var i = 0; i < newconf.tracks.length; i++) {
                var tr = newconf.tracks[i]
                browser.trackConfigsByName[tr.label] = tr;
            }

            console.log('ManyTracks plugin starting');
        }
    });
});
