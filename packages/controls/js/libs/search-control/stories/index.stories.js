/**
 * External dependencies
 */
import { nanoid } from 'nanoid';

/**
 * Blockera dependencies
 */
import { default as Decorators } from '@blockera/dev-storybook/js/decorators';

/**
 * Internal dependencies
 */
import { Flex, SearchControl } from '../../index';
import { ControlContextProvider } from '../../../context';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import ControlWithHooks from '../../../../../../.storybook/components/control-with-hooks';

const { WithInspectorStyles, SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Controls/SearchControl',
	component: SearchControl,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		placeholder: 'Enter to search...',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="20px">
			<h2 className="story-heading">
				Search<span>Empty</span>
			</h2>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: '',
				}}
			>
				<ControlWithHooks Control={SearchControl} {...args} />
			</ControlContextProvider>
		</Flex>
	),
};

export const States = {
	args: {
		placeholder: 'Enter to search...',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="20px">
				<h2 className="story-heading">
					Search<span>States</span>
				</h2>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: '',
					}}
				>
					<ControlWithHooks Control={SearchControl} {...args} />
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: '',
					}}
				>
					<ControlWithHooks
						Control={SearchControl}
						{...args}
						className="is-hovered"
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: '',
					}}
				>
					<ControlWithHooks
						Control={SearchControl}
						{...args}
						className="is-focused"
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 'blockera',
					}}
				>
					<ControlWithHooks Control={SearchControl} {...args} />
				</ControlContextProvider>
			</Flex>
		);
	},
};

export const All = {
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: () => (
		<Flex direction="column" gap="50px">
			<Default.render {...Default.args} />

			<States.render {...States.args} />
		</Flex>
	),
};
