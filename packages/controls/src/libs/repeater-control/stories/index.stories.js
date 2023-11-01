/**
 * External dependencies
 */
import { useContext } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { nanoid } from 'nanoid';

/**
 * Publisher dependencies
 */
import { controlInnerClassNames } from '@publisher/classnames';
import { Flex } from '@publisher/components';
import { default as Decorators } from '@publisher/storybook/decorators';

/**
 * Internal dependencies
 */
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import { ControlContextProvider, useControlContext } from '../../../context';
import { InputControl, RepeaterControl } from '../../index';
import { RepeaterContext } from '../context';
import { STORE_NAME } from '../store';
import { default as InheritIcon } from './icons/inherit';

const { WithInspectorStyles, WithPopoverDataProvider, SharedDecorators } =
	Decorators;

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
					<RepeaterControl {...args} label="Repeater" />
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
					<RepeaterControl {...args} label="Repeater" />
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
					<RepeaterControl {...args} label="Repeater" />
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
					<RepeaterControl {...args} label="Repeater" />
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
					<RepeaterControl {...args} label="Repeater" />
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
					<RepeaterControl {...args} label="Repeater" />
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
					<RepeaterControl {...args} label="Repeater" />
				</ControlContextProvider>
			</Flex>
		);
	},
};
AccordionFilled.storyName = 'Accordion → Custom Header';

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
					<RepeaterControl {...args} label="Repeater" />
				</ControlContextProvider>
			</Flex>
		);
	},
};
AccordionOpenItem.storyName = 'Accordion → Filled';

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
