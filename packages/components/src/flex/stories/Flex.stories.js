/**
 * Internal dependencies
 */
import Flex from '../index';
import {
	decorators,
	inspectDecorator,
} from '../../../../../.storybook/preview';

export default {
	title: 'Components/Flex Component',
	component: Flex,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		children: (
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
		),
	},
	decorators: [inspectDecorator, ...decorators],
};

export const Screenshot = {
	render: (args) => (
		<>
			<h2 className="story-heading">Row Flex</h2>
			<Flex direction="row" {...args}>
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
			</Flex>

			<h2 className="story-heading">20px Gap Flex</h2>
			<Flex gap="20px" {...args}>
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
			</Flex>

			<h2 className="story-heading">Flex Wrap</h2>
			<Flex flexWrap="wrap" {...args}>
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
			</Flex>

			<h2 className="story-heading">Column Flex</h2>
			<Flex direction="column" {...args}>
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
			</Flex>

			<h2 className="story-heading">alignItems=center</h2>
			<Flex direction="column" alignItems="center" {...args}>
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
			</Flex>

			<h2 className="story-heading">alignItems=flex-end</h2>
			<Flex direction="column" alignItems="flex-end" {...args}>
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
			</Flex>
		</>
	),
	decorators: [inspectDecorator, ...decorators],
};
