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
import { ControlContextProvider, Flex, ToggleControl } from '../../index';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import ControlWithHooks from '../../../../../../.storybook/components/control-with-hooks';

const { WithInspectorStyles, SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Controls/ToggleControl',
	component: ToggleControl,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		controlInfo: {
			name: nanoid(),
			value: true,
		},
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => <ControlWithHooks Control={ToggleControl} {...args} />,
};

export const States = {
	args: {
		// controlInfo: {
		// 	name: nanoid(),
		// 	value: false,
		// },
		// type: 'custom',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Toggle</h2>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: false,
					}}
				>
					<ControlWithHooks
						Control={ToggleControl}
						label="Not Checked"
						{...args}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: true,
					}}
				>
					<ControlWithHooks
						Control={ToggleControl}
						label="Checked"
						{...args}
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
