/**
 * External dependencies
 */

import { nanoid } from 'nanoid';

/**
 * Publisher dependencies
 */
import { Flex } from '@publisher/components';
import { default as Decorators } from '@publisher/storybook/decorators';

/**
 * Internal dependencies
 */
import { DividerControl } from '../../index';
import { STORE_NAME } from '../../repeater-control/store';
import { ControlContextProvider } from '../../../context';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import ControlWithHooks from '../../../../../../.storybook/components/control-with-hooks';

const { WithInspectorStyles, SharedDecorators, WithPopoverDataProvider } =
	Decorators;

SharedDecorators.push(WithPlaygroundStyles);
SharedDecorators.push(WithPopoverDataProvider);

export default {
	title: 'Controls/DividerControl',
	component: DividerControl,
	tags: ['autodocs'],
};

export const Empty = {
	args: {
		label: 'Divider',
		defaultValue: [],
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="20px">
			<h2 className="story-heading">
				Divider<span>Empty</span>
			</h2>

			<ControlContextProvider
				storeName={STORE_NAME}
				value={{
					name: nanoid(),
					value: [],
				}}
			>
				<ControlWithHooks Control={DividerControl} {...args} />
			</ControlContextProvider>
		</Flex>
	),
};

export const Fill = {
	args: {
		label: 'Dividers',
	},

	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="50px">
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Filled<span>default</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [{}],
						}}
					>
						<ControlWithHooks Control={DividerControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Filled<span>Top</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									position: 'top',
									shape: {
										type: 'shape',
										id: 'wave-opacity',
									},
									color: '',
									size: { width: '', height: '' },
									animate: false,
									duration: '',
									flip: false,
									onFront: false,
									isVisible: true,
								},
							],
						}}
					>
						<ControlWithHooks Control={DividerControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Filled<span>Bottom</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									position: 'bottom',
									shape: {
										type: 'shape',
										id: 'wave-opacity',
									},
									color: '',
									size: { width: '', height: '' },
									animate: false,
									duration: '',
									flip: false,
									onFront: false,
									isVisible: true,
								},
							],
						}}
					>
						<ControlWithHooks Control={DividerControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Filled<span>Colored</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									position: 'top',
									shape: {
										type: 'shape',
										id: 'wave-opacity',
									},
									color: '#b96b6b',
									size: { width: '', height: '' },
									animate: false,
									duration: '',
									flip: false,
									onFront: false,
									isVisible: true,
								},
							],
						}}
					>
						<ControlWithHooks Control={DividerControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Filled<span>Multiple</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									position: 'bottom',
									shape: {
										type: 'shape',
										id: 'wave-opacity',
									},
									color: '',
									size: { width: '', height: '' },
									animate: false,
									duration: '',
									flip: false,
									onFront: false,
									isVisible: true,
								},
								{
									position: 'top',
									shape: {
										type: 'shape',
										id: 'wave-opacity',
									},
									color: '#601fd9',
									size: { width: '', height: '' },
									animate: false,
									duration: '',
									flip: false,
									onFront: false,
									isVisible: true,
								},
								{
									position: 'bottom',
									shape: {
										type: 'shape',
										id: 'wave-opacity',
									},
									color: '#b96b6b',
									size: { width: '', height: '' },
									animate: false,
									duration: '',
									flip: false,
									onFront: false,
									isVisible: true,
								},
							],
						}}
					>
						<ControlWithHooks Control={DividerControl} {...args} />
					</ControlContextProvider>
				</Flex>
			</Flex>
		);
	},
};

export const Open = {
	args: {
		label: 'Divider',
	},
	decorators: [
		WithInspectorStyles,
		WithPopoverDataProvider,
		...SharedDecorators,
	],
	render: (args) => {
		return (
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">
					Filled<span>Open Item</span>
				</h2>

				<ControlContextProvider
					storeName={STORE_NAME}
					value={{
						name: nanoid(),
						value: [
							{
								position: 'top',
								shape: {
									type: 'shape',
									id: 'wave-opacity',
								},
								color: '#b96b6b',
								size: { width: '', height: '' },
								animate: false,
								duration: '',
								flip: false,
								onFront: false,
								isVisible: true,
								isOpen: true,
							},
						],
					}}
				>
					<ControlWithHooks Control={DividerControl} {...args} />
				</ControlContextProvider>
			</Flex>
		);
	},
};

export const Shapes = {
	args: {
		label: 'Dividers',
	},
	decorators: [
		WithInspectorStyles,
		WithPopoverDataProvider,
		...SharedDecorators,
	],
	render: (args) => {
		return (
			<Flex direction="column" gap="50px">
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Shapes<span>wave-opacity</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									position: 'top',
									shape: {
										type: 'shape',
										id: 'wave-opacity',
									},
									color: '',
									size: { width: '', height: '' },
									animate: false,
									duration: '',
									flip: false,
									onFront: false,
									isVisible: true,
								},
							],
						}}
					>
						<ControlWithHooks Control={DividerControl} {...args} />
					</ControlContextProvider>
				</Flex>
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						<span>wave-1</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									position: 'top',
									shape: {
										type: 'shape',
										id: 'wave-1',
									},
									color: '',
									size: { width: '', height: '' },
									animate: false,
									duration: '',
									flip: false,
									onFront: false,
									isVisible: true,
								},
							],
						}}
					>
						<ControlWithHooks Control={DividerControl} {...args} />
					</ControlContextProvider>
				</Flex>
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						<span>wave-2</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									position: 'top',
									shape: {
										type: 'shape',
										id: 'wave-2',
									},
									color: '',
									size: { width: '', height: '' },
									animate: false,
									duration: '',
									flip: false,
									onFront: false,
									isVisible: true,
								},
							],
						}}
					>
						<ControlWithHooks Control={DividerControl} {...args} />
					</ControlContextProvider>
				</Flex>
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						<span>curve-1</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									position: 'top',
									shape: {
										type: 'shape',
										id: 'curve-1',
									},
									color: '',
									size: { width: '', height: '' },
									animate: false,
									duration: '',
									flip: false,
									onFront: false,
									isVisible: true,
								},
							],
						}}
					>
						<ControlWithHooks Control={DividerControl} {...args} />
					</ControlContextProvider>
				</Flex>
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						<span>curve-2</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									position: 'top',
									shape: {
										type: 'shape',
										id: 'curve-2',
									},
									color: '',
									size: { width: '', height: '' },
									animate: false,
									duration: '',
									flip: false,
									onFront: false,
									isVisible: true,
								},
							],
						}}
					>
						<ControlWithHooks Control={DividerControl} {...args} />
					</ControlContextProvider>
				</Flex>
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						<span>triangle-1</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									position: 'top',
									shape: {
										type: 'shape',
										id: 'triangle-1',
									},
									color: '',
									size: { width: '', height: '' },
									animate: false,
									duration: '',
									flip: false,
									onFront: false,
									isVisible: true,
								},
							],
						}}
					>
						<ControlWithHooks Control={DividerControl} {...args} />
					</ControlContextProvider>
				</Flex>
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						<span>triangle-2</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									position: 'top',
									shape: {
										type: 'shape',
										id: 'triangle-2',
									},
									color: '',
									size: { width: '', height: '' },
									animate: false,
									duration: '',
									flip: false,
									onFront: false,
									isVisible: true,
								},
							],
						}}
					>
						<ControlWithHooks Control={DividerControl} {...args} />
					</ControlContextProvider>
				</Flex>
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						<span>triangle-3</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									position: 'top',
									shape: {
										type: 'shape',
										id: 'triangle-3',
									},
									color: '',
									size: { width: '', height: '' },
									animate: false,
									duration: '',
									flip: false,
									onFront: false,
									isVisible: true,
								},
							],
						}}
					>
						<ControlWithHooks Control={DividerControl} {...args} />
					</ControlContextProvider>
				</Flex>
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						<span>triangle-4</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									position: 'top',
									shape: {
										type: 'shape',
										id: 'triangle-4',
									},
									color: '',
									size: { width: '', height: '' },
									animate: false,
									duration: '',
									flip: false,
									onFront: false,
									isVisible: true,
								},
							],
						}}
					>
						<ControlWithHooks Control={DividerControl} {...args} />
					</ControlContextProvider>
				</Flex>
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						<span>triangle-5</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									position: 'top',
									shape: {
										type: 'shape',
										id: 'triangle-5',
									},
									color: '',
									size: { width: '', height: '' },
									animate: false,
									duration: '',
									flip: false,
									onFront: false,
									isVisible: true,
								},
							],
						}}
					>
						<ControlWithHooks Control={DividerControl} {...args} />
					</ControlContextProvider>
				</Flex>
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						<span>triangle-6</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									position: 'top',
									shape: {
										type: 'shape',
										id: 'triangle-6',
									},
									color: '',
									size: { width: '', height: '' },
									animate: false,
									duration: '',
									flip: false,
									onFront: false,
									isVisible: true,
								},
							],
						}}
					>
						<ControlWithHooks Control={DividerControl} {...args} />
					</ControlContextProvider>
				</Flex>
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						<span>title-1</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									position: 'top',
									shape: {
										type: 'shape',
										id: 'title-1',
									},
									color: '',
									size: { width: '', height: '' },
									animate: false,
									duration: '',
									flip: false,
									onFront: false,
									isVisible: true,
								},
							],
						}}
					>
						<ControlWithHooks Control={DividerControl} {...args} />
					</ControlContextProvider>
				</Flex>
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						<span>title-2</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									position: 'top',
									shape: {
										type: 'shape',
										id: 'title-2',
									},
									color: '',
									size: { width: '', height: '' },
									animate: false,
									duration: '',
									flip: false,
									onFront: false,
									isVisible: true,
								},
							],
						}}
					>
						<ControlWithHooks Control={DividerControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						<span>title-3</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									position: 'top',
									shape: {
										type: 'shape',
										id: 'title-3',
									},
									color: '',
									size: { width: '', height: '' },
									animate: false,
									duration: '',
									flip: false,
									onFront: false,
									isVisible: true,
								},
							],
						}}
					>
						<ControlWithHooks Control={DividerControl} {...args} />
					</ControlContextProvider>
				</Flex>
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						<span>title-4</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									position: 'top',
									shape: {
										type: 'shape',
										id: 'title-4',
									},
									color: '',
									size: { width: '', height: '' },
									animate: false,
									duration: '',
									flip: false,
									onFront: false,
									isVisible: true,
								},
							],
						}}
					>
						<ControlWithHooks Control={DividerControl} {...args} />
					</ControlContextProvider>
				</Flex>
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						<span>title-5</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									position: 'top',
									shape: {
										type: 'shape',
										id: 'title-5',
									},
									color: '',
									size: { width: '', height: '' },
									animate: false,
									duration: '',
									flip: false,
									onFront: false,
									isVisible: true,
								},
							],
						}}
					>
						<ControlWithHooks Control={DividerControl} {...args} />
					</ControlContextProvider>
				</Flex>
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						<span>title-6</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									position: 'top',
									shape: {
										type: 'shape',
										id: 'title-6',
									},
									color: '',
									size: { width: '', height: '' },
									animate: false,
									duration: '',
									flip: false,
									onFront: false,
									isVisible: true,
								},
							],
						}}
					>
						<ControlWithHooks Control={DividerControl} {...args} />
					</ControlContextProvider>
				</Flex>
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						<span>title-7</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									position: 'top',
									shape: {
										type: 'shape',
										id: 'title-7',
									},
									color: '',
									size: { width: '', height: '' },
									animate: false,
									duration: '',
									flip: false,
									onFront: false,
									isVisible: true,
								},
							],
						}}
					>
						<ControlWithHooks Control={DividerControl} {...args} />
					</ControlContextProvider>
				</Flex>
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						<span>title-8</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									position: 'top',
									shape: {
										type: 'shape',
										id: 'title-8',
									},
									color: '',
									size: { width: '', height: '' },
									animate: false,
									duration: '',
									flip: false,
									onFront: false,
									isVisible: true,
								},
							],
						}}
					>
						<ControlWithHooks Control={DividerControl} {...args} />
					</ControlContextProvider>
				</Flex>
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						<span>arrow-1</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									position: 'top',
									shape: {
										type: 'shape',
										id: 'arrow-1',
									},
									color: '',
									size: { width: '', height: '' },
									animate: false,
									duration: '',
									flip: false,
									onFront: false,
									isVisible: true,
								},
							],
						}}
					>
						<ControlWithHooks Control={DividerControl} {...args} />
					</ControlContextProvider>
				</Flex>
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						<span>arrow-2</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									position: 'top',
									shape: {
										type: 'shape',
										id: 'arrow-2',
									},
									color: '',
									size: { width: '', height: '' },
									animate: false,
									duration: '',
									flip: false,
									onFront: false,
									isVisible: true,
								},
							],
						}}
					>
						<ControlWithHooks Control={DividerControl} {...args} />
					</ControlContextProvider>
				</Flex>
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						<span>arrow-3</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									position: 'top',
									shape: {
										type: 'shape',
										id: 'arrow-3',
									},
									color: '',
									size: { width: '', height: '' },
									animate: false,
									duration: '',
									flip: false,
									onFront: false,
									isVisible: true,
								},
							],
						}}
					>
						<ControlWithHooks Control={DividerControl} {...args} />
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
			<Empty.render {...Empty.args} />

			<Fill.render {...Fill.args} />

			<Open.render {...Open.args} />

			<Shapes.render {...Open.args} />
		</Flex>
	),
};
