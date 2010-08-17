/*!
 * CloudFlare UI List & ListItemRenderer
 *
 * Copyright 2010, AUTHORS.txt
 * Dual licensed under the MIT & GPLv2 licenses.
 * See MIT-LICENSE.txt & GPL-LICENSE.txt
 * 
 * CloudFlare UI Documentation:
 * 
 * http://wiki.github.com/cloudflare/CloudFlare-UI/
 * 
 * 
 * CloudFlare UI incorporates the following independent projects:
 * 
 * jQuery (Dual licensed under MIT & GPLv2 licenses)
 * http://jquery.com/
 * Copyright 2010, John Resig
 *
 * QUnit (Dual licensed under MIT & GPLv2 licenses)
 * http://docs.jquery.com/QUnit
 * Copyright 2009, John Resig, Jšrn Zaefferer
 */
(function($) {
    
    $.cf.component(
        'cf.listItemRenderer',
        $.cf.dataRenderer,
        {
            _initialize: function() {
                
                var self = this;
                
            },
            _invalidateItemRenderer: function() {},
            _invalidateDataProvider: function() {}
        }
    );
    
    $.cf.component(
        'cf.list',
        $.cf.dataRenderer,
        {
            _settings: {
                title: null,
                effects: {
                    addItem: function(item, complete) {
                        item.show();
                        complete();
                    },
                    removeItem: function(item, complete) {
                        item.hide();
                        complete();
                    }
                }
            },
            _initialize: function() {
                
                var self = this;
                
                self.superMethod();
            },
            _invalidateTitle: function() {},
            _invalidateItemRenderer: function() {},
            _invalidateDataProvider: function() {},
            _resolveItem: function() {},
            _resolveItemSelector: function() {},
            title: function(title) {},
            effects: function(effects) {},
            next: function() {},
            previous: function() {},
            highlight: function(item) {},
            select: function(item) {}
            
        }
    );
})(jQuery);