/**
 * External dependencies
 */
import { nanoid } from 'nanoid';

/**
 * Blockera dependencies
 */
import { Flex } from '@blockera/components';
import { default as Decorators } from '@blockera/storybook/decorators';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';

/**
 * Internal dependencies
 */
import { TransformControl } from '../../index';
import { STORE_NAME } from '../../repeater-control/store';
import { ControlContextProvider } from '../../../context';
import { WithControlDataProvider } from '../../../../../../.storybook/decorators/with-control-data-provider';

const { WithInspectorStyles, SharedDecorators, WithPopoverDataProvider } =
	Decorators;

SharedDecorators.push(WithPopoverDataProvider);
SharedDecorators.push(WithControlDataProvider);
SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Controls/TransformControl',
	component: TransformControl,
	tags: ['autodocs'],
};

export const Empty = {
	args: {
		label: 'Transforms',
		controlInfo: {
			name: nanoid(),
			value: [],
		},
		storeName: STORE_NAME,
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const Fill = {
	args: {
		label: 'Transforms',
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
									type: 'move',
									'move-x': '10px',
									'move-y': '10px',
									'move-z': '10px',
									isVisible: true,
								},
								{
									type: 'scale',
									scale: '20%',
									isVisible: true,
								},
								{
									type: 'rotate',
									'rotate-x': '30deg',
									'rotate-y': '30deg',
									'rotate-z': '30deg',
									isVisible: true,
								},
								{
									type: 'skew',
									'skew-x': '40deg',
									'skew-y': '40deg',
									isVisible: true,
								},
							],
						}}
					>
						<TransformControl {...args} />
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
									type: 'move',
									'move-x': '10pxfunc',
									'move-y': '10pxfunc',
									'move-z': '10pxfunc',
									isVisible: true,
								},
								{
									type: 'move',
									'move-x': '10px',
									'move-y': '10pxfunc',
									'move-z': '10pxfunc',
									isVisible: true,
								},
								{
									type: 'move',
									'move-x': '10pxfunc',
									'move-y': '10px',
									'move-z': '10pxfunc',
									isVisible: true,
								},
								{
									type: 'move',
									'move-x': '10pxfunc',
									'move-y': '10pxfunc',
									'move-z': '10px',
									isVisible: true,
								},
								{
									type: 'scale',
									scale: '20%func',
									isVisible: true,
								},
								{
									type: 'rotate',
									'rotate-x': '30degfunc',
									'rotate-y': '30degfunc',
									'rotate-z': '30degfunc',
									isVisible: true,
								},
								{
									type: 'rotate',
									'rotate-x': '30deg',
									'rotate-y': '30degfunc',
									'rotate-z': '30degfunc',
									isVisible: true,
								},
								{
									type: 'rotate',
									'rotate-x': '30degfunc',
									'rotate-y': '30deg',
									'rotate-z': '30degfunc',
									isVisible: true,
								},
								{
									type: 'rotate',
									'rotate-x': '30degfunc',
									'rotate-y': '30degfunc',
									'rotate-z': '30deg',
									isVisible: true,
								},
								{
									type: 'skew',
									'skew-x': '40degfunc',
									'skew-y': '40degfunc',
									isVisible: true,
								},
								{
									type: 'skew',
									'skew-x': '40deg',
									'skew-y': '40degfunc',
									isVisible: true,
								},
								{
									type: 'skew',
									'skew-x': '40degfunc',
									'skew-y': '40deg',
									isVisible: true,
								},
							],
						}}
					>
						<TransformControl {...args} />
					</ControlContextProvider>
				</Flex>
			</Flex>
		);
	},
};

export const Open = {
	args: {
		label: 'Transforms',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="50px">
				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '250px' }}
				>
					<h2 className="story-heading">
						Open<span>Move</span>
					</h2>
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									type: 'move',
									'move-x': '10px',
									'move-y': '20px',
									'move-z': '30px',
									isVisible: true,
									isOpen: true,
								},
							],
						}}
					>
						<TransformControl {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '150px' }}
				>
					<h2 className="story-heading">
						Open<span>Scale</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									type: 'scale',
									scale: '20%',
									isVisible: true,
									isOpen: true,
								},
							],
						}}
					>
						<TransformControl {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '150px' }}
				>
					<h2 className="story-heading">
						Open<span>Rotate</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									type: 'rotate',
									'rotate-x': '30deg',
									'rotate-y': '40deg',
									'rotate-z': '50deg',
									isOpen: true,
								},
							],
						}}
					>
						<TransformControl {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '250px' }}
				>
					<h2 className="story-heading">
						Open<span>Skew</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									type: 'skew',
									'skew-x': '40deg',
									'skew-y': '50deg',
									isVisible: true,
									isOpen: true,
								},
							],
						}}
					>
						<TransformControl {...args} />
					</ControlContextProvider>
				</Flex>
			</Flex>
		);
	},
};

export const All = {
	args: {},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: () => (
		<Flex direction="column" gap="50px">
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Empty</h2>
				<ControlContextProvider
					storeName={STORE_NAME}
					value={{
						name: nanoid(),
						value: [],
					}}
				>
					<TransformControl />
				</ControlContextProvider>
			</Flex>

			<Fill.render />

			<Open.render />
		</Flex>
	),
};
