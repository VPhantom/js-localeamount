// Copyright 2013 Stéphane Lavergne <http://www.imars.com/> Free software under <http://www.gnu.org/licenses/lgpl-3.0.txt>

/**
 * Number.toLocaleAmount
 *
 * Format numbers into localized strings, optionally as currency amounts,
 * using HTML entities where appropriate.
 *
 * Built-in languages: en, fr.
 * Built-in currencies: AUD, CAD, CHF, EUR, GBP, JPY, MXN, NZD, USD.
 *
 * Usage:
 *
 * (41131.935).toLocaleAmount()                  // "41,131.935" (in English browser)
 * (41131.935).toLocaleAmount('en')              // "41,131.935"
 * (41131.935).toLocaleAmount('fr', 2)           // "41 131,94"
 * (41131.935).toLocaleAmount('en', 'EUR')       // "&euro;41,131.94"
 * (41131.935).toLocaleAmount('fr', 'JPY', true) // "41 132 &yen;"
 *
 * To add a new currency in English:
 *
 * Number.prototype.toLocaleAmount.locales.en.ZZZ = {
 *   prefix:    '$',  suffix:    '',
 *   extPrefix: 'Z$', extSuffix: '',
 *   digits: 2
 * }
 *
 * To add a new language:
 *
 * Number.prototype.toLocaleAmount.locales.zz = {
 *   thousands:   ',',
 *   decimal:     '.',
 *   thousandths: '&nbsp;',
 *   AUD: { ... },
 *   CAD: { ... },
 *   ...
 * }
 *
 * @package   Number.toLocaleAmount
 * @author    Stéphane Lavergne <http://www.imars.com/>
 * @copyright 2013 Stéphane Lavergne
 * @license   http://www.gnu.org/licenses/lgpl-3.0.txt  GNU LGPL version 3
 */

/*jslint node: false, browser: true, es5: false, white: true, nomen: true, plusplus: true */

(function (window) {
	"use strict";

	Number.prototype.toLocaleAmount = function (languageCode, digitsOrCurrencyCode, extended) {
		var
			lang     = languageCode || window.navigator.userLanguage || window.navigator.language || '',
			locales  = Number.prototype.toLocaleAmount.locales,
			digits   = parseInt(digitsOrCurrencyCode, 10),
			currency = null,
			result   = '',
			parts    = [],
			partLen  = 0,
			i        = 0
		;
		lang = lang.substring(0,2).toLowerCase();
		if (!locales[lang]) { lang = 'en'; }
		if (isNaN(digits)) {
			digits = -1;
			currency = digitsOrCurrencyCode;
		}
		if (locales[lang].currencies[currency]) {
			digits = locales[lang].currencies[currency].digits;
		}

		if (digits >= 0) {
			result = this.toFixed(digits);
		} else {
			result = this.toString();
		}

		parts = result.split('.', 2);
		result = '';
		partLen = parts[0].length;
		if (partLen > 3) {
			for (i=partLen; i >= 0; i -= 3) {
				if (i > 0 && i < partLen) { result = locales[lang].thousands + result; }
				result = parts[0].substring(i-3, i) + result;
			}
		} else {
			result = parts[0];
		}
		if (typeof parts[1] !== 'undefined') {
			result += locales[lang].decimal;
			partLen = parts[1].length;
			if (partLen > 5) {
				for (i=0; i < partLen; i += 3) {
					if (i > 0 && i < partLen) { result += locales[lang].thousandths; }
					result += parts[1].substring(i, i+3);
				}
			} else {
				result += parts[1];
			}
		}

		if (currency && locales[lang].currencies[currency]) {
			if (extended) {
				result = locales[lang].currencies[currency].extPrefix + result + locales[lang].currencies[currency].extSuffix;
			} else {
				result = locales[lang].currencies[currency].prefix    + result + locales[lang].currencies[currency].suffix;
			}
		}

		return result;
	};

	Number.prototype.toLocaleAmount.locales = {

		// English locale
		en: {
			thousands:   ',',
			decimal:     '.',
			thousandths: '&nbsp;',
			currencies: {
				AUD: {
					prefix:    '$',   suffix:    '',
					extPrefix: 'A$',  extSuffix: '',
					digits: 2
				},
				CAD: {
					prefix:    '$',   suffix:    '',
					extPrefix: 'C$',  extSuffix: '',
					digits: 2
				},
				CHF: {
					prefix:    '',   suffix:    '',
					extPrefix: '',   extSuffix: '',
					digits: 2
				},
				EUR: {
					prefix:    '&euro;',  suffix:    '',
					extPrefix: '&euro;',  extSuffix: '',
					digits: 2
				},
				GBP: {
					prefix:    '&pound;',  suffix:    '',
					extPrefix: '&pound;',  extSuffix: '',
					digits: 2
				},
				JPY: {
					prefix:    '&yen;',  suffix:    '',
					extPrefix: '&yen;',  extSuffix: '',
					digits: 0
				},
				MXN: {
					prefix:    '$',     suffix:    '',
					extPrefix: 'Mex$',  extSuffix: '',
					digits: 2
				},
				NZD: {
					prefix:    '$',    suffix:    '',
					extPrefix: 'NZ$',  extSuffix: '',
					digits: 2
				},
				USD: {
					prefix:    '$',    suffix:    '',
					extPrefix: 'US$',  extSuffix: '',
					digits: 2
				}
			}
		},

		// French locale
		fr: {
			thousands:   '&nbsp;',
			decimal:     ',',
			thousandths: '&nbsp;',
			currencies: {
				AUD: {
					prefix:    '',  suffix:    '&nbsp;$',
					extPrefix: '',  extSuffix: '&nbsp;$A',
					digits: 2
				},
				CAD: {
					prefix:    '',  suffix:    '&nbsp;$',
					extPrefix: '',  extSuffix: '&nbsp;$CAN',
					digits: 2
				},
				CHF: {
					prefix:    '',  suffix:    '',
					extPrefix: '',  extSuffix: '',
					digits: 2
				},
				EUR: {
					prefix:    '',  suffix:    '&nbsp;&euro;',
					extPrefix: '',  extSuffix: '&nbsp;&euro;',
					digits: 2
				},
				GBP: {
					prefix:    '',  suffix:    '&nbsp;&pound;',
					extPrefix: '',  extSuffix: '&nbsp;&pound;',
					digits: 2
				},
				JPY: {
					prefix:    '',  suffix:    '&nbsp;&yen;',
					extPrefix: '',  extSuffix: '&nbsp;&yen;',
					digits: 0
				},
				MXN: {
					prefix:    '',  suffix:    '&nbsp;$',
					extPrefix: '',  extSuffix: '&nbsp;$Mex',
					digits: 2
				},
				NZD: {
					prefix:    '',  suffix:    '&nbsp;$',
					extPrefix: '',  extSuffix: '&nbsp;$NZ',
					digits: 2
				},
				USD: {
					prefix:    '',  suffix:    '&nbsp;$',
					extPrefix: '',  extSuffix: '&nbsp;$US',
					digits: 2
				}
			}
		}

	};


}( window ));
