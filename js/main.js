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
            console.log('ManyTracks plugin starting');
            var browser = args.browser;
            if(browser.config.manytracks) {
                var arrs = Object.entries(browser.config.manytracks).map(([k, v]) => {
                    var base = v.baseUrl || (browser.config.baseUrl + browser.config.dataRoot + '/')
                    var files = v.urlTemplates
                    v.urlTemplates = null
                    return files.map(s => Object.assign({}, v, { urlTemplate: s, label: v.label + '_' + s.split('/').pop() }))
                })
                var adapter = new Config();
                var newconf = adapter.regularizeTrackConfigs({ tracks: arrs.flat() });
                lang.mixin(browser.config.stores, newconf.stores);
                browser.config.tracks = browser.config.tracks.concat(newconf.tracks);
                newconf.tracks.forEach(function (tr) {
                    browser.trackConfigsByName[tr.label] = tr;
                });
            }
        }
    });
});
