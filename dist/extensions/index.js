/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
var publisher;
/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./packages/classnames/src/index.js":
/*!******************************************!*\
  !*** ./packages/classnames/src/index.js ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"componentClassNames\": function() { return /* binding */ componentClassNames; },\n/* harmony export */   \"controlClassNames\": function() { return /* binding */ controlClassNames; },\n/* harmony export */   \"extensionClassNames\": function() { return /* binding */ extensionClassNames; },\n/* harmony export */   \"getClassNames\": function() { return /* binding */ getClassNames; }\n/* harmony export */ });\n/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ \"./node_modules/classnames/index.js\");\n/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _defaults_root_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./defaults/root.json */ \"./packages/classnames/src/defaults/root.json\");\n/* harmony import */ var _defaults_controls_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./defaults/controls.json */ \"./packages/classnames/src/defaults/controls.json\");\n/* harmony import */ var _defaults_components_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./defaults/components.json */ \"./packages/classnames/src/defaults/components.json\");\n/* harmony import */ var _defaults_extensions_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./defaults/extensions.json */ \"./packages/classnames/src/defaults/extensions.json\");\n/**\n * External dependencies\n */\n\n\n/**\n * Internal dependencies\n */\n\n\n\n\nfunction getClassNames() {\n  for (var _len = arguments.length, names = new Array(_len), _key = 0; _key < _len; _key++) {\n    names[_key] = arguments[_key];\n  }\n  return classnames__WEBPACK_IMPORTED_MODULE_0___default()(_defaults_root_json__WEBPACK_IMPORTED_MODULE_1__, names);\n}\nfunction controlClassNames() {\n  for (var _len2 = arguments.length, names = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {\n    names[_key2] = arguments[_key2];\n  }\n  return classnames__WEBPACK_IMPORTED_MODULE_0___default()(_defaults_controls_json__WEBPACK_IMPORTED_MODULE_2__, names);\n}\nfunction componentClassNames() {\n  for (var _len3 = arguments.length, names = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {\n    names[_key3] = arguments[_key3];\n  }\n  return classnames__WEBPACK_IMPORTED_MODULE_0___default()(_defaults_components_json__WEBPACK_IMPORTED_MODULE_3__, names);\n}\nfunction extensionClassNames() {\n  for (var _len4 = arguments.length, names = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {\n    names[_key4] = arguments[_key4];\n  }\n  return classnames__WEBPACK_IMPORTED_MODULE_0___default()(_defaults_extensions_json__WEBPACK_IMPORTED_MODULE_4__, names);\n}\n\n//# sourceURL=webpack://publisher/./packages/classnames/src/index.js?");

/***/ }),

/***/ "./packages/extensions/src/index.js":
/*!******************************************!*\
  !*** ./packages/extensions/src/index.js ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ activateExtensions; }\n/* harmony export */ });\n/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/hooks */ \"@wordpress/hooks\");\n/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _wrappers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./wrappers */ \"./packages/extensions/src/wrappers/block-attributes.js\");\n/* harmony import */ var _wrappers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./wrappers */ \"./packages/extensions/src/wrappers/block-controls.js\");\n/* harmony import */ var _wrappers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./wrappers */ \"./packages/extensions/src/wrappers/editor-props.js\");\n/* harmony import */ var _wrappers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./wrappers */ \"./packages/extensions/src/wrappers/save-props.js\");\n/* harmony import */ var _wrappers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./wrappers */ \"./packages/extensions/src/wrappers/save-element.js\");\n/**\n * WordPress dependencies\n */\n\n\n/**\n * Internal dependencies\n */\n\nfunction activateExtensions() {\n  (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__.addFilter)('blocks.registerBlockType', 'publisher/core/extensions/withAdvancedControlsAttributes', _wrappers__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\n  (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__.addFilter)('editor.BlockEdit', 'publisher/core/extensions/withAdvancedBlockEditControls', _wrappers__WEBPACK_IMPORTED_MODULE_2__[\"default\"]);\n  (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__.addFilter)('editor.BlockListBlock', 'publisher/core/extensions/withAppliedEditorProps', _wrappers__WEBPACK_IMPORTED_MODULE_3__[\"default\"]);\n  (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__.addFilter)('blocks.getSaveContent.extraProps', 'publisher/core/extensions/withAppliedExtraSaveProps', _wrappers__WEBPACK_IMPORTED_MODULE_4__[\"default\"]);\n  (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__.addFilter)('blocks.getSaveElement', 'publisher/core/extensions/withAppliedCustomizeSaveElement', _wrappers__WEBPACK_IMPORTED_MODULE_5__[\"default\"]);\n}\n\n//# sourceURL=webpack://publisher/./packages/extensions/src/index.js?");

/***/ }),

/***/ "./packages/extensions/src/wrappers/block-attributes.js":
/*!**************************************************************!*\
  !*** ./packages/extensions/src/wrappers/block-attributes.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ withBlockAttributes; }\n/* harmony export */ });\n/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/hooks */ \"@wordpress/hooks\");\n/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ \"./packages/extensions/src/wrappers/utils.js\");\n/**\r\n * WordPress dependencies\r\n */\n\n\n/**\r\n * Internal dependencies\r\n */\n\n\n/**\r\n * Filters registered block settings, extending attributes with settings and block name.\r\n *\r\n * @param {Object} settings Original block settings.\r\n * @param {string} name block id or name.\r\n * @return {Object} Filtered block settings.\r\n */\nfunction withBlockAttributes(settings, name) {\n  /**\r\n   * Allowed Block Types in Publisher Extensions Setup\r\n   */\n  const allowedBlockTypes = (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__.applyFilters)('publisher.core.extensions.allowedBlockTypes', []);\n  if (!allowedBlockTypes.includes(name)) {\n    return settings;\n  }\n  const callbacks = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getBlockEditorProp)(name);\n  const {\n    blockAttributes\n  } = callbacks;\n  if ('function' !== typeof blockAttributes) {\n    return settings;\n  }\n  return blockAttributes(settings, name);\n}\n\n//# sourceURL=webpack://publisher/./packages/extensions/src/wrappers/block-attributes.js?");

/***/ }),

/***/ "./packages/extensions/src/wrappers/block-controls.js":
/*!************************************************************!*\
  !*** ./packages/extensions/src/wrappers/block-controls.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ \"./node_modules/@babel/runtime/helpers/esm/extends.js\");\n/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ \"@wordpress/element\");\n/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/hooks */ \"@wordpress/hooks\");\n/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/compose */ \"@wordpress/compose\");\n/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils */ \"./packages/extensions/src/wrappers/utils.js\");\n/* harmony import */ var _publisher_classnames__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @publisher/classnames */ \"./packages/classnames/src/index.js\");\n\n\n/**\n * WordPress dependencies\n */\n\n\n\n\n/**\n * Internal dependencies\n */\n\n\n\n/**\n * Add custom Publisher Extensions attributes to selected blocks\n *\n * @param {Object} props Block props\n * @param {Object} allowedBlockTypes Allowed Block Types\n * @return {{}|Object} Block props extended with Publisher Extensions attributes.\n */\nconst useAttributes = (props, allowedBlockTypes) => {\n  const {\n    name: blockName\n  } = props;\n  const extendedProps = {\n    ...props\n  };\n  if (allowedBlockTypes.includes(blockName)) {\n    extendedProps.attributes.publisherAttributes = extendedProps.attributes.publisherAttributes || {};\n    if (typeof extendedProps.attributes.publisherAttributes.id === 'undefined') {\n      const d = new Date();\n      extendedProps.attributes.publisherAttributes = Object.assign({}, extendedProps.attributes.publisherAttributes, {\n        id: '' + d.getMonth() + d.getDate() + d.getHours() + d.getMinutes() + d.getSeconds() + d.getMilliseconds()\n      });\n    }\n  }\n  return extendedProps;\n};\n\n/**\n * Add custom publisher extensions controls to selected blocks\n *\n * @param {Function} BlockEdit Original component.\n * @return {string} Wrapped component.\n */\nconst withBlockControls = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_3__.createHigherOrderComponent)(BlockEdit => {\n  return blockProps => {\n    /**\n     * Allowed Block Types in Publisher Extensions Setup\n     */\n    const allowedBlockTypes = (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_2__.applyFilters)('publisher.core.extensions.allowedBlockTypes', []);\n    const {\n      name\n    } = blockProps;\n    const props = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => {\n      return {\n        ...useAttributes(blockProps, allowedBlockTypes)\n      };\n    }, [blockProps, allowedBlockTypes]);\n    const blockEditRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useRef)();\n    if (!allowedBlockTypes.includes(name)) {\n      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(BlockEdit, props);\n    }\n    const callbacks = (0,_utils__WEBPACK_IMPORTED_MODULE_5__.getBlockEditorProp)(name);\n    const {\n      sideEffect,\n      blockControls\n    } = callbacks;\n    (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {\n      if (!sideEffect) {\n        return;\n      }\n      sideEffect(blockEditRef, props);\n    }, [blockEditRef, props, sideEffect]);\n    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(BlockEdit, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({}, props, {\n      className: (0,_publisher_classnames__WEBPACK_IMPORTED_MODULE_4__.extensionClassNames)('block-edit-extension-ref', `client-id-${props.clientId}`, props.className)\n    })), 'function' === typeof blockControls && blockControls(name, props));\n  };\n}, 'withAllNeedsControls');\n/* harmony default export */ __webpack_exports__[\"default\"] = (withBlockControls);\n\n//# sourceURL=webpack://publisher/./packages/extensions/src/wrappers/block-controls.js?");

/***/ }),

/***/ "./packages/extensions/src/wrappers/deprecated.js":
/*!********************************************************!*\
  !*** ./packages/extensions/src/wrappers/deprecated.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ deprecateAllFeatures; }\n/* harmony export */ });\n/**\r\n * Handle deprecate all features.\r\n *\r\n * Block deprecations should run in a useEffect so as to\r\n * respect the React component lifecycle and avoid errors.\r\n *\r\n * TODO: param {Object} props\r\n *\r\n * @since 1.0.0\r\n * @return {void}\r\n */\nfunction deprecateAllFeatures() {\n  //TODO: Implements Block deprecation logic belongs here.\n}\n\n//# sourceURL=webpack://publisher/./packages/extensions/src/wrappers/deprecated.js?");

/***/ }),

/***/ "./packages/extensions/src/wrappers/editor-props.js":
/*!**********************************************************!*\
  !*** ./packages/extensions/src/wrappers/editor-props.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ \"./node_modules/@babel/runtime/helpers/esm/extends.js\");\n/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ \"@wordpress/element\");\n/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/hooks */ \"@wordpress/hooks\");\n/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/compose */ \"@wordpress/compose\");\n/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! classnames */ \"./node_modules/classnames/index.js\");\n/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _deprecated__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./deprecated */ \"./packages/extensions/src/wrappers/deprecated.js\");\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils */ \"./packages/extensions/src/wrappers/utils.js\");\n\n\n/**\r\n * WordPress dependencies\r\n */\n\n\n\n/**\r\n * External dependencies\r\n */\n\n\n/**\r\n * Internal dependencies\r\n */\n\n\n\n/**\r\n * React hook function to override the default block element to add wrapper props.\r\n *\r\n * @function addEditorBlockAttributes\r\n * @param {Object} BlockListBlock Block and its wrapper in the editor.\r\n * @return {Object} BlockListBlock extended\r\n */\nconst withEditorProps = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_3__.createHigherOrderComponent)(BlockListBlock => {\n  return (0,_utils__WEBPACK_IMPORTED_MODULE_5__.enhance)(_ref => {\n    let {\n      select,\n      ...props\n    } = _ref;\n    /**\r\n     * Allowed Block Types in Publisher Extensions Setup\r\n     */\n    const allowedBlockTypes = (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_2__.applyFilters)('publisher.core.extensions.allowedBlockTypes', []);\n    if (!allowedBlockTypes.includes(props?.name)) {\n      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(BlockListBlock, props);\n    }\n    const blockEditorStore = 'core/block-editor';\n\n    /**\r\n     * Block deprecation logic belongs here.\r\n     *\r\n     * By keeping this logic as an extension it allows us to remove a great deal of superfluous code.\r\n     * These deprecations would otherwise need to be applied on each respective block in the edit.js function.\r\n     */\n    (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => (0,_deprecated__WEBPACK_IMPORTED_MODULE_6__[\"default\"])(props), [props]);\n\n    /**\r\n     * Some controls must use the parent blocks like for\r\n     * galleries but others will use children like buttonControls\r\n     */\n    const parentBlock = select(blockEditorStore).getBlock(props.rootClientId || props.clientId);\n    const parentBlockName = select(blockEditorStore).getBlockName(props.rootClientId || props.clientId);\n    // const childBlock = select(blockEditorStore).getBlock(props.clientId);\n    // const childBlockName = select(blockEditorStore).getBlockName(\n    // \tprops.clientId\n    // );\n\n    /**\r\n     * Group extensions in an array to minimize code duplication and\r\n     * allow a source of truth for all applied extensions.\r\n     */\n    const callbacks = (0,_utils__WEBPACK_IMPORTED_MODULE_5__.getBlockEditorProp)(props?.name);\n    const {\n      editorProps\n    } = callbacks;\n    if ('function' !== typeof editorProps) {\n      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(BlockListBlock, props);\n    }\n    const everyExtension = editorProps({\n      block: parentBlock,\n      blockName: parentBlockName,\n      wrapperProps: props.wrapperProps\n    });\n\n    /**\r\n     * Merge classes from all extensions.\r\n     */\n    const mergeClasses = classnames__WEBPACK_IMPORTED_MODULE_4___default()(...everyExtension.map(extendedProps => extendedProps?.className));\n\n    /**\r\n     * @function mergeProps Merge props from all extensions.\r\n     * @return {Object} The merged props from all extensions\r\n     */\n    const mergeProps = () => {\n      let mergedProps = {};\n\n      /**\r\n       * Be aware of overriding existing props with matching properties names when adding new extensions.\r\n       * Classes are a known collision point and must be merged separately.\r\n       */\n      everyExtension.forEach(extendedProps => {\n        mergedProps = {\n          ...mergedProps,\n          ...extendedProps\n        };\n      });\n\n      // Classnames collide due to matching property names. We delete them here and merge them separately.\n      delete mergedProps.className;\n      return mergedProps;\n    };\n\n    /**\r\n     * Extended wrapperProps applied to BlockListBlock.\r\n     * wrapperProps would be element attributes in the DOM\r\n     * such as `[data-p-blocks-align-support: 1]` but should not contain the className.\r\n     */\n    const wrapperProps = {\n      ...mergeProps()\n    };\n    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(BlockListBlock, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({}, props, {\n      className: mergeClasses,\n      wrapperProps: wrapperProps\n    }));\n  });\n}, 'withAllNeedsEditorProps');\n/* harmony default export */ __webpack_exports__[\"default\"] = (withEditorProps);\n\n//# sourceURL=webpack://publisher/./packages/extensions/src/wrappers/editor-props.js?");

/***/ }),

/***/ "./packages/extensions/src/wrappers/save-element.js":
/*!**********************************************************!*\
  !*** ./packages/extensions/src/wrappers/save-element.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/hooks */ \"@wordpress/hooks\");\n/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ \"./packages/extensions/src/wrappers/utils.js\");\n/**\n * WordPress dependencies\n */\n\n\n/**\n * Internal dependencies\n */\n\nconst withCustomizeSaveElement = (element, blockType, attributes) => {\n  if (!element) {\n    return;\n  }\n\n  /**\n   * Allowed Block Types in Publisher Extensions Setup\n   */\n  const allowedBlockTypes = (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__.applyFilters)('publisher.core.extensions.allowedBlockTypes', []);\n  if (!allowedBlockTypes.includes(blockType?.name)) {\n    return element;\n  }\n  const callbacks = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getBlockEditorProp)(blockType?.name);\n  const {\n    saveElement\n  } = callbacks;\n  if ('function' !== typeof saveElement) {\n    return element;\n  }\n  return saveElement({\n    element,\n    blockType,\n    attributes\n  });\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = (withCustomizeSaveElement);\n\n//# sourceURL=webpack://publisher/./packages/extensions/src/wrappers/save-element.js?");

/***/ }),

/***/ "./packages/extensions/src/wrappers/save-props.js":
/*!********************************************************!*\
  !*** ./packages/extensions/src/wrappers/save-props.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/hooks */ \"@wordpress/hooks\");\n/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ \"./packages/extensions/src/wrappers/utils.js\");\n/**\r\n * WordPress dependencies\r\n */\n\n\n/**\r\n * Internal dependencies\r\n */\n\n\n/**\r\n * Override props assigned to save component to inject attributes\r\n *\r\n * @param {Object} extraProps Additional props applied to save element.\r\n * @param {Object} blockType  Block type.\r\n * @param {Object} attributes Current block attributes.\r\n * @return {Object} Filtered props applied to save element.\r\n */\nfunction withSaveProps(extraProps, blockType, attributes) {\n  /**\r\n   * Allowed Block Types in Publisher Extensions Setup\r\n   */\n  const allowedBlockTypes = (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__.applyFilters)('publisher.core.extensions.allowedBlockTypes', []);\n  if (!allowedBlockTypes.includes(blockType?.name)) {\n    return extraProps;\n  }\n  const callbacks = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getBlockEditorProp)(blockType?.name);\n  const {\n    extraProps: _extraProps\n  } = callbacks;\n  if ('function' !== typeof _extraProps) {\n    return extraProps;\n  }\n  return _extraProps({\n    extraProps,\n    blockType,\n    attributes\n  });\n}\n/* harmony default export */ __webpack_exports__[\"default\"] = (withSaveProps);\n\n//# sourceURL=webpack://publisher/./packages/extensions/src/wrappers/save-props.js?");

/***/ }),

/***/ "./packages/extensions/src/wrappers/utils.js":
/*!***************************************************!*\
  !*** ./packages/extensions/src/wrappers/utils.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"enhance\": function() { return /* binding */ enhance; },\n/* harmony export */   \"getBlockEditorProp\": function() { return /* binding */ getBlockEditorProp; },\n/* harmony export */   \"getCurrentBlockId\": function() { return /* binding */ getCurrentBlockId; },\n/* harmony export */   \"ucFirstWord\": function() { return /* binding */ ucFirstWord; }\n/* harmony export */ });\n/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/compose */ \"@wordpress/compose\");\n/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ \"@wordpress/data\");\n/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/hooks */ \"@wordpress/hooks\");\n/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_2__);\n/**\r\n * WordPress dependencies\r\n */\n\n\n\nfunction ucFirstWord(word) {\n  return word.charAt(0).toUpperCase() + word.slice(1);\n}\n\n/**\r\n * Retrieve the current block Id.\r\n *\r\n * @param {string} name\r\n * @return {string} return the blockId as string\r\n */\nconst getCurrentBlockId = name => ucFirstWord(name.replace('core/', ''));\nconst enhance = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_0__.compose)(\n/**\r\n * @param {Function} WrappedBlockEdit A filtered BlockEdit instance.\r\n * @return {Function} Enhanced component with merged state data props.\r\n */\n(0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.withSelect)(select => {\n  const CORE_BLOCK_EDITOR = 'core/block-editor';\n  return {\n    getBlocks: select(CORE_BLOCK_EDITOR).getBlocks,\n    select,\n    selected: select(CORE_BLOCK_EDITOR).getSelectedBlock()\n  };\n}));\nfunction getBlockEditorProp(blockName) {\n  /**\r\n   * BlockEditor callbacks in Publisher Extensions Setup\r\n   */\n  const blockEditorCallbacks = (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_2__.applyFilters)('publisher.core.extensions.blockEditorCallbacks', {});\n  if (!blockEditorCallbacks[getCurrentBlockId(blockName)]) {\n    return {};\n  }\n  return blockEditorCallbacks[getCurrentBlockId(blockName)];\n}\n\n//# sourceURL=webpack://publisher/./packages/extensions/src/wrappers/utils.js?");

/***/ }),

/***/ "./node_modules/classnames/index.js":
/*!******************************************!*\
  !*** ./node_modules/classnames/index.js ***!
  \******************************************/
/***/ (function(module, exports) {

eval("var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!\n\tCopyright (c) 2018 Jed Watson.\n\tLicensed under the MIT License (MIT), see\n\thttp://jedwatson.github.io/classnames\n*/\n/* global define */\n\n(function () {\n\t'use strict';\n\n\tvar hasOwn = {}.hasOwnProperty;\n\tvar nativeCodeString = '[native code]';\n\n\tfunction classNames() {\n\t\tvar classes = [];\n\n\t\tfor (var i = 0; i < arguments.length; i++) {\n\t\t\tvar arg = arguments[i];\n\t\t\tif (!arg) continue;\n\n\t\t\tvar argType = typeof arg;\n\n\t\t\tif (argType === 'string' || argType === 'number') {\n\t\t\t\tclasses.push(arg);\n\t\t\t} else if (Array.isArray(arg)) {\n\t\t\t\tif (arg.length) {\n\t\t\t\t\tvar inner = classNames.apply(null, arg);\n\t\t\t\t\tif (inner) {\n\t\t\t\t\t\tclasses.push(inner);\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t} else if (argType === 'object') {\n\t\t\t\tif (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {\n\t\t\t\t\tclasses.push(arg.toString());\n\t\t\t\t\tcontinue;\n\t\t\t\t}\n\n\t\t\t\tfor (var key in arg) {\n\t\t\t\t\tif (hasOwn.call(arg, key) && arg[key]) {\n\t\t\t\t\t\tclasses.push(key);\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\n\t\treturn classes.join(' ');\n\t}\n\n\tif ( true && module.exports) {\n\t\tclassNames.default = classNames;\n\t\tmodule.exports = classNames;\n\t} else if (true) {\n\t\t// register as 'classnames', consistent with npm package name\n\t\t!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {\n\t\t\treturn classNames;\n\t\t}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),\n\t\t__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));\n\t} else {}\n}());\n\n\n//# sourceURL=webpack://publisher/./node_modules/classnames/index.js?");

/***/ }),

/***/ "@wordpress/compose":
/*!*********************************!*\
  !*** external ["wp","compose"] ***!
  \*********************************/
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["compose"];

/***/ }),

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["data"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/hooks":
/*!*******************************!*\
  !*** external ["wp","hooks"] ***!
  \*******************************/
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["hooks"];

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/extends.js":
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/extends.js ***!
  \************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ _extends; }\n/* harmony export */ });\nfunction _extends() {\n  _extends = Object.assign ? Object.assign.bind() : function (target) {\n    for (var i = 1; i < arguments.length; i++) {\n      var source = arguments[i];\n      for (var key in source) {\n        if (Object.prototype.hasOwnProperty.call(source, key)) {\n          target[key] = source[key];\n        }\n      }\n    }\n    return target;\n  };\n  return _extends.apply(this, arguments);\n}\n\n//# sourceURL=webpack://publisher/./node_modules/@babel/runtime/helpers/esm/extends.js?");

/***/ }),

/***/ "./packages/classnames/src/defaults/components.json":
/*!**********************************************************!*\
  !*** ./packages/classnames/src/defaults/components.json ***!
  \**********************************************************/
/***/ (function(module) {

"use strict";
eval("module.exports = JSON.parse('{\"publisher-core\":true,\"component\":true}');\n\n//# sourceURL=webpack://publisher/./packages/classnames/src/defaults/components.json?");

/***/ }),

/***/ "./packages/classnames/src/defaults/controls.json":
/*!********************************************************!*\
  !*** ./packages/classnames/src/defaults/controls.json ***!
  \********************************************************/
/***/ (function(module) {

"use strict";
eval("module.exports = JSON.parse('{\"publisher-core\":true,\"control\":true}');\n\n//# sourceURL=webpack://publisher/./packages/classnames/src/defaults/controls.json?");

/***/ }),

/***/ "./packages/classnames/src/defaults/extensions.json":
/*!**********************************************************!*\
  !*** ./packages/classnames/src/defaults/extensions.json ***!
  \**********************************************************/
/***/ (function(module) {

"use strict";
eval("module.exports = JSON.parse('{\"publisher-core\":true,\"extension\":true}');\n\n//# sourceURL=webpack://publisher/./packages/classnames/src/defaults/extensions.json?");

/***/ }),

/***/ "./packages/classnames/src/defaults/root.json":
/*!****************************************************!*\
  !*** ./packages/classnames/src/defaults/root.json ***!
  \****************************************************/
/***/ (function(module) {

"use strict";
eval("module.exports = JSON.parse('{\"publisher-core\":true}');\n\n//# sourceURL=webpack://publisher/./packages/classnames/src/defaults/root.json?");

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
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./packages/extensions/src/index.js");
/******/ 	(publisher = typeof publisher === "undefined" ? {} : publisher).extensions = __webpack_exports__;
/******/ 	
/******/ })()
;