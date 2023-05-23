var publisher;
/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
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
/*!**********************************************!*\
  !*** ./packages/data-extractor/src/index.js ***!
  \**********************************************/
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
(publisher = typeof publisher === "undefined" ? {} : publisher).dataExtractor = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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cGFjazovL3B1Ymxpc2hlci93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vcHVibGlzaGVyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vcHVibGlzaGVyL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vcHVibGlzaGVyLy4vcGFja2FnZXMvZGF0YS1leHRyYWN0b3Ivc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIFRoZSByZXF1aXJlIHNjb3BlXG52YXIgX193ZWJwYWNrX3JlcXVpcmVfXyA9IHt9O1xuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBkZWZpbml0aW9uKSB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iaiwgcHJvcCkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7IH0iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImV4cG9ydCBmdW5jdGlvbiBwcmVwYXJlKHF1ZXJ5OiBzdHJpbmcsIGRhdGFzZXQ6IE9iamVjdCk6IEFycmF5PHN0cmluZz4ge1xuXHRjb25zdCBwYXJzZWRRdWVyeSA9IHF1ZXJ5LnNwbGl0KCcuJyk7XG5cdGNvbnN0IGl0ZW1WYWx1ZSA9ICguLi52YWx1ZXMpID0+IHZhbHVlcy5yZWR1Y2UoYWNjdW11bGF0b3IsIGRhdGFzZXQpO1xuXG5cdGxldCBwcm9wcyA9IFtdO1xuXG5cdHBhcnNlZFF1ZXJ5LmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XG5cdFx0cHJvcHMgPSB0b0FycmF5KGl0ZW0sIGluZGV4LCBwcm9wcyk7XG5cdH0pO1xuXG5cdHJldHVybiBpdGVtVmFsdWUoLi4ucHJvcHMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWNjdW11bGF0b3IoYSwgeCkge1xuXHRjb25zdCByZWdleHAgPSAvXFxbLipcXF0vZ2k7XG5cdGxldCB0ZW1wVmFsdWUgPSBhW3hdO1xuXHRsZXQgbTtcblxuXHR3aGlsZSAoKG0gPSByZWdleHAuZXhlYyh4KSkgIT09IG51bGwpIHtcblx0XHQvLyBUaGlzIGlzIG5lY2Vzc2FyeSB0byBhdm9pZCBpbmZpbml0ZSBsb29wcyB3aXRoIHplcm8td2lkdGggbWF0Y2hlc1xuXHRcdGlmIChtLmluZGV4ID09PSByZWdleHAubGFzdEluZGV4KSB7XG5cdFx0XHRyZWdleHAubGFzdEluZGV4Kys7XG5cdFx0fVxuXG5cdFx0Ly8gVGhlIHJlc3VsdCBjYW4gYmUgYWNjZXNzZWQgdGhyb3VnaCB0aGUgYG1gLXZhcmlhYmxlLlxuXHRcdG0uZm9yRWFjaCgobWF0Y2gpID0+IHtcblx0XHRcdG1hdGNoWzBdID0gbWF0Y2hbMF0ucmVwbGFjZSgvXFxbfFxcXS9nLCAnJyk7XG5cblx0XHRcdHRlbXBWYWx1ZSA9IHRlbXBWYWx1ZVttYXRjaFswXV07XG5cdFx0fSk7XG5cdH1cblxuXHRyZXR1cm4gdGVtcFZhbHVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9BcnJheShpdGVtLCBpbmRleCwgYXJyKSB7XG5cdGlmICgtMSAhPT0gaXRlbS5pbmRleE9mKCdbJykpIHtcblx0XHRjb25zdCBkZXRhaWxzID0gaXRlbS5zcGxpdCgnWycpO1xuXG5cdFx0ZGV0YWlscy5mb3JFYWNoKChfaXRlbSkgPT4ge1xuXHRcdFx0YXJyLnB1c2goX2l0ZW0ucmVwbGFjZSgvXFxbfFxcXS9nLCAnJykpO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIGFycjtcblx0fVxuXG5cdGFyci5wdXNoKGl0ZW0ucmVwbGFjZSgvXFxbfFxcXS9nLCAnJykpO1xuXG5cdHJldHVybiBhcnI7XG59XG4iXSwibmFtZXMiOlsicHJlcGFyZSIsInF1ZXJ5IiwiZGF0YXNldCIsInBhcnNlZFF1ZXJ5Iiwic3BsaXQiLCJpdGVtVmFsdWUiLCJfbGVuIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwidmFsdWVzIiwiQXJyYXkiLCJfa2V5IiwicmVkdWNlIiwiYWNjdW11bGF0b3IiLCJwcm9wcyIsImZvckVhY2giLCJpdGVtIiwiaW5kZXgiLCJ0b0FycmF5IiwiYSIsIngiLCJyZWdleHAiLCJ0ZW1wVmFsdWUiLCJtIiwiZXhlYyIsImxhc3RJbmRleCIsIm1hdGNoIiwicmVwbGFjZSIsImFyciIsImluZGV4T2YiLCJkZXRhaWxzIiwiX2l0ZW0iLCJwdXNoIl0sInNvdXJjZVJvb3QiOiIifQ==