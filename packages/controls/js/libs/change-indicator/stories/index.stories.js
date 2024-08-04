/**
 *  Storybook dependencies
 */
import { default as Decorators } from '@blockera/dev-storybook/js/decorators';

/**
 * Internal dependencies
 */
import { ChangeIndicator, Flex } from '../../index';
import { WithPlaygroundStyles } from '../../../../../../.storybook/decorators/with-playground-styles';

const { WithInspectorStyles, SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Components/ChangeIndicator',
	component: ChangeIndicator,
	tags: ['autodocs'],
};

export const Default = {
	args: {},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Not Changed</h2>
				<ChangeIndicator isChanged={false} />
			</Flex>
		);
	},
};

export const ChangedOnPrimary = {
	args: {},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: () => {
		return (
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Changed On Primary</h2>
				<ChangeIndicator isChanged={true} />
			</Flex>
		);
	},
};

export const ChangedOnStates = {
	args: {},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: () => {
		return (
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Changed On States</h2>
				<ChangeIndicator isChanged={false} isChangedOnStates={true} />
			</Flex>
		);
	},
};

export const ChangedOnAll = {
	args: {},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: () => {
		return (
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Changed On All</h2>
				<ChangeIndicator isChanged={true} isChangedOnStates={true} />
			</Flex>
		);
	},
};

export const All = {
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: () => (
		<Flex direction="column" gap="50px">
			<Default.render {...Default.args} />

			<ChangedOnPrimary.render {...ChangedOnPrimary.args} />

			<ChangedOnStates.render {...ChangedOnStates.args} />

			<ChangedOnAll.render {...ChangedOnAll.args} />
		</Flex>
	),
};
