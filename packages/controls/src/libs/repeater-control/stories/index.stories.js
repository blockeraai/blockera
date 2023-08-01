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
import { __, sprintf } from '@wordpress/i18n';
import { nanoid } from 'nanoid';

/**
 * Publisher dependencies
 */
import { Flex } from '@publisher/components';
import { default as Decorators } from '@publisher/storybook/decorators';
import { controlInnerClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { InputControl, RepeaterControl } from '../../index';
import { STORE_NAME } from '../store';
import { RepeaterContext } from '../context';
import { ControlContextProvider, useControlContext } from '../../../context';
import { default as InheritIcon } from './icons/inherit';
import ControlWithHooks from '../../../../../../.storybook/components/control-with-hooks';
import { WithControlDataProvider } from '../../../../../../.storybook/decorators/with-control-data-provider';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';

const {
	WithInspectorStyles,
	WithStoryContextProvider,
	WithPopoverDataProvider,
	SharedDecorators,
} = Decorators;

SharedDecorators.push(WithPopoverDataProvider);
SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Controls/RepeaterControl',
	component: RepeaterControl,
	tags: ['autodocs'],
};

export const PopoverEmpty = {
	args: {
		label: 'Items',
		repeaterItemChildren: () => <p>hi</p>,
		storeName: STORE_NAME,
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex
				direction="column"
				gap="20px"
				style={{ marginBottom: '100px' }}
			>
				<h2 className="story-heading">
					Repeater<span>Popover → Empty</span>
				</h2>
				<ControlContextProvider
					storeName={STORE_NAME}
					value={{
						name: nanoid(),
						value: [],
					}}
				>
					<ControlWithHooks
						Control={RepeaterControl}
						{...args}
						label="Repeater"
					/>
				</ControlContextProvider>
			</Flex>
		);
	},
};
PopoverEmpty.storyName = 'Popover → Empty';

function CustomRepeaterItemChildren({ itemId, item }) {
	const {
		controlInfo: { name: controlId },
		dispatch: { changeRepeaterItem },
	} = useControlContext();

	const { repeaterId, getControlId } = useContext(RepeaterContext);

	return (
		<div id={`repeater-item-${itemId}`}>
			<InputControl
				id={getControlId(itemId, 'name')}
				type="text"
				label={__('Name', 'publisher-core')}
				onChange={(value) =>
					changeRepeaterItem({
						controlId,
						repeaterId,
						itemId,
						value: { ...item, name: value },
					})
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

export const PopoverFilled = {
	args: {
		label: 'Items',
		defaultRepeaterItemValue: {
			name: '',
			isVisible: true,
		},
		repeaterItemChildren: CustomRepeaterItemChildren,
		storeName: STORE_NAME,
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex
				direction="column"
				gap="20px"
				style={{ marginBottom: '100px' }}
			>
				<h2 className="story-heading">
					Repeater<span>Popover → Filled</span>
				</h2>
				<ControlContextProvider
					storeName={STORE_NAME}
					value={{
						name: nanoid(),
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
					}}
				>
					<ControlWithHooks
						Control={RepeaterControl}
						{...args}
						label="Repeater"
					/>
				</ControlContextProvider>
			</Flex>
		);
	},
};
PopoverFilled.storyName = 'Popover → Filled';

export const PopoverCustomHeader = {
	args: {
		...PopoverFilled.args,
		...{
			repeaterItemHeader: CustomRepeaterItemHeader,
			injectHeaderButtonsStart: '👉',
			injectHeaderButtonsEnd: '👈',
		},
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex
				direction="column"
				gap="20px"
				style={{ marginBottom: '100px' }}
			>
				<h2 className="story-heading">
					Repeater<span>Popover → Custom Header</span>
				</h2>
				<ControlContextProvider
					storeName={STORE_NAME}
					value={{
						name: nanoid(),
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
					}}
				>
					<ControlWithHooks
						Control={RepeaterControl}
						{...args}
						label="Repeater"
					/>
				</ControlContextProvider>
			</Flex>
		);
	},
};
PopoverCustomHeader.storyName = 'Popover → Custom Header';

export const PopoverMaxItems = {
	args: {
		...PopoverFilled.args,
		...{
			repeaterItemHeader: CustomRepeaterItemHeader,
			maxItems: 5,
		},
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex
				direction="column"
				gap="20px"
				style={{ marginBottom: '100px' }}
			>
				<h2 className="story-heading">
					Repeater<span>Popover → Max Items</span>
				</h2>
				<ControlContextProvider
					storeName={STORE_NAME}
					value={{
						name: nanoid(),
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
					}}
				>
					<ControlWithHooks
						Control={RepeaterControl}
						{...args}
						label="Repeater"
					/>
				</ControlContextProvider>
			</Flex>
		);
	},
};
PopoverMaxItems.storyName = 'Popover → Max Items';

export const PopoverMinItems = {
	args: {
		...PopoverFilled.args,
		...{
			repeaterItemHeader: CustomRepeaterItemHeader,
			minItems: 5,
		},
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex
				direction="column"
				gap="20px"
				style={{ marginBottom: '100px' }}
			>
				<h2 className="story-heading">
					Repeater<span>Popover → Min Items</span>
				</h2>
				<ControlContextProvider
					storeName={STORE_NAME}
					value={{
						name: nanoid(),
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
					}}
				>
					<ControlWithHooks
						Control={RepeaterControl}
						{...args}
						label="Repeater"
					/>
				</ControlContextProvider>
			</Flex>
		);
	},
};
PopoverMinItems.storyName = 'Popover → Min Items';

export const PopoverOpenItem = {
	args: {
		...PopoverFilled.args,
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex
				direction="column"
				gap="20px"
				style={{ marginBottom: '100px' }}
			>
				<h2 className="story-heading">
					Repeater<span>Popover → Open Item</span>
				</h2>
				<ControlContextProvider
					storeName={STORE_NAME}
					value={{
						name: nanoid(),
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
					}}
				>
					<ControlWithHooks
						Control={RepeaterControl}
						{...args}
						label="Repeater"
					/>
				</ControlContextProvider>
			</Flex>
		);
	},
};
PopoverOpenItem.storyName = 'Popover → Open Item';

export const AccordionFilled = {
	args: {
		...PopoverFilled.args,
		...{
			repeaterItemHeader: CustomRepeaterItemHeader,
			mode: 'accordion',
		},
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex
				direction="column"
				gap="20px"
				style={{ marginBottom: '100px' }}
			>
				<h2 className="story-heading">
					Repeater<span>Accordion → Filled</span>
				</h2>
				<ControlContextProvider
					storeName={STORE_NAME}
					value={{
						name: nanoid(),
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
					}}
				>
					<ControlWithHooks
						Control={RepeaterControl}
						{...args}
						label="Repeater"
					/>
				</ControlContextProvider>
			</Flex>
		);
	},
};
AccordionFilled.storyName = 'Accordion → Filled';

export const AccordionOpenItem = {
	args: {
		...PopoverFilled.args,
		...{
			mode: 'accordion',
		},
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex
				direction="column"
				gap="20px"
				style={{ marginBottom: '100px' }}
			>
				<h2 className="story-heading">
					Repeater<span>Accordion → Custom Header</span>
				</h2>
				<ControlContextProvider
					storeName={STORE_NAME}
					value={{
						name: nanoid(),
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
					}}
				>
					<ControlWithHooks
						Control={RepeaterControl}
						{...args}
						label="Repeater"
					/>
				</ControlContextProvider>
			</Flex>
		);
	},
};
AccordionOpenItem.storyName = 'Accordion → Custom Header';

export const Play = {
	args: {
		...PopoverCustomHeader.args,
		controlInfo: {
			name: nanoid(),
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
		},
		minItems: 3,
		maxItems: 6,
	},
	decorators: [
		WithStoryContextProvider,
		WithInspectorStyles,
		WithControlDataProvider,
		...SharedDecorators,
	],
	render: (args) => <ControlWithHooks Control={RepeaterControl} {...args} />,
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

export const All = {
	args: {},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: () => (
		<Flex direction="column" gap="50px">
			<PopoverEmpty.render {...PopoverEmpty.args} />

			<PopoverFilled.render {...PopoverFilled.args} />

			<PopoverCustomHeader.render {...PopoverCustomHeader.args} />

			<PopoverMaxItems.render {...PopoverMaxItems.args} />

			<PopoverMinItems.render {...PopoverMinItems.args} />

			<PopoverOpenItem.render {...PopoverOpenItem.args} />

			<AccordionFilled.render {...AccordionFilled.args} />

			<AccordionOpenItem.render {...AccordionOpenItem.args} />
		</Flex>
	),
};
