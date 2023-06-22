/**
 * Internal dependencies
 */
import Grid from '../index';
import {
	decorators,
	inspectDecorator,
} from '../../../../../.storybook/preview';

export default {
	title: 'Components/Grid Component',
	component: Grid,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		children: (
			<>
				<div
					style={{
						backgroundColor: '#0047eb',
						color: '#fff',
						width: '60px',
					}}
				>
					Item 1
				</div>
				<div
					style={{
						backgroundColor: '#0047eb',
						color: '#fff',
						width: '90px',
					}}
				>
					Item 2
				</div>
				<div
					style={{
						backgroundColor: '#0047eb',
						color: '#fff',
						width: '110px',
					}}
				>
					Item 3
				</div>
			</>
		),
	},
	decorators: [inspectDecorator, ...decorators],
};

export const Screenshot = {
	render: (args) => (
		<>
			<h2 className="story-heading">Default Grid</h2>
			<Grid direction="row" {...args}>
				<div
					style={{
						backgroundColor: '#0047eb',
						color: '#fff',
					}}
				>
					Item 1
				</div>
				<div
					style={{
						backgroundColor: '#0047eb',
						color: '#fff',
					}}
				>
					Item 2
				</div>
				<div
					style={{
						backgroundColor: '#0047eb',
						color: '#fff',
					}}
				>
					Item 3
				</div>
				<div
					style={{
						backgroundColor: '#0047eb',
						color: '#fff',
					}}
				>
					Item 4
				</div>
				<div
					style={{
						backgroundColor: '#0047eb',
						color: '#fff',
					}}
				>
					Item 5
				</div>
				<div
					style={{
						backgroundColor: '#0047eb',
						color: '#fff',
					}}
				>
					Item 6
				</div>
			</Grid>

			<h2 className="story-heading">30px Gap Grid</h2>
			<Grid gap="30px" {...args}>
				<div
					style={{
						backgroundColor: '#0047eb',
						color: '#fff',
					}}
				>
					Item 1
				</div>
				<div
					style={{
						backgroundColor: '#0047eb',
						color: '#fff',
					}}
				>
					Item 2
				</div>
				<div
					style={{
						backgroundColor: '#0047eb',
						color: '#fff',
					}}
				>
					Item 3
				</div>
				<div
					style={{
						backgroundColor: '#0047eb',
						color: '#fff',
					}}
				>
					Item 4
				</div>
				<div
					style={{
						backgroundColor: '#0047eb',
						color: '#fff',
					}}
				>
					Item 5
				</div>
				<div
					style={{
						backgroundColor: '#0047eb',
						color: '#fff',
					}}
				>
					Item 6
				</div>
			</Grid>

			<h2 className="story-heading">3 Columns Grid</h2>
			<Grid gridTemplateColumns="repeat(3, 1fr)" {...args}>
				<div
					style={{
						backgroundColor: '#0047eb',
						color: '#fff',
					}}
				>
					Item 1
				</div>
				<div
					style={{
						backgroundColor: '#0047eb',
						color: '#fff',
					}}
				>
					Item 2
				</div>
				<div
					style={{
						backgroundColor: '#0047eb',
						color: '#fff',
					}}
				>
					Item 3
				</div>
				<div
					style={{
						backgroundColor: '#0047eb',
						color: '#fff',
					}}
				>
					Item 4
				</div>
				<div
					style={{
						backgroundColor: '#0047eb',
						color: '#fff',
					}}
				>
					Item 5
				</div>
				<div
					style={{
						backgroundColor: '#0047eb',
						color: '#fff',
					}}
				>
					Item 6
				</div>
			</Grid>

			<h2 className="story-heading">3 Columns Grid (50px)</h2>
			<Grid gridTemplateColumns="repeat(3, 50px)" {...args}>
				<div
					style={{
						backgroundColor: '#0047eb',
						color: '#fff',
					}}
				>
					Item 1
				</div>
				<div
					style={{
						backgroundColor: '#0047eb',
						color: '#fff',
					}}
				>
					Item 2
				</div>
				<div
					style={{
						backgroundColor: '#0047eb',
						color: '#fff',
					}}
				>
					Item 3
				</div>
				<div
					style={{
						backgroundColor: '#0047eb',
						color: '#fff',
					}}
				>
					Item 4
				</div>
				<div
					style={{
						backgroundColor: '#0047eb',
						color: '#fff',
					}}
				>
					Item 5
				</div>
				<div
					style={{
						backgroundColor: '#0047eb',
						color: '#fff',
					}}
				>
					Item 6
				</div>
			</Grid>
		</>
	),
	decorators: [inspectDecorator, ...decorators],
};
