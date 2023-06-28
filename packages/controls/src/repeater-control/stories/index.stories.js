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
import BaseControl from '../../base';
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

export const EmptyRepeater = {
	args: {
		label: 'Repeater',
		repeaterItemChildren: () => <p>hi</p>,
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

function CustomRepeaterItemChildren({ itemId, item }) {
	const { changeItem } = useContext(RepeaterContext);

	return (
		<BaseControl id={`repeater-item-${itemId}`}>
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
		</BaseControl>
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

export const Custom = {
	args: {
		label: 'Repeater',
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
				name: 'Doste Akbat',
				isVisible: false,
				__className: 'is-hovered is-open',
			},
		],
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const CustomHeader = {
	args: {
		...Custom.args,
		...{
			repeaterItemHeader: CustomRepeaterItemHeader,
		},
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const MaxItems = {
	args: {
		...Custom.args,
		...{
			repeaterItemHeader: CustomRepeaterItemHeader,
			maxItems: 5,
		},
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const MinItems = {
	args: {
		...Custom.args,
		...{
			repeaterItemHeader: CustomRepeaterItemHeader,
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

export const Play = {
	args: {
		...CustomHeader.args,
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
				name: 'Doste Akbat',
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
						'[ { "name": "Akbar", "isVisible": true }, { "name": "Akbar Ali", "isVisible": true }, { "name": "Akbar Shah", "isVisible": true }, { "name": "Akbarollah", "isVisible": true }, { "name": "Doste Akbat", "isVisible": true } ]'
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
						'[ { "name": "Akbar", "isVisible": true }, { "name": "Akbar Ali", "isVisible": true }, { "name": "Akbar Shah", "isVisible": true }, { "name": "Akbarollah", "isVisible": true }, { "name": "Doste Akbat", "isVisible": true }, { "name": "", "isVisible": true } ]'
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
						'[ { "name": "Akbar", "isVisible": true }, { "name": "Akbar Ali", "isVisible": true }, { "name": "Akbar Shah", "isVisible": true }, { "name": "Akbarollah", "isVisible": true }, { "name": "Doste Akbat", "isVisible": true }, { "name": "New Akbar", "isVisible": true } ]'
					),
				{ timeout: 1000 }
			);
		});

		await step('Delete New Item', async () => {
			await expect(canvas.getByLabelText('Delete 6')).toBeInTheDocument();
			fireEvent.mouseOver(
				canvas
					.getByLabelText('Item 6')
					.closest('.publisher-control-group-header')
			);
			await userEvent.click(canvas.getByLabelText('Delete 6'));
		});
	},
};

export const Screenshot = {
	args: {},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: () => (
		<Flex direction="column" gap="50px">
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Empty Repeater</h2>
				<RepeaterControl {...EmptyRepeater.args} />
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Custom Repeater</h2>
				<RepeaterControl {...Custom.args} />
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Customized Header Repeater</h2>
				<RepeaterControl {...CustomHeader.args} />
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Max Items → 5</h2>
				<RepeaterControl {...MaxItems.args} />
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Min Items → 5</h2>
				<RepeaterControl {...MinItems.args} />
			</Flex>
		</Flex>
	),
};
