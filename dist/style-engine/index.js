var publisher;
/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./packages/data-extractor/src/index.js":
/*!**********************************************!*\
  !*** ./packages/data-extractor/src/index.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "accumulator": function() { return /* binding */ accumulator; },
/* harmony export */   "prepare": function() { return /* binding */ prepare; },
/* harmony export */   "toArray": function() { return /* binding */ toArray; }
/* harmony export */ });
function prepare(query, dataset) {
  const parsedQuery = query.split('.');
  const itemValue = function () {
    for (var _len = arguments.length, values = new Array(_len), _key = 0; _key < _len; _key++) {
      values[_key] = arguments[_key];
    }
    return values.reduce(accumulator, dataset);
  };
  let props = [];
  parsedQuery.forEach((item, index) => {
    props = toArray(item, index, props);
  });
  return itemValue(...props);
}
function accumulator(a, x) {
  const regexp = /\[.*\]/gi;
  let tempValue = a[x];
  let m;
  while ((m = regexp.exec(x)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regexp.lastIndex) {
      regexp.lastIndex++;
    }

    // The result can be accessed through the `m`-variable.
    m.forEach(match => {
      match[0] = match[0].replace(/\[|\]/g, '');
      tempValue = tempValue[match[0]];
    });
  }
  return tempValue;
}
function toArray(item, index, arr) {
  if (-1 !== item.indexOf('[')) {
    const details = item.split('[');
    details.forEach(_item => {
      arr.push(_item.replace(/\[|\]/g, ''));
    });
    return arr;
  }
  arr.push(item.replace(/\[|\]/g, ''));
  return arr;
}

/***/ }),

/***/ "./packages/style-engine/src/index.js":
/*!********************************************!*\
  !*** ./packages/style-engine/src/index.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "computedCssRules": function() { return /* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_1__.computedCssRules; },
/* harmony export */   "createCssRule": function() { return /* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_1__.createCssRule; },
/* harmony export */   "default": function() { return /* binding */ CssGenerators; },
/* harmony export */   "injectHelpersToCssGenerators": function() { return /* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_1__.injectHelpersToCssGenerators; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./packages/style-engine/src/utils.js");



class CssGenerators {
  constructor(name, _ref, blockProps) {
    let {
      type,
      function: callback,
      selector,
      properties
    } = _ref;
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "name", '');
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "selector", '');
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "type", 'static');
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "properties", {});
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "blockProps", {});
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "function", () => {});
    this.name = name;
    this.type = type;
    this.selector = selector;
    this.function = callback;
    this.properties = properties;
    this.blockProps = blockProps;
  }
  getPropValue(attributeName) {
    const {
      attributes
    } = this.blockProps;
    return attributeName ? attributes[attributeName] || attributes : attributes;
  }
  rules() {
    const addRule = `add${this.type.charAt(0).toUpperCase() + this.type.slice(1)}Rule`;
    if (!this[addRule]) {
      return '';
    }
    return this[addRule]();
  }
  setUniqueClassName() {
    this.selector = this.selector.replace(/\.{{BLOCK_ID}}/g, `.publisher-core.extension.publisher-extension-ref.client-id-${this.blockProps?.clientId}`);
  }
  addStaticRule() {
    this.setUniqueClassName();
    return (0,_utils__WEBPACK_IMPORTED_MODULE_1__.createCssRule)(this);
  }
  addFunctionRule() {
    if (!this.getPropValue(this.name)) {
      return '';
    }
    return this.function(this.name, this.blockProps, this);
  }
}

/***/ }),

/***/ "./packages/style-engine/src/utils.js":
/*!********************************************!*\
  !*** ./packages/style-engine/src/utils.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "computedCssRules": function() { return /* binding */ computedCssRules; },
/* harmony export */   "createCssRule": function() { return /* binding */ createCssRule; },
/* harmony export */   "getVars": function() { return /* binding */ getVars; },
/* harmony export */   "hasAllProperties": function() { return /* binding */ hasAllProperties; },
/* harmony export */   "injectHelpersToCssGenerators": function() { return /* binding */ injectHelpersToCssGenerators; }
/* harmony export */ });
/* harmony import */ var _publisher_style_engine__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @publisher/style-engine */ "./packages/style-engine/src/index.js");
/* harmony import */ var _publisher_data_extractor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @publisher/data-extractor */ "./packages/data-extractor/src/index.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);
/**
 * Internal dependencies
 */




/**
 * Has object all passed properties?
 *
 * @param {Object} obj the any object
 * @param {Array.<string>} props the props of any object
 * @return {boolean} true on success, false when otherwise!
 */
function hasAllProperties(obj, props) {
  for (let i = 0; i < props.length; i++) {
    if (!obj.hasOwnProperty(props[i])) {
      return false;
    }
  }
  return true;
}

/**
 * Injection helpers into generators.
 *
 * @param {Object} helpers The helper function to injected current css generator.
 * @param {Object} generators The css generators list as Object
 * @return {Object} generators with includes helper functions!
 */
const injectHelpersToCssGenerators = (helpers, generators) => {
  Object.values(generators).forEach((generator, index) => {
    generator.forEach(item => {
      if ('function' === item?.type) {
        generators[Object.keys(generators)[index]] = {
          ...item,
          function: helpers[item.function]
        };
      }
    });
  });
  return generators;
};

/**
 * Retrieve computed css rules with usage of registered CSS Generators runner.
 *
 * @param {Object} blockType The current block type
 * @param {*} blockProps The current block properties
 * @return {string} The current block css output of css generators!
 */
const computedCssRules = (blockType, blockProps) => {
  let css = '';
  const {
    publisherCssGenerators = []
  } = blockType;
  for (const controlId in publisherCssGenerators) {
    if (!Object.hasOwnProperty.call(publisherCssGenerators, controlId)) {
      continue;
    }
    const generator = publisherCssGenerators[controlId];
    if (!generator?.type) {
      continue;
    }
    const cssGenerator = new _publisher_style_engine__WEBPACK_IMPORTED_MODULE_1__["default"](controlId, generator, blockProps);
    css += cssGenerator.rules() + '\n';
  }
  return css;
};

/**
 * Creating CSS Rule!
 *
 * @param {Object} style The style object
 * @return {string} The created CSS Rule!
 */
const createCssRule = style => {
  if (!hasAllProperties(style, ['selector', 'properties'])) {
    console.warn(`Style rule: %o ${JSON.stringify(style)} avoid css rule validation!`);
    return '';
  }
  const {
    properties = [],
    selector = '',
    blockProps = {}
  } = style;
  let styleBody = [];
  const keys = Object.keys(properties);
  const lastKeyIndex = keys.length - 1;
  for (const property in properties) {
    if (!Object.hasOwnProperty.call(properties, property)) {
      continue;
    }
    const value = properties[property];
    if (!(0,lodash__WEBPACK_IMPORTED_MODULE_0__.isString)(value)) {
      console.warn(`CSS property value must be string given ${typeof value}, please double check properties.`);
      continue;
    }
    styleBody.push(`${property}: ${value}${-1 === value.indexOf(';') ? ';\n' : '\n'}${lastKeyIndex === keys.indexOf(property) ? '\n' : ''}`);
  }
  styleBody = styleBody.join('\n');
  if (!blockProps?.attributes) {
    return `${selector}{${styleBody}}`;
  }
  getVars(styleBody).forEach(query => {
    const replacement = (0,_publisher_data_extractor__WEBPACK_IMPORTED_MODULE_2__.prepare)(query, blockProps?.attributes);
    if (!replacement) {
      return;
    }
    styleBody = styleBody.replace(query, replacement).replace(/\{|\}/g, '');
  });
  return `${selector}{${styleBody}}`;
};

/**
 * Retrieve dynamic variables from queries!
 *
 * @param {string} queries The queries as string. Example: "{{x.y[2].z}} {{x.a}}"
 * @return {Array<string>} The dynamic variables list
 */
function getVars(queries) {
  const regex = /{{[^{}]+}}/gi;
  const matches = queries.matchAll(regex);
  const replacements = [];
  for (const match of matches) {
    replacements.push(match[0].replace(/\{|\}/g, ''));
  }
  return replacements;
}

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/***/ (function(module) {

module.exports = window["lodash"];

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/defineProperty.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _defineProperty; }
/* harmony export */ });
/* harmony import */ var _toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toPropertyKey.js */ "./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js");

function _defineProperty(obj, key, value) {
  key = (0,_toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__["default"])(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/toPrimitive.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/toPrimitive.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _toPrimitive; }
/* harmony export */ });
/* harmony import */ var _typeof_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./typeof.js */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");

function _toPrimitive(input, hint) {
  if ((0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if ((0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _toPropertyKey; }
/* harmony export */ });
/* harmony import */ var _typeof_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./typeof.js */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _toPrimitive_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./toPrimitive.js */ "./node_modules/@babel/runtime/helpers/esm/toPrimitive.js");


function _toPropertyKey(arg) {
  var key = (0,_toPrimitive_js__WEBPACK_IMPORTED_MODULE_1__["default"])(arg, "string");
  return (0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(key) === "symbol" ? key : String(key);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/typeof.js":
/*!***********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/typeof.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _typeof; }
/* harmony export */ });
function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}

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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./packages/style-engine/src/index.js");
/******/ 	(publisher = typeof publisher === "undefined" ? {} : publisher).styleEngine = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNka0M7QUFDbkI7QUFDZixNQUFNLHNEQUFPO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBTztBQUNmO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDVmtDO0FBQ1M7QUFDNUI7QUFDZixZQUFZLDJEQUFXO0FBQ3ZCLFNBQVMsc0RBQU87QUFDaEI7Ozs7Ozs7Ozs7Ozs7O0FDTGU7QUFDZjs7QUFFQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0EsR0FBRztBQUNIOzs7Ozs7VUNSQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQSxlQUFlLDRCQUE0QjtXQUMzQyxlQUFlO1dBQ2YsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBLDhDQUE4Qzs7Ozs7V0NBOUM7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztVRU5BO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcHVibGlzaGVyLy4vcGFja2FnZXMvZGF0YS1leHRyYWN0b3Ivc3JjL2luZGV4LmpzIiwid2VicGFjazovL3B1Ymxpc2hlci8uL3BhY2thZ2VzL3N0eWxlLWVuZ2luZS9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vcHVibGlzaGVyLy4vcGFja2FnZXMvc3R5bGUtZW5naW5lL3NyYy91dGlscy5qcyIsIndlYnBhY2s6Ly9wdWJsaXNoZXIvZXh0ZXJuYWwgd2luZG93IFwibG9kYXNoXCIiLCJ3ZWJwYWNrOi8vcHVibGlzaGVyLy4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZXNtL2RlZmluZVByb3BlcnR5LmpzIiwid2VicGFjazovL3B1Ymxpc2hlci8uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS90b1ByaW1pdGl2ZS5qcyIsIndlYnBhY2s6Ly9wdWJsaXNoZXIvLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vdG9Qcm9wZXJ0eUtleS5qcyIsIndlYnBhY2s6Ly9wdWJsaXNoZXIvLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vdHlwZW9mLmpzIiwid2VicGFjazovL3B1Ymxpc2hlci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9wdWJsaXNoZXIvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vcHVibGlzaGVyL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9wdWJsaXNoZXIvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9wdWJsaXNoZXIvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9wdWJsaXNoZXIvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9wdWJsaXNoZXIvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL3B1Ymxpc2hlci93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIHByZXBhcmUocXVlcnk6IHN0cmluZywgZGF0YXNldDogT2JqZWN0KTogQXJyYXk8c3RyaW5nPiB7XG5cdGNvbnN0IHBhcnNlZFF1ZXJ5ID0gcXVlcnkuc3BsaXQoJy4nKTtcblx0Y29uc3QgaXRlbVZhbHVlID0gKC4uLnZhbHVlcykgPT4gdmFsdWVzLnJlZHVjZShhY2N1bXVsYXRvciwgZGF0YXNldCk7XG5cblx0bGV0IHByb3BzID0gW107XG5cblx0cGFyc2VkUXVlcnkuZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcblx0XHRwcm9wcyA9IHRvQXJyYXkoaXRlbSwgaW5kZXgsIHByb3BzKTtcblx0fSk7XG5cblx0cmV0dXJuIGl0ZW1WYWx1ZSguLi5wcm9wcyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhY2N1bXVsYXRvcihhLCB4KSB7XG5cdGNvbnN0IHJlZ2V4cCA9IC9cXFsuKlxcXS9naTtcblx0bGV0IHRlbXBWYWx1ZSA9IGFbeF07XG5cdGxldCBtO1xuXG5cdHdoaWxlICgobSA9IHJlZ2V4cC5leGVjKHgpKSAhPT0gbnVsbCkge1xuXHRcdC8vIFRoaXMgaXMgbmVjZXNzYXJ5IHRvIGF2b2lkIGluZmluaXRlIGxvb3BzIHdpdGggemVyby13aWR0aCBtYXRjaGVzXG5cdFx0aWYgKG0uaW5kZXggPT09IHJlZ2V4cC5sYXN0SW5kZXgpIHtcblx0XHRcdHJlZ2V4cC5sYXN0SW5kZXgrKztcblx0XHR9XG5cblx0XHQvLyBUaGUgcmVzdWx0IGNhbiBiZSBhY2Nlc3NlZCB0aHJvdWdoIHRoZSBgbWAtdmFyaWFibGUuXG5cdFx0bS5mb3JFYWNoKChtYXRjaCkgPT4ge1xuXHRcdFx0bWF0Y2hbMF0gPSBtYXRjaFswXS5yZXBsYWNlKC9cXFt8XFxdL2csICcnKTtcblxuXHRcdFx0dGVtcFZhbHVlID0gdGVtcFZhbHVlW21hdGNoWzBdXTtcblx0XHR9KTtcblx0fVxuXG5cdHJldHVybiB0ZW1wVmFsdWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0FycmF5KGl0ZW0sIGluZGV4LCBhcnIpIHtcblx0aWYgKC0xICE9PSBpdGVtLmluZGV4T2YoJ1snKSkge1xuXHRcdGNvbnN0IGRldGFpbHMgPSBpdGVtLnNwbGl0KCdbJyk7XG5cblx0XHRkZXRhaWxzLmZvckVhY2goKF9pdGVtKSA9PiB7XG5cdFx0XHRhcnIucHVzaChfaXRlbS5yZXBsYWNlKC9cXFt8XFxdL2csICcnKSk7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gYXJyO1xuXHR9XG5cblx0YXJyLnB1c2goaXRlbS5yZXBsYWNlKC9cXFt8XFxdL2csICcnKSk7XG5cblx0cmV0dXJuIGFycjtcbn1cbiIsImltcG9ydCB7IGNyZWF0ZUNzc1J1bGUgfSBmcm9tICcuL3V0aWxzJztcblxuZXhwb3J0IHtcblx0Y3JlYXRlQ3NzUnVsZSxcblx0Y29tcHV0ZWRDc3NSdWxlcyxcblx0aW5qZWN0SGVscGVyc1RvQ3NzR2VuZXJhdG9ycyxcbn0gZnJvbSAnLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENzc0dlbmVyYXRvcnMge1xuXHRuYW1lID0gJyc7XG5cdHNlbGVjdG9yID0gJyc7XG5cdHR5cGUgPSAnc3RhdGljJztcblx0cHJvcGVydGllcyA9IHt9O1xuXHRibG9ja1Byb3BzID0ge307XG5cdGZ1bmN0aW9uID0gKCkgPT4ge307XG5cblx0Y29uc3RydWN0b3IoXG5cdFx0bmFtZTogc3RyaW5nLFxuXHRcdHsgdHlwZSwgZnVuY3Rpb246IGNhbGxiYWNrLCBzZWxlY3RvciwgcHJvcGVydGllcyB9OiBPYmplY3QsXG5cdFx0YmxvY2tQcm9wczogT2JqZWN0XG5cdCkge1xuXHRcdHRoaXMubmFtZSA9IG5hbWU7XG5cdFx0dGhpcy50eXBlID0gdHlwZTtcblx0XHR0aGlzLnNlbGVjdG9yID0gc2VsZWN0b3I7XG5cdFx0dGhpcy5mdW5jdGlvbiA9IGNhbGxiYWNrO1xuXHRcdHRoaXMucHJvcGVydGllcyA9IHByb3BlcnRpZXM7XG5cdFx0dGhpcy5ibG9ja1Byb3BzID0gYmxvY2tQcm9wcztcblx0fVxuXG5cdGdldFByb3BWYWx1ZShhdHRyaWJ1dGVOYW1lOiBzdHJpbmcpIHtcblx0XHRjb25zdCB7IGF0dHJpYnV0ZXMgfSA9IHRoaXMuYmxvY2tQcm9wcztcblxuXHRcdHJldHVybiBhdHRyaWJ1dGVOYW1lXG5cdFx0XHQ/IGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0gfHwgYXR0cmlidXRlc1xuXHRcdFx0OiBhdHRyaWJ1dGVzO1xuXHR9XG5cblx0cnVsZXMoKTogc3RyaW5nIHtcblx0XHRjb25zdCBhZGRSdWxlID0gYGFkZCR7XG5cdFx0XHR0aGlzLnR5cGUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0aGlzLnR5cGUuc2xpY2UoMSlcblx0XHR9UnVsZWA7XG5cblx0XHRpZiAoIXRoaXNbYWRkUnVsZV0pIHtcblx0XHRcdHJldHVybiAnJztcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpc1thZGRSdWxlXSgpO1xuXHR9XG5cblx0c2V0VW5pcXVlQ2xhc3NOYW1lKCkge1xuXHRcdHRoaXMuc2VsZWN0b3IgPSB0aGlzLnNlbGVjdG9yLnJlcGxhY2UoXG5cdFx0XHQvXFwue3tCTE9DS19JRH19L2csXG5cdFx0XHRgLnB1Ymxpc2hlci1jb3JlLmV4dGVuc2lvbi5wdWJsaXNoZXItZXh0ZW5zaW9uLXJlZi5jbGllbnQtaWQtJHt0aGlzLmJsb2NrUHJvcHM/LmNsaWVudElkfWBcblx0XHQpO1xuXHR9XG5cblx0YWRkU3RhdGljUnVsZSgpIHtcblx0XHR0aGlzLnNldFVuaXF1ZUNsYXNzTmFtZSgpO1xuXG5cdFx0cmV0dXJuIGNyZWF0ZUNzc1J1bGUodGhpcyk7XG5cdH1cblxuXHRhZGRGdW5jdGlvblJ1bGUoKTogc3RyaW5nIHtcblx0XHRpZiAoIXRoaXMuZ2V0UHJvcFZhbHVlKHRoaXMubmFtZSkpIHtcblx0XHRcdHJldHVybiAnJztcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5mdW5jdGlvbih0aGlzLm5hbWUsIHRoaXMuYmxvY2tQcm9wcywgdGhpcyk7XG5cdH1cbn1cbiIsIi8qKlxuICogSW50ZXJuYWwgZGVwZW5kZW5jaWVzXG4gKi9cbmltcG9ydCBDc3NHZW5lcmF0b3JzIGZyb20gJ0BwdWJsaXNoZXIvc3R5bGUtZW5naW5lJztcbmltcG9ydCB7IHByZXBhcmUgfSBmcm9tICdAcHVibGlzaGVyL2RhdGEtZXh0cmFjdG9yJztcbmltcG9ydCB7IGlzU3RyaW5nIH0gZnJvbSAnbG9kYXNoJztcblxuLyoqXG4gKiBIYXMgb2JqZWN0IGFsbCBwYXNzZWQgcHJvcGVydGllcz9cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqIHRoZSBhbnkgb2JqZWN0XG4gKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBwcm9wcyB0aGUgcHJvcHMgb2YgYW55IG9iamVjdFxuICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBvbiBzdWNjZXNzLCBmYWxzZSB3aGVuIG90aGVyd2lzZSFcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhhc0FsbFByb3BlcnRpZXMob2JqOiBPYmplY3QsIHByb3BzOiBBcnJheTxzdHJpbmc+KTogYm9vbGVhbiB7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcblx0XHRpZiAoIW9iai5oYXNPd25Qcm9wZXJ0eShwcm9wc1tpXSkpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBJbmplY3Rpb24gaGVscGVycyBpbnRvIGdlbmVyYXRvcnMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGhlbHBlcnMgVGhlIGhlbHBlciBmdW5jdGlvbiB0byBpbmplY3RlZCBjdXJyZW50IGNzcyBnZW5lcmF0b3IuXG4gKiBAcGFyYW0ge09iamVjdH0gZ2VuZXJhdG9ycyBUaGUgY3NzIGdlbmVyYXRvcnMgbGlzdCBhcyBPYmplY3RcbiAqIEByZXR1cm4ge09iamVjdH0gZ2VuZXJhdG9ycyB3aXRoIGluY2x1ZGVzIGhlbHBlciBmdW5jdGlvbnMhXG4gKi9cbmV4cG9ydCBjb25zdCBpbmplY3RIZWxwZXJzVG9Dc3NHZW5lcmF0b3JzID0gKFxuXHRoZWxwZXJzOiBPYmplY3QsXG5cdGdlbmVyYXRvcnM6IE9iamVjdFxuKSA9PiB7XG5cdE9iamVjdC52YWx1ZXMoZ2VuZXJhdG9ycykuZm9yRWFjaCgoZ2VuZXJhdG9yLCBpbmRleCkgPT4ge1xuXHRcdGdlbmVyYXRvci5mb3JFYWNoKChpdGVtKSA9PiB7XG5cdFx0XHRpZiAoJ2Z1bmN0aW9uJyA9PT0gaXRlbT8udHlwZSkge1xuXHRcdFx0XHRnZW5lcmF0b3JzW09iamVjdC5rZXlzKGdlbmVyYXRvcnMpW2luZGV4XV0gPSB7XG5cdFx0XHRcdFx0Li4uaXRlbSxcblx0XHRcdFx0XHRmdW5jdGlvbjogaGVscGVyc1tpdGVtLmZ1bmN0aW9uXSxcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSk7XG5cblx0cmV0dXJuIGdlbmVyYXRvcnM7XG59O1xuXG4vKipcbiAqIFJldHJpZXZlIGNvbXB1dGVkIGNzcyBydWxlcyB3aXRoIHVzYWdlIG9mIHJlZ2lzdGVyZWQgQ1NTIEdlbmVyYXRvcnMgcnVubmVyLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBibG9ja1R5cGUgVGhlIGN1cnJlbnQgYmxvY2sgdHlwZVxuICogQHBhcmFtIHsqfSBibG9ja1Byb3BzIFRoZSBjdXJyZW50IGJsb2NrIHByb3BlcnRpZXNcbiAqIEByZXR1cm4ge3N0cmluZ30gVGhlIGN1cnJlbnQgYmxvY2sgY3NzIG91dHB1dCBvZiBjc3MgZ2VuZXJhdG9ycyFcbiAqL1xuZXhwb3J0IGNvbnN0IGNvbXB1dGVkQ3NzUnVsZXMgPSAoXG5cdGJsb2NrVHlwZTogT2JqZWN0LFxuXHRibG9ja1Byb3BzOiBPYmplY3Rcbik6IHN0cmluZyA9PiB7XG5cdGxldCBjc3MgPSAnJztcblx0Y29uc3QgeyBwdWJsaXNoZXJDc3NHZW5lcmF0b3JzID0gW10gfSA9IGJsb2NrVHlwZTtcblxuXHRmb3IgKGNvbnN0IGNvbnRyb2xJZCBpbiBwdWJsaXNoZXJDc3NHZW5lcmF0b3JzKSB7XG5cdFx0aWYgKCFPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChwdWJsaXNoZXJDc3NHZW5lcmF0b3JzLCBjb250cm9sSWQpKSB7XG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cblx0XHRjb25zdCBnZW5lcmF0b3IgPSBwdWJsaXNoZXJDc3NHZW5lcmF0b3JzW2NvbnRyb2xJZF07XG5cblx0XHRpZiAoIWdlbmVyYXRvcj8udHlwZSkge1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXG5cdFx0Y29uc3QgY3NzR2VuZXJhdG9yID0gbmV3IENzc0dlbmVyYXRvcnMoXG5cdFx0XHRjb250cm9sSWQsXG5cdFx0XHRnZW5lcmF0b3IsXG5cdFx0XHRibG9ja1Byb3BzXG5cdFx0KTtcblxuXHRcdGNzcyArPSBjc3NHZW5lcmF0b3IucnVsZXMoKSArICdcXG4nO1xuXHR9XG5cblx0cmV0dXJuIGNzcztcbn07XG5cbi8qKlxuICogQ3JlYXRpbmcgQ1NTIFJ1bGUhXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHN0eWxlIFRoZSBzdHlsZSBvYmplY3RcbiAqIEByZXR1cm4ge3N0cmluZ30gVGhlIGNyZWF0ZWQgQ1NTIFJ1bGUhXG4gKi9cbmV4cG9ydCBjb25zdCBjcmVhdGVDc3NSdWxlID0gKHN0eWxlOiBPYmplY3QpOiBzdHJpbmcgPT4ge1xuXHRpZiAoIWhhc0FsbFByb3BlcnRpZXMoc3R5bGUsIFsnc2VsZWN0b3InLCAncHJvcGVydGllcyddKSkge1xuXHRcdGNvbnNvbGUud2Fybihcblx0XHRcdGBTdHlsZSBydWxlOiAlbyAke0pTT04uc3RyaW5naWZ5KHN0eWxlKX0gYXZvaWQgY3NzIHJ1bGUgdmFsaWRhdGlvbiFgXG5cdFx0KTtcblx0XHRyZXR1cm4gJyc7XG5cdH1cblxuXHRjb25zdCB7IHByb3BlcnRpZXMgPSBbXSwgc2VsZWN0b3IgPSAnJywgYmxvY2tQcm9wcyA9IHt9IH0gPSBzdHlsZTtcblxuXHRsZXQgc3R5bGVCb2R5ID0gW107XG5cdGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKTtcblx0Y29uc3QgbGFzdEtleUluZGV4ID0ga2V5cy5sZW5ndGggLSAxO1xuXG5cdGZvciAoY29uc3QgcHJvcGVydHkgaW4gcHJvcGVydGllcykge1xuXHRcdGlmICghT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwocHJvcGVydGllcywgcHJvcGVydHkpKSB7XG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cblx0XHRjb25zdCB2YWx1ZSA9IHByb3BlcnRpZXNbcHJvcGVydHldO1xuXG5cdFx0aWYgKCFpc1N0cmluZyh2YWx1ZSkpIHtcblx0XHRcdGNvbnNvbGUud2Fybihcblx0XHRcdFx0YENTUyBwcm9wZXJ0eSB2YWx1ZSBtdXN0IGJlIHN0cmluZyBnaXZlbiAke3R5cGVvZiB2YWx1ZX0sIHBsZWFzZSBkb3VibGUgY2hlY2sgcHJvcGVydGllcy5gXG5cdFx0XHQpO1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXG5cdFx0c3R5bGVCb2R5LnB1c2goXG5cdFx0XHRgJHtwcm9wZXJ0eX06ICR7dmFsdWV9JHstMSA9PT0gdmFsdWUuaW5kZXhPZignOycpID8gJztcXG4nIDogJ1xcbid9JHtcblx0XHRcdFx0bGFzdEtleUluZGV4ID09PSBrZXlzLmluZGV4T2YocHJvcGVydHkpID8gJ1xcbicgOiAnJ1xuXHRcdFx0fWBcblx0XHQpO1xuXHR9XG5cblx0c3R5bGVCb2R5ID0gc3R5bGVCb2R5LmpvaW4oJ1xcbicpO1xuXG5cdGlmICghYmxvY2tQcm9wcz8uYXR0cmlidXRlcykge1xuXHRcdHJldHVybiBgJHtzZWxlY3Rvcn17JHtzdHlsZUJvZHl9fWA7XG5cdH1cblxuXHRnZXRWYXJzKHN0eWxlQm9keSkuZm9yRWFjaCgocXVlcnkpID0+IHtcblx0XHRjb25zdCByZXBsYWNlbWVudCA9IHByZXBhcmUocXVlcnksIGJsb2NrUHJvcHM/LmF0dHJpYnV0ZXMpO1xuXG5cdFx0aWYgKCFyZXBsYWNlbWVudCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHN0eWxlQm9keSA9IHN0eWxlQm9keS5yZXBsYWNlKHF1ZXJ5LCByZXBsYWNlbWVudCkucmVwbGFjZSgvXFx7fFxcfS9nLCAnJyk7XG5cdH0pO1xuXG5cdHJldHVybiBgJHtzZWxlY3Rvcn17JHtzdHlsZUJvZHl9fWA7XG59O1xuXG4vKipcbiAqIFJldHJpZXZlIGR5bmFtaWMgdmFyaWFibGVzIGZyb20gcXVlcmllcyFcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gcXVlcmllcyBUaGUgcXVlcmllcyBhcyBzdHJpbmcuIEV4YW1wbGU6IFwie3t4LnlbMl0uen19IHt7eC5hfX1cIlxuICogQHJldHVybiB7QXJyYXk8c3RyaW5nPn0gVGhlIGR5bmFtaWMgdmFyaWFibGVzIGxpc3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFZhcnMocXVlcmllczogc3RyaW5nKTogQXJyYXk8c3RyaW5nPiB7XG5cdGNvbnN0IHJlZ2V4ID0gL3t7W157fV0rfX0vZ2k7XG5cdGNvbnN0IG1hdGNoZXMgPSBxdWVyaWVzLm1hdGNoQWxsKHJlZ2V4KTtcblx0Y29uc3QgcmVwbGFjZW1lbnRzID0gW107XG5cblx0Zm9yIChjb25zdCBtYXRjaCBvZiBtYXRjaGVzKSB7XG5cdFx0cmVwbGFjZW1lbnRzLnB1c2gobWF0Y2hbMF0ucmVwbGFjZSgvXFx7fFxcfS9nLCAnJykpO1xuXHR9XG5cblx0cmV0dXJuIHJlcGxhY2VtZW50cztcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gd2luZG93W1wibG9kYXNoXCJdOyIsImltcG9ydCB0b1Byb3BlcnR5S2V5IGZyb20gXCIuL3RvUHJvcGVydHlLZXkuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHtcbiAga2V5ID0gdG9Qcm9wZXJ0eUtleShrZXkpO1xuICBpZiAoa2V5IGluIG9iaikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgb2JqW2tleV0gPSB2YWx1ZTtcbiAgfVxuICByZXR1cm4gb2JqO1xufSIsImltcG9ydCBfdHlwZW9mIGZyb20gXCIuL3R5cGVvZi5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX3RvUHJpbWl0aXZlKGlucHV0LCBoaW50KSB7XG4gIGlmIChfdHlwZW9mKGlucHV0KSAhPT0gXCJvYmplY3RcIiB8fCBpbnB1dCA9PT0gbnVsbCkgcmV0dXJuIGlucHV0O1xuICB2YXIgcHJpbSA9IGlucHV0W1N5bWJvbC50b1ByaW1pdGl2ZV07XG4gIGlmIChwcmltICE9PSB1bmRlZmluZWQpIHtcbiAgICB2YXIgcmVzID0gcHJpbS5jYWxsKGlucHV0LCBoaW50IHx8IFwiZGVmYXVsdFwiKTtcbiAgICBpZiAoX3R5cGVvZihyZXMpICE9PSBcIm9iamVjdFwiKSByZXR1cm4gcmVzO1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJAQHRvUHJpbWl0aXZlIG11c3QgcmV0dXJuIGEgcHJpbWl0aXZlIHZhbHVlLlwiKTtcbiAgfVxuICByZXR1cm4gKGhpbnQgPT09IFwic3RyaW5nXCIgPyBTdHJpbmcgOiBOdW1iZXIpKGlucHV0KTtcbn0iLCJpbXBvcnQgX3R5cGVvZiBmcm9tIFwiLi90eXBlb2YuanNcIjtcbmltcG9ydCB0b1ByaW1pdGl2ZSBmcm9tIFwiLi90b1ByaW1pdGl2ZS5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX3RvUHJvcGVydHlLZXkoYXJnKSB7XG4gIHZhciBrZXkgPSB0b1ByaW1pdGl2ZShhcmcsIFwic3RyaW5nXCIpO1xuICByZXR1cm4gX3R5cGVvZihrZXkpID09PSBcInN5bWJvbFwiID8ga2V5IDogU3RyaW5nKGtleSk7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX3R5cGVvZihvYmopIHtcbiAgXCJAYmFiZWwvaGVscGVycyAtIHR5cGVvZlwiO1xuXG4gIHJldHVybiBfdHlwZW9mID0gXCJmdW5jdGlvblwiID09IHR5cGVvZiBTeW1ib2wgJiYgXCJzeW1ib2xcIiA9PSB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID8gZnVuY3Rpb24gKG9iaikge1xuICAgIHJldHVybiB0eXBlb2Ygb2JqO1xuICB9IDogZnVuY3Rpb24gKG9iaikge1xuICAgIHJldHVybiBvYmogJiYgXCJmdW5jdGlvblwiID09IHR5cGVvZiBTeW1ib2wgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7XG4gIH0sIF90eXBlb2Yob2JqKTtcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHRmdW5jdGlvbigpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcblx0XHRmdW5jdGlvbigpIHsgcmV0dXJuIG1vZHVsZTsgfTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIGRlZmluaXRpb24pIHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqLCBwcm9wKSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTsgfSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9wYWNrYWdlcy9zdHlsZS1lbmdpbmUvc3JjL2luZGV4LmpzXCIpO1xuIiwiIl0sIm5hbWVzIjpbInByZXBhcmUiLCJxdWVyeSIsImRhdGFzZXQiLCJwYXJzZWRRdWVyeSIsInNwbGl0IiwiaXRlbVZhbHVlIiwiX2xlbiIsImFyZ3VtZW50cyIsImxlbmd0aCIsInZhbHVlcyIsIkFycmF5IiwiX2tleSIsInJlZHVjZSIsImFjY3VtdWxhdG9yIiwicHJvcHMiLCJmb3JFYWNoIiwiaXRlbSIsImluZGV4IiwidG9BcnJheSIsImEiLCJ4IiwicmVnZXhwIiwidGVtcFZhbHVlIiwibSIsImV4ZWMiLCJsYXN0SW5kZXgiLCJtYXRjaCIsInJlcGxhY2UiLCJhcnIiLCJpbmRleE9mIiwiZGV0YWlscyIsIl9pdGVtIiwicHVzaCIsImNyZWF0ZUNzc1J1bGUiLCJjb21wdXRlZENzc1J1bGVzIiwiaW5qZWN0SGVscGVyc1RvQ3NzR2VuZXJhdG9ycyIsIkNzc0dlbmVyYXRvcnMiLCJjb25zdHJ1Y3RvciIsIm5hbWUiLCJfcmVmIiwiYmxvY2tQcm9wcyIsInR5cGUiLCJmdW5jdGlvbiIsImNhbGxiYWNrIiwic2VsZWN0b3IiLCJwcm9wZXJ0aWVzIiwiX2RlZmluZVByb3BlcnR5IiwiZ2V0UHJvcFZhbHVlIiwiYXR0cmlidXRlTmFtZSIsImF0dHJpYnV0ZXMiLCJydWxlcyIsImFkZFJ1bGUiLCJjaGFyQXQiLCJ0b1VwcGVyQ2FzZSIsInNsaWNlIiwic2V0VW5pcXVlQ2xhc3NOYW1lIiwiY2xpZW50SWQiLCJhZGRTdGF0aWNSdWxlIiwiYWRkRnVuY3Rpb25SdWxlIiwiaXNTdHJpbmciLCJoYXNBbGxQcm9wZXJ0aWVzIiwib2JqIiwiaSIsImhhc093blByb3BlcnR5IiwiaGVscGVycyIsImdlbmVyYXRvcnMiLCJPYmplY3QiLCJnZW5lcmF0b3IiLCJrZXlzIiwiYmxvY2tUeXBlIiwiY3NzIiwicHVibGlzaGVyQ3NzR2VuZXJhdG9ycyIsImNvbnRyb2xJZCIsImNhbGwiLCJjc3NHZW5lcmF0b3IiLCJzdHlsZSIsImNvbnNvbGUiLCJ3YXJuIiwiSlNPTiIsInN0cmluZ2lmeSIsInN0eWxlQm9keSIsImxhc3RLZXlJbmRleCIsInByb3BlcnR5IiwidmFsdWUiLCJqb2luIiwiZ2V0VmFycyIsInJlcGxhY2VtZW50IiwicXVlcmllcyIsInJlZ2V4IiwibWF0Y2hlcyIsIm1hdGNoQWxsIiwicmVwbGFjZW1lbnRzIl0sInNvdXJjZVJvb3QiOiIifQ==