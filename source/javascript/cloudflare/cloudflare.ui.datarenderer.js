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
            _settings: {
                dataProvider: new $.cf.Collection(),
                itemRenderer: null
            },
            _initialize: function() {
                
                var self = this;
                
                self.superMethod();
                
                self._handleDataProviderChange = function() {
                    
                    self._invalidateDataProvider();
                };
                
                self._invalidateDataProvider();
                self._invalidateItemRenderer();
            },
            _invalidateDataProvider: function() {
                
                // Redraw display based on current data provider..
            },
            _invalidateItemRenderer: function() {
                
                // Redraw display based on current item renderer..
            },
            dataProvider: function(dataProvider) {
                
                var self = this;
                
                if(dataProvider) {
                    
                    // Set..
                    dataProvider = dataProvider instanceof $.cf.Collection ? dataProvider : new $.cf.Collection(dataProvider);
                    
                    if(self._settings.dataProvider) {
                        
                        self._settings.dataProvider.removeListener(
                            'change',
                            self._handleDataProviderChange
                        );
                    }
                    
                    self._settings.dataProvider = dataProvider;
                    self._settings.dataProvider.addListener(
                        'change',
                        self._handleDataProviderChange
                    );
                    
                    self._invalidateDataProvider();
                } else {
                    
                    // Get..
                    return self._settings.dataProvider;
                }
            },
            itemRenderer: function(itemRenderer) {
                
                var self = this;
                
                if(itemRenderer && typeof itemRenderer == 'string') {
                    
                    // Set..
                    self._currentItemRenderer = self._settings.itemRenderer;
                    self._settings.itemRenderer = itemRenderer;
                    self._invalidateItemRenderer();
                } else {
                    
                    // Get..
                    return self._settings.itemRenderer;
                }
            }
        }
    );
})(jQuery);