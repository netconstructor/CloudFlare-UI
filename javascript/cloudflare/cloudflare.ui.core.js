/*!
 * CloudFlare UI Core Library
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
    
    $.extend(
        $.fn,
        {
            margin: function() {
                
                var marginTop = this.css('marginTop').substr(0, this.css('marginTop').length - 2);
                var marginBottom = this.css('marginBottom').substr(0, this.css('marginBottom').length - 2);
                var marginLeft = this.css('marginLeft').substr(0, this.css('marginLeft').length - 2);
                var marginRight = this.css('marginRight').substr(0, this.css('marginRight').length - 2);
                
                return {
                    top: marginTop,
                    bottom: marginBottom,
                    left: marginLeft,
                    right: marginRight,
                    horizontal: marginLeft + marginRight,
                    vertical: marginTop + marginBottom
                };
            },
            marginalWidth: function() { return this.width() + this.margin().horizontal; },
            marginalInnerWidth: function() { return this.innerWidth() + this.margin().horizontal; },
            marginalOuterWidth: function() { return this.outerWidth() + this.margin().horizontal; },
            marginalHeight: function() { return this.height() + this.margin().vertical; },
            marginalInnerHeight: function() { return this.innerHeight() + this.margin().vertical; },
            marginalOuterHeight: function() { return this.outerHeight() + this.margin().vertical; }
        }
    );
    
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
                normalizeCSS: function(measure) {
                    
                    measure = $.isFunction(measure) ? measure() : measure;
                    
                    if(typeof measure == 'number' || (typeof measure == 'string' && !(measure.substr(measure.length - 2, 2) == "px" || measure.substr(measure.length - 1, 1) == "%"))) {
                        
                        return measure + "px";
                    }
                    
                    return measure;
                },
                normalizeDigital: function(measure) {
                    
                    measure = $.isFunction(measure) ? measure() : measure;
                    
                    if(typeof measure == 'string') {
                        if(measure.substr(measure.length - 2, 2) == "px") {
                            
                            return parseInt(measure.substr(0, measure.length - 2));
                        } else if(measure.substr(measure.length - 1, 1) == "%") {
                            
                            return -1;
                        }
                        
                        return parseInt(measure);
                    }
                    
                    return measure;
                },
                // The base subclassable object for the CloudFlare chain
                AncestralObject: function() {}
            }
        }
    );
    
    // Inheritance pattern inspired by John Resig's article at
    // http://ejohn.org/blog/simple-javascript-inheritance/
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
                    _listeners: {},
                    _construct: function() {
                        
                        var self = this;
                    },
                    destruct: function() {
                        
                        var self = this;
                        
                        self.removeAllListeners();
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
            Query: $.cf.EventDispatcher.subclass(
                {
                    _construct: function(options) {
                        
                        var self = this;
                        
                        self.superMethod();
                        
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
                        
                        return response || false;
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
                                            complete(false, self);
                                        },
                                        success: function(response, status, xhr) {
                                            
                                            try {
                                                
                                                response = $.parseJSON(response);
                                            } catch(e) {
                                                
                                                $.cf.log("An exception was thrown while parsing an AJAX response as JSON: " + e);
                                                
                                                complete(false, self);
                                                return;
                                            }
                                            
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
                        
                        self.superMethod();
                        
                        if(sourceArray && $.isArray(sourceArray)) {
                            self.source = sourceArray;
                        }
                        
                        self._invalidate();
                    },
                    _invalidate: function() {
                        
                        var self = this;
                        
                        self.length = self.source.length;
                        self.dispatch('change', self);
                    },
                    source: [],
                    length: 0,
                    at: function(index) {
                        
                        var self = this;
                        return self.source[index];
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
                                    self._invalidate();
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