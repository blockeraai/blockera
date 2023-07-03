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
import { RepeaterControl } from '../../index';
import { RepeaterContext } from '../context';
import { InputField } from '@publisher/fields';
import { __, sprintf } from '@wordpress/i18n';
import { controlInnerClassNames } from '@publisher/classnames';
import { default as InheritIcon } from './icons/inherit';

const {
	WithInspectorStyles,
	StoryDataContext,
	WithStoryContextProvider,
	SharedDecorators,
} = Decorators;

export default {
	title: 'Controls/RepeaterControl',
	component: RepeaterControl,
	tags: ['autodocs'],
};

export const EmptyPopover = {
	args: {
		label: 'Items',
		repeaterItemChildren: () => <p>hi</p>,
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

function CustomRepeaterItemChildren({ itemId, item }) {
	const { changeItem } = useContext(RepeaterContext);

	return (
		<div id={`repeater-item-${itemId}`}>
			<InputField
				label={__('Name', 'publisher-core')}
				settings={{
					type: 'text',
				}}
				value={item.name}
				onChange={(value) =>
					changeItem(itemId, { ...item, name: value })
				}
			/>
		</div>
	);
}

function CustomRepeaterItemHeader({
	item: { name },
	itemId,
	isOpen,
	setOpen,
	children,
	isOpenPopoverEvent,
}) {
	return (
		<div
			className={controlInnerClassNames('repeater-group-header')}
			onClick={(event) => isOpenPopoverEvent(event) && setOpen(!isOpen)}
			aria-label={sprintf(
				// translators: it's the aria label for repeater item
				__('Item %d', 'publisher-core'),
				itemId + 1
			)}
		>
			<span className={controlInnerClassNames('header-icon')}>
				<InheritIcon />
			</span>

			<span className={controlInnerClassNames('header-label')}>Name</span>

			<span className={controlInnerClassNames('header-values')}>
				{name}
			</span>

			{children}
		</div>
	);
}

export const FilledPopover = {
	args: {
		label: 'Items',
		defaultRepeaterItemValue: {
			name: '',
			isVisible: true,
		},
		repeaterItemChildren: CustomRepeaterItemChildren,
		value: [
			{
				name: 'Akbar',
				isVisible: true,
			},
			{
				name: 'Akbar Ali',
				isVisible: true,
			},
			{
				name: 'Akbar Shah',
				isVisible: true,
				__className: 'is-hovered',
			},
			{
				name: 'Akbarollah',
				isVisible: false,
			},
			{
				name: 'Doste Akbar',
				isVisible: false,
				__className: 'is-hovered is-open',
			},
		],
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const CustomHeaderPopover = {
	args: {
		...FilledPopover.args,
		...{
			repeaterItemHeader: CustomRepeaterItemHeader,
			injectHeaderButtonsStart: '👉',
			injectHeaderButtonsEnd: '👈',
		},
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const MaxItems = {
	args: {
		...FilledPopover.args,
		...{
			repeaterItemHeader: CustomRepeaterItemHeader,
			maxItems: 5,
		},
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const MinItems = {
	args: {
		...FilledPopover.args,
		...{
			repeaterItemHeader: CustomRepeaterItemHeader,
			minItems: 5,
		},
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const OpenItemPopover = {
	args: {
		...FilledPopover.args,
		...{
			value: [
				{
					name: 'Akbar',
					isVisible: true,
				},
				{
					name: 'Akbar Ali',
					isVisible: true,
				},
				{
					name: 'Akbar Shah',
					isVisible: true,
					isOpen: true,
				},
			],
			minItems: 5,
		},
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

const ControlWithHooks = (args) => {
	const { storyValue, setStoryValue } = useContext(StoryDataContext);

	return (
		<RepeaterControl
			{...args}
			onChange={setStoryValue}
			value={storyValue}
		/>
	);
};

export const FilledAccordion = {
	args: {
		...FilledPopover.args,
		...{
			repeaterItemHeader: CustomRepeaterItemHeader,
			mode: 'accordion',
		},
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const OpenItemAccordion = {
	args: {
		...FilledPopover.args,
		...{
			value: [
				{
					name: 'Akbar',
					isVisible: true,
				},
				{
					name: 'Akbar Ali',
					isVisible: true,
				},
				{
					name: 'Akbar Shah',
					isVisible: true,
					isOpen: true,
				},
			],
			mode: 'accordion',
		},
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const Play = {
	args: {
		...CustomHeaderPopover.args,
		value: [
			{
				name: 'Akbar',
				isVisible: true,
			},
			{
				name: 'Akbar Ali',
				isVisible: true,
			},
			{
				name: 'Akbar Shah',
				isVisible: true,
			},
			{
				name: 'Akbarollah',
				isVisible: true,
			},
			{
				name: 'Doste Akbar',
				isVisible: true,
			},
		],
		minItems: 3,
		maxItems: 6,
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

		await step('Test Initialise Data', async () => {
			await expect(currentValue).toBeInTheDocument();
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'[ { "name": "Akbar", "isVisible": true }, { "name": "Akbar Ali", "isVisible": true }, { "name": "Akbar Shah", "isVisible": true }, { "name": "Akbarollah", "isVisible": true }, { "name": "Doste Akbar", "isVisible": true } ]'
					),
				{ timeout: 1000 }
			);
		});

		await step('Add New Item', async () => {
			// add new item
			await userEvent.click(button);
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'[ { "name": "Akbar", "isVisible": true }, { "name": "Akbar Ali", "isVisible": true }, { "name": "Akbar Shah", "isVisible": true }, { "name": "Akbarollah", "isVisible": true }, { "name": "Doste Akbar", "isVisible": true }, { "name": "", "isVisible": true } ]'
					),
				{ timeout: 1000 }
			);

			await expect(canvas.getByLabelText('Item 6')).toBeInTheDocument();

			// open popover
			await userEvent.click(canvas.getByLabelText('Item 6'));

			// find input and change
			await expect(
				canvas.getByRole('textbox', { type: 'text' })
			).toBeInTheDocument();

			fireEvent.change(canvas.getByRole('textbox', { type: 'text' }), {
				target: { value: 'New Akbar' },
			});

			await expect(
				canvas.getByRole('textbox', { type: 'text' })
			).toHaveValue('New Akbar');

			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'[ { "name": "Akbar", "isVisible": true }, { "name": "Akbar Ali", "isVisible": true }, { "name": "Akbar Shah", "isVisible": true }, { "name": "Akbarollah", "isVisible": true }, { "name": "Doste Akbar", "isVisible": true }, { "name": "New Akbar", "isVisible": true } ]'
					),
				{ timeout: 1000 }
			);
		});

		await step('Delete New Item', async () => {
			await expect(canvas.getByLabelText('Delete 6')).toBeInTheDocument();

			await userEvent.click(canvas.getByLabelText('Delete 6'));

			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'[ { "name": "Akbar", "isVisible": true }, { "name": "Akbar Ali", "isVisible": true }, { "name": "Akbar Shah", "isVisible": true }, { "name": "Akbarollah", "isVisible": true }, { "name": "Doste Akbar", "isVisible": true } ]'
					),
				{ timeout: 1000 }
			);
		});

		await step('Disable Last Item', async () => {
			await expect(
				canvas.getByLabelText('Disable 5')
			).toBeInTheDocument();

			await userEvent.click(canvas.getByLabelText('Disable 5'));

			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'[ { "name": "Akbar", "isVisible": true }, { "name": "Akbar Ali", "isVisible": true }, { "name": "Akbar Shah", "isVisible": true }, { "name": "Akbarollah", "isVisible": true }, { "name": "Doste Akbar", "isVisible": false } ]'
					),
				{ timeout: 1000 }
			);

			await userEvent.click(canvas.getByLabelText('Enable 5'));

			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'[ { "name": "Akbar", "isVisible": true }, { "name": "Akbar Ali", "isVisible": true }, { "name": "Akbar Shah", "isVisible": true }, { "name": "Akbarollah", "isVisible": true }, { "name": "Doste Akbar", "isVisible": true } ]'
					),
				{ timeout: 1000 }
			);
		});

		await step('Clone Item', async () => {
			await expect(canvas.getByLabelText('Clone 4')).toBeInTheDocument();

			await userEvent.click(canvas.getByLabelText('Clone 4'));

			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'[ { "name": "Akbar", "isVisible": true }, { "name": "Akbar Ali", "isVisible": true }, { "name": "Akbar Shah", "isVisible": true }, { "name": "Akbarollah", "isVisible": true }, { "name": "Akbarollah", "isVisible": true }, { "name": "Doste Akbar", "isVisible": true } ]'
					),
				{ timeout: 1000 }
			);
		});

		await step(
			'Try to add new item but max items count is exceeded',
			async () => {
				// add new item
				await userEvent.click(button);
				await waitFor(
					async () =>
						await expect(currentValue).toHaveTextContent(
							'[ { "name": "Akbar", "isVisible": true }, { "name": "Akbar Ali", "isVisible": true }, { "name": "Akbar Shah", "isVisible": true }, { "name": "Akbarollah", "isVisible": true }, { "name": "Akbarollah", "isVisible": true }, { "name": "Doste Akbar", "isVisible": true } ]'
						),
					{ timeout: 1000 }
				);
			}
		);

		await step('Remove 3 Items', async () => {
			await expect(canvas.getByLabelText('Delete 6')).toBeInTheDocument();
			await userEvent.click(canvas.getByLabelText('Delete 6'));

			await expect(canvas.getByLabelText('Delete 5')).toBeInTheDocument();
			await userEvent.click(canvas.getByLabelText('Delete 5'));

			await expect(canvas.getByLabelText('Delete 4')).toBeInTheDocument();
			await userEvent.click(canvas.getByLabelText('Delete 4'));

			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'[ { "name": "Akbar", "isVisible": true }, { "name": "Akbar Ali", "isVisible": true }, { "name": "Akbar Shah", "isVisible": true } ]'
					),
				{ timeout: 1000 }
			);
		});

		await step('Try delete 1 more item', async () => {
			await expect(
				canvas.queryByLabelText('Delete 3')
			).not.toBeInTheDocument();
		});
	},
};

export const Screenshot = {
	args: {},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: () => (
		<Flex direction="column" gap="50px">
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">
					Popover Repeater<span>Empty</span>
				</h2>
				<RepeaterControl {...EmptyPopover.args} />
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">
					Popover Repeater<span>Filled</span>
				</h2>
				<RepeaterControl {...FilledPopover.args} />
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">
					Popover Repeater<span>Custom Header</span>
				</h2>
				<RepeaterControl {...CustomHeaderPopover.args} />
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">
					Popover Repeater<span>Max 5 Items</span>
				</h2>
				<RepeaterControl {...MaxItems.args} />
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">
					Popover Repeater<span>Min 5 Items</span>
				</h2>
				<RepeaterControl {...MinItems.args} />
			</Flex>

			<Flex
				direction="column"
				gap="15px"
				style={{ marginBottom: '100px' }}
			>
				<h2 className="story-heading">
					Popover Repeater<span>Open Item</span>
				</h2>
				<RepeaterControl {...OpenItemPopover.args} />
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">
					Accordion Repeater<span>Filled</span>
				</h2>
				<RepeaterControl {...FilledAccordion.args} />
			</Flex>

			<Flex
				direction="column"
				gap="15px"
				style={{ marginBottom: '150px' }}
			>
				<h2 className="story-heading">
					Accordion Repeater<span>Open Item</span>
				</h2>
				<RepeaterControl {...OpenItemAccordion.args} />
			</Flex>
		</Flex>
	),
};
