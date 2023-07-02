/**
 * Publisher dependencies
 */
import { Flex } from '@publisher/components';
import { default as Decorators } from '@publisher/storybook/decorators';

/**
 * Internal dependencies
 */
import { WithPlaygroundStyles } from '../../../../../.storybook/preview';
import GradientBarControl from '../index';

const { WithInspectorStyles, SharedDecorators, WithPopoverDataProvider } =
	Decorators;

SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Controls/GradientBarControl',
	component: GradientBarControl,
	tags: ['autodocs'],
};

export const Empty = {
	args: {},
	decorators: [
		WithInspectorStyles,
		WithPopoverDataProvider,
		...SharedDecorators,
	],
};

export const Filled = {
	args: {},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="50px">
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Gradient<span>Linear Gradient</span>
					</h2>
					<GradientBarControl
						{...args}
						value="linear-gradient(90deg,rgb(25,0,255) 10%,rgb(230,134,0) 90%)"
					/>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Gradient<span>Radial Gradient</span>
					</h2>
					<GradientBarControl
						{...args}
						value="radial-gradient(rgb(250,0,247) 0%,rgb(255,213,0) 64%)"
					/>
				</Flex>
			</Flex>
		);
	},
};

export const Screenshot = {
	args: {},
	decorators: [
		WithInspectorStyles,
		WithPopoverDataProvider,
		...SharedDecorators,
	],
	render: () => (
		<Flex direction="column" gap="50px">
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Empty</h2>
				<GradientBarControl {...Empty.args} />
			</Flex>

			<Filled.render />
		</Flex>
	),
};
