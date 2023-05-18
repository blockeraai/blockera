import { createCssRule } from './utils';

export {
	createCssRule,
	computedCssRules,
	injectHelpersToCssGenerators,
} from './utils';

export default class CssGenerators {
	name = '';
	selector = '';
	type = 'static';
	properties = {};
	blockProps = {};
	function = () => {};

	constructor(
		name: string,
		{ type, function: callback, selector, properties }: Object,
		blockProps: Object
	) {
		this.name = name;
		this.type = type;
		this.selector = selector;
		this.function = callback;
		this.properties = properties;
		this.blockProps = blockProps;
	}

	getPropValue(attributeName: string) {
		const { attributes } = this.blockProps;

		return attributeName
			? attributes[attributeName] || attributes
			: attributes;
	}

	rules(): string {
		const addRule = `add${
			this.type.charAt(0).toUpperCase() + this.type.slice(1)
		}Rule`;

		if (!this[addRule]) {
			return '';
		}

		return this[addRule]();
	}

	setUniqueClassName() {
		this.selector = this.selector.replace(
			/\.{{BLOCK_ID}}/g,
			`.publisher-core.extension.publisher-extension-ref.client-id-${this.blockProps?.clientId}`
		);
	}

	addStaticRule() {
		this.setUniqueClassName();

		return createCssRule(this);
	}

	addFunctionRule(): string {
		if (!this.getPropValue(this.name)) {
			return '';
		}

		return this.function(this.name, this.blockProps, this);
	}
}
