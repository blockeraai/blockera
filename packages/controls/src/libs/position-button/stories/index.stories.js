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
import { PositionButtonControl } from '../../index';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import { ControlContextProvider } from '../../../context';
import ControlWithHooks from '../../../../../../.storybook/components/control-with-hooks';

const { WithInspectorStyles, SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Controls/PositionButtonControl',
	component: PositionButtonControl,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		value: { top: '', left: '' },
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="20px">
				<h2 className="story-heading">Position Button</h2>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: args.value,
					}}
				>
					<ControlWithHooks Control={PositionButtonControl} />
				</ControlContextProvider>
			</Flex>
		);
	},
};

export const States = {
	args: {
		value: { top: '', left: '' },
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="15px">
				<h3 className="story-heading">Without Value</h3>
				<ControlContextProvider
					value={{
						name: nanoid(),
					}}
				>
					<ControlWithHooks
						Control={PositionButtonControl}
						{...args}
					/>
				</ControlContextProvider>
				<h3 className="story-heading">Custom</h3>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: { top: '10%', left: '20%' },
					}}
				>
					<ControlWithHooks
						Control={PositionButtonControl}
						{...args}
					/>
				</ControlContextProvider>
				<h3 className="story-heading">With Value</h3>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: { top: '50%', left: '50%' },
					}}
				>
					<ControlWithHooks
						Control={PositionButtonControl}
						{...args}
					/>
				</ControlContextProvider>
				<h3 className="story-heading">With Alignment Matrix field</h3>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: { top: '20%', left: '30%' },
					}}
				>
					<ControlWithHooks
						Control={PositionButtonControl}
						{...args}
						alignmentMatrixLabel="Position"
					/>
				</ControlContextProvider>
			</Flex>
		);
	},
};

export const All = {
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: () => (
		<Flex direction="column" gap="50px">
			<States.render {...States.args} />
		</Flex>
	),
};
