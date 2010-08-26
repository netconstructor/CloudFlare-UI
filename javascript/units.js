(function($) {
    
    /***
     * Core pre-requisites...
     **/
    
    var BaseClass = $.cf.AncestralObject.subclass(
        {
            _construct: function() {
                
                this.inherit = true;
            },
            baseProperty: 'value',
            baseOptions: {
                
                first: 1,
                two: 'a'
            },
            baseMethod: function() {
                
                return true;
            },
            overwrittenMethod: function() {
                
                return 1;
            },
            hasInherit: function() {
                
                return this.inherit === true;
            }
        }
    );
    
    var SubClass = BaseClass.subclass(
        {
            _construct: function() {
                
                this.noInherit = true;
                this.superMethod();
            },
            subProperty: true,
            baseOptions: {
                
                two: 'b',
                third: true
            },
            overwrittenMethod: function() {
                
                return 2;
            }
        }
    );
    
    var ThirdClass = SubClass.subclass(
        {
            _construct: function() {},
            baseProperty: 99,
            subProperty: false,
            baseOptions: {
                first: 2
            },
            overwrittenMethod: function() {
                
                return this.superMethod();
            },
            proxyBaseMethod: function() {
                
                return this.superClass.baseMethod();
            },
            proxyBaseOptions: function() {
                
                return this.superClass.baseOptions.first;
            }
        }
    );
    
    var Evented = $.cf.EventDispatcher.subclass(
        {
            someAction: function() {
                
                var self = this;
                self.dispatch('action', {});
            }
        }
    );
    
    /***
     * Component pre-requisites...
     **/
    $.cf.component(
        'cf.Foo',
        {
            initialize: function() {
                
                var self = this;
                self.setting = self._settings.setting;
            },
            baseMethod: function() {
                
                return false;
            },
            assignClass: function() {
                
                var self = this;
                self._element.addClass('fooClass');
            },
            hasSetting: function() {
                
                var self = this;
                return self.setting == true;
            },
            setValue: function(valueOne, valueTwo) {
                
                var self = this;
                self.value = valueOne + '.' + valueTwo;
            },
            getValue: function() {
                var self = this;
                return self.value;
            },
            getElement: function() {
                
                var self = this;
                return self._element;
            }
        }
    );
    
    $.cf.component(
        'cf.Bar',
        $.cf.Foo,
        {
            initialize: function(options) {
                
                var self = this;
                self.superMethod(options);
            },
            assignClass: function() {
                
                var self = this;
                self._element.addClass('barClass');
                self.superMethod();
            }
        }
    );
    
    /***
     * Unit tests...
     **/
    $.extend(
        $.cf,
        {
            units: {
                core: function() {
                    
                    test(
                        "Basic polymorphism",
                        function() {
                            
                            stop();
                            
                            try {
                                
                                var foo = new SubClass();
                                
                                if(foo instanceof BaseClass) {
                                    
                                    ok(true, "Instance of subclass reports that it is also an instance of the base class.");
                                } else {
                                    
                                    ok(false, "Instance of subclass failed to believe that it was also an instance of the base class!");
                                }
                                
                                if(foo.baseMethod && foo.baseMethod()) {
                                    
                                    ok(true, "Base class method was properly inherited by subclass.");
                                } else {
                                    
                                    ok(false, "Subclass failed to inherit a method in the base class!");
                                }
                                
                                if(foo.overwrittenMethod && foo.overwrittenMethod() == 2) {
                                    
                                    ok(true, "Base class method was successfully overwritten by the subclass.");
                                } else {
                                    
                                    ok(false, "Subclass failed to overwrite a method in the base class!");
                                }
                            } catch(e) {
                                
                                ok(false, "An exception was thrown while performing test operations: " + e);
                            }
                            
                            start();
                        }
                    );
                    
                    test(
                        "Property inheritance",
                        function() {
                            
                            stop();
                            
                            try {
                                
                                var foo = new SubClass();
                                var bar = new ThirdClass();
                                var baz = new BaseClass();
                                
                                if(foo.baseProperty && foo.baseProperty == 'value') {
                                    
                                    ok(true, "Subclass successfully inherited a property from the base class.");
                                } else {
                                    
                                    ok(false, "Subclass failed to inherit a property from the base class!");
                                }
                                
                                if(foo.noInherit) {
                                    
                                    ok(true, "Class instance successfully assigned a visible property during construction.");
                                } else {
                                    
                                    ok(false, "Class instance failed to assign a visible property during construction!")
                                }
                                
                                if(baz.hasInherit()) {
                                    
                                    ok(true, "Base class can field a property assigned in the constructor.");
                                } else {
                                    
                                    ok(false, "Base class failed to field a property assigned in the constructor!");
                                }
                                
                                if(baz.hasInherit() && foo.hasInherit()) {
                                    
                                    ok(true, "Subclass can field a property assigned in the base class's constructor.");
                                } else {
                                    
                                    ok(false, "Subclass failed to field a property assigned in the base class's constructor!");
                                }
                                
                                if(foo.noInherit && !bar.noInherit) {
                                    
                                    ok(true, "Subclass correctly did not inherit a property set in the constructor of the base class.");
                                } else {
                                    
                                    ok(false, "Subclass incorrectly inherited a property set in the constructor of the base class!");
                                }
                                
                                if(bar.baseProperty && bar.baseProperty == 99) {
                                    
                                    ok(true, "Subclass successfully overwrote a property inherited from the base class.");
                                } else {
                                    
                                    ok(false, "Subclass failed to overwrite a property inherited from the base class!");
                                }
                                
                                if(foo.baseOptions && foo.baseOptions.first && foo.baseOptions.first == 1) {
                                    
                                    ok(true, "Subclass successfully integrated a value object inherited from the base class.");
                                } else {
                                    
                                    ok(false, "Subclass did not successfully integrate a value object inherited from the base class!");
                                }
                                
                                if(bar.baseOptions && bar.baseOptions.two && bar.baseOptions.third) {
                                    
                                    ok(true, "Subclass successfully integrated a value object with properties from multiple ancestors.");
                                } else {
                                    
                                    ok(false, "Subclass failed to integrate a value object with properties from multiple ancestors!");
                                }
                                
                            } catch(e) {
                                
                                ok(false, "An exception was thrown while performing test operations: " + e);
                            }
                            
                            start();
                        }
                    );
                    
                    test(
                        "Super-class awareness",
                        function() {
                            stop();
                            
                            try {
                                
                                var foo = new ThirdClass();
                                
                                if(foo.overwrittenMethod() == 2) {
                                    
                                    ok(true, "Subclass successfully called the overwritten method on the super class.");
                                } else {
                                    
                                    ok(false, "Subclass failed to call the overwritten method on the super class!");
                                }
                                
                                if(foo.proxyBaseMethod()) {
                                    
                                    ok(true, "Subclass successfully called a method on a reference to the super class's prototype.");
                                } else {
                                    
                                    ok(false, "Subclass failed to call a method on a reference to the super class's prototype!");
                                }
                                
                                if(foo.proxyBaseOptions() == 1) {
                                    
                                    ok(true, "Subclass successfully accessed the value of an overwritten property in the superclass.");
                                } else {
                                    
                                    ok(false, "Subclass failed to access the value of an overwritten property in the superclass!");
                                }
                            } catch(e) {
                                
                                ok(false, "An exception was thrown while performing test operations: " + e);
                            }
                            
                            start();
                        }
                    );
                    
                    test(
                        "EventDispatcher tests",
                        function() {
                            stop();
                            
                            try {
                                
                                var foo = new Evented();
                                var handlerCalled = false;
                                var handlerData = false;
                                
                                var actionHandler = function(data) {
                                    
                                    handlerCalled = true;
                                };
                                
                                var someHandler = function(data) {
                                    
                                    handlerCalled = true;
                                    handlerData = data;
                                };
                                
                                
                                foo.addListener('action', actionHandler);
                                
                                if(foo.getListeners('action').length > 0 && foo.getListeners('action')[0] == actionHandler) {
                                    
                                    ok(true, "An event listener was successfully registered with an event dispatcher.");
                                } else {
                                    
                                    ok(false, "Failed to registered an event listener with an event dispatcher!");
                                }
                                
                                foo.someAction();
                                
                                if(handlerCalled) {
                                    
                                    ok(true, "An event handler was successfully called when an event was dispatched.");
                                } else {
                                    
                                    ok(false, "An event handler failed to be called when an event was dispatched!");
                                }
                                
                                handlerCalled = false;
                                foo.addListener('generic', someHandler);
                                
                                foo.dispatch('generic', { value: true });
                                
                                if(handlerCalled) {
                                    
                                    ok(true, "An event dispatcher successfully dispatched an event when told to do so externally.");
                                } else {
                                    
                                    ok(false, "An event dispatcher failed to dispatch an event when told to do so externally!");
                                }
                                
                                handlerCalled = false;
                                
                                if(handlerData && $.isPlainObject(handlerData) && handlerData.value) {
                                    
                                    ok(true, "Event data was successfully passed to an event handler.");
                                } else {
                                    
                                    ok(false, "Event data failed to be passed to an event handler!");
                                }
                                
                                handlerData = false;
                                
                                foo.removeListener('generic', someHandler);
                                
                                if(foo.getListeners('generic').length == 0) {
                                    
                                    ok(true, "An event handler was successfully removed from the event dispatcher.");
                                } else {
                                    
                                    ok(false, "An event handler failed to be removed from the event dispatcher!");
                                }
                                
                                for(var i = 0; i < 3; i++) {
                                    
                                    foo.addListener('event', function() {});
                                }
                                
                                foo.removeListenersFor('event');
                                
                                if(foo.getListeners('event').length == 0) {
                                    
                                    ok(true, "Event dispatcher successfully removed all listeners for a particular event.");
                                } else {
                                    
                                    ok(false, "Event dispatcher failed to remove all listeners for a particular event!");
                                }
                                
                                for(var i = 0; i < 3; i++) {
                                    
                                    foo.addListener('event', function() {});
                                }
                                
                                foo.addListener('generic', someHandler);
                                
                                foo.removeAllListeners();
                                
                                if(foo.getListeners('action').length == 0 && foo.getListeners('event').length == 0 && foo.getListeners('generic').length == 0) {
                                    
                                    ok(true, "Event dispatcher successfully removed all listeners for all events.");
                                } else {
                                    
                                    ok(false, "Event dispatcher failed to remove all listeners for all events!");
                                }
                                
                            } catch(e) {
                                
                                ok(false, "An exception was thrown while performing test operations: " + e);
                            }
                            
                            start();
                        }
                    );
                    
                    test(
                        "Query tests",
                        function() {
                            stop();
                            
                            try {
                                
                                var query = new $.cf.Query(
                                    {
                                        url: '/units/service.json'
                                    }
                                );
                                
                                query.query(
                                    function(result, query) {
                                        
                                        if(result) {
                                            
                                            ok(true, "Query retrieved a valid response from the service.");
                                            
                                            if(result.hasOwnProperty('status') && result.status == 'success') {
                                                
                                                ok(true, "Query yielded well-formed, parse-able JSON.");
                                            } else {
                                                
                                                ok(false, "Query did not yield well-formed, parse-able JSON!");
                                            }
                                        } else {
                                            
                                            ok(false, "Query failed to retrieve a valid response from the service!");
                                        }
                                    }
                                );
                                
                            } catch(e) {
                                
                                ok(false, "An exception was thrown while performing test operations: " + e);
                            }
                            
                            start();
                        }
                    );
                    
                    test(
                        "Collection tests",
                        function() {
                            stop();
                            
                            try {
                                
                                var foo = new $.cf.Collection(),
                                    handlerCalled = false,
                                    fooLength = 0;
                                
                                try {
                                    
                                    foo.addItemAt(10, true);
                                    
                                    ok(true, "Collection prevented an exception when adding an item that was out of bounds.");
                                    
                                    if(foo.source.length == 0) {
                                        
                                        ok(true, "Collection appropriately prevented the out of bounds index from being affected.");
                                    } else {
                                        
                                        ok(false, "Collection inappropriately allowed the out of bounds index to be affected!");
                                    }
                                    
                                } catch(e) {
                                    
                                    ok(false, "Collection failed to prevent an exception when adding an item that was out of bounds!");
                                }
                                
                                foo.addItem('foo');
                                
                                if(foo.length == foo.source.length) {
                                    
                                    ok(true, "Collection's length value was updated when the collection was modified.");
                                } else {
                                    
                                    ok(false, "Collection's length value did not update when the collection was modified!");
                                }
                                
                                handlerCalled = false;
                                fooLength = foo.length;
                                
                                foo.addListener(
                                    'change',
                                    function(collection) {
                                        
                                        handlerCalled = true;
                                    }
                                );
                                
                                foo.addItem(true);
                                
                                if(handlerCalled) {
                                    
                                    ok(true, "Collection dispatched a change event when the collection was modified.");
                                    
                                    if(foo.length == (fooLength + 1)) {
                                        
                                        ok(true, "Collection reported the correct length when an item was added.");
                                    } else {
                                        
                                        ok(false, "Collection did not report the correct length when an item was added!");
                                    }
                                    
                                } else {
                                    
                                    ok(false, "Collection did not dispatch a change event when the collection was modified!");
                                }
                                
                                
                            } catch(e) {
                                
                                ok(false, "An exception was thrown while performing test operations: " + e);
                            }
                            
                            start();
                        }
                    );
                },
                component: function() {
                    
                    test(
                        "Component factory pattern",
                        function() {
                            stop();
                            
                            try {
                                
                                $('<div id="ComponentOne"></div>').appendTo('body');
                                $('<div id="ComponentTwo"></div>').appendTo('body');
                                
                                var foo = $('#ComponentOne').Foo();
                                var bar = $('#ComponentTwo').Bar({ setting: true });
                                
                                if(foo.is('div') && bar.is('div')) {
                                    
                                    ok(true, "Component constructor appropriately yielded the target element as a return value.");
                                } else {
                                    
                                    ok(false, "Component constructor failed to yield the target element as a return value!");
                                }
                                
                                if(foo['Foo'] && foo['Bar']) {
                                    
                                    ok(true, "jQuery prototype has successfully spawned component construction wrappers.");
                                } else {
                                    
                                    ok(false, "jQuery prototype failed to spawn component construction wrappers!");
                                }
                                
                                if(foo.data('Foo') && bar.data('Bar')) {
                                    
                                    ok(true, "DOM elements are associated with the appropriate component data.");
                                } else {
                                    
                                    ok(false, "DOM elements failed to be associated with component data!");
                                }
                                
                                if(foo.Foo('baseMethod') === false) {
                                    
                                    ok(true, "Method called on a component yielded a return value.");
                                } else {
                                    
                                    ok(false, "Method called on a component failed to yield a return value!");
                                }
                                
                                if(foo.Foo('getElement').get(0) === foo.get(0)) {
                                    
                                    ok(true, "Component has a valid reference to the appropriate DOM element.");
                                } else {
                                    
                                    ok(false, "Component does not have a valid reference to the appropriate DOM element!");
                                }
                                
                                if(bar.Bar('hasSetting')) {
                                    
                                    ok(true, "Subcomponent successfully inherited settings initialized by the base component.");
                                } else {
                                    
                                    ok(false, "Subcomponent failed to inherit settings initialized by the base component!");
                                }
                                
                                bar.Bar('assignClass');
                                
                                if(bar.hasClass('fooClass') && bar.hasClass('barClass')) {
                                    
                                    ok(true, "Component method successfully performed polymorphic manipulation of a DOM element.");
                                } else {
                                    
                                    ok(false, "Component method failed to perform polymorphic manipulation of a DOM element!");
                                }
                                
                                foo.Foo('setValue', "someValue", "otherValue");
                                
                                if(foo.Foo('getValue') == "someValue.otherValue") {
                                    
                                    ok(true, "Component method successfully fielded multiple arguments in a method call.");
                                } else {
                                    
                                    ok(false, "Component method failed to field multiple arguments in a method call!");
                                }
                                
                            } catch(e) {
                                
                                ok(false, "An exception was thrown while performing test operations: " + e);
                            }
                            
                            $('#ComponentOne, #ComponentTwo').remove();
                            
                            start();
                        }
                    );
                },
                dataRenderer: function() {
                    
                    var dataProviderOne = new $.cf.Collection(
                        [
                            {
                                label: 'foo',
                                value: 'foo'
                            },
                            {
                                label: 'bar',
                                value: 'bar'
                            },
                            {
                                label: 'fu',
                                value: 'fu'
                            },
                            {
                                label: 'baz',
                                value: 'baz'
                            },
                            {
                                label: 'Zero',
                                value: 0
                            },
                            {
                                label: 'One',
                                value: 1
                            }
                        ]
                    ),
                    dataProviderUpdated = false,
                    itemRendererUpdated = false;
                    
                    $.cf.component(
                        'cf.dataRenderingFoo',
                        $.cf.dataRenderer,
                        {
                            _invalidateDataProvider: function() {
                                
                                dataProviderUpdated = true;
                            },
                            _invalidateItemRenderer: function() {
                                
                                itemRendererUpdated = true;
                            }
                        }
                    );
                    
                    var foo = $('<div></div>').appendTo('body').dataRenderingFoo();
                    
                    test(
                        'DataRenderer basic functionality',
                        function() {
                            
                            foo.dataRenderingFoo('dataProvider', dataProviderOne);
                            
                            if(foo.dataRenderingFoo('dataProvider') == dataProviderOne) {
                                
                                ok(true, "DataRenderer's data provider was successfully assigned.");
                                
                            } else {
                                
                                ok(false, "DataRenderer's data provider was not successfully assigned!");
                            }
                            
                            if(dataProviderUpdated) {
                                
                                ok(true, "DataRenderer's data provider was successfully invalidated.");
                            } else {
                                
                                ok(false, "DataRenderer's data provider was not successfully invalidated!");
                            }
                            
                            foo.dataRenderingFoo('itemRenderer', 'someItemRenderer');
                            
                            if(foo.dataRenderingFoo('itemRenderer') == 'someItemRenderer') {
                                
                                ok(true, "DataRenderer's item renderer was successfully assigned.");
                            } else {
                                
                                ok(false, "DataRenderer's item rendere was not successfully assigned!");
                            }
                            
                            if(itemRendererUpdated) {
                                
                                ok(true, "DataRenderer's item renderer was successfully invalidated.");
                            } else {
                                
                                ok(false, "DataRenderer's item renderer was not successfully invalidated!");
                            }
                        }
                    );
                },
                list: function() {
                    
                    test(
                        'List manipulation',
                        function() {
                            ok(false, "TODO");
                        }
                    );
                }
            }
        }
    );
    
})(jQuery);