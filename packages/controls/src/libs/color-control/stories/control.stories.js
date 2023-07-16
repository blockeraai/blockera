/**
 * External dependencies
 */
import { useContext } from '@wordpress/element';
import {
	fireEvent,
	userEvent,
	waitFor,
	within,
} from '@storybook/testing-library';
import { expect } from '@storybook/jest';

/**
 * Publisher dependencies
 */
import { Flex } from '@publisher/components';
import { default as Decorators } from '@publisher/storybook/decorators';

/**
 * Internal dependencies
 */
import { ColorControl } from '../../index';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';

const {
	WithInspectorStyles,
	WithPopoverDataProvider,
	SharedDecorators,
	StoryDataContext,
	WithStoryContextProvider,
} = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

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
	decorators: [
		WithInspectorStyles,
		WithPopoverDataProvider,
		...SharedDecorators,
	],
};

export const Normal = {
	args: {
		defaultValue: '',
		value: '',
	},
	decorators: [
		WithInspectorStyles,
		WithPopoverDataProvider,
		...SharedDecorators,
	],
	render: (args) => (
		<Flex direction="column" gap="15px">
			<h2 className="story-heading">Normal Color Control</h2>
			<ColorControl {...args} value="" placement={'left-start'} />
			<ColorControl {...args} value="#eeeeee" />
			<ColorControl {...args} value="#0947eb" />
			<ColorControl
				{...args}
				value="#0945EB91"
				style={{ width: '100px' }}
			/>
			<ColorControl {...args} value="#0947eb" contentAlign="center" />
		</Flex>
	),
};

export const Minimal = {
	args: {
		defaultValue: '',
		value: '',
	},
	decorators: [
		WithInspectorStyles,
		WithPopoverDataProvider,
		...SharedDecorators,
	],
	render: (args) => (
		<Flex direction="column" gap="20px">
			<h2 className="story-heading">Minimal Color Control</h2>
			<ColorControl {...args} value="" type="minimal" />
			<ColorControl {...args} value="#eeeeee" type="minimal" />
			<ColorControl {...args} value="#0947eb" type="minimal" />
		</Flex>
	),
};

const ControlWithHooks = (args) => {
	const { storyValue, setStoryValue } = useContext(StoryDataContext);

	return (
		<ColorControl {...args} onChange={setStoryValue} value={storyValue} />
	);
};

export const Play = {
	args: {
		value: '#0947eb',
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
		const button = canvas.getByRole('button', {});

		await step('Story Data', async () => {
			await expect(currentValue).toBeInTheDocument();
		});

		await step('Check Initial State', async () => {
			await expect(button).toBeInTheDocument();
			await expect(currentValue).toHaveTextContent('"#0947eb"');
		});

		await step('Change Color', async () => {
			await userEvent.click(button);

			const input = canvas.getByRole('textbox');

			// element shown inside popover
			await expect(input).toBeInTheDocument();

			fireEvent.change(input, { target: { value: '00B703' } });
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent('"#00b703"'),
				{ timeout: 1000 }
			);
		});
	},
};

export const Screenshot = {
	args: {
		defaultValue: '10px',
		value: '20px',
	},
	decorators: [
		WithInspectorStyles,
		WithPopoverDataProvider,
		...SharedDecorators,
	],
	render: () => (
		<Flex direction="column" gap="50px">
			<Normal.render {...Normal.args} />

			<Minimal.render {...Minimal.args} />
		</Flex>
	),
};
