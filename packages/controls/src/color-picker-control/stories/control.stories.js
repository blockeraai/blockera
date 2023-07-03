/**
 * External dependencies
 */
import { useContext } from '@wordpress/element';
import { fireEvent, waitFor, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

/**
 * Publisher dependencies
 */
import { Flex } from '@publisher/components';
import { default as Decorators } from '@publisher/storybook/decorators';

/**
 * Internal dependencies
 */
import { ColorPickerControl } from '../../index';
import { WithPlaygroundStyles } from '../../../../../.storybook/preview';

const {
	WithInspectorStyles,
	WithPopoverDataProvider,
	SharedDecorators,
	StoryDataContext,
	WithStoryContextProvider,
} = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Controls/ColorPickerControl',
	component: ColorPickerControl,
	tags: ['autodocs'],
};

export const PopoverPicker = {
	args: {
		defaultValue: '',
		value: '',
		isOpen: true,
	},
	decorators: [
		WithInspectorStyles,
		WithPopoverDataProvider,
		...SharedDecorators,
	],
};

export const WithoutPopover = {
	args: {
		defaultValue: '',
		value: '#0947eb',
	},
	decorators: [
		WithInspectorStyles,
		WithPopoverDataProvider,
		...SharedDecorators,
	],
	render: (args) => (
		<Flex direction="column" gap="15px">
			<h2 className="story-heading">
				ColorPicker<span>Without Popover</span>
			</h2>
			<ColorPickerControl {...args} isPopover={false} />
		</Flex>
	),
};

const ControlWithHooks = (args) => {
	const { storyValue, setStoryValue } = useContext(StoryDataContext);

	return (
		<ColorPickerControl
			{...args}
			onChange={setStoryValue}
			value={storyValue}
		/>
	);
};

export const Play = {
	args: {
		value: '',
		isOpen: true,
	},
	decorators: [
		WithStoryContextProvider,
		WithInspectorStyles,
		...SharedDecorators,
	],
	render: (args) => <ControlWithHooks {...args} />,
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		const currentValue = canvas.getByTestId('current-value');

		await step('Story Data', async () => {
			await expect(currentValue).toBeInTheDocument();
		});

		await step('Change Color Input', async () => {
			await expect(canvas.getByRole('textbox')).toBeInTheDocument();
			fireEvent.change(canvas.getByRole('textbox'), {
				target: { value: '0947eb' },
			});
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent('"#0947eb"'),
				{ timeout: 1000 }
			);
		});
	},
};

export const Screenshot = {
	args: {},
	decorators: [
		WithInspectorStyles,
		WithPopoverDataProvider,
		...SharedDecorators,
	],
	render: () => (
		<Flex direction="column" gap="50px">
			<Flex
				direction="column"
				gap="15px"
				style={{ marginBottom: '500px' }}
			>
				<h2 className="story-heading">Popover Color Picker</h2>
				<ColorPickerControl {...PopoverPicker.args} />
			</Flex>

			<WithoutPopover.render />
		</Flex>
	),
};
