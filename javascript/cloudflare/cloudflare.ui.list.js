/*!
 * CloudFlare UI List & ListItemRenderer
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
        'cf.listItemRenderer',
        $.cf.dataRenderer,
        {
            _initialize: function() {
                
                var self = this;
                
                if(self.is('li')) {
                    
                    self._element.addClass('list-item-renderer');
                    self._element.superMethod();
                } else {
                    
                    self.destruct();
                }
            },
            _invalidateDataProvider: function() {},
            itemRenderer: function() {
                
                return self._settings.dataProvider.at(0).itemRenderer;
            }
        }
    );
    
    $.cf.component(
        'cf.list',
        $.cf.dataRenderer,
        {
            _settings: {
                title: null,
                effects: {
                    addItem: function(item, complete) {
                        item.show();
                        complete();
                    },
                    removeItem: function(item, complete) {
                        item.hide();
                        complete();
                    }
                },
                scrollBuffer: 100
            },
            _initialize: function() {
                
                var self = this;
                
                if(self._element.is('div')) {
                    
                    self._element.addClass('list');
                    self._element.bind(
                        'blur mouseleave',
                        function(event) {
                            
                            self.highlight(-1);
                        }
                    );
                    
                    self._title = $('<div class="title"></div>').appendTo(self._element);
                    self._list = $('<ul></ul>').appendTo(self._element);
                    
                    self._selectedIndex = -1;
                    self._hoverIndex = -1;
                    
                    self._dataIndex = -1;
                    self._dataDensity = -1;
                    
                    self.superMethod();
                } else {
                    
                    self.destruct();
                }
            },
            _invalidateTitle: function() {
                
                var self = this;
                self._title.text(self._settings.title || "");
            },
            _invalidateItemRenderer: function() {
                
                var self = this;
                
                if(self._currentItemRenderer && self._currentItemRenderer != self._settings.itemRenderer) {
                    self._list.children(self._resolveItemSelector()).each(
                        function(i, e) {
                            
                            var item = this;
                            var data = item[self._deprecatedItemRenderer]('dataProvider');
                            
                            item[self._deprecatedItemRenderer]('destroy');
                            item[self._settings.itemRenderer](
                                {
                                    dataProvider: data
                                }
                            );
                        }
                    );
                    
                    self._currentItemRenderer = self._settings.itemRenderer;
                }
            },
            _invalidateDataProvider: function() {
                
                var self = this;
                
                self._element.children(self._resolveItemSelector()).each(
                    function(i, e) {
                        
                        var item = this;
                        
                        item[self._settings.itemRenderer]('destroy');
                        item.remove();
                    }
                );
                
                if(self._settings.dataProvider) {
                    
                    if(self._dataIndex = -1) {
                        
                        self._dataIndex = 0;
                    }
                    
                    
                } else {
                    
                    self._dataIndex - -1;
                }
            },
            _resolveItemData: function(related) {
                
                var self = this;
                
                if(typeof related == 'number') {
                    
                    return self._settings.dataProvider.at(related);
                } else if($.isPlainObject(related)) {
                    
                    return related;
                } else {
                    
                    try {
                        related = $(related);
                        
                    } catch(e) {
                        
                        return false;
                    }
                    
                    return related.index(self._element.find(self._resolveItemSelector()));
                }
            },
            _resolveItemElement: function(related) {
                
                var self = this;
            },
            _resolveItemIndex: function(related) {
                
                var self = this;
            },
            _resolveItemSelector: function() {
                
                return 'li.cf-ui.item-renderer';
            },
            _resolveDataMeasurement: function() {
                
                var self = this;
                
                if(self._currentDataIndex != self._dataIndex && self._currentDataDensity != self._dataDensity) {
                    
                    self._dataMeasurement = 0;
                    
                    self.children(self._resolveItemSelector()).each(
                        function(i, e) {
                            
                            self._dataMeasurement += this.outerHeight();
                        }
                    );
                    
                    self._currentDataIndex = self._dataIndex;
                    self._currentDataDensity = self._dataDensity;
                }
                
                return self._dataMeasurement;
            },
            title: function(title) {
                
                var self = this;
                
                if(title && typeof title == 'string') {
                    
                    self._settings.title = title;
                    self._invalidateTitle();
                } else {
                    
                    return self._settings.title;
                }
            },
            effects: function(effects) {
                
                var self = this;
                
                if(effects && $.isPlainObject(effects)) {
                    
                    $.extend(
                        self._settings.effects,
                        effects
                    );
                } else {
                    
                    return self._settings.effects;
                }
            },
            next: function() {},
            previous: function() {},
            highlight: function(item) {},
            select: function(item) {}
            
        }
    );
})(jQuery);