/**
 * Publisher dependencies
 */
import { Flex } from '@publisher/components';

/**
 * Internal dependencies
 */
import { ColorControl } from '../../index';
import {
	decorators,
	inspectDecorator,
} from '../../../../../.storybook/preview';

export default {
	title: 'Controls/ColorControl',
	component: ColorControl,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		defaultValue: '',
		value: '',
	},
	decorators: [inspectDecorator, ...decorators],
};

export const _ColorControl = {
	args: {
		defaultValue: '',
		value: '',
	},
	decorators: [inspectDecorator, ...decorators],
	render: (args) => (
		<>
			<h2 className="story-heading">Normal Color Control</h2>
			<Flex direction="column" gap="20px">
				<ColorControl {...args} value="" />
				<ColorControl {...args} value="#eeeeee" />
				<ColorControl {...args} value="#0947eb" />
				<ColorControl
					{...args}
					value="#0945EB91"
					style={{ width: '100px' }}
				/>
				<ColorControl {...args} value="#0947eb" contentAlign="center" />
			</Flex>

			<h2 className="story-heading">Minimal Color Control</h2>
			<Flex direction="column" gap="20px">
				<ColorControl {...args} value="" type="minimal" />
				<ColorControl {...args} value="#eeeeee" type="minimal" />
				<ColorControl {...args} value="#0947eb" type="minimal" />
			</Flex>
		</>
	),
};
