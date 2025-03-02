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
import { isNormalState } from '../extensions/components/utils';

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

		const { blockName: name, clientId, state } = this.blockProps;
		const {
			getActiveInnerState,
			getActiveMasterState,
			getExtensionCurrentBlock,
		} = select('blockera/extensions');

		const currentBlock = getExtensionCurrentBlock();
		const innerState = getActiveInnerState(clientId, currentBlock);
		const masterState = getActiveMasterState(clientId, name);

		const options = this.options;

		if (
			isNormalState(state) &&
			(!isNormalState(masterState) || !isNormalState(innerState))
		) {
			options.important = this.pickedSelector.includes(`:${state}`);
		}

		// $FlowFixMe
		return this[addRule](options);
	}

	convertToCssSelector(cssClasses: string): string {
		if (!cssClasses) {
			return '';
		}

		return `.${cssClasses.replace(/\s+/g, '.')}`;
	}

	addStaticRule(options: Object): string {
		// $FlowFixMe
		return createCssDeclarations({
			options,
			properties: this.properties,
		});
	}

	addFunctionRule(options: Object): string | void {
		if (!this.getPropValue(this.name)) {
			return '';
		}

		// $FlowFixMe
		return this.function(this.name, this.blockProps, options);
	}
}
