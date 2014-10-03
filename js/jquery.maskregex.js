/**
 *  Project: jQuery plugin Mask Regex
 *  Author: Marcelo S. Campos <sk8sta13@gmail.com>
 *	https://github.com/sk8sta13/jquery.maskregex
 *  License: MIT License (https://raw.github.com/plentz/jquery-maskmoney/master/LICENSE)
 *
 *	JQuery plugin to create masks in HTML fields.
 *	Main aim is to work in any browser on any mobile device including.
 */

;(function ($, window, document, undefined) {

    var pluginName = "mask",
        dataKey = "Plugin_" + pluginName,
        defaults = {
            centsDigits: 2,
            centsSeparator: ',',
            thousandSeparator: '.',
			currencySymbol: 'R$'
        };

    var Plugin = function (element, options) {
        this.element = element;
        this.settings = ((typeof options) == 'string') ? options : $.extend({}, defaults, options);
        this.money = ((typeof options) == 'string') ? false : true;
        this.init(options);
    };

    Plugin.prototype = {
        init: function (options) {
            var self = this;
			var str = '';

            self.element.bind( "keyup", function( e ) {
				str = self.element.val();
				str = self.clearStr(str);
                if(self.money){
					var a = (((str.length - (self.settings.centsDigits)) % 3) == 0) ? 1 : 0;
					var separator = Math.floor(((str.length - (self.settings.centsDigits + 1)) / 3) - a);
					for(var i = separator; i >= 0; i--){
						str = self.setPosition(str, ((i + 1) * 3) + self.settings.centsDigits, self.settings.thousandSeparator, false);
					}
					str = self.setPosition(str, self.settings.centsDigits, self.settings.centsSeparator, false);
					str = self.settings.currencySymbol+' '+str;
                }else{
					self.maxLength(self.settings.length);
					var symbol = self.getSymbols(self.settings);
					var pos = self.getPositions(self.settings);
					for(var i = 0; i <= (symbol.length - 1); i++){
						str = self.setPosition(str, pos[i], symbol[i], true);
					}
                }
				self.element.val(str);
            });

            return this;

        },

		clearStr: function (str) {
			var mask = this.settings;
			if((!this.money) && (mask.indexOf('A') >= 0)){
				mask = mask.replace(/[^0-9a-zA-Z]/g, '');
				str = str.toUpperCase();
				var r = '';
				for(var i = 0; i <= (str.length - 1); i++){
					var c = str[i];
					if(mask[i] == 'A'){
						c = c.replace(/[0-9]/g, '');
					}else if(mask[i] == '9'){
						c = c.replace(/\D/g, '');
					}
					r += c;
				}
				return r;
			}else{
				return str.replace(/\D/g, '');
			}
        },

		setPosition: function (str, position, character, i) {
			if((position >= 0) && (character != '')){
				var standard = (i) ? new RegExp('(.{'+position+'})(.)') : new RegExp('(\\d)(\\d{'+position+'})$');
				return str.replace(standard, '$1'+character+'$2');
			}
		},

		maxLength: function (digits) {
			this.element.attr('maxLength', digits);
		},

		getSymbols: function (str) {
			return str.match(/[^0-9a-zA-Z]/g);
		},

		getPositions: function (str) {
			var s = this.getSymbols(str);
			var pos = Array();
			var x = 0;
			for(i = 0; i <= (str.length - 1); i++){
				if(str.indexOf(s[i], x) != -1){
					pos[i] = str.indexOf(s[i], x);
					x = (pos[i] + 1);
				}
			}
			return pos;
		}
    };

    $.fn[pluginName] = function (options) {

        var plugin = this.data(dataKey);

        if (plugin instanceof Plugin) {
            if (typeof options !== 'undefined') {
                plugin.init(options);
            }
        } else {
            plugin = new Plugin(this, options);
            this.data(dataKey, plugin);
        }

        return plugin;
    };

}(jQuery, window, document));