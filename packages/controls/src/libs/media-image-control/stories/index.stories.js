/**
 * Publisher dependencies
 */
import { Flex } from '@publisher/components';
import { default as Decorators } from '@publisher/storybook/decorators';

/**
 * Internal dependencies
 */
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import { MediaImageControl } from '../../index';

const { WithInspectorStyles, SharedDecorators, WithPopoverDataProvider } =
	Decorators;

SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Controls/MediaImageControl',
	component: MediaImageControl,
	tags: ['autodocs'],
};

export const Empty = {
	args: {
		label: '',
	},
	decorators: [
		WithInspectorStyles,
		WithPopoverDataProvider,
		...SharedDecorators,
	],
};

export const Filled = {
	args: {
		label: '',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="50px">
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Image<span>Filled</span>
					</h2>
					<MediaImageControl
						{...args}
						value="https://betterstudio.com/wp-content/uploads/2022/09/publisher-theme.svg"
					/>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Image<span>Large Image</span>
					</h2>
					<MediaImageControl
						{...args}
						value="https://betterstudio.com/wp-content/uploads/2023/05/Best-WooCommerce-Currency-Switcher-Plugins.png"
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
				<MediaImageControl {...Empty.args} />
			</Flex>

			<Filled.render />
		</Flex>
	),
};
