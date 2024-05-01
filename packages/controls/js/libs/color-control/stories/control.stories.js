/**
 * External dependencies
 */

import { nanoid } from 'nanoid';

/**
 * Blockera dependencies
 */
import { Flex } from '@blockera/components';
import { default as Decorators } from '@blockera/dev-storybook/js/decorators';

/**
 * Internal dependencies
 */
import { ColorControl } from '../../index';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import { ControlContextProvider } from '../../../context';
import ControlWithHooks from '../../../../../../.storybook/components/control-with-hooks';

const { WithInspectorStyles, WithPopoverDataProvider, SharedDecorators } =
	Decorators;

SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Controls/ColorControl',
	component: ColorControl,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		defaultValue: '',
	},
	decorators: [
		WithInspectorStyles,
		WithPopoverDataProvider,
		...SharedDecorators,
	],
	render: (args) => (
		<Flex direction="column" gap="20px">
			<h2 className="story-heading">
				Color<span>Empty</span>
			</h2>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: '',
				}}
			>
				<ControlWithHooks Control={ColorControl} {...args} />
			</ControlContextProvider>
		</Flex>
	),
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
		<Flex direction="column" gap="20px">
			<h2 className="story-heading">Normal Color Control</h2>
			<ControlContextProvider
				value={{
					name: nanoid(),
					value: '',
				}}
			>
				<ControlWithHooks
					Control={ColorControl}
					{...args}
					value=""
					placement={'left-start'}
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: '#eeeeee',
				}}
			>
				<ControlWithHooks Control={ColorControl} {...args} />
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: '#0947eb',
				}}
			>
				<ControlWithHooks Control={ColorControl} {...args} />
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: '#0945EB91',
				}}
			>
				<ControlWithHooks
					Control={ColorControl}
					{...args}
					style={{ width: '100px' }}
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: '#0947eb',
				}}
			>
				<ControlWithHooks
					Control={ColorControl}
					{...args}
					contentAlign="center"
				/>
			</ControlContextProvider>
		</Flex>
	),
};

export const Minimal = {
	args: {
		defaultValue: '',
		type: 'minimal',
	},
	decorators: [
		WithInspectorStyles,
		WithPopoverDataProvider,
		...SharedDecorators,
	],
	render: (args) => (
		<Flex direction="column" gap="20px">
			<h2 className="story-heading">Minimal Color Control</h2>
			<ControlContextProvider
				value={{
					name: nanoid(),
					value: '',
				}}
			>
				<ControlWithHooks Control={ColorControl} {...args} />
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: '#eeeeee',
				}}
			>
				<ControlWithHooks Control={ColorControl} {...args} />
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: '#0947eb',
				}}
			>
				<ControlWithHooks Control={ColorControl} {...args} />
			</ControlContextProvider>
		</Flex>
	),
};

export const All = {
	args: {},
	decorators: [
		WithInspectorStyles,
		WithPopoverDataProvider,
		...SharedDecorators,
	],
	render: () => (
		<Flex direction="column" gap="50px">
			<Default.render {...Default.args} />

			<Normal.render {...Normal.args} />

			<Minimal.render {...Minimal.args} />
		</Flex>
	),
};
