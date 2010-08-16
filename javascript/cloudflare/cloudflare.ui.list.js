/*!
 * CloudFlare UI List
 *
 * Copyright 2010, AUTHORS.txt
 * Licensed under the MIT license, see MIT-LICENSE.txt
 *
 * TODO: Documentation URL
 */
(function($) {
    
    $.component(
        'cf.listItemRenderer',
        $.cf.dataRenderer,
        {
            _initialize: function(options) {
                var self = this;
                self._options = options;
            }
        }
    );
    
    $.component(
        'cf.list',
        $.cf.dataRenderer,
        {
            _initialize: function(options) {
                var self = this;
                self._options = options;
            }
        }
    );
    
})(jQuery);