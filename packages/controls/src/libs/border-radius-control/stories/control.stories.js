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
import { BorderRadiusControl } from '../../index';
import { ControlContextProvider } from '../../../context';
import ControlWithHooks from '../../../../../../.storybook/components/control-with-hooks';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';

const { WithInspectorStyles, SharedDecorators } = Decorators;
SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Controls/BorderRadiusControl',
	component: BorderRadiusControl,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		label: 'Border Radius',
		value: {
			type: 'all',
			all: '5px',
		},
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="20px">
			<h2 className="story-heading">
				Border Radius<span>Empty</span>
			</h2>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks Control={BorderRadiusControl} {...args} />
			</ControlContextProvider>
		</Flex>
	),
};

export const AllCorners = {
	args: {
		label: 'Border Radius',
		value: {
			type: 'all',
			all: '10px',
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
					Control={BorderRadiusControl}
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
					Control={BorderRadiusControl}
					{...args}
					label="Empty"
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: {
						type: 'all',
						all: '10pxfunc',
					},
				}}
			>
				<ControlWithHooks
					Control={BorderRadiusControl}
					{...args}
					label="CSS Value"
				/>
			</ControlContextProvider>
		</Flex>
	),
};

export const CustomCorners = {
	args: {},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="15px">
			<h2 className="story-heading">Custom Corners</h2>
			<ControlContextProvider
				value={{
					name: nanoid(),
					value: {
						type: 'custom',
						all: '10px',
						topLeft: '10px',
						topRight: '10px',
						bottomRight: '10px',
						bottomLeft: '10px',
					},
				}}
			>
				<ControlWithHooks
					Control={BorderRadiusControl}
					{...args}
					label="All Same"
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: {
						type: 'custom',
						all: '10%',
						topLeft: '10%',
						topRight: '50%',
						bottomRight: '10%',
						bottomLeft: '50%',
					},
				}}
			>
				<ControlWithHooks
					Control={BorderRadiusControl}
					{...args}
					label="Customized"
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: {
						type: 'custom',
						all: '10%func',
						topLeft: '10%func',
						topRight: '50%func',
						bottomRight: '10%func',
						bottomLeft: '50%func',
					},
				}}
			>
				<ControlWithHooks
					Control={BorderRadiusControl}
					{...args}
					label="CSS Values"
				/>
			</ControlContextProvider>
		</Flex>
	),
};

export const All = {
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: () => (
		<Flex direction="column" gap="50px">
			<AllCorners.render {...AllCorners.args} />

			<CustomCorners.render {...CustomCorners.args} />
		</Flex>
	),
};
