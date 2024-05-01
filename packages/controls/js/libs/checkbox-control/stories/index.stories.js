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
import { CheckboxControl } from '../../index';
import { ControlContextProvider } from '../../../context';
import ControlWithHooks from '../../../../../../.storybook/components/control-with-hooks';

const { WithInspectorStyles, SharedDecorators } = Decorators;

export default {
	title: 'Controls/CheckboxControl',
	component: CheckboxControl,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		value: false,
		label: 'Checkbox',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Checkbox</h2>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: args.value,
					}}
				>
					<ControlWithHooks
						Control={CheckboxControl}
						checkboxLabel="Not Checked"
					/>
				</ControlContextProvider>
			</Flex>
		);
	},
};

export const States = {
	args: {},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: () => {
		return (
			<Flex direction="column" gap="20px">
				<h2 className="story-heading">Checkbox</h2>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: false,
					}}
				>
					<ControlWithHooks
						Control={CheckboxControl}
						checkboxLabel="Not Checked"
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: true,
					}}
				>
					<ControlWithHooks
						Control={CheckboxControl}
						checkboxLabel="Checked"
					/>
				</ControlContextProvider>
			</Flex>
		);
	},
};

export const Field = {
	args: {
		value: true,
		label: 'Enable',
		checkboxLabel: 'Feature Name',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">With Field</h2>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: args.value,
					}}
				>
					<ControlWithHooks Control={CheckboxControl} {...args} />
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

			<Field.render {...Field.args} />
		</Flex>
	),
};
