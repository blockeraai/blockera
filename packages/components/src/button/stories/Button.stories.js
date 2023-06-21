/**
 * Internal dependencies
 */
import Button from '../button';
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
		style: 'tertiary',
		children: 'Call to Action',
	},
	decorators: [inspectDecorator, ...decorators],
};

export const Styles = {
	render: (args) => (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '20px',
				alignItems: 'flex-start',
			}}
		>
			<Button style="primary" {...args}>
				Primary Button
			</Button>
			<Button style="secondary" {...args}>
				Secondary Button
			</Button>
			<Button style="tertiary" {...args}>
				Tertiary Button
			</Button>
			<Button style="link" {...args}>
				Link Button
			</Button>
		</div>
	),
	decorators: [inspectDecorator, ...decorators],
};

export const Sizes = {
	render: (args) => (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '20px',
				alignItems: 'flex-start',
			}}
		>
			<Button size="normal" {...args}>
				Normal Button
			</Button>
			<Button size="small" {...args}>
				Small Button
			</Button>
			<Button size="extra-small" {...args}>
				Extra Small
			</Button>
		</div>
	),
	decorators: [inspectDecorator, ...decorators],
};

export const Screenshot = {
	render: (args) => (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '20px',
				alignItems: 'flex-start',
			}}
		>
			<h3 style={{ margin: '0 0 10px' }}>Primary Button</h3>
			<Button style="primary" size="normal" {...args}>
				Normal Button
			</Button>
			<Button style="primary" size="small" {...args}>
				Small Button
			</Button>
			<Button
				style="primary"
				size="small"
				icon={<Icon />}
				text="Small Button + Text + Icon"
				{...args}
			/>
			<Button
				style="primary"
				size="small"
				iconPosition="right"
				icon={<Icon />}
				text="Small Button + Text + Right Icon"
				{...args}
			/>
			<Button style="primary" size="extra-small" {...args}>
				Extra Small
			</Button>
			<Button style="primary" size="extra-small" isFocus={true} {...args}>
				Extra Small + Focused
			</Button>
			<Button
				style="primary"
				size="extra-small"
				noBorder={true}
				{...args}
			>
				Extra Small + No Border
			</Button>
			<Button
				style="primary"
				size="extra-small"
				isFocus={true}
				noBorder={true}
				{...args}
			>
				Extra Small + No Border + Focused
			</Button>

			<h3 style={{ margin: '30px 0 10px' }}>Secondary Button</h3>
			<Button style="secondary" size="normal" {...args}>
				Normal Button
			</Button>
			<Button style="secondary" size="small" {...args}>
				Small Button
			</Button>
			<Button
				style="secondary"
				size="small"
				icon={<Icon />}
				text="Normal Button + Text + Icon"
				{...args}
			/>
			<Button
				style="secondary"
				size="small"
				iconPosition="right"
				icon={<Icon />}
				text="Normal Button + Text + Right Icon"
				{...args}
			/>
			<Button style="secondary" size="extra-small" {...args}>
				Extra Small
			</Button>
			<Button
				style="secondary"
				size="extra-small"
				isFocus={true}
				{...args}
			>
				Extra Small & Focused
			</Button>
			<Button
				style="secondary"
				size="extra-small"
				noBorder={true}
				{...args}
			>
				Extra Small & No Border
			</Button>
			<Button
				style="secondary"
				size="extra-small"
				isFocus={true}
				noBorder={true}
				{...args}
			>
				Extra Small & No Border & Focused
			</Button>

			<h3 style={{ margin: '30px 0 10px' }}>Tertiary Button</h3>
			<Button style="tertiary" size="normal" {...args}>
				Normal Button
			</Button>
			<Button style="tertiary" size="small" {...args}>
				Small Button
			</Button>
			<Button
				style="tertiary"
				size="small"
				icon={<Icon />}
				text="Normal Button + Text + Icon"
				{...args}
			/>
			<Button
				style="tertiary"
				size="small"
				iconPosition="right"
				icon={<Icon />}
				text="Normal Button + Text + Right Icon"
				{...args}
			/>
			<Button style="tertiary" size="extra-small" {...args}>
				Extra Small
			</Button>
			<Button
				style="tertiary"
				size="extra-small"
				isFocus={true}
				{...args}
			>
				Extra Small & Focused
			</Button>
			<Button
				style="tertiary"
				size="extra-small"
				noBorder={true}
				{...args}
			>
				Extra Small & No Border
			</Button>
			<Button
				style="tertiary"
				size="extra-small"
				isFocus={true}
				noBorder={true}
				{...args}
			>
				Extra Small & No Border & Focused
			</Button>
		</div>
	),
	decorators: [inspectDecorator, ...decorators],
};
