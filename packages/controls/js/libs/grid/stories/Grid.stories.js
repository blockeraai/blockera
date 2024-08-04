/**
 *  Storybook dependencies
 */
import { default as Decorators } from '@blockera/dev-storybook/js/decorators';

/**
 * Internal dependencies
 */
import Grid from '../index';
import Flex from '../../flex';
import { WithPlaygroundStyles } from '../../../../../../.storybook/decorators/with-playground-styles';

const { WithInspectorStyles, SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Components/Grid Component',
	component: Grid,
	tags: ['autodocs'],
};

const GridChildren = ({ count = 3 }) => {
	const stack = [];

	for (let i = 1; i <= count; i++) {
		stack.push(
			<div
				style={{
					backgroundColor: '#0047eb',
					color: '#fff',
					width: '60px',
				}}
			>
				Item {i}
			</div>
		);
	}

	return <>{stack}</>;
};

export const Default = {
	args: {
		children: <GridChildren count={3} />,
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const All = {
	render: (args) => (
		<Flex direction="column" gap="30px">
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Default Grid</h2>
				<Grid direction="row" gap="30px" {...args}>
					<GridChildren count={3} />
				</Grid>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">30px Gap Grid</h2>
				<Grid gap="30px" {...args}>
					<GridChildren count={3} />
				</Grid>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">3 Columns Grid</h2>
				<Grid gridTemplateColumns="repeat(3, 1fr)" gap="30px" {...args}>
					<GridChildren count={6} />
				</Grid>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">3 Columns Grid (50px)</h2>
				<Grid
					gridTemplateColumns="repeat(3, 50px)"
					gap="30px"
					{...args}
				>
					<GridChildren count={6} />
				</Grid>
			</Flex>
		</Flex>
	),
	decorators: [WithInspectorStyles, ...SharedDecorators],
};
