var publisher;
/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/classnames/index.js":
/*!******************************************!*\
  !*** ./node_modules/classnames/index.js ***!
  \******************************************/
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;
	var nativeCodeString = '[native code]';

	function classNames() {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				if (arg.length) {
					var inner = classNames.apply(null, arg);
					if (inner) {
						classes.push(inner);
					}
				}
			} else if (argType === 'object') {
				if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {
					classes.push(arg.toString());
					continue;
				}

				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if ( true && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return classNames;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}
}());


/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/***/ (function(module) {

"use strict";
module.exports = window["lodash"];

/***/ }),

/***/ "./packages/classnames/src/defaults/components.json":
/*!**********************************************************!*\
  !*** ./packages/classnames/src/defaults/components.json ***!
  \**********************************************************/
/***/ (function(module) {

"use strict";
module.exports = JSON.parse('{"publisher-core":true,"component":true}');

/***/ }),

/***/ "./packages/classnames/src/defaults/controls.json":
/*!********************************************************!*\
  !*** ./packages/classnames/src/defaults/controls.json ***!
  \********************************************************/
/***/ (function(module) {

"use strict";
module.exports = JSON.parse('{"publisher-core":true,"control":true}');

/***/ }),

/***/ "./packages/classnames/src/defaults/extensions.json":
/*!**********************************************************!*\
  !*** ./packages/classnames/src/defaults/extensions.json ***!
  \**********************************************************/
/***/ (function(module) {

"use strict";
module.exports = JSON.parse('{"publisher-core":true,"extension":true}');

/***/ }),

/***/ "./packages/classnames/src/defaults/root.json":
/*!****************************************************!*\
  !*** ./packages/classnames/src/defaults/root.json ***!
  \****************************************************/
/***/ (function(module) {

"use strict";
module.exports = JSON.parse('{"publisher-core":true}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
/*!******************************************!*\
  !*** ./packages/classnames/src/index.js ***!
  \******************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "componentClassNames": function() { return /* binding */ componentClassNames; },
/* harmony export */   "controlClassNames": function() { return /* binding */ controlClassNames; },
/* harmony export */   "extensionClassNames": function() { return /* binding */ extensionClassNames; },
/* harmony export */   "getClassNames": function() { return /* binding */ getClassNames; },
/* harmony export */   "mergeClasses": function() { return /* binding */ mergeClasses; }
/* harmony export */ });
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _defaults_root_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./defaults/root.json */ "./packages/classnames/src/defaults/root.json");
/* harmony import */ var _defaults_controls_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./defaults/controls.json */ "./packages/classnames/src/defaults/controls.json");
/* harmony import */ var _defaults_components_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./defaults/components.json */ "./packages/classnames/src/defaults/components.json");
/* harmony import */ var _defaults_extensions_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./defaults/extensions.json */ "./packages/classnames/src/defaults/extensions.json");
/**
 * External dependencies
 */



/**
 * Internal dependencies
 */




function getClassNames() {
  for (var _len = arguments.length, names = new Array(_len), _key = 0; _key < _len; _key++) {
    names[_key] = arguments[_key];
  }
  return classnames__WEBPACK_IMPORTED_MODULE_0___default()(_defaults_root_json__WEBPACK_IMPORTED_MODULE_2__, names);
}
function controlClassNames() {
  for (var _len2 = arguments.length, names = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    names[_key2] = arguments[_key2];
  }
  return classnames__WEBPACK_IMPORTED_MODULE_0___default()(_defaults_controls_json__WEBPACK_IMPORTED_MODULE_3__, names);
}
function componentClassNames() {
  for (var _len3 = arguments.length, names = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    names[_key3] = arguments[_key3];
  }
  return classnames__WEBPACK_IMPORTED_MODULE_0___default()(_defaults_components_json__WEBPACK_IMPORTED_MODULE_4__, names);
}
function extensionClassNames() {
  for (var _len4 = arguments.length, names = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    names[_key4] = arguments[_key4];
  }
  return classnames__WEBPACK_IMPORTED_MODULE_0___default()(_defaults_extensions_json__WEBPACK_IMPORTED_MODULE_5__, names);
}

/**
 * Merged default context classnames with additional classnames
 *
 * @param {Array<Object|string|Array>} names The additional classnames
 * @param {Object} defaultValues The default values of context
 * @returns {Object} classnames with additional items as object
 */
function mergeClasses(names, defaultValues) {
  names?.forEach(name => {
    if ((0,lodash__WEBPACK_IMPORTED_MODULE_1__.isString)(name)) {
      name.split(' ')?.forEach(item => {
        if (defaultValues[item]) {
          return;
        }
        defaultValues[item] = true;
      });
      return;
    }
    if ((0,lodash__WEBPACK_IMPORTED_MODULE_1__.isArray)(name)) {
      name.forEach(item => {
        if (defaultValues[item]) {
          return;
        }
        defaultValues[item] = true;
      });
      return;
    }
    if ((0,lodash__WEBPACK_IMPORTED_MODULE_1__.isObject)(name)) {
      Object.keys(name).forEach(item => {
        if (defaultValues[item]) {
          return;
        }
        if (defaultValues[item] === name[item]) {
          return;
        }
        defaultValues[item] = name[item];
      });
    }
  });
  return classnames__WEBPACK_IMPORTED_MODULE_0___default()(defaultValues);
}
}();
(publisher = typeof publisher === "undefined" ? {} : publisher).classnames = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUdGLElBQUksQ0FBQ0UsSUFBSSxDQUFDO01BQ2pDLENBQUMsQ0FBQztJQUNIO0VBQ0QsQ0FBQyxDQUFDO0VBRUYsT0FBTzdCLGlEQUFVLENBQUN5QixhQUFhLENBQUM7QUFDakMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL3B1Ymxpc2hlci8uL25vZGVfbW9kdWxlcy9jbGFzc25hbWVzL2luZGV4LmpzIiwid2VicGFjazovL3B1Ymxpc2hlci9leHRlcm5hbCB3aW5kb3cgXCJsb2Rhc2hcIiIsIndlYnBhY2s6Ly9wdWJsaXNoZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcHVibGlzaGVyL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3B1Ymxpc2hlci93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vcHVibGlzaGVyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vcHVibGlzaGVyL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vcHVibGlzaGVyLy4vcGFja2FnZXMvY2xhc3NuYW1lcy9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohXG5cdENvcHlyaWdodCAoYykgMjAxOCBKZWQgV2F0c29uLlxuXHRMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UgKE1JVCksIHNlZVxuXHRodHRwOi8vamVkd2F0c29uLmdpdGh1Yi5pby9jbGFzc25hbWVzXG4qL1xuLyogZ2xvYmFsIGRlZmluZSAqL1xuXG4oZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIGhhc093biA9IHt9Lmhhc093blByb3BlcnR5O1xuXHR2YXIgbmF0aXZlQ29kZVN0cmluZyA9ICdbbmF0aXZlIGNvZGVdJztcblxuXHRmdW5jdGlvbiBjbGFzc05hbWVzKCkge1xuXHRcdHZhciBjbGFzc2VzID0gW107XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGFyZyA9IGFyZ3VtZW50c1tpXTtcblx0XHRcdGlmICghYXJnKSBjb250aW51ZTtcblxuXHRcdFx0dmFyIGFyZ1R5cGUgPSB0eXBlb2YgYXJnO1xuXG5cdFx0XHRpZiAoYXJnVHlwZSA9PT0gJ3N0cmluZycgfHwgYXJnVHlwZSA9PT0gJ251bWJlcicpIHtcblx0XHRcdFx0Y2xhc3Nlcy5wdXNoKGFyZyk7XG5cdFx0XHR9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoYXJnKSkge1xuXHRcdFx0XHRpZiAoYXJnLmxlbmd0aCkge1xuXHRcdFx0XHRcdHZhciBpbm5lciA9IGNsYXNzTmFtZXMuYXBwbHkobnVsbCwgYXJnKTtcblx0XHRcdFx0XHRpZiAoaW5uZXIpIHtcblx0XHRcdFx0XHRcdGNsYXNzZXMucHVzaChpbm5lcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKGFyZ1R5cGUgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdGlmIChhcmcudG9TdHJpbmcgIT09IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcgJiYgIWFyZy50b1N0cmluZy50b1N0cmluZygpLmluY2x1ZGVzKCdbbmF0aXZlIGNvZGVdJykpIHtcblx0XHRcdFx0XHRjbGFzc2VzLnB1c2goYXJnLnRvU3RyaW5nKCkpO1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Zm9yICh2YXIga2V5IGluIGFyZykge1xuXHRcdFx0XHRcdGlmIChoYXNPd24uY2FsbChhcmcsIGtleSkgJiYgYXJnW2tleV0pIHtcblx0XHRcdFx0XHRcdGNsYXNzZXMucHVzaChrZXkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBjbGFzc2VzLmpvaW4oJyAnKTtcblx0fVxuXG5cdGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRcdGNsYXNzTmFtZXMuZGVmYXVsdCA9IGNsYXNzTmFtZXM7XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBjbGFzc05hbWVzO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGRlZmluZS5hbWQgPT09ICdvYmplY3QnICYmIGRlZmluZS5hbWQpIHtcblx0XHQvLyByZWdpc3RlciBhcyAnY2xhc3NuYW1lcycsIGNvbnNpc3RlbnQgd2l0aCBucG0gcGFja2FnZSBuYW1lXG5cdFx0ZGVmaW5lKCdjbGFzc25hbWVzJywgW10sIGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBjbGFzc05hbWVzO1xuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdHdpbmRvdy5jbGFzc05hbWVzID0gY2xhc3NOYW1lcztcblx0fVxufSgpKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gd2luZG93W1wibG9kYXNoXCJdOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdGZ1bmN0aW9uKCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuXHRcdGZ1bmN0aW9uKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgZGVmaW5pdGlvbikge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmosIHByb3ApIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApOyB9IiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvKipcbiAqIEV4dGVybmFsIGRlcGVuZGVuY2llc1xuICovXG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCB7IGlzQXJyYXksIGlzT2JqZWN0LCBpc1N0cmluZyB9IGZyb20gJ2xvZGFzaCc7XG5cbi8qKlxuICogSW50ZXJuYWwgZGVwZW5kZW5jaWVzXG4gKi9cbmltcG9ydCByb290RGVmYXVsdCBmcm9tICcuL2RlZmF1bHRzL3Jvb3QuanNvbic7XG5pbXBvcnQgY29udHJvbHNEZWZhdWx0IGZyb20gJy4vZGVmYXVsdHMvY29udHJvbHMuanNvbic7XG5pbXBvcnQgY29tcG9uZW50c0RlZmF1bHQgZnJvbSAnLi9kZWZhdWx0cy9jb21wb25lbnRzLmpzb24nO1xuaW1wb3J0IGV4dGVuc2lvbnNEZWZhdWx0IGZyb20gJy4vZGVmYXVsdHMvZXh0ZW5zaW9ucy5qc29uJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldENsYXNzTmFtZXMoLi4ubmFtZXMpIHtcblx0cmV0dXJuIGNsYXNzbmFtZXMocm9vdERlZmF1bHQsIG5hbWVzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnRyb2xDbGFzc05hbWVzKC4uLm5hbWVzKSB7XG5cdHJldHVybiBjbGFzc25hbWVzKGNvbnRyb2xzRGVmYXVsdCwgbmFtZXMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29tcG9uZW50Q2xhc3NOYW1lcyguLi5uYW1lcykge1xuXHRyZXR1cm4gY2xhc3NuYW1lcyhjb21wb25lbnRzRGVmYXVsdCwgbmFtZXMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXh0ZW5zaW9uQ2xhc3NOYW1lcyguLi5uYW1lcykge1xuXHRyZXR1cm4gY2xhc3NuYW1lcyhleHRlbnNpb25zRGVmYXVsdCwgbmFtZXMpO1xufVxuXG4vKipcbiAqIE1lcmdlZCBkZWZhdWx0IGNvbnRleHQgY2xhc3NuYW1lcyB3aXRoIGFkZGl0aW9uYWwgY2xhc3NuYW1lc1xuICpcbiAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0fHN0cmluZ3xBcnJheT59IG5hbWVzIFRoZSBhZGRpdGlvbmFsIGNsYXNzbmFtZXNcbiAqIEBwYXJhbSB7T2JqZWN0fSBkZWZhdWx0VmFsdWVzIFRoZSBkZWZhdWx0IHZhbHVlcyBvZiBjb250ZXh0XG4gKiBAcmV0dXJucyB7T2JqZWN0fSBjbGFzc25hbWVzIHdpdGggYWRkaXRpb25hbCBpdGVtcyBhcyBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlQ2xhc3Nlcyhcblx0bmFtZXM6IEFycmF5PE9iamNldCB8IHN0cmluZyB8IEFycmF5Pixcblx0ZGVmYXVsdFZhbHVlczogT2JqZWN0XG4pOiBPYmplY3Qge1xuXHRuYW1lcz8uZm9yRWFjaCgobmFtZSkgPT4ge1xuXHRcdGlmIChpc1N0cmluZyhuYW1lKSkge1xuXHRcdFx0bmFtZS5zcGxpdCgnICcpPy5mb3JFYWNoKChpdGVtKSA9PiB7XG5cdFx0XHRcdGlmIChkZWZhdWx0VmFsdWVzW2l0ZW1dKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZGVmYXVsdFZhbHVlc1tpdGVtXSA9IHRydWU7XG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmIChpc0FycmF5KG5hbWUpKSB7XG5cdFx0XHRuYW1lLmZvckVhY2goKGl0ZW0pID0+IHtcblx0XHRcdFx0aWYgKGRlZmF1bHRWYWx1ZXNbaXRlbV0pIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRkZWZhdWx0VmFsdWVzW2l0ZW1dID0gdHJ1ZTtcblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKGlzT2JqZWN0KG5hbWUpKSB7XG5cdFx0XHRPYmplY3Qua2V5cyhuYW1lKS5mb3JFYWNoKChpdGVtKSA9PiB7XG5cdFx0XHRcdGlmIChkZWZhdWx0VmFsdWVzW2l0ZW1dKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGRlZmF1bHRWYWx1ZXNbaXRlbV0gPT09IG5hbWVbaXRlbV0pIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRkZWZhdWx0VmFsdWVzW2l0ZW1dID0gbmFtZVtpdGVtXTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG5cblx0cmV0dXJuIGNsYXNzbmFtZXMoZGVmYXVsdFZhbHVlcyk7XG59XG4iXSwibmFtZXMiOlsiY2xhc3NuYW1lcyIsImlzQXJyYXkiLCJpc09iamVjdCIsImlzU3RyaW5nIiwicm9vdERlZmF1bHQiLCJjb250cm9sc0RlZmF1bHQiLCJjb21wb25lbnRzRGVmYXVsdCIsImV4dGVuc2lvbnNEZWZhdWx0IiwiZ2V0Q2xhc3NOYW1lcyIsIl9sZW4iLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJuYW1lcyIsIkFycmF5IiwiX2tleSIsImNvbnRyb2xDbGFzc05hbWVzIiwiX2xlbjIiLCJfa2V5MiIsImNvbXBvbmVudENsYXNzTmFtZXMiLCJfbGVuMyIsIl9rZXkzIiwiZXh0ZW5zaW9uQ2xhc3NOYW1lcyIsIl9sZW40IiwiX2tleTQiLCJtZXJnZUNsYXNzZXMiLCJkZWZhdWx0VmFsdWVzIiwiZm9yRWFjaCIsIm5hbWUiLCJzcGxpdCIsIml0ZW0iLCJPYmplY3QiLCJrZXlzIl0sInNvdXJjZVJvb3QiOiIifQ==