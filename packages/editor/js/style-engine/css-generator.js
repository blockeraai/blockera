// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { createCssDeclarations } from './utils';
import type { DynamicStyleFunction } from './types';
import { isInnerBlock, isNormalState } from '../extensions/components/utils';
export default class CssGenerator {
	name: string = '';
	options: Object = {};
	type: 'static' | 'dynamic' = 'static';
	properties: Object = {};
	blockProps: Object = {};
	pickedSelector: string = '';
	function: DynamicStyleFunction = (): void => {};

	constructor(
		name: string,
		{ type, options, properties, function: callback }: Object,
		blockProps: Object,
		pickedSelector: string
	) {
		this.name = name;
		this.type = type;
		this.function = callback;
		this.properties = properties;
		this.blockProps = blockProps;
		this.options = options || { important: false };
		this.pickedSelector = pickedSelector;
	}

	getPropValue(attributeName: string): string {
		const { attributes } = this.blockProps;

		return attributeName
			? attributes[attributeName] || attributes
			: attributes;
	}

	rules(): string {
		const addRule = `add${
			this.type.charAt(0).toUpperCase() + this.type.slice(1)
		}Rule`;

		// $FlowFixMe
		if (!this[addRule]) {
			return '';
		}

		this.setupStyleEngineOptions();

		// $FlowFixMe
		return this[addRule]();
	}

	convertToCssSelector(cssClasses: string): string {
		if (!cssClasses) {
			return '';
		}

		return `.${cssClasses.replace(/\s+/g, '.')}`;
	}

	addStaticRule(): string {
		// $FlowFixMe
		return createCssDeclarations({
			options: this.options,
			properties: this.properties,
		});
	}

	addFunctionRule(): string | void {
		if (!this.getPropValue(this.name)) {
			return '';
		}

		// $FlowFixMe
		return this.function(this.name, this.blockProps, this);
	}

	setupStyleEngineOptions(): void {
		const { blockName: name, clientId } = this.blockProps;
		const {
			getActiveInnerState,
			getActiveMasterState,
			getExtensionCurrentBlock,
			getExtensionInnerBlockState,
			getExtensionCurrentBlockState,
		} = select('blockera/extensions');

		const currentBlock = getExtensionCurrentBlock();
		const innerState = getActiveInnerState(clientId, currentBlock);
		const masterState = getActiveMasterState(clientId, name);

		if (
			!isNormalState(masterState) &&
			!isInnerBlock(currentBlock) &&
			!this.pickedSelector.includes(masterState) &&
			getExtensionCurrentBlockState() !== masterState
		) {
			window.blockeraStyleEngineOptions = {
				importantMark: false,
			};
		}

		if (
			isNormalState(innerState) &&
			isInnerBlock(currentBlock) &&
			!this.pickedSelector.includes(innerState) &&
			getExtensionInnerBlockState() !== innerState
		) {
			window.blockeraStyleEngineOptions = {
				importantMark: false,
			};
		}
	}
}
