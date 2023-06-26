/**
 * Publisher Storybook dependencies
 */
import { default as Decorators } from '@publisher/storybook/decorators';

/**
 * Internal dependencies
 */
import { Flex } from '../../index';
import { default as ColorIndicator } from '../color-indicator';
import { default as ColorIndicatorStack } from '../color-indicator-stack';
import { WithPlaygroundStyles } from '../../../../../.storybook/decorators/with-playground-styles';

const { WithInspectorStyles, SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Components/Color Indicator',
	component: ColorIndicator,
	tags: ['autodocs'],
};

export const Default = {
	component: ColorIndicator,
	args: {
		type: 'color',
		value: '#4a81ff',
	},
	argTypes: {
		value: {
			control: 'color',
		},
		size: {
			control: 'range',
		},
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const Color = {
	args: Default.args,
	argTypes: Default.argTypes,
	render: (args) => (
		<Flex direction="column" gap="30px">
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Color</h2>
				<ColorIndicator {...args} />
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Color → Empty & None</h2>
				<Flex direction="row" gap="20px">
					<ColorIndicator value="" />
					<ColorIndicator value="none" />
				</Flex>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Color → Custom Size</h2>
				<Flex direction="row" gap="20px">
					<ColorIndicator size="30" {...args} />
					<ColorIndicator size="30" value="" />
				</Flex>
			</Flex>
		</Flex>
	),
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const Image = {
	args: {
		type: 'image',
		value: 'https://betterstudio.com/wp-content/uploads/2022/09/publisher-theme.svg',
	},
	argTypes: {
		...Default.argTypes,
		value: {
			control: 'file',
		},
	},
	render: (args) => (
		<Flex direction="column" gap="30px">
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Image</h2>
				<ColorIndicator {...args} />
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Image → Empty & None</h2>
				<Flex direction="row" gap="20px">
					<ColorIndicator {...args} type="image" value="" />
					<ColorIndicator {...args} type="image" value="none" />
				</Flex>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Image → Custom Size</h2>
				<Flex direction="row" gap="20px">
					<ColorIndicator {...args} type="image" size="30" />
					<ColorIndicator {...args} type="image" size="30" value="" />
				</Flex>
			</Flex>
		</Flex>
	),
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const Gradient = {
	component: ColorIndicator,
	args: {
		type: 'gradient',
		value: 'linear-gradient(315deg,rgb(143,0,0) 26%,rgb(117,48,255) 26%,rgb(0,39,179) 58%,rgb(255,122,0) 58%,rgb(150,30,0) 81%,rgb(204,167,0) 100%)',
	},
	argTypes: {
		...Default.argTypes,
		value: {
			control: 'string',
		},
	},
	render: (args) => (
		<Flex direction="column" gap="30px">
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Gradient</h2>
				<ColorIndicator {...args} />
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Gradient → Empty & None</h2>
				<Flex direction="row" gap="20px">
					<ColorIndicator {...args} type="gradient" value="" />
					<ColorIndicator {...args} type="gradient" value="none" />
				</Flex>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Gradient → Custom Size</h2>
				<Flex direction="row" gap="20px">
					<ColorIndicator {...args} type="gradient" size="30" />
					<ColorIndicator
						{...args}
						type="gradient"
						size="30"
						value=""
					/>
				</Flex>
			</Flex>
		</Flex>
	),
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const Stack = {
	component: ColorIndicatorStack,
	args: {},
	argTypes: Default.argTypes,
	render: (args) => (
		<Flex direction="column" gap="30px">
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Stack → Flat Value</h2>
				<ColorIndicatorStack
					{...args}
					value={['#1183ff', '#ff6363', '#2cc800']}
				/>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Stack → Object Value</h2>
				<ColorIndicatorStack
					{...args}
					value={[
						{
							type: 'color',
							value: '#1183ff',
						},
						{
							type: 'image',
							value: 'https://betterstudio.com/wp-content/uploads/2022/09/publisher-theme.svg',
						},
						{
							type: 'gradient',
							value: 'linear-gradient(315deg,rgb(143,0,0) 26%,rgb(117,48,255) 26%,rgb(0,39,179) 58%,rgb(255,122,0) 58%,rgb(150,30,0) 81%,rgb(204,167,0) 100%)',
						},
					]}
				/>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Stack → Custom Size</h2>
				<ColorIndicatorStack
					{...args}
					size="30"
					value={[
						{
							type: 'color',
							value: '#1183ff',
						},
						{
							type: 'image',
							value: 'https://betterstudio.com/wp-content/uploads/2022/09/publisher-theme.svg',
						},
						{
							type: 'gradient',
							value: 'linear-gradient(315deg,rgb(143,0,0) 26%,rgb(117,48,255) 26%,rgb(0,39,179) 58%,rgb(255,122,0) 58%,rgb(150,30,0) 81%,rgb(204,167,0) 100%)',
						},
					]}
				/>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Stack → 1 Item</h2>
				<ColorIndicatorStack {...args} value={['#1183ff']} />
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Stack → 2 Items</h2>
				<ColorIndicatorStack {...args} value={['#1183ff', '#ff6363']} />
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Stack → 5 Items</h2>
				<ColorIndicatorStack
					{...args}
					value={[
						'#1183ff',
						'#ff6363',
						'#2cc800',
						'#becd00',
						'#ff2e63',
					]}
				/>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Stack → 10 Items</h2>
				<ColorIndicatorStack
					{...args}
					value={[
						'#1183ff',
						'#ff1313b3',
						'#2cc800',
						'#becd00',
						'#ff2e63',
						'#ad8400',
						'#0a9cba',
						'#d31000',
						'#0949e8',
						'#5100df',
					]}
					maxItems={10}
				/>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Stack → 15 Items</h2>
				<ColorIndicatorStack
					{...args}
					value={[
						'#1183ff',
						'#ff1313b3',
						'#2cc800',
						'#becd00',
						'#ff2e63',
						'#ad8400',
						'#0a9cba',
						'#d31000',
						'#0949e8',
						'#5100df',
						'#40a700',
						'#231bff',
						'#f62c1b',
						'#e8a909',
						'#a0df00',
					]}
					maxItems={15}
				/>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">
					Stack → 10 Items (Max Items → 6)
				</h2>
				<ColorIndicatorStack
					{...args}
					value={[
						'#1183ff',
						'#ff1313b3',
						'#2cc800',
						'#becd00',
						'#ff2e63',
						'#ad8400',
						'#0a9cba',
						'#d31000',
						'#0949e8',
						'#5100df',
					]}
					maxItems={6}
				/>
			</Flex>
		</Flex>
	),
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const Screenshot = {
	render: () => (
		<Flex direction="column" gap="30px">
			<Color.render {...Color.args} />
			<Image.render {...Image.args} />
			<Gradient.render {...Gradient.args} />
			<Stack.render {...Stack.args} />
		</Flex>
	),
	decorators: [WithInspectorStyles, ...SharedDecorators],
};
