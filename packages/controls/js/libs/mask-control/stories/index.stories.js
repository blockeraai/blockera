/**
 * External dependencies
 */
import { useContext } from '@wordpress/element';
import { nanoid } from 'nanoid';

/**
 * Blockera dependencies
 */
import { default as Decorators } from '@blockera/dev-storybook/js/decorators';

/**
 * Internal dependencies
 */
import { Flex } from '../../';
import MaskControl from '../index';
import { ControlContextProvider } from '../../../context';
import { STORE_NAME } from '../../repeater-control/store';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';

const {
	WithInspectorStyles,
	StoryDataContext,
	SharedDecorators,
	WithPopoverDataProvider,
} = Decorators;

SharedDecorators.push(WithPlaygroundStyles);
SharedDecorators.push(WithPopoverDataProvider);

export default {
	title: 'Controls/MaskControl',
	component: MaskControl,
	tags: ['autodocs'],
};

export const Empty = {
	args: {
		label: 'Mask',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="20px">
			<h2 className="story-heading">
				Mask<span>Empty</span>
			</h2>

			<ControlContextProvider
				storeName={STORE_NAME}
				value={{
					name: nanoid(),
					value: [],
				}}
			>
				<ControlWithHooks Control={MaskControl} {...args} />
			</ControlContextProvider>
		</Flex>
	),
};

export const Fill = {
	args: {
		label: 'Mask',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="50px">
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Filled</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									shape: { type: 'shape', id: 'Blob 1' },
									size: 'custom',
									'size-width': '',
									'size-height': '',
									repeat: 'no-repeat',
									position: { top: '50%', left: '50%' },
									'horizontally-flip': false,
									'vertically-flip': false,
									isVisible: true,
									isOpen: false,
								},
							],
						}}
					>
						<ControlWithHooks Control={MaskControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Filled<span>H Flip</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									shape: { type: 'shape', id: 'Stairs' },
									size: 'custom',
									'size-width': '',
									'size-height': '',
									repeat: 'no-repeat',
									position: { top: '50%', left: '50%' },
									'horizontally-flip': true,
									'vertically-flip': false,
									isVisible: true,
									isOpen: false,
								},
							],
						}}
					>
						<ControlWithHooks Control={MaskControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Filled<span>V Flip</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									shape: { type: 'shape', id: 'Stairs' },
									size: 'custom',
									'size-width': '',
									'size-height': '',
									repeat: 'no-repeat',
									position: { top: '50%', left: '50%' },
									'horizontally-flip': false,
									'vertically-flip': true,
									isVisible: true,
									isOpen: false,
								},
							],
						}}
					>
						<ControlWithHooks Control={MaskControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Filled<span>H&V Flip</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									shape: { type: 'shape', id: 'Stairs' },
									size: 'custom',
									'size-width': '',
									'size-height': '',
									repeat: 'no-repeat',
									position: { top: '50%', left: '50%' },
									'horizontally-flip': true,
									'vertically-flip': true,
									isVisible: true,
									isOpen: false,
								},
							],
						}}
					>
						<ControlWithHooks Control={MaskControl} {...args} />
					</ControlContextProvider>
				</Flex>
			</Flex>
		);
	},
};

export const Open = {
	args: {
		label: 'Mask',
	},

	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="50px">
				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '180px' }}
				>
					<h2 className="story-heading">
						Open<span></span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									shape: { type: 'shape', id: 'Blob 1' },
									size: 'custom',
									'size-width': '',
									'size-height': '',
									repeat: 'no-repeat',
									position: { top: '50%', left: '50%' },
									'horizontally-flip': false,
									'vertically-flip': false,
									isVisible: true,
									isOpen: true,
								},
							],
						}}
					>
						<ControlWithHooks Control={MaskControl} {...args} />
					</ControlContextProvider>
				</Flex>
			</Flex>
		);
	},
};

export const Shapes = {
	args: {
		label: 'Mask',
	},

	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="50px">
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Shapes</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									shape: { type: 'shape', id: 'Blob 1' },
								},
							],
						}}
					>
						<ControlWithHooks Control={MaskControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									shape: { type: 'shape', id: 'Blob 2' },
									isOpen: false,
								},
							],
						}}
					>
						<ControlWithHooks Control={MaskControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									shape: { type: 'shape', id: 'Blob 3' },
									isOpen: false,
								},
							],
						}}
					>
						<ControlWithHooks Control={MaskControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									shape: { type: 'shape', id: 'Blob 4' },
									isOpen: false,
								},
							],
						}}
					>
						<ControlWithHooks Control={MaskControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									shape: { type: 'shape', id: 'Blob 5' },
									isOpen: false,
								},
							],
						}}
					>
						<ControlWithHooks Control={MaskControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									shape: { type: 'shape', id: 'Blob 6' },
									isOpen: false,
								},
							],
						}}
					>
						<ControlWithHooks Control={MaskControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									shape: { type: 'shape', id: 'Blob 7' },
									isOpen: false,
								},
							],
						}}
					>
						<ControlWithHooks Control={MaskControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									shape: { type: 'shape', id: 'Blob 8' },
									isOpen: false,
								},
							],
						}}
					>
						<ControlWithHooks Control={MaskControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									shape: { type: 'shape', id: 'Blob 9' },
									isOpen: false,
								},
							],
						}}
					>
						<ControlWithHooks Control={MaskControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									shape: { type: 'shape', id: 'Blob 10' },
									isOpen: false,
								},
							],
						}}
					>
						<ControlWithHooks Control={MaskControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									shape: { type: 'shape', id: 'Blob 11' },
									isOpen: false,
								},
							],
						}}
					>
						<ControlWithHooks Control={MaskControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									shape: { type: 'shape', id: 'Blob 12' },
									isOpen: false,
								},
							],
						}}
					>
						<ControlWithHooks Control={MaskControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									shape: { type: 'shape', id: 'Sketch 1' },
									isOpen: false,
								},
							],
						}}
					>
						<ControlWithHooks Control={MaskControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									shape: { type: 'shape', id: 'Sketch 2' },
									isOpen: false,
								},
							],
						}}
					>
						<ControlWithHooks Control={MaskControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									shape: { type: 'shape', id: 'Sketch 3' },
									isOpen: false,
								},
							],
						}}
					>
						<ControlWithHooks Control={MaskControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									shape: { type: 'shape', id: 'Sketch 4' },
									isOpen: false,
								},
							],
						}}
					>
						<ControlWithHooks Control={MaskControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									shape: { type: 'shape', id: 'Sketch 5' },
									isOpen: false,
								},
							],
						}}
					>
						<ControlWithHooks Control={MaskControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									shape: { type: 'shape', id: 'Sketch 6' },
									isOpen: false,
								},
							],
						}}
					>
						<ControlWithHooks Control={MaskControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									shape: { type: 'shape', id: 'Sketch 7' },
									isOpen: false,
								},
							],
						}}
					>
						<ControlWithHooks Control={MaskControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									shape: { type: 'shape', id: 'Sketch 8' },
									isOpen: false,
								},
							],
						}}
					>
						<ControlWithHooks Control={MaskControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									shape: {
										type: 'shape',
										id: 'Paint Circle 1',
									},
									isOpen: false,
								},
							],
						}}
					>
						<ControlWithHooks Control={MaskControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									shape: {
										type: 'shape',
										id: 'Paint Circle 2',
									},
									isOpen: false,
								},
							],
						}}
					>
						<ControlWithHooks Control={MaskControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									shape: {
										type: 'shape',
										id: 'Paint Circle 3',
									},
									isOpen: false,
								},
							],
						}}
					>
						<ControlWithHooks Control={MaskControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									shape: {
										type: 'shape',
										id: 'Paint Circle 1',
									},
									isOpen: false,
								},
							],
						}}
					>
						<ControlWithHooks Control={MaskControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									shape: {
										type: 'shape',
										id: 'Splatter 1',
									},
									isOpen: false,
								},
							],
						}}
					>
						<ControlWithHooks Control={MaskControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									shape: {
										type: 'shape',
										id: 'Splatter 2',
									},
									isOpen: false,
								},
							],
						}}
					>
						<ControlWithHooks Control={MaskControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									shape: {
										type: 'shape',
										id: 'Splatter 3',
									},
									isOpen: false,
								},
							],
						}}
					>
						<ControlWithHooks Control={MaskControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									shape: {
										type: 'shape',
										id: 'Splatter 4',
									},
									isOpen: false,
								},
							],
						}}
					>
						<ControlWithHooks Control={MaskControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									shape: {
										type: 'shape',
										id: 'Circle',
									},
									isOpen: false,
								},
							],
						}}
					>
						<ControlWithHooks Control={MaskControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									shape: {
										type: 'shape',
										id: 'Triangle',
									},
									isOpen: false,
								},
							],
						}}
					>
						<ControlWithHooks Control={MaskControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									shape: {
										type: 'shape',
										id: 'Hexagon',
									},
									isOpen: false,
								},
							],
						}}
					>
						<ControlWithHooks Control={MaskControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									shape: {
										type: 'shape',
										id: 'Octagon',
									},
									isOpen: false,
								},
							],
						}}
					>
						<ControlWithHooks Control={MaskControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									shape: {
										type: 'shape',
										id: 'Flower',
									},
									isOpen: false,
								},
							],
						}}
					>
						<ControlWithHooks Control={MaskControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									shape: {
										type: 'shape',
										id: 'Multiplication',
									},
									isOpen: false,
								},
							],
						}}
					>
						<ControlWithHooks Control={MaskControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									shape: {
										type: 'shape',
										id: 'Star',
									},
									isOpen: false,
								},
							],
						}}
					>
						<ControlWithHooks Control={MaskControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									shape: {
										type: 'shape',
										id: 'Stairs',
									},
									isOpen: false,
								},
							],
						}}
					>
						<ControlWithHooks Control={MaskControl} {...args} />
					</ControlContextProvider>
				</Flex>
			</Flex>
		);
	},
};

const ControlWithHooks = (args) => {
	const { storyValue, setStoryValue } = useContext(StoryDataContext);

	return (
		<MaskControl {...args} onChange={setStoryValue} value={storyValue} />
	);
};

export const All = {
	args: {},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: () => (
		<Flex direction="column" gap="50px">
			<Empty.render {...Empty.args} />

			<Fill.render {...Fill.args} />

			<Open.render {...Open.args} />

			<Shapes.render {...Shapes.args} />
		</Flex>
	),
};
