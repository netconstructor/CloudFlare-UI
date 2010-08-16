/*!
 * CloudFlare UI Core Library
 *
 * Copyright 2010, AUTHORS.txt
 * Licensed under the MIT license, see LICENSE.txt
 *
 * TODO: Documentation URL
 */
(function($) {
    
    // Inheritance pattern inspired by John Resig's article at
    // http://ejohn.org/blog/simple-javascript-inheritance/
    $.extend(
        $,
        {
            cf: {
                // The base subclassable object for the CloudFlare chain
                AncestralObject: function() {},
            }
        }
    );
    
    $.extend(
        $.cf.AncestralObject,
        {
            subclass: (function() {
                
                var subclassing = false;
                
                return function(properties) {
                    
                    var self = this,
                        parentClass = self.prototype,
                        nextPrototype,
                        NextClass;
                    
                    // Short-circuit the construction of the base class in order to 
                    // create our starting prototype
                    subclassing = true;
                    nextPrototype = new self();
                    subclassing = false;
                    
                    // We need to sequentially copy properties into the new prototype
                    for(var property in properties) {
                        
                        // Handle class methods
                        if( typeof properties[property] == 'function' &&
                            $.isFunction(properties[property])) {
                            
                            nextPrototype[property] = (function(property, implementation) {
                                
                                // We return a proxy function that sets class-level properties
                                // referencing the inherited prototype (superClass) and the
                                // overridden method (superMethod) if one exists.
                                return function() {
                                    var placeholder = this.superMethod,
                                        returnValue;
                                    
                                    this.superClass = parentClass;
                                    this.superMethod = this.superClass[property] || function() {};
                                    
                                    // Now that superClass and superMethod are set, we can call the 
                                    // actual class method.
                                    returnValue = implementation.apply(this, arguments);
                                    this.superMethod = placeholder;
                                    
                                    return returnValue;
                                }
                            })(property, properties[property]);
                        // Handle properties that are value objects by extending and overriding 
                        // values with those from the same property in the subclass.
                        } else if(  typeof properties[property] == 'object' && 
                                    typeof parentClass[property] == 'object' &&
                                    $.isPlainObject(properties[property])) {
                            
                            nextPrototype[property] = $.extend(
                                {},
                                parentClass[property],
                                properties[property]
                            );
                        // Default to blindly copying over the new property for all other types.
                        } else {
                            
                            nextPrototype[property] = properties[property];
                        }
                    }
                    
                    // We will wrap construction in a function that checks to make sure that we are 
                    // not instantiating the class for the purposes of deriving another class.
                    NextClass = function() {
                        if(!subclassing && this._construct) {
                            
                            this._construct.apply(this, arguments);
                        }
                    };
                    
                    NextClass.prototype = nextPrototype;
                    NextClass.constructor = NextClass;
                    
                    // Pass 'subclass' along to the new class, as it is not part of the prototype
                    NextClass.subclass = arguments.callee;
                    
                    return NextClass;
                }
            })()
        }
    );
    
    $.extend(
        $.cf,
        {
            EventDispatcher: $.cf.AncestralObject.subclass(
                {
                    _construct: function() {
                        
                        var self = this;
                        
                        self._listeners = {};
                    },
                    addListener: function(event, listener) {
                        
                        var self = this;
                        
                        self._listeners[event] = self._listeners[event] || [];
                        self._listeners[event].push(listener);
                    },
                    getListeners: function(event) {
                        
                        var self = this;
                        return self._listeners[event];
                    },
                    removeListener: function(event, listener) {
                        
                        var self = this;
                        
                        if(self._listeners.hasOwnProperty(event)) {
                            
                            $.each(
                                self._listeners[event],
                                function(i, l) {
                                    
                                    if(l == listener) {
                                        
                                        self._listeners[event].splice(i, 1);
                                        return false;
                                    }
                                }
                            );
                        }
                    },
                    removeListenersFor: function(event) {
                        
                        var self = this;
                        
                        if(self._listeners.hasOwnProperty(event)) {
                            
                            self._listeners[event] = [];
                        }
                    },
                    removeAllListeners: function() {
                        
                        var self = this;
                        
                        for(var event in self._listeners) {
                            
                            self.removeListenersFor(event);
                        }
                    },
                    dispatch: function(event, data) {
                        
                        var self = this;
                        
                        if(self._listeners.hasOwnProperty(event)) {
                            
                            $.each(
                                self._listeners[event],
                                function(i, l) {
                                    l(data);
                                }
                            )
                        }
                    }
                }
            )
        }
    );
    
    $.extend(
        $.cf,
        {
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
            Query: $.cf.EventDispatcher.subclass(
                {
                    _construct: function(options) {
                        
                        var self = this;
                        $.extend(self, options);
                    },
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
            ),
            Collection: $.cf.EventDispatcher.subclass(
                {
                    _construct: function(sourceArray) {
                        
                        var self = this;
                        
                        self.source = sourceArray || [];
                    },
                    _invalidate: function() {
                        
                        var self = this;
                        
                        self.dispatch('change', self);
                    },
                    addItem: function(item) {
                        
                        var self = this;
                        
                        self.addItemAt(self.source.length, item);
                    },
                    addItems: function(collection) {
                        
                        var self = this;
                        
                        self.addItemsAt(self.source.length, collection);
                    },
                    addItemAt: function(index, item) {
                        
                        var self = this;
                        
                        if(item && index <= self.source.length) {
                            
                            self.source.splice(index, 0, item);
                            self._invalidate();
                        }
                    },
                    addItemsAt: function(index, collection) {
                        
                        var self = this,
                            other = null;
                        
                        if($.isArray(collection)) {
                            
                            other = collection;
                        } else if(collection instanceof $.cf.Collection) {
                            
                            other = collection.source;
                        }
                        
                        if(other) {
                            
                            self.source = self.source.splice(0, index).concat(array).concat(self.source);
                            self._invalidate();
                        }
                    },
                    removeItem: function(item) {
                        
                        var self = this;
                        
                        $.each(
                            self.source,
                            function(i, it) {
                                if(it == item) {
                                    
                                    self.source.splice(i, 1);
                                    return false;
                                }
                            }
                        );
                    },
                    removeItemAt: function(index, item) {
                        
                        var self = this;
                        
                        if(item && index < self.source.length) {
                            
                            self.source.splice(index, 1);
                            self._invalidate();
                        }
                    },
                    empty: function() {
                        
                        var self = this;
                        self.source = [];
                    }
                }
            )
        }
    );
})(jQuery);