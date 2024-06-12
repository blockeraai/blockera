/**
 *  Storybook dependencies
 */
import { default as Decorators } from '@blockera/dev-storybook/js/decorators';

/**
 * Internal dependencies
 */
import { MoreFeatures } from '../../index';
import { WithPlaygroundStyles } from '../../../../../.storybook/decorators/with-playground-styles';
import Flex from '../../flex';

const { WithInspectorStyles, SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Components/More Features',
	component: MoreFeatures,
	tags: ['autodocs'],
};

export const Default = {
	args: {},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const All = {
	render: () => (
		<Flex direction="column" gap="100px">
			<Flex direction="column" gap="30px">
				<h2 className="story-heading">Close</h2>
				<MoreFeatures isChanged={false} isOpen={false}>
					children is here
				</MoreFeatures>
			</Flex>

			<Flex direction="column" gap="30px">
				<h2 className="story-heading">Close & Changed</h2>
				<MoreFeatures isChanged={true} isOpen={false}>
					children is here
				</MoreFeatures>
			</Flex>

			<Flex direction="column" gap="30px">
				<h2 className="story-heading">Open</h2>
				<MoreFeatures isChanged={false} isOpen={true}>
					children is here
				</MoreFeatures>
			</Flex>

			<Flex direction="column" gap="30px">
				<h2 className="story-heading">Open & Changed</h2>
				<MoreFeatures isChanged={true} isOpen={true}>
					children is here
				</MoreFeatures>
			</Flex>
		</Flex>
	),
	decorators: [WithInspectorStyles, ...SharedDecorators],
};
