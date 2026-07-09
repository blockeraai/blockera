/**
 * External dependencies
 */

/**
 * Blockera dependencies
 */
import { default as Decorators } from '@blockera/dev-storybook/js/decorators';

/**
 * Internal dependencies
 */
import { Flex, AnglePickerControl } from '../../index';
import { ControlContextProvider } from '../../../context';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import ControlWithHooks from '../../../../../../.storybook/components/control-with-hooks';
import { nanoid } from 'nanoid';

const { WithInspectorStyles, SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Controls/AnglePickerControl',
	component: AnglePickerControl,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		value: 25,
		rotateButtons: false,
	},
	render: (args) => (
		<Flex direction="column" gap="15px">
			<h2 className="story-heading">With Rotate Button</h2>
			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks Control={AnglePickerControl} {...args} />
			</ControlContextProvider>
		</Flex>
	),
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const NoButtons = {
	args: {
		value: 25,
		rotateButtons: false,
	},
	render: (args) => (
		<Flex direction="column" gap="15px">
			<h2 className="story-heading">Without Rotate Button</h2>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks Control={AnglePickerControl} {...args} />
			</ControlContextProvider>
		</Flex>
	),
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const Field = {
	args: {
		label: 'Angle Picker',
		value: 45,
		rotateButtons: true,
	},
	render: (args) => (
		<Flex direction="column" gap="15px">
			<h2 className="story-heading">With Field</h2>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks Control={AnglePickerControl} {...args} />
			</ControlContextProvider>
		</Flex>
	),
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const All = {
	args: {},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: () => (
		<Flex direction="column" gap="50px">
			<Default.render {...Default.args} />

			<NoButtons.render {...NoButtons.args} />

			<Field.render {...Field.args} />
		</Flex>
	),
};
