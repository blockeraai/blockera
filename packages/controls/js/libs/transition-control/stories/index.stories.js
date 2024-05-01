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
import TransitionControl from '../index';
import { STORE_NAME } from '../../repeater-control/store';
import { ControlContextProvider } from '../../../context';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import { WithControlDataProvider } from '../../../../../../.storybook/decorators/with-control-data-provider';

const { WithInspectorStyles, WithPopoverDataProvider, SharedDecorators } =
	Decorators;

SharedDecorators.push(WithPopoverDataProvider);
SharedDecorators.push(WithControlDataProvider);
SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Controls/TransitionControl',
	component: TransitionControl,
	tags: ['autodocs'],
};

export const Empty = {
	args: {
		label: 'Transitions',
		controlInfo: {
			name: nanoid(),
			value: [],
		},
		storeName: STORE_NAME,
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const Fill = {
	args: {
		label: 'Transitions',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="50px">
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Filled</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									type: 'all',
									duration: '2.5s',
									timing: 'ease',
									delay: '10ms',
									isVisible: true,
									isOpen: false,
								},
								{
									type: 'opacity',
									duration: '600ms',
									timing: 'ease',
									delay: '0ms',
									isVisible: true,
								},
							],
						}}
					>
						<TransitionControl {...args} label="Transitions" />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Filled<span>CSS Values</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									type: 'all',
									duration: '2.5sfunc',
									timing: 'ease',
									delay: '10msfunc',
									isVisible: true,
									isOpen: false,
								},
								{
									type: 'opacity',
									duration: '600msfunc',
									timing: 'ease',
									delay: '0msfunc',
									isVisible: true,
								},
							],
						}}
					>
						<TransitionControl {...args} label="Transitions" />
					</ControlContextProvider>
				</Flex>
			</Flex>
		);
	},
};

export const Open = {
	args: {
		label: 'Transitions',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex
				direction="column"
				gap="15px"
				style={{ marginBottom: '250px' }}
			>
				<h2 className="story-heading">Filled</h2>

				<ControlContextProvider
					storeName={STORE_NAME}
					value={{
						name: nanoid(),
						value: [
							{
								type: 'all',
								duration: '2.5s',
								timing: 'ease',
								delay: '10ms',
								isVisible: true,
								isOpen: true,
							},
							{
								type: 'opacity',
								duration: '600ms',
								timing: 'ease',
								delay: '0ms',
								isVisible: true,
							},
						],
					}}
				>
					<TransitionControl {...args} label="Transitions" />
				</ControlContextProvider>
			</Flex>
		);
	},
};

export const All = {
	args: {},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: () => (
		<Flex direction="column" gap="50px">
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Empty</h2>
				<ControlContextProvider
					storeName={STORE_NAME}
					value={{
						name: nanoid(),
						value: [],
					}}
				>
					<TransitionControl {...Empty.args} />
				</ControlContextProvider>
			</Flex>

			<Fill.render />

			<Open.render />
		</Flex>
	),
};
