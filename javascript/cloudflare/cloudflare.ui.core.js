/*!
 * CloudFlare UI Core Library
 *
 * Copyright 2010, AUTHORS.txt
 * Licensed under the MIT license, see LICENSE.txt
 *
 * TODO: Documentation URL
 */
(function($) {
    
    $.extend(
        $,
        {
            cf: {
                logType: {
                    
                    debug: "[ D ]",
                    warning: "[ W ]",
                    error: "[ E ]"
                },
                
                log: function(message, type) {
                    
                    type = type || $.cf.logType.debug;
                    
                    try {
                        
                        console.log(type + " " + message);
                    } catch(e) { /* Console.log not supported... */ }
                },
                Query: function(options) {
                            
                    var self = this;
                    
                    $.extend(self, options);
                }
            }
        }
    );
    
    $.cf.Query.prototype = {
        
        id: "",
        url: "",
        lastResponse: null,
        data: function(data, replace) {
            
            var self = this;
            
            if(replace !== false) {
                
                self._data = $.extend(
                    self._data || {},
                    data
                );
            } else {
                
                self._data = data;
            }
        },
        ajaxOptions: function(ajaxOptions, replace) {
            
            var self = this;
            
            if(replace !== false) {
                
                self._ajaxOptions = $.extend(
                    self._ajaxOptions || {
                        dataType: 'json',
                        type: "GET",
                        async: true,
                        cache: true
                    },
                    ajaxOptions
                );
            } else {
                
                self._ajaxOptions = ajaxOptions;
            }
        },
        mapQuery: function() {
            
            var self = this;
            return self._data;
        },
        mapResponse: function(response) {
            
            if(!response) {
                
                $.cf.log("Got a null response from the server. Something isn't working right...", $.cf.logType.error);
                return false;
            } else if(response.hasOwnProperty('error')) {
                
                $.cf.log("The server returned an error! Error: " + response.error, $.cf.logType.error);
                return false;
            }
            
            return response;
        },
        query: function(complete) {
            
            var self = this;
            complete = complete || $.noop;
            
            if(self.url && self.url != "") {
                $.ajax(
                    $.extend(
                        {
                            url: $.isFunction(self.url) ? self.url() : self.url,
                            data: self.mapQuery(),
                            error: function() {
                                
                                $.cf.log("There was an error making an AJAX call to " + self.url, $.cf.logType.error);
                            },
                            success: function(response, status, xhr) {
                                
                                self.lastResponse = response;
                                complete(self.mapResponse(response), self);
                            }
                        },
                        self._ajaxOptions
                    )
                );
            } else {
                
                complete(self.mapResponse(self.mapQuery(self)));
            }
        }
    }
})(jQuery);