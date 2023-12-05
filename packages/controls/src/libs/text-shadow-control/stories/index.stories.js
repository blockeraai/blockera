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
import { WithControlDataProvider } from '../../../../../../.storybook/decorators/with-control-data-provider';
import { WithPlaygroundStyles } from '../../../../../../.storybook/decorators/with-playground-styles';
import { ControlContextProvider } from '../../../context';
import { TextShadowControl } from '../../index';
import { STORE_NAME } from '../../repeater-control/store';

const { WithInspectorStyles, SharedDecorators, WithPopoverDataProvider } =
	Decorators;

SharedDecorators.push(WithPopoverDataProvider);
SharedDecorators.push(WithControlDataProvider);
SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Controls/TextShadowControl',
	component: TextShadowControl,
	tags: ['autodocs'],
};

export const Empty = {
	args: {
		label: 'Text Shadows',
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
		label: 'Text Shadows',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="50px">
				<Flex direction="column" gap="30px">
					<h2 className="story-heading">Filled</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									x: '2px',
									y: '3px',
									blur: '4px',
									color: '#0947eb',
									isVisible: true,
								},
								{
									x: '5px',
									y: '10px',
									blur: '20px',
									color: '#616161',
									isVisible: true,
								},
							],
						}}
					>
						<TextShadowControl {...args} label="Text Shadows" />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="30px">
					<h2 className="story-heading">
						Filled<span>CSS Values</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									x: 'calc(10px)func',
									y: 'calc(10px)func',
									blur: 'calc(10px)func',
									color: '#0947eb',
									isVisible: true,
								},
								{
									x: 'calc(10px)func',
									y: '12px',
									blur: '13px',
									color: '#0947eb',
									isVisible: true,
								},
								{
									x: '12px',
									y: 'calc(10px)func',
									blur: '11px',
									color: '#0947eb',
									isVisible: true,
								},
								{
									x: '12px',
									y: '11px',
									blur: 'calc(10px)func',
									color: '#0947eb',
									isVisible: true,
								},
							],
						}}
					>
						<TextShadowControl {...args} label="All CSS Values" />
					</ControlContextProvider>
				</Flex>
			</Flex>
		);
	},
};

export const Open = {
	args: {
		label: 'Text Shadows',
		controlInfo: {
			name: nanoid(),
			value: [],
		},
		storeName: STORE_NAME,
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex
				direction="column"
				gap="30px"
				style={{ marginBottom: '300px' }}
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
								x: '2px',
								y: '3px',
								blur: '4px',
								color: '#0947eb',
								isVisible: true,
								isOpen: true,
							},
						],
					}}
				>
					<TextShadowControl {...args} label="Text Shadows" />
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
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Empty</h2>
				<ControlContextProvider
					storeName={STORE_NAME}
					value={{
						name: nanoid(),
						value: [],
					}}
				>
					<TextShadowControl {...Empty.args} />
				</ControlContextProvider>
			</Flex>

			<Fill.render />

			<Open.render />
		</Flex>
	),
};
