/**
 * External dependencies
 */
import { useContext } from '@wordpress/element';
import { expect } from '@storybook/jest';
import {
	fireEvent,
	userEvent,
	waitFor,
	within,
} from '@storybook/testing-library';

/**
 * Publisher dependencies
 */
import { Flex } from '@publisher/components';
import { default as Decorators } from '@publisher/storybook/decorators';

/**
 * Internal dependencies
 */
import { AttributesControl } from '../../index';

const {
	WithInspectorStyles,
	StoryDataContext,
	WithStoryContextProvider,
	SharedDecorators,
} = Decorators;

export default {
	title: 'Controls/AttributesControl',
	component: AttributesControl,
	tags: ['autodocs'],
};

export const Empty = {
	args: {
		label: 'Attributes',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const Filled = {
	args: {
		label: 'Attributes',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="50px">
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Attributes<span>General</span>
					</h2>
					<AttributesControl
						{...args}
						label="Attributes"
						value={[
							{
								key: 'data-test',
								value: '#test',
								isVisible: true,
							},
							{
								key: 'aria-label',
								value: '#label',
								isVisible: true,
							},
							{
								key: 'lang',
								value: '#lang',
								isVisible: true,
							},
							{
								key: 'required',
								value: '#required',
								isVisible: true,
							},
							{
								key: 'custom',
								value: '#custom',
								isVisible: true,
							},
						]}
					/>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Attributes<span>A Tag</span>
					</h2>
					<AttributesControl
						{...args}
						label="Attributes"
						attributeElement="a"
						value={[
							{ key: 'rel', value: 'nofollow', isVisible: true },
							{
								key: 'target',
								value: '_blank',
								isVisible: true,
							},
							{
								key: 'hreflang',
								value: '#hreflang',
								isVisible: true,
							},
							{
								key: 'referrerpolicy',
								value: 'no-referrer',
								isVisible: true,
							},
						]}
					/>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Attributes<span>Button Tag</span>
					</h2>
					<AttributesControl
						{...args}
						label="Attributes"
						attributeElement="button"
						value={[
							{
								key: 'type',
								value: '#type',
								isVisible: true,
							},
						]}
					/>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Attributes<span>Ol Tag</span>
					</h2>
					<AttributesControl
						{...args}
						label="Attributes"
						attributeElement="ol"
						value={[
							{
								key: 'reversed',
								value: '#reversed',
								isVisible: true,
							},
							{
								key: 'start',
								value: '#start',
								isVisible: true,
							},
							{
								key: 'type',
								value: '#type',
								isVisible: true,
							},
						]}
					/>
				</Flex>
			</Flex>
		);
	},
};

export const Open = {
	args: {
		label: 'Attributes',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="50px">
				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '150px' }}
				>
					<h2 className="story-heading">
						Open<span>Custom</span>
					</h2>
					<AttributesControl
						{...args}
						value={[
							{
								key: 'custom',
								value: '#custom',
								isVisible: true,
								isOpen: true,
							},
						]}
					/>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '150px' }}
				>
					<h2 className="story-heading">
						Open<span>A Tag</span>
					</h2>
					<AttributesControl
						{...args}
						attributeElement="a"
						value={[
							{
								key: 'rel',
								value: 'nofollow',
								isVisible: true,
								isOpen: true,
							},
						]}
					/>
				</Flex>
			</Flex>
		);
	},
};

const ControlWithHooks = (args) => {
	const { storyValue, setStoryValue } = useContext(StoryDataContext);

	return (
		<AttributesControl
			{...args}
			onChange={setStoryValue}
			value={storyValue}
		/>
	);
};

export const PlayGeneral = {
	args: {
		label: 'Attributes',
		attributeElement: 'general',
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
		const button = canvas.getByLabelText('Add New');
		//
		await step('Story Data', async () => {
			await expect(currentValue).toBeInTheDocument();
			await expect(currentValue).toBeEmptyDOMElement();
		});

		await step('Click Add Button', async () => {
			await expect(button).toBeInTheDocument();

			await userEvent.click(button);
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'[ { "key": "", "value": "", "isVisible": true } ]'
					),
				{ timeout: 1000 }
			);
		});

		await step('Open Popover', async () => {
			await userEvent.click(canvas.getByLabelText('Item 1'));
		});

		await step('Change Input', async () => {
			const inputs = canvas.getAllByRole('textbox');

			await userEvent.type(inputs[0], 'custom attr{enter}');
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'[ { "key": "custom attr", "value": "", "isVisible": true } ]'
					),
				{ timeout: 2000 }
			);

			await userEvent.type(inputs[1], 'attr value{enter}');
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'[ { "key": "custom attr", "value": "attr value", "isVisible": true } ]'
					),
				{ timeout: 2000 }
			);
		});
	},
};
PlayGeneral.storyName = 'Play → General';

export const PlaySpecial = {
	args: {
		label: 'Attributes',
		attributeElement: 'a',
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
		const button = canvas.getByLabelText('Add New');
		//
		await step('Story Data', async () => {
			await expect(currentValue).toBeInTheDocument();
			await expect(currentValue).toBeEmptyDOMElement();
		});

		await step('Click Add Button', async () => {
			await expect(button).toBeInTheDocument();

			await userEvent.click(button);
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'[ { "key": "", "value": "", "isVisible": true } ]'
					),
				{ timeout: 1000 }
			);
		});

		await step('Open Popover', async () => {
			await userEvent.click(canvas.getByLabelText('Item 1'));
		});

		await step('Change Input', async () => {
			const select = canvas.getByRole('combobox', {});

			fireEvent.change(select, {
				target: { value: 'rel' },
			});

			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'[ { "key": "rel", "value": "", "isVisible": true } ]'
					),
				{ timeout: 2000 }
			);

			await expect(
				canvas.getAllByRole('combobox', {})[1]
			).toBeInTheDocument();

			fireEvent.change(canvas.getAllByRole('combobox', {})[1], {
				target: { value: 'next' },
			});

			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'[ { "key": "rel", "value": "next", "isVisible": true } ]'
					),
				{ timeout: 2000 }
			);
		});
	},
};
PlaySpecial.storyName = 'Play → Special';

export const Screenshot = {
	args: {},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: () => (
		<Flex direction="column" gap="50px">
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Empty</h2>
				<AttributesControl {...Empty.args} />
			</Flex>

			<Filled.render />

			<Open.render />
		</Flex>
	),
};
