/**
 *  Storybook dependencies
 */
import { default as Decorators } from '@blockera/dev-storybook/js/decorators';
import { InputControl } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { Wrapper } from '../components/wrapper';
import { WithPlaygroundStyles } from '../../../../../.storybook/decorators/with-playground-styles';
import Flex from '../../flex';

const { WithInspectorStyles, SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Components/Wrapper Component',
	component: Wrapper,
	tags: ['autodocs'],
};

export const Default = {
	args: {},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const All = {
	render: () => (
		<Flex direction="column" gap="10px">
			<Wrapper type="free">
				<InputControl label="Feature Name" columns="columns-2" />
			</Wrapper>
		</Flex>
	),
	decorators: [WithInspectorStyles, ...SharedDecorators],
};
