/**
 * External dependencies
 */

import { nanoid } from 'nanoid';

/**
 * Blockera dependencies
 */
import { Flex } from '@blockera/components';
import { default as Decorators } from '@blockera/storybook/decorators';

/**
 * Internal dependencies
 */
import { BoxShadowControl } from '../../index';
import { STORE_NAME } from '../../repeater-control/store';
import { ControlContextProvider } from '../../../context';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import ControlWithHooks from '../../../../../../.storybook/components/control-with-hooks';

const { WithInspectorStyles, SharedDecorators, WithPopoverDataProvider } =
	Decorators;

SharedDecorators.push(WithPlaygroundStyles);
SharedDecorators.push(WithPopoverDataProvider);

export default {
	title: 'Controls/BoxShadowControl',
	component: BoxShadowControl,
	tags: ['autodocs'],
};

export const Empty = {
	args: {
		label: 'Box Shadows',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="20px">
			<h2 className="story-heading">
				Box Shadow<span>Empty</span>
			</h2>

			<ControlContextProvider
				storeName={STORE_NAME}
				value={{
					name: nanoid(),
					value: [],
				}}
			>
				<ControlWithHooks Control={BoxShadowControl} {...args} />
			</ControlContextProvider>
		</Flex>
	),
};

export const Fill = {
	args: {
		label: 'Box Shadows',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="50px">
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Filled<span>Outer</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									type: 'outer',
									x: '2px',
									y: '2px',
									blur: '2px',
									spread: '2px',
									color: '#0947eb',
									isVisible: true,
								},
							],
						}}
					>
						<ControlWithHooks
							Control={BoxShadowControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Filled<span>Inner</span>
					</h2>
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									type: 'inner',
									x: '5px',
									y: '5px',
									blur: '5px',
									spread: '0px',
									color: '#dedede',
									isVisible: true,
								},
							],
						}}
					>
						<ControlWithHooks
							Control={BoxShadowControl}
							{...args}
						/>
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
									type: 'outer',
									x: '2px',
									y: '2px',
									blur: '2px',
									spread: '2px',
									color: '#0947eb',
									isVisible: true,
								},
								{
									type: 'outer',
									x: '-2px',
									y: '-2px',
									blur: '2px',
									spread: '0px',
									color: '#00762a',
									isVisible: true,
								},
								{
									type: 'inner',
									x: '5px',
									y: '5px',
									blur: '5px',
									spread: '0px',
									color: '#dedede',
									isVisible: true,
								},
							],
						}}
					>
						<ControlWithHooks
							Control={BoxShadowControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Filled<span>CSS Value</span>
					</h2>
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									type: 'outer',
									x: '2pxfunc',
									y: '2pxfunc',
									blur: '2pxfunc',
									spread: '2pxfunc',
									color: '#0947eb',
									isVisible: true,
								},
								{
									type: 'outer',
									x: '-2px',
									y: '-2pxfunc',
									blur: '2pxfunc',
									spread: '0pxfunc',
									color: '#00762a',
									isVisible: true,
								},
								{
									type: 'inner',
									x: '5pxfunc',
									y: '5px',
									blur: '5pxfunc',
									spread: '0pxfunc',
									color: '#dedede',
									isVisible: true,
								},
							],
						}}
					>
						<ControlWithHooks
							Control={BoxShadowControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>
			</Flex>
		);
	},
};

export const Open = {
	args: {
		label: 'Box Shadows',
	},
	decorators: [
		WithInspectorStyles,
		WithPopoverDataProvider,
		...SharedDecorators,
	],
	render: (args) => {
		return (
			<Flex
				direction="column"
				gap="15px"
				style={{ marginBottom: '400px' }}
			>
				<h2 className="story-heading">
					Filled<span>Open Item</span>
				</h2>
				<ControlContextProvider
					storeName={STORE_NAME}
					value={{
						name: nanoid(),
						value: [
							{
								type: 'outer',
								x: '2px',
								y: '2px',
								blur: '2px',
								spread: '2px',
								color: '#0947eb',
								isVisible: true,
								isOpen: true,
							},
						],
					}}
				>
					<ControlWithHooks Control={BoxShadowControl} {...args} />
				</ControlContextProvider>
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
		</Flex>
	),
};
