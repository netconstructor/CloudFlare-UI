/*!
 * CloudFlare UI Gesture Interpreter
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
        $.browser,
        {
            mobile: RegExp(" Mobile/").test(navigator.userAgent),
            touchEnabled: (function() { try{ document.createEvent('TouchEvent'); return true; } catch(e){ return false; } })()
        }
    );
    
    $.extend(
        $.cf,
        {
            uiEvent: (function() {
                
                var standardEvents = {
                    down: 'mousedown',
                    up: 'mouseup',
                    move: 'mousemove'
                };
                
                var touchEvents = $.extend(
                    standardEvents,
                    {
                        down: 'touchstart',
                        up: 'touchend',
                        move: 'touchmove'
                    }
                );
                
                if($.browser.mobile) {
                    return touchEvents;
                } else if($.browser.touchEnabled) {
                    return (function() {
                        
                        var result = {};
                        
                        for(var i in standardEvents) {
                            
                            if(standardEvents[i] != touchEvents[i]) {
                                result[i] = standardEvents[i] + ' ' + touchEvents[i];
                            } else {
                                result[i] = standardEvents[i];
                            }
                        }
                        
                        return result;
                    })();
                }
                
                return standardEvents;
            })()
        }
    );
    
    $.extend(
        $.fn,
        {
            enableGestures: function() {
                
                this.each(
                    function(i, e) {
                        
                        var target = $(this);
                        
                        if(!target.data('gestureData')) {
                            
                            var mouseDown = false,
                                p0 = new $.cf.Point(), 
                                p1 = new $.cf.Point(),
                                t0 = 0, t1 = 0;
                            
                            var track = function(event) {
                                
                                p1.set(event.pageX, event.pageY);
                            };
                            
                            var resolveGesture = function() {
                                
                                var delta = p0.delta(p1),
                                    time = t1 - t0;
                                
                                $.cf.log('Magnitude: ' + delta.magnitude() + ' - Time: ' + time);
                                if(delta.magnitude() < 20 && time < 200) {
                                    
                                    target.trigger('tap');
                                } else if(delta.magnitude() / time > 1) {
                                    
                                    if(delta.x() > delta.y()) {
                                        
                                        target.trigger('horizontalswipe');
                                    } else {
                                        
                                        target.trigger('verticalswipe');
                                    }
                                }
                            };
                            
                            var invalidate = function() {
                                
                                mouseDown = false;
                                p0.set(0, 0);
                                p1.set(0, 0);
                                t0 = t1 = 0;
                            };
                            
                            
                            target.data(
                                'gestureData',
                                {
                                    initialize: function(event) {
                                        
                                        mouseDown = true;
                                        p0.set(event.pageX, event.pageY);
                                        p1.set(event.pageX, event.pageY);
                                        t0 = $.cf.time();
                                    },
                                    complete: function(event) {
                                        
                                        t1 = $.cf.time();
                                        resolveGesture();
                                        invalidate();
                                    },
                                    track: function(event) {
                                        
                                        if(mouseDown) {
                                            
                                            p1.set(event.pageX, event.pageY);
                                        }
                                    }
                                }
                            );
                            
                            target.bind(
                                'mousedown',
                                target.data('gestureData').initialize
                            ).bind(
                                'mouseup',
                                target.data('gestureData').complete
                            ).bind(
                                'mousemove',
                                target.data('gestureData').track
                            ).bind(
                                'click',
                                $.cf.muteEvent
                            );
                            
                            invalidate();
                        }
                    }
                );
                
                return this;
            },
            disableGestures: function() {
                
                this.each(
                    function(i, e) {
                        
                        var target = $(this);
                        
                        if(target.data('gestureData')) {
                            target.unbind(
                                'mousedown',
                                target.data('gestureData').initialize
                            ).unbind(
                                'mouseup',
                                target.data('gestureData').complete
                            ).unbind(
                                'mousemove',
                                target.data('gestureData').track
                            ).unbind(
                                'click',
                                $.cf.muteEvent
                            );
                            
                            target.removeData('gestureData');
                        }
                    }
                );
                
                return this;
            }
        }
    );
    
})(jQuery);