/*!
 * CloudFlare UI DataRenderer
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
        'cf.dataRenderer',
        {
            _initialize: function(options) {
                
                var self = this;
                
                self.dataProvider(options.dataProvider);
                self._dataProvider = self._dataProvider || new $.cf.Collection();
            },
            dataProvider: function(dataProvider) {
                
                var self = this;
                
                if(dataProvider && dataProvider instanceof $.cf.Collection) {
                    
                    // Set..
                    self._dataProvider = dataProvider;
                } else {
                    
                    // Get..
                    return self._dataProvider;
                }
            }
        }
    );
})(jQuery);