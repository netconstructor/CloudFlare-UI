/*!
 * CloudFlare UI Component Factory
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
    
    // Base class for all CloudFlare UI components. The Component is an abstract
    // class, and cannot be instantiated through the component factory.
    // TODO: Component/DOM event dispatching+triggering..
    $.extend(
        $.cf,
        {
            Component: $.cf.EventDispatcher.subclass(
                {
                    // TODO: Make this actually do something useful...
                    _trigger: function(event, data) {
                        
                        var self = this;
                        self._element.trigger(event, data);
                    },
                    _construct: function(element, componentName, options) {
                        
                        // Construct! Sub-components should not override the constructor..
                        var self = this;
                        
                        self._componentName = componentName;
                        self._element = $(element);
                        self._element.bind(
                            'remove',
                            function(event) {
                                
                                self.destroy();
                            }
                        );
                        
                        $.data(self._element, self._componentName, self);
                        self.initialize(options);
                    },
                    destruct: function() {
                        
                        // Remove bound events and data..
                        var self = this;
                        
                        self._element.removeData(self.componentName);
                        // TODO: Detach events..
                    },
                    initialize: function(options) {
                        
                        // Initialize! This method is safe to override..
                    }
                }
            )
        }
    );
    
    // UI component factory inspired by jQuery UI's widget pattern.
    // Expands upon it by incorporating super-class awareness.
    $.extend(
        $.cf,
        {
            // Registers the component, derives the class and 'bridges' it
            component: function(path, base, subclass) {
                
                var namespace = path.split('.')[0],
                    name = path.split('.')[1];
                
                if(!subclass) {
                    // Subclass isn't defined, so default to CloudFlareComponent
                    subclass = base;
                    base = $.cf.Component;
                }
                
                // Create the namespace if it isn't there, and assign the subclass
                $[namespace] = $[namespace] || {};
                $[namespace][name] = base.subclass(subclass);
                
                // Build the method to instantiate the component on DOM elements
                $.cf.bridge(name, $[namespace][name]);
            },
            // Patches the component into jQuery.fn, and controls component method access
            bridge: function(className, Component) {
                
                $.fn[className] = function(method) {
                    
                    var targets = this,
                        result = this,
                        options;
                    
                    // If no method is specified, we will attempt to construct
                    if(!method || $.isPlainObject(method)) {
                        
                        options = method || {};
                        method = '_construct';
                    } else {
                        
                        // A method is specified, so all other arguments will be the method parameters
                        options = arguments.length ? $.map(arguments, function(a, i) { return i == 0 ? null : a; }) : [];
                    }
                    
                    targets.each(
                        function(i, e) {
                            var target = this;
                            var component = $.data(target, className);
                            
                            // We're constructing only if the component doesn't exist
                            if(method == '_construct' && !component) {
                                
                                // The component constructor expects a reference
                                // the element, the component name and an hash
                                // of instance options
                                $.data(target, className, new Component(target, className, options));
                            } else if(component && method.substr(0, 1) != '_' && $.isFunction(component[method])) {
                                
                                // Everything checks out, so call the method and pass the arguments
                                result = component[method].apply(component, options);
                            } else {
                                
                                // The user called a private method that isn't the constructor, 
                                // or they called the constructor after construction is complete
                                return false;
                            }
                        }
                    );
                    
                    return result;
                }
            }
        }
    );
})(jQuery);