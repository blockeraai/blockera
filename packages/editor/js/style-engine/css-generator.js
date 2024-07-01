// @flow

/**
 * Internal dependencies
 */
import { createCssDeclarations } from './utils';
import type { DynamicStyleFunction } from './types';

export default class CssGenerator {
	name: string = '';
	options: Object = {};
	type: 'static' | 'dynamic' = 'static';
	properties: Object = {};
	blockProps: Object = {};
	function: DynamicStyleFunction = (): void => {};

	constructor(
		name: string,
		{ type, options, properties, function: callback }: Object,
		blockProps: Object
	) {
		this.name = name;
		this.type = type;
		this.function = callback;
		this.properties = properties;
		this.blockProps = blockProps;
		this.options = options || { important: false };
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
}
