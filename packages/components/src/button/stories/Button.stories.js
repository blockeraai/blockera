/**
 * Publisher Storybook dependencies
 */
import { default as Decorators } from '@publisher/storybook/decorators';

/**
 * Internal dependencies
 */
import Button from '../button';
import Buttons from '../buttons';
import { default as Icon } from './icons/icon';
import { WithPlaygroundStyles } from '../../../../../.storybook/decorators/with-playground-styles';

const { WithInspectorStyles, SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

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
	decorators: [WithInspectorStyles, ...SharedDecorators],
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
	decorators: [WithInspectorStyles, ...SharedDecorators],
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
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const PrimaryButton = {
	render: (args) => (
		<>
			<h2 className="story-heading">Primary Button</h2>

			<Buttons
				gap="20px"
				direction="column"
				alignItems="flex-start"
				style={{ margin: '0 0 50px' }}
			>
				<Button variant="primary" size="normal" {...args}>
					Normal Button
				</Button>
				<Button
					variant="primary"
					size="normal"
					disabled={true}
					{...args}
				>
					Normal Disabled Button
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
				<Button variant="primary" size="small" isFocus={true} {...args}>
					Small + Focused
				</Button>
				<Button
					variant="primary"
					size="small"
					noBorder={true}
					{...args}
				>
					Small + No Border
				</Button>
				<Button
					variant="primary"
					size="small"
					isFocus={true}
					noBorder={true}
					{...args}
				>
					Small + No Border + Focused
				</Button>
			</Buttons>
		</>
	),
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const SecondaryButton = {
	render: (args) => (
		<>
			<h2 className="story-heading">Secondary Button</h2>
			<Buttons
				gap="20px"
				direction="column"
				alignItems="flex-start"
				style={{ margin: '0 0 50px' }}
			>
				<Button variant="secondary" size="normal" {...args}>
					Normal Button
				</Button>
				<Button
					variant="secondary"
					size="normal"
					disabled={true}
					{...args}
				>
					Normal Disabled Button
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
					size="small"
					isFocus={true}
					{...args}
				>
					Small & Focused
				</Button>
				<Button
					variant="secondary"
					size="small"
					noBorder={true}
					{...args}
				>
					Small & No Border
				</Button>
				<Button
					variant="secondary"
					size="small"
					isFocus={true}
					noBorder={true}
					{...args}
				>
					Small & No Border & Focused
				</Button>
			</Buttons>
		</>
	),
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const TertiaryButton = {
	render: (args) => (
		<>
			<h2 className="story-heading">Tertiary Button</h2>
			<Buttons gap="20px" direction="column" alignItems="flex-start">
				<Button variant="tertiary" size="normal" {...args}>
					Normal Button
				</Button>
				<Button
					variant="tertiary"
					size="normal"
					disabled={true}
					{...args}
				>
					Normal Disabled Button
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
					size="small"
					isFocus={true}
					{...args}
				>
					Small & Focused
				</Button>
				<Button
					variant="tertiary"
					size="small"
					noBorder={true}
					{...args}
				>
					Small & No Border
				</Button>
				<Button
					variant="tertiary"
					size="small"
					isFocus={true}
					noBorder={true}
					{...args}
				>
					Small & No Border & Focused
				</Button>
			</Buttons>
		</>
	),
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const Screenshot = {
	render: (args) => (
		<>
			<PrimaryButton.render {...args} />

			<SecondaryButton.render {...args} />

			<TertiaryButton.render {...args} />
		</>
	),
	decorators: [WithInspectorStyles, ...SharedDecorators],
};
