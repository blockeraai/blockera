// @flow

/**
 * Internal dependencies
 */
import { createCssRule } from './utils';
import type { DynamicStyleFunction } from './types';

export default class CssGenerator {
	name: string = '';
	options: Object = {};
	media: string = '';
	selector: string = '';
	type: 'static' | 'dynamic' = 'static';
	properties: Object = {};
	blockProps: Object = {};
	function: DynamicStyleFunction = (): void => {};

	constructor(
		name: string,
		{
			type,
			media,
			options,
			selector,
			properties,
			function: callback,
		}: Object,
		blockProps: Object
	) {
		this.name = name;
		this.type = type;
		this.media = media;
		this.options = options || { important: false };
		this.selector = selector;
		this.function = callback;
		this.properties = properties;
		this.blockProps = blockProps;
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

	setUniqueClassName() {
		if (!this.selector) {
			return;
		}

		this.selector = this.selector
			.replace(/\.{{BLOCK_ID}}/g, `#block-${this.blockProps?.clientId}`)
			.replace(
				/\.{{className}}/g,
				`.${this.convertToCssSelector(
					this.blockProps.attributes.className
				)}`
			);
	}

	addStaticRule(): string {
		this.setUniqueClassName();

		// $FlowFixMe
		return createCssRule(this);
	}

	addFunctionRule(): string | void {
		if (!this.getPropValue(this.name)) {
			return '';
		}

		this.setUniqueClassName();

		// $FlowFixMe
		return this.function(this.name, this.blockProps, this);
	}
}
