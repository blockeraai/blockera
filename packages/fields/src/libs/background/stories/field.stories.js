/**
 * Internal dependencies
 */
import { BackgroundField } from '../field';
import { BlockEditContext, extensionConfig } from '@publisher/extensions';
import { useState } from '@wordpress/element';
import {
	decorators,
	inspectDecorator,
} from '../../../../../../.storybook/preview';

const _value = {
	publisherBackground: [],
};

export default {
	title: 'Fields/Background',
	component: BackgroundField,
	tags: ['autodocs'],
};

const WithMockBlockEditContext = (story) => {
	const [value, setValue] = useState(_value);

	return (
		<BlockEditContext.Provider
			value={{
				attributes: value,
				setAttributes: setValue,
			}}
		>
			{story()}
		</BlockEditContext.Provider>
	);
};

export const Default = {
	args: {
		config: extensionConfig,
		attribute: 'publisherBackground',
		label: 'Background Field',
		className: 'publisher-background-field',
	},
	decorators: [WithMockBlockEditContext, inspectDecorator, ...decorators],
};
