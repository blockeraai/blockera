/**
 * Publisher dependencies
 */
import { nanoid } from 'nanoid';
import { Flex } from '@publisher/components';
import { default as Decorators } from '@publisher/storybook/decorators';

/**
 * Internal dependencies
 */
import { ControlContextProvider, GradientBarControl } from '../../../index';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import { WithControlDataProvider } from '../../../../../../.storybook/decorators/with-control-data-provider';
import ControlWithHooks from '../../../../../../.storybook/components/control-with-hooks';

const { WithInspectorStyles, SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);
SharedDecorators.push(WithControlDataProvider);

export default {
	title: 'Controls/GradientBarControl',
	component: GradientBarControl,
	tags: ['autodocs'],
};

export const Empty = {
	args: {
		controlInfo: {
			name: nanoid(),
			value: 'linear-gradient(90deg,#009efa 10%,#e52e00 90%)',
		},
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const Filled = {
	args: {},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="50px">
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Gradient<span>Linear Gradient</span>
					</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: 'linear-gradient(90deg,rgb(25,0,255) 10%,rgb(230,134,0) 90%)',
						}}
					>
						<ControlWithHooks
							Control={GradientBarControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Gradient<span>Radial Gradient</span>
					</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: 'radial-gradient(rgb(250,0,247) 0%,rgb(255,213,0) 64%)',
						}}
					>
						<GradientBarControl {...args} />
					</ControlContextProvider>
				</Flex>
			</Flex>
		);
	},
};

export const Screenshot = {
	args: {},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: () => (
		<Flex direction="column" gap="50px">
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Empty</h2>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 'linear-gradient(90deg,#009efa 10%,#e52e00 90%)',
					}}
				>
					<GradientBarControl {...Empty.args} />
				</ControlContextProvider>
			</Flex>

			<Filled.render />
		</Flex>
	),
};
