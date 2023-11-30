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
import { ControlContextProvider, PublisherInputControl } from '../../../index';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import { WithControlDataProvider } from '../../../../../../.storybook/decorators/with-control-data-provider';
import ControlWithHooks from '../../../../../../.storybook/components/control-with-hooks';
import { fireEvent, waitFor, within } from '@storybook/testing-library';

const { WithInspectorStyles, WithStoryContextProvider, SharedDecorators } =
	Decorators;

SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Controls/PublisherInputControl',
	component: PublisherInputControl,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		controlInfo: {
			name: nanoid(),
			value: '20',
		},
		label: 'My Label',
	},
	render: (args) => (
		<ControlWithHooks Control={PublisherInputControl} {...args} />
	),
	decorators: [
		WithInspectorStyles,
		WithControlDataProvider,
		...SharedDecorators,
	],
	parameters: {
		jest: ['input.spec.js'],
	},
};

export const TextInput = {
	args: {
		controlInfo: {
			name: nanoid(),
			value: 'text',
		},
		type: 'text',
		defaultValue: 'default',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="15px">
			<h2 className="story-heading">Text Input</h2>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: '',
				}}
			>
				<ControlWithHooks
					Control={PublisherInputControl}
					type="text"
					label="Empty"
					{...args}
					defaultValue=""
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.controlInfo.value,
				}}
			>
				<ControlWithHooks
					Control={PublisherInputControl}
					type="text"
					label="Normal"
					{...args}
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.controlInfo.value,
				}}
			>
				<ControlWithHooks
					Control={PublisherInputControl}
					type="text"
					className="is-hovered"
					label="is-hovered"
					{...args}
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.controlInfo.value,
				}}
			>
				<ControlWithHooks
					Control={PublisherInputControl}
					type="text"
					className="is-focused"
					label="is-focused"
					{...args}
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.controlInfo.value,
				}}
			>
				<ControlWithHooks
					Control={PublisherInputControl}
					type="text"
					noBorder={true}
					label="no-border"
					{...args}
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.controlInfo.value,
				}}
			>
				<ControlWithHooks
					Control={PublisherInputControl}
					type="number"
					className="is-focused"
					noBorder={true}
					label="is-focused & no-border"
					{...args}
				/>
			</ControlContextProvider>
			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.controlInfo.value,
				}}
			>
				<ControlWithHooks
					Control={PublisherInputControl}
					type="number"
					disabled
					label="disabled"
					{...args}
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.controlInfo.value,
				}}
			>
				<ControlWithHooks
					Control={PublisherInputControl}
					type="text"
					label="Validator → Valid"
					{...args}
					validator={(value) => {
						return value === 'text';
					}}
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: 'not text',
				}}
			>
				<ControlWithHooks
					Control={PublisherInputControl}
					type="text"
					label="Validator → Not Valid"
					{...args}
					validator={(value) => {
						return value === 'text';
					}}
				/>
			</ControlContextProvider>
		</Flex>
	),
};

export const NumberInput = {
	args: {
		controlInfo: {
			name: nanoid(),
			value: '20',
		},
		defaultValue: '',
	},
	render: (args) => (
		<Flex direction="column" gap="30px">
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Number Input</h2>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: '',
					}}
				>
					<ControlWithHooks
						Control={PublisherInputControl}
						label="Empty"
						{...args}
						type="number"
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 0,
					}}
				>
					<ControlWithHooks
						Control={PublisherInputControl}
						label="Normal"
						{...args}
						type="number"
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 10,
					}}
				>
					<ControlWithHooks
						Control={PublisherInputControl}
						label="is-hovered"
						{...args}
						type="number"
						className="is-hovered"
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 20,
					}}
				>
					<ControlWithHooks
						Control={PublisherInputControl}
						label="is-focused"
						{...args}
						type="number"
						className="is-focused"
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 30,
					}}
				>
					<ControlWithHooks
						Control={PublisherInputControl}
						label="no-border"
						{...args}
						type="number"
						noBorder={true}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 40,
					}}
				>
					<ControlWithHooks
						Control={PublisherInputControl}
						label="no-border & is-focused"
						{...args}
						type="number"
						className="is-focused"
						noBorder={true}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 50,
					}}
				>
					<ControlWithHooks
						Control={PublisherInputControl}
						label="Arrows"
						{...args}
						type="number"
						arrows={true}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 3,
					}}
				>
					<ControlWithHooks
						Control={PublisherInputControl}
						label="Arrows → Arrow up disabled"
						{...args}
						type="number"
						max={3}
						min={-3}
						arrows={true}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 50,
					}}
				>
					<ControlWithHooks
						Control={PublisherInputControl}
						label="disabled"
						{...args}
						type="number"
						disabled={true}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 0,
					}}
				>
					<ControlWithHooks
						Control={PublisherInputControl}
						label="Validator → Valid"
						{...args}
						type="number"
						validator={(value) => {
							return value !== 0;
						}}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 0,
					}}
				>
					<ControlWithHooks
						Control={PublisherInputControl}
						label="Validator → Not Valid"
						{...args}
						type="number"
						validator={(value) => {
							return value === 1;
						}}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 0,
					}}
				>
					<ControlWithHooks
						Control={PublisherInputControl}
						label="Drag Disabled"
						{...args}
						type="number"
						drag={false}
					/>
				</ControlContextProvider>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Range Number Input</h2>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: '',
					}}
				>
					<ControlWithHooks
						Control={PublisherInputControl}
						label="Empty"
						{...args}
						range={true}
						type="number"
						defaultValue=""
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 50,
					}}
				>
					<ControlWithHooks
						Control={PublisherInputControl}
						label="Normal"
						{...args}
						range={true}
						type="number"
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 60,
					}}
				>
					<ControlWithHooks
						Control={PublisherInputControl}
						label="is-hovered"
						{...args}
						range={true}
						type="number"
						className="is-hovered"
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 70,
					}}
				>
					<ControlWithHooks
						Control={PublisherInputControl}
						label="is-focused"
						{...args}
						range={true}
						type="number"
						className="is-focused"
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 80,
					}}
				>
					<ControlWithHooks
						Control={PublisherInputControl}
						label="no-border"
						{...args}
						range={true}
						type="number"
						noBorder={true}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 90,
					}}
				>
					<ControlWithHooks
						Control={PublisherInputControl}
						label="no-border & is-focused"
						{...args}
						range={true}
						type="number"
						className="is-focused"
						noBorder={true}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 50,
					}}
				>
					<ControlWithHooks
						Control={PublisherInputControl}
						label="Arrows"
						{...args}
						type="number"
						arrows={true}
						range={true}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 3,
					}}
				>
					<ControlWithHooks
						Control={PublisherInputControl}
						label="Arrows → Arrow up disabled"
						{...args}
						type="number"
						max={3}
						min={-3}
						arrows={true}
						range={true}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 100,
					}}
				>
					<ControlWithHooks
						Control={PublisherInputControl}
						label="disabled"
						{...args}
						range={true}
						type="number"
						disabled={true}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 0,
					}}
				>
					<ControlWithHooks
						Control={PublisherInputControl}
						label="Drag Disabled"
						{...args}
						range={true}
						type="number"
						drag={false}
					/>
				</ControlContextProvider>
			</Flex>
		</Flex>
	),
	decorators: [
		WithInspectorStyles,
		WithControlDataProvider,
		...SharedDecorators,
	],
	parameters: {
		jest: ['input.spec.js'],
	},
};

export const CssInput = {
	args: {
		defaultValue: '1px',
		className: 'publisher-input',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="15px">
			<h2 className="story-heading">CSS Input</h2>
			<ControlContextProvider
				value={{
					name: nanoid(),
					value: '12px',
				}}
			>
				<ControlWithHooks
					Control={PublisherInputControl}
					{...args}
					unitType="general"
					label="No Value"
					defaultValue=""
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: '10px',
				}}
			>
				<ControlWithHooks
					Control={PublisherInputControl}
					{...args}
					unitType="general"
					label="With PX Value"
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: '20em',
				}}
			>
				<ControlWithHooks
					Control={PublisherInputControl}
					{...args}
					unitType="general"
					label="With EM Value"
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: '30px',
				}}
			>
				<ControlWithHooks
					Control={PublisherInputControl}
					{...args}
					range={true}
					unitType="general"
					label="With Range"
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: '30px',
				}}
			>
				<ControlWithHooks
					Control={PublisherInputControl}
					{...args}
					unitType="general"
					label="Arrows + Units"
					arrows={true}
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: '30px',
				}}
			>
				<ControlWithHooks
					Control={PublisherInputControl}
					{...args}
					unitType="general"
					label="Arrows + Units + Range"
					arrows={true}
					range={true}
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: 'auto',
				}}
			>
				<ControlWithHooks
					Control={PublisherInputControl}
					{...args}
					range={true}
					unitType="general"
					label="Special Value"
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: 'calc(20px + 12px)func',
				}}
			>
				<ControlWithHooks
					Control={PublisherInputControl}
					{...args}
					range={true}
					unitType="general"
					label="Advanced"
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: '1px',
				}}
			>
				<ControlWithHooks
					Control={PublisherInputControl}
					{...args}
					range={true}
					unitType="general"
					min={0}
					max={50}
					label="Min=0 Max=50"
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: '-5px',
				}}
			>
				<ControlWithHooks
					Control={PublisherInputControl}
					{...args}
					range={true}
					unitType="general"
					min={-20}
					max={20}
					label="Min=-20 Max=20"
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: '10px',
				}}
			>
				<ControlWithHooks
					Control={PublisherInputControl}
					{...args}
					units={[
						{
							value: 'px',
							label: 'PX',
							default: 0,
							format: 'number',
						},
						{
							value: 'em',
							label: 'EM',
							default: 0,
							format: 'number',
						},
						{
							value: 'auto',
							label: 'Auto',
							default: 0,
							format: 'text',
						},
					]}
					label="Custom Units"
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: '10xyz',
				}}
			>
				<ControlWithHooks
					Control={PublisherInputControl}
					{...args}
					unitType="general"
					label="Unit passed by value but not in units list"
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: '10',
				}}
			>
				<ControlWithHooks
					Control={PublisherInputControl}
					{...args}
					units={[
						{
							value: '',
							label: '-',
							default: 0,
							format: 'number',
						},
						{
							value: 'px',
							label: 'PX',
							default: 0,
							format: 'number',
						},
						{
							value: 'em',
							label: 'EM',
							default: 0,
							format: 'number',
						},
						{
							value: 'auto',
							label: 'Auto',
							default: 0,
							format: 'text',
						},
					]}
					label="Unit value is empty but have label"
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: '10px',
				}}
			>
				<ControlWithHooks
					Control={PublisherInputControl}
					{...args}
					range={true}
					arrows={true}
					unitType="general"
					label="disabled"
					disabled={true}
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: '10px',
				}}
			>
				<ControlWithHooks
					Control={PublisherInputControl}
					{...args}
					unitType="general"
					label="Validator → Valid"
					validator={(value) => {
						return value === '10px';
					}}
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: '10%',
				}}
			>
				<ControlWithHooks
					Control={PublisherInputControl}
					{...args}
					unitType="general"
					label="Validator → Not Valid"
					validator={(value) => {
						return value === '10px';
					}}
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: '10px',
				}}
			>
				<ControlWithHooks
					Control={PublisherInputControl}
					{...args}
					unitType="general"
					label="Drag Disable"
					drag={false}
				/>
			</ControlContextProvider>
		</Flex>
	),
};

export const PlayNumber = {
	args: {
		type: 'number',
		unitType: 'general',
		controlInfo: {
			name: nanoid(),
			value: '20px',
		},
		range: true,
		arrows: true,
	},
	decorators: [
		WithInspectorStyles,
		WithStoryContextProvider,
		WithControlDataProvider,
		...SharedDecorators,
	],
	render: (args) => (
		<ControlWithHooks Control={PublisherInputControl} {...args} />
	),
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		const currentValue = canvas.getByTestId('current-value');
		const input = canvas.getByRole('spinbutton', {
			type: 'number',
		});

		await step('Story data is available', async () => {
			await expect(currentValue).toBeInTheDocument();
		});

		await step('Input control test', async () => {
			await expect(input).toBeInTheDocument();

			await expect(input).toHaveValue(20);
			await expect(currentValue).toHaveTextContent('20');

			// type 30
			fireEvent.change(input, {
				target: {
					value: '30',
				},
			});
			await waitFor(
				async () => {
					await expect(input).toHaveValue(30);
					await expect(currentValue).toHaveTextContent('30');
				},
				{ timeout: 1000 }
			);
		});
	},
};
PlayNumber.storyName = 'Play';
