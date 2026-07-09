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
import { Flex, RangeControl } from '../../index';
import { ControlContextProvider } from '../../../context';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import ControlWithHooks from '../../../../../../.storybook/components/control-with-hooks';

const { WithInspectorStyles, SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Controls/RangeControl',
	component: RangeControl,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		value: 0,
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="20px">
				<h2 className="story-heading">Range</h2>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: args.value,
					}}
				>
					<ControlWithHooks Control={RangeControl} />
				</ControlContextProvider>
			</Flex>
		);
	},
};

export const States = {
	args: {
		value: 0,
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Range Control</h2>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 10,
					}}
				>
					<ControlWithHooks Control={RangeControl} {...args} />
				</ControlContextProvider>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 30,
					}}
				>
					<ControlWithHooks
						Control={RangeControl}
						{...args}
						withInputField={false}
					/>
				</ControlContextProvider>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 20,
					}}
				>
					<ControlWithHooks
						Control={RangeControl}
						{...args}
						min={0}
						max={100}
					/>
				</ControlContextProvider>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: args.value,
					}}
				>
					<ControlWithHooks Control={RangeControl} {...args} />
				</ControlContextProvider>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: args.value,
					}}
				>
					<ControlWithHooks
						Control={RangeControl}
						{...args}
						disabled={true}
						label="disabled"
					/>
				</ControlContextProvider>
			</Flex>
		);
	},
};

export const Field = {
	args: {
		label: 'Time',
		value: 30,
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="20px">
				<h2 className="story-heading">With Field</h2>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: args.value,
					}}
				>
					<ControlWithHooks Control={RangeControl} {...args} />
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

			<Field.render {...Field.args} />
		</Flex>
	),
};
