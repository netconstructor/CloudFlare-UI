/*!
 * CloudFlare UI Button
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
        'cf.button',
        {
            _settings: {
                
                
            },
            _initialize: function() {
                
                var self = this;
                
                if(self._element.is('div')) {
                    
                    self._element.addClass('cf-ui button');
                    self.superMethod();
                } else {
                    
                    self.destruct();
                }
            }
        }
    );
    
})(jQuery);