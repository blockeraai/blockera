/**
 * External dependencies
 */
import { nanoid } from 'nanoid';

/**
 * Publisher dependencies
 */
import { Flex } from '@publisher/components';
import { default as Decorators } from '@publisher/storybook/decorators';

/**
 * Internal dependencies
 */
import { BoxBorderControl } from '../../index';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import { ControlContextProvider } from '../../../context';
import ControlWithHooks from '../../../../../../.storybook/components/control-with-hooks';

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
	render: (args) => (
		<Flex direction="column" gap="20px">
			<h2 className="story-heading">
				Box Border<span>Empty</span>
			</h2>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks Control={BoxBorderControl} {...args} />
			</ControlContextProvider>
		</Flex>
	),
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
		<Flex direction="column" gap="20px">
			<h2 className="story-heading">All Borders</h2>
			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks
					Control={BoxBorderControl}
					{...args}
					label="All"
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: {},
				}}
			>
				<ControlWithHooks
					Control={BoxBorderControl}
					{...args}
					label="Empty"
				/>
			</ControlContextProvider>
		</Flex>
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
		<Flex direction="column" gap="15px">
			<h2 className="story-heading">Custom Borders</h2>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: {
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
					},
				}}
			>
				<ControlWithHooks
					Control={BoxBorderControl}
					{...args}
					label="All Same"
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: {
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
					},
				}}
			>
				<ControlWithHooks
					Control={BoxBorderControl}
					{...args}
					label="Customized"
				/>
			</ControlContextProvider>
		</Flex>
	),
};

export const All = {
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: () => (
		<Flex direction="column" gap="50px">
			<Default.render {...Default.args} />

			<AllBorders.render {...AllBorders.args} />

			<CustomBorders.render {...CustomBorders.args} />
		</Flex>
	),
};
