export class CssGenerators {
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

	getPublisherAttribute(attributeName: string) {
		const {
			attributes: { publisherAttributes },
		} = this.blockProps;

		return attributeName
			? publisherAttributes[attributeName] || publisherAttributes
			: publisherAttributes;
	}

	rules(): string {
		const handler = `handle${
			this.type.charAt(0).toUpperCase() + this.type.slice(1)
		}Type`;

		if (!this[handler]) {
			return '';
		}

		return this[handler]();
	}

	cssProps(): string {
		const output = [];

		this.properties.map((prop) => {
			Object.keys(prop).forEach((item, index) => {
				let value = Object.values(prop)[index];

				if (-1 === value.indexOf(',')) {
					value = this.removeReplacements(
						value,
						this.getPublisherAttribute(this.name)[0]
					);
				} else {
					//FIXME: Refactor
					value.split(',').forEach((v, i) => {
						value = value.replace(
							v,
							this.removeReplacements(
								v,
								this.getPublisherAttribute(this.name)[i]
							)
						);
					});
				}

				value = -1 !== value.indexOf(';') ? value : `${value};`;

				output.push(`${item}: ${value}`);
			});
		});

		return output.join('\n');
	}

	removeReplacements(value: string, targetAttribute: Object): string {
		const regex = /{\w+}/gi;
		const matches = value.matchAll(regex);

		for (const match of matches) {
			const _match = match[0]
				.replace('{', '')
				.replace('}', '')
				.toLowerCase();

			value = value.replace(match[0], targetAttribute[_match]);
		}

		return value;
	}

	getDynamicSelector() {
		this.selector = this.selector.replace(
			/\.{BLOCK_ID}/g,
			`.publisher-core.extension.publisher-extension-ref.client-id-${this.blockProps?.clientId}`
		);

		return this.selector;
	}

	handleStaticType() {
		return `${this.getDynamicSelector()}{
					${this.cssProps()}
				}`;
	}

	handleFunctionType(): string {
		if (!this.getPublisherAttribute(this.name)) {
			return '';
		}

		return this.function(this.name, this.blockProps, this);
	}
}
