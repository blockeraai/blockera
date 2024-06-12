/**
 * Blockera dependencies
 */
import { default as Decorators } from '@blockera/dev-storybook/js/decorators';

/**
 * Internal dependencies
 */
import { Flex, ToggleControl } from '../../index';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';

const { WithInspectorStyles, SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Controls/ToggleControl',
	component: ToggleControl,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		value: false,
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const States = {
	args: {
		label: 'test',
		value: false,
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: () => {
		return (
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Toggle</h2>
				<ToggleControl label="Not Checked" value={false} />
				<ToggleControl label="Checked" value={true} />
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
