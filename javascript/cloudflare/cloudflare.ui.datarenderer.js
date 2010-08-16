(function($) {
    
    $.component(
        'cf.dataRenderer',
        {
            _initialize: function(options) {
                
                var self = this;
                
                self.dataProvider(options.dataProvider);
            },
            dataProvider: function(dataProvider) {
                
                var self = this;
                
                if(dataProvider) {
                    
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