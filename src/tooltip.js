/* ===========================================================
 * Livefyre's tooltip.js v0.0.1
 * ===========================================================
 * This file extends Bootstrap's tooltip.js (v3.0.3).
 * By default, when the tooltip trigger is set to 'click', the
 * user must click the original trigger again to close the 
 * tooltip. This file modifies this behavior so that clicking 
 * anywhere outside of the tooltip closes it.
 * =========================================================== */


+function ($) { "use strict";

  // LIVEFYRE TOOLTIP PUBLIC CLASS DEFINITION
  // ========================================

  var LivefyreTooltip = function (element, options) {
    this.init('tooltip', element, options);
  };

  if (!$.fn.tooltip) throw new Error('The LF Tooltip Extension requires Bootstrap\'s tooltip.js');


  // NOTE: LIVEFYRE TOOLTIP EXTENDS BOOTSTRAP'S tooltip.js
  // =====================================================

  LivefyreTooltip.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype);

  LivefyreTooltip.prototype.constructor = LivefyreTooltip;

  LivefyreTooltip.prototype.init = function (type, element, options) {
    this.enabled  = true;
    this.type     = type;
    this.$element = $(element);
    this.options  = this.getOptions(options);

    var triggers = this.options.trigger.split(' ');

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i];

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this));

        this.$element.on('shown.bs.tooltip', function () {
            // Add 'open' class to trigger
            $(this).addClass('open');
            // Create listener on entire page.
            $('html').click(function closeClick(e) {
                // Only call if target isn't the tooltip or trigger (trigger has its own listeners).
                if ($(e.target).data('toggle') !== 'tooltip'
                  && $(e.target).parents('.tooltip.in').length === 0) { 
                    $('[data-toggle="tooltip"]').tooltip('hide');
                    $('html').off("click", closeClick);
                }
            });
        });

        this.$element.on('hidden.bs.tooltip', function () {
          $(this).removeClass('open');
        });

      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focus';
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'blur';

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this));
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this));
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle();
  }


  // LIVEFYRE TOOLTIP PLUGIN DEFINITION
  // ==================================

  var old = $.fn.tooltip

  $.fn.tooltip = function (option) {
    return this.each(function () {
      var $this   = $(this);
      var data    = $this.data('bs.tooltip');
      var options = typeof option == 'object' && option;

      if (!data) { 
        $this.data('bs.tooltip', (data = new LivefyreTooltip(this, options))); 
      }
      if (typeof option == 'string') { 
        data[option](); 
      }
    })
  }

  $.fn.tooltip.Constructor = LivefyreTooltip;


  // LIVEFYRE TOOLTIP NO CONFLICT
  // ============================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old;
    return this;
  }

}(jQuery);

