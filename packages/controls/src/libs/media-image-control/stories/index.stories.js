/**
 * External dependencies
 */
import { nanoid } from 'nanoid';

/**
 * Blockera dependencies
 */
import { Flex } from '@blockera/components';
import { default as Decorators } from '@blockera/storybook/decorators';

/**
 * Internal dependencies
 */
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import { ControlContextProvider, MediaImageControl } from '../../../index';
import { WithControlDataProvider } from '../../../../../../.storybook/decorators/with-control-data-provider';
import ControlWithHooks from '../../../../../../.storybook/components/control-with-hooks';

const { WithInspectorStyles, SharedDecorators, WithPopoverDataProvider } =
	Decorators;

SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Controls/MediaImageControl',
	component: MediaImageControl,
	tags: ['autodocs'],
};

export const Empty = {
	args: {
		label: '',
		controlInfo: {
			name: nanoid(),
			value: '',
		},
	},
	render: (args) => (
		<Flex direction="column" gap="20px">
			<h2 className="story-heading">Empty Media</h2>
			<ControlWithHooks Control={MediaImageControl} {...args} />
		</Flex>
	),
	decorators: [
		WithInspectorStyles,
		WithPopoverDataProvider,
		WithControlDataProvider,
		...SharedDecorators,
	],
};

export const Filled = {
	args: {
		label: '',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="50px">
				<Flex direction="column" gap="20px">
					<h2 className="story-heading">
						Image<span>Filled</span>
					</h2>

					<ControlContextProvider
						value={{
							name: nanoid(),
							value: 'https://betterstudio.com/wp-content/uploads/2022/09/blockera-theme.svg',
						}}
					>
						<ControlWithHooks
							Control={MediaImageControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="20px">
					<h2 className="story-heading">
						Image<span>Large Image</span>
					</h2>

					<ControlContextProvider
						value={{
							name: nanoid(),
							value: 'https://betterstudio.com/wp-content/uploads/2023/05/Best-WooCommerce-Currency-Switcher-Plugins.png',
						}}
					>
						<ControlWithHooks
							Control={MediaImageControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>
			</Flex>
		);
	},
};

export const Field = {
	args: {
		label: 'Field',
	},
	render: (args) => (
		<Flex direction="column" gap="20px">
			<h2 className="story-heading">With Field</h2>
			<ControlContextProvider
				value={{
					name: nanoid(),
					value: 'https://betterstudio.com/wp-content/uploads/2022/09/blockera-theme.svg',
				}}
			>
				<ControlWithHooks Control={MediaImageControl} {...args} />
			</ControlContextProvider>
		</Flex>
	),
	decorators: [
		WithInspectorStyles,
		WithPopoverDataProvider,
		WithControlDataProvider,
		...SharedDecorators,
	],
};

export const All = {
	args: {},
	decorators: [
		WithInspectorStyles,
		WithPopoverDataProvider,
		WithControlDataProvider,
		...SharedDecorators,
	],
	render: () => (
		<Flex direction="column" gap="50px">
			<Empty.render {...Empty.args} />

			<Filled.render {...Filled.args} />

			<Field.render {...Field.args} />
		</Flex>
	),
};
