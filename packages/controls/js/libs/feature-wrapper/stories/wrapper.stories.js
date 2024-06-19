/**
 *  Storybook dependencies
 */
import { default as Decorators } from '@blockera/dev-storybook/js/decorators';
import { InputControl } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { FeatureWrapper } from '../';
import { WithPlaygroundStyles } from '../../../../../../.storybook/decorators/with-playground-styles';
import { WithControlDataProvider } from '../../../../../../.storybook/decorators/with-control-data-provider';
import { Flex } from '../../';

const { WithInspectorStyles, SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);
SharedDecorators.push(WithControlDataProvider);

export default {
	title: 'Components/FeatureWrapper Component',
	component: FeatureWrapper,
	tags: ['autodocs'],
};

export const Default = {
	args: {},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const All = {
	render: () => (
		<Flex direction="column" gap="10px">
			<FeatureWrapper type="free">
				<InputControl label="Feature Name" columns="columns-2" />
			</FeatureWrapper>
		</Flex>
	),
	decorators: [WithInspectorStyles, ...SharedDecorators],
};
