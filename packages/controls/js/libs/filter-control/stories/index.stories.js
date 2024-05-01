/**
 * External dependencies
 */
import { useContext } from '@wordpress/element';
import { nanoid } from 'nanoid';

/**
 * Blockera dependencies
 */
import { Flex } from '@blockera/components';
import { default as Decorators } from '@blockera/storybook/decorators';

/**
 * Internal dependencies
 */
import FilterControl from '../index';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import { ControlContextProvider } from '../../../context';
import { STORE_NAME } from '../../repeater-control/store';

const {
	WithInspectorStyles,
	StoryDataContext,
	SharedDecorators,
	WithPopoverDataProvider,
} = Decorators;

SharedDecorators.push(WithPlaygroundStyles);
SharedDecorators.push(WithPopoverDataProvider);

export default {
	title: 'Controls/FilterControl',
	component: FilterControl,
	tags: ['autodocs'],
};

export const Empty = {
	args: {
		label: 'Filters',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="20px">
			<h2 className="story-heading">
				Filter<span>Empty</span>
			</h2>

			<ControlContextProvider
				storeName={STORE_NAME}
				value={{
					name: nanoid(),
					value: [],
				}}
			>
				<ControlWithHooks Control={FilterControl} {...args} />
			</ControlContextProvider>
		</Flex>
	),
};

export const Fill = {
	args: {
		label: 'Filters',
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
									type: 'blur',
									blur: '10px',
									isVisible: true,
								},
								{
									type: 'drop-shadow',
									'drop-shadow-x': '20px',
									'drop-shadow-y': '20px',
									'drop-shadow-blur': '20px',
									'drop-shadow-color': '#0947eb',
									isVisible: true,
								},
								{
									type: 'brightness',
									brightness: '30%',
									isVisible: true,
								},
								{
									type: 'contrast',
									contrast: '40%',
									isVisible: true,
								},
								{
									type: 'hue-rotate',
									'hue-rotate': '50deg',
									isVisible: true,
								},
								{
									type: 'saturate',
									saturate: '60%',
									isVisible: true,
								},
								{
									type: 'grayscale',
									grayscale: '70%',
									isVisible: true,
								},
								{
									type: 'invert',
									invert: '80%',
									isVisible: true,
								},
								{
									type: 'sepia',
									sepia: '90%',
									isVisible: true,
								},
							],
						}}
					>
						<ControlWithHooks Control={FilterControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Filled<span>CSS Values</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									type: 'blur',
									blur: 'calc(10px)func',
									isVisible: true,
								},
								{
									type: 'drop-shadow',
									'drop-shadow-x': '20pxfunc',
									'drop-shadow-y': '20pxfunc',
									'drop-shadow-blur': '20pxfunc',
									'drop-shadow-color': '#0947eb',
									isVisible: true,
								},
								{
									type: 'brightness',
									brightness: '30%func',
									isVisible: true,
								},
								{
									type: 'contrast',
									contrast: '40%func',
									isVisible: true,
								},
								{
									type: 'hue-rotate',
									'hue-rotate': '50degfunc',
									isVisible: true,
								},
								{
									type: 'saturate',
									saturate: '60%func',
									isVisible: true,
								},
								{
									type: 'grayscale',
									grayscale: '70%func',
									isVisible: true,
								},
								{
									type: 'invert',
									invert: '80%func',
									isVisible: true,
								},
								{
									type: 'sepia',
									sepia: '90%func',
									isVisible: true,
								},
							],
						}}
					>
						<ControlWithHooks Control={FilterControl} {...args} />
					</ControlContextProvider>
				</Flex>
			</Flex>
		);
	},
};

export const Open = {
	args: {
		label: 'Filters',
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
						Open<span>Blur</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									type: 'blur',
									blur: '10px',
									isVisible: true,
									isOpen: true,
								},
							],
						}}
					>
						<ControlWithHooks Control={FilterControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '300px' }}
				>
					<h2 className="story-heading">
						Open<span>Drop Shadow</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									type: 'drop-shadow',
									'drop-shadow-x': '20px',
									'drop-shadow-y': '20px',
									'drop-shadow-blur': '20px',
									'drop-shadow-color': '#0947eb',
									isVisible: true,
									isOpen: true,
								},
							],
						}}
					>
						<ControlWithHooks Control={FilterControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '180px' }}
				>
					<h2 className="story-heading">
						Open<span>Brightness</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									type: 'brightness',
									brightness: '30%',
									isVisible: true,
									isOpen: true,
								},
							],
						}}
					>
						<ControlWithHooks Control={FilterControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '180px' }}
				>
					<h2 className="story-heading">
						Open<span>Contrast</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									type: 'contrast',
									contrast: '40%',
									isVisible: true,
									isOpen: true,
								},
							],
						}}
					>
						<ControlWithHooks Control={FilterControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '180px' }}
				>
					<h2 className="story-heading">
						Open<span>Hue Rotate</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									type: 'hue-rotate',
									'hue-rotate': '50deg',
									isVisible: true,
									isOpen: true,
								},
							],
						}}
					>
						<ControlWithHooks Control={FilterControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '180px' }}
				>
					<h2 className="story-heading">
						Open<span>Saturate</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									type: 'saturate',
									saturate: '60%',
									isVisible: true,
									isOpen: true,
								},
							],
						}}
					>
						<ControlWithHooks Control={FilterControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '180px' }}
				>
					<h2 className="story-heading">
						Open<span>Grayscale</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									type: 'grayscale',
									grayscale: '70%',
									isVisible: true,
									isOpen: true,
								},
							],
						}}
					>
						<ControlWithHooks Control={FilterControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '180px' }}
				>
					<h2 className="story-heading">
						Open<span>Invert</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									type: 'invert',
									invert: '80%',
									isVisible: true,
									isOpen: true,
								},
							],
						}}
					>
						<ControlWithHooks Control={FilterControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '180px' }}
				>
					<h2 className="story-heading">
						Open<span>Sepia</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									type: 'sepia',
									sepia: '90%',
									isVisible: true,
									isOpen: true,
								},
							],
						}}
					>
						<ControlWithHooks Control={FilterControl} {...args} />
					</ControlContextProvider>
				</Flex>
			</Flex>
		);
	},
};

const ControlWithHooks = (args) => {
	const { storyValue, setStoryValue } = useContext(StoryDataContext);

	return (
		<FilterControl {...args} onChange={setStoryValue} value={storyValue} />
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
		</Flex>
	),
};
