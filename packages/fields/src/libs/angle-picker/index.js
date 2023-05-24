/**
 * Internal dependencies
 */
import helpers from './helpers';
import extension from './field.json';
import { AnglePickerControl } from '@publisher/controls';
import {
	injectHelpersToCssGenerators,
	computedCssRules,
} from '@publisher/style-engine';

export default {
	...extension,
	publisherCssGenerators: {
		...extension.publisherCssGenerators,
		...injectHelpersToCssGenerators(helpers, extension.cssGenerators),
	},
	Edit: ({ name, ...props }) => {
		return (
			<>
				<AnglePickerControl {...props} blockName={name} />
			</>
		);
	},
	Save: ({ blockType, attributes }) => {
		const { publisherAnglePicker } = attributes;

		if (!publisherAnglePicker) {
			return null;
		}

		const __css = computedCssRules(blockType, {
			attributes,
		});

		return (
			0 !== __css?.trim()?.length && (
				<style
					dangerouslySetInnerHTML={{
						__html: __css,
					}}
				/>
			)
		);
	},
};
