/**
 * Blockera dependencies
 */
import { Flex } from '@blockera/components';
import { default as Decorators } from '@blockera/dev-storybook/js/decorators';

/**
 * Internal dependencies
 */
import { LabelControl } from '../../index';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';

const { WithInspectorStyles, WithPopoverDataProvider, SharedDecorators } =
	Decorators;

SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Controls/LabelControl',
	component: LabelControl,
	tags: ['autodocs'],
};

export const Simple = {
	args: {
		defaultValue: '',
		label: 'I am Label!',
		isOpen: true,
	},
	decorators: [
		WithInspectorStyles,
		WithPopoverDataProvider,
		...SharedDecorators,
	],
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
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">
					Label<span>Simple</span>
				</h2>
				<LabelControl {...Simple.args} />
			</Flex>
		</Flex>
	),
};
