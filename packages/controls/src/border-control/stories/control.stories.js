/**
 * Publisher dependencies
 */
import { Flex } from '@publisher/components';

/**
 * Internal dependencies
 */
import { BorderControl } from '../../index';
import {
	decorators,
	inspectDecorator,
} from '../../../../../.storybook/preview';

export default {
	title: 'Controls/BorderControl',
	component: BorderControl,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		value: {
			width: '10px',
			style: 'solid',
			color: '#0947eb',
		},
	},
	decorators: [inspectDecorator, ...decorators],
};

export const HorizontalBorder = {
	args: {
		value: {
			width: '10px',
			style: 'solid',
			color: '#0947eb',
		},
		linesDirection: 'horizontal',
	},
	decorators: [inspectDecorator, ...decorators],
	render: (args) => (
		<>
			<h2 className="story-heading">Horizontal Border Control</h2>
			<Flex direction="column" gap="20px">
				<BorderControl {...args} />
				<BorderControl {...args} value={{}} />
				<BorderControl
					{...args}
					value={{ ...args.value, style: 'dashed' }}
				/>
				<BorderControl
					{...args}
					value={{ ...args.value, style: 'dotted' }}
				/>
				<BorderControl
					{...args}
					value={{ ...args.value, style: 'double' }}
				/>
				<BorderControl {...args} style={{ width: '91px' }} />
			</Flex>
		</>
	),
};

export const VerticalBorder = {
	args: {
		value: {
			width: '10px',
			style: 'solid',
			color: '#0947eb',
		},
		linesDirection: 'vertical',
	},
	decorators: [inspectDecorator, ...decorators],
	render: (args) => (
		<>
			<h2 className="story-heading">Vertical Border Control</h2>
			<Flex direction="column" gap="20px">
				<BorderControl {...args} />
				<BorderControl {...args} value={{}} />
				<BorderControl
					{...args}
					value={{ ...args.value, style: 'dashed' }}
				/>
				<BorderControl
					{...args}
					value={{ ...args.value, style: 'dotted' }}
				/>
				<BorderControl
					{...args}
					value={{ ...args.value, style: 'double' }}
				/>
				<BorderControl {...args} style={{ width: '91px' }} />
			</Flex>
		</>
	),
};

export const FocusAndWidthChange = {
	args: {
		value: {
			width: '10px',
			style: 'solid',
			color: '#0947eb',
		},
	},
	decorators: [inspectDecorator, ...decorators],
	render: (args) => (
		<>
			<h2 className="story-heading">Focus And Width Change</h2>
			<Flex direction="column" gap="20px">
				<BorderControl {...args} __isWidthFocused={true} />
				<BorderControl
					{...args}
					__isWidthFocused={true}
					style={{ width: '91px' }}
				/>
				<BorderControl {...args} __isColorFocused={true} />
				<BorderControl
					{...args}
					__isColorFocused={true}
					style={{ width: '91px' }}
				/>
				<BorderControl {...args} __isStyleFocused={true} />
				<BorderControl
					{...args}
					__isStyleFocused={true}
					style={{ width: '91px' }}
				/>
			</Flex>
		</>
	),
};

export const Screenshot = {
	decorators: [inspectDecorator, ...decorators],
	render: () => (
		<>
			<HorizontalBorder.render {...HorizontalBorder.args} />
			<VerticalBorder.render {...VerticalBorder.args} />
			<FocusAndWidthChange.render {...FocusAndWidthChange.args} />
		</>
	),
};
