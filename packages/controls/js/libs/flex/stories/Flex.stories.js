/**
 *  Storybook dependencies
 */
import { default as Decorators } from '@blockera/dev-storybook/js/decorators';

/**
 * Internal dependencies
 */
import Flex from '../index';
import { WithPlaygroundStyles } from '../../../../../../.storybook/decorators/with-playground-styles';

const { WithInspectorStyles, SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Components/Flex Component',
	component: Flex,
	tags: ['autodocs'],
};

const FlexChildren = () => {
	return (
		<>
			<div
				className="story-flex-item"
				style={{
					backgroundColor: '#0047eb',
					color: '#fff',
					width: '60px',
				}}
			>
				Item 1
			</div>
			<div
				className="story-flex-item"
				style={{
					backgroundColor: '#0047eb',
					color: '#fff',
					width: '90px',
				}}
			>
				Item 2
			</div>
			<div
				className="story-flex-item"
				style={{
					backgroundColor: '#0047eb',
					color: '#fff',
					width: '110px',
				}}
			>
				Item 3
			</div>
		</>
	);
};

export const Default = {
	args: {
		children: <FlexChildren />,
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const All = {
	render: (args) => (
		<Flex direction="column" gap="30px">
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Row Flex</h2>
				<Flex direction="row" {...args}>
					<FlexChildren />
				</Flex>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">20px Gap Flex</h2>
				<Flex gap="20px" {...args}>
					<FlexChildren />
				</Flex>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Flex Wrap</h2>
				<Flex flexWrap="wrap" {...args}>
					<FlexChildren />
				</Flex>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Column Flex</h2>
				<Flex direction="column" {...args}>
					<FlexChildren />
				</Flex>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">alignItems=center</h2>
				<Flex direction="column" alignItems="center" {...args}>
					<FlexChildren />
				</Flex>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">alignItems=flex-end</h2>
				<Flex direction="column" alignItems="flex-end" {...args}>
					<FlexChildren />
				</Flex>
			</Flex>
		</Flex>
	),
	decorators: [WithInspectorStyles, ...SharedDecorators],
};
