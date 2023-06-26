/**
 * Publisher dependencies
 */
import { Flex } from '@publisher/components';

/**
 * Publisher Storybook dependencies
 */
import { default as Decorators } from '@publisher/storybook/decorators';

/**
 * Internal dependencies
 */
import { BoxBorderControl } from '../../index';
import { WithPlaygroundStyles } from '../../../../../.storybook/decorators/with-playground-styles';

const { WithInspectorStyles, SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Controls/BoxBorderControl',
	component: BoxBorderControl,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		label: 'Border Line',
		value: {
			type: 'all',
			all: {
				width: '2px',
				style: 'solid',
				color: '#0947eb',
			},
		},
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const AllBorders = {
	args: {
		label: 'Border Line',
		value: {
			type: 'all',
			all: {
				width: '2px',
				style: 'solid',
				color: '#0947eb',
			},
		},
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<>
			<h2 className="story-heading">All Borders</h2>
			<Flex direction="column" gap="30px">
				<BoxBorderControl {...args} label="All" />
				<BoxBorderControl {...args} value={{}} label="Empty" />
			</Flex>
		</>
	),
};

export const CustomBorders = {
	args: {
		label: 'Border Line',
		value: {
			type: 'all',
			all: {
				width: '2px',
				style: 'solid',
				color: '#0947eb',
			},
		},
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<>
			<h2 className="story-heading">Custom Borders</h2>
			<Flex direction="column" gap="30px">
				<BoxBorderControl
					{...args}
					label="All Same"
					value={{
						type: 'custom',
						all: {
							width: '2px',
							style: 'solid',
							color: '#0947eb',
						},
						left: {
							width: '2px',
							style: 'solid',
							color: '#0947eb',
						},
						right: {
							width: '2px',
							style: 'solid',
							color: '#0947eb',
						},
						top: {
							width: '2px',
							style: 'solid',
							color: '#0947eb',
						},
						bottom: {
							width: '2px',
							style: 'solid',
							color: '#0947eb',
						},
					}}
				/>
				<BoxBorderControl
					{...args}
					label="Customized"
					value={{
						type: 'custom',
						all: {
							width: '1px',
							style: 'solid',
							color: '#0947eb',
						},
						left: {
							width: '10px',
							style: 'double',
							color: '#5100df',
						},
						right: {
							width: '2px',
							style: 'dashed',
							color: '#009d74',
						},
						top: {
							width: '1px',
							style: 'solid',
							color: '#0947eb',
						},
						bottom: {
							width: '7px',
							style: 'dotted',
							color: '#a92d00',
						},
					}}
				/>
			</Flex>
		</>
	),
};

export const Screenshot = {
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: () => (
		<>
			<AllBorders.render {...AllBorders.args} />

			<CustomBorders.render {...CustomBorders.args} />
		</>
	),
};
