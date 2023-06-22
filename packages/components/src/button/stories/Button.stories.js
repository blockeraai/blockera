/**
 * Internal dependencies
 */
import Button from '../button';
import Buttons from '../buttons';
import {
	decorators,
	inspectDecorator,
} from '../../../../../.storybook/preview';
import { default as Icon } from './icons/icon';

export default {
	title: 'Components/Button Component',
	component: Button,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		variant: 'tertiary',
		children: 'Call to Action',
	},
	decorators: [inspectDecorator, ...decorators],
};

export const Styles = {
	render: (args) => (
		<Buttons direction="column" alignItems="flex-start" gap="20px">
			<Button variant="primary" {...args}>
				Primary Button
			</Button>
			<Button variant="secondary" {...args}>
				Secondary Button
			</Button>
			<Button variant="tertiary" {...args}>
				Tertiary Button
			</Button>
			<Button variant="link" {...args}>
				Link Button
			</Button>
		</Buttons>
	),
	decorators: [inspectDecorator, ...decorators],
};

export const Sizes = {
	render: (args) => (
		<Buttons direction="column" alignItems="flex-start" gap="20px">
			<Button size="normal" {...args}>
				Normal Button
			</Button>
			<Button size="small" {...args}>
				Small Button
			</Button>
			<Button size="extra-small" {...args}>
				Extra Small
			</Button>
		</Buttons>
	),
	decorators: [inspectDecorator, ...decorators],
};

export const Screenshot = {
	render: (args) => (
		<>
			<Buttons
				gap="20px"
				direction="column"
				alignItems="flex-start"
				style={{ margin: '0 0 50px' }}
			>
				<h2 style={{ margin: '0 0 10px' }}>Primary Button</h2>
				<Button variant="primary" size="normal" {...args}>
					Normal Button
				</Button>
				<Button variant="primary" size="small" {...args}>
					Small Button
				</Button>
				<Button
					variant="primary"
					size="small"
					icon={<Icon />}
					text="Small Button + Text + Icon"
					{...args}
				/>
				<Button
					variant="primary"
					size="small"
					iconPosition="right"
					icon={<Icon />}
					text="Small Button + Text + Right Icon"
					{...args}
				/>
				<Button variant="primary" size="extra-small" {...args}>
					Extra Small
				</Button>
				<Button
					variant="primary"
					size="extra-small"
					isFocus={true}
					{...args}
				>
					Extra Small + Focused
				</Button>
				<Button
					variant="primary"
					size="extra-small"
					noBorder={true}
					{...args}
				>
					Extra Small + No Border
				</Button>
				<Button
					variant="primary"
					size="extra-small"
					isFocus={true}
					noBorder={true}
					{...args}
				>
					Extra Small + No Border + Focused
				</Button>
			</Buttons>

			<Buttons
				gap="20px"
				direction="column"
				alignItems="flex-start"
				style={{ margin: '0 0 50px' }}
			>
				<h2 style={{ margin: '0 0 10px' }}>Secondary Button</h2>
				<Button variant="secondary" size="normal" {...args}>
					Normal Button
				</Button>
				<Button variant="secondary" size="small" {...args}>
					Small Button
				</Button>
				<Button
					variant="secondary"
					size="small"
					icon={<Icon />}
					text="Normal Button + Text + Icon"
					{...args}
				/>
				<Button
					variant="secondary"
					size="small"
					iconPosition="right"
					icon={<Icon />}
					text="Normal Button + Text + Right Icon"
					{...args}
				/>
				<Button variant="secondary" size="extra-small" {...args}>
					Extra Small
				</Button>
				<Button
					variant="secondary"
					size="extra-small"
					isFocus={true}
					{...args}
				>
					Extra Small & Focused
				</Button>
				<Button
					variant="secondary"
					size="extra-small"
					noBorder={true}
					{...args}
				>
					Extra Small & No Border
				</Button>
				<Button
					variant="secondary"
					size="extra-small"
					isFocus={true}
					noBorder={true}
					{...args}
				>
					Extra Small & No Border & Focused
				</Button>
			</Buttons>

			<Buttons gap="20px" direction="column" alignItems="flex-start">
				<h2 style={{ margin: '0 0 10px' }}>Tertiary Button</h2>
				<Button variant="tertiary" size="normal" {...args}>
					Normal Button
				</Button>
				<Button variant="tertiary" size="small" {...args}>
					Small Button
				</Button>
				<Button
					variant="tertiary"
					size="small"
					icon={<Icon />}
					text="Normal Button + Text + Icon"
					{...args}
				/>
				<Button
					variant="tertiary"
					size="small"
					iconPosition="right"
					icon={<Icon />}
					text="Normal Button + Text + Right Icon"
					{...args}
				/>
				<Button variant="tertiary" size="extra-small" {...args}>
					Extra Small
				</Button>
				<Button
					variant="tertiary"
					size="extra-small"
					isFocus={true}
					{...args}
				>
					Extra Small & Focused
				</Button>
				<Button
					variant="tertiary"
					size="extra-small"
					noBorder={true}
					{...args}
				>
					Extra Small & No Border
				</Button>
				<Button
					variant="tertiary"
					size="extra-small"
					isFocus={true}
					noBorder={true}
					{...args}
				>
					Extra Small & No Border & Focused
				</Button>
			</Buttons>
		</>
	),
	decorators: [inspectDecorator, ...decorators],
};
