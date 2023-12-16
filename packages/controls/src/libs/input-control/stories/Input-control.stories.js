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
import { ControlContextProvider, InputControl } from '../../../index';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import { WithControlDataProvider } from '../../../../../../.storybook/decorators/with-control-data-provider';
import ControlWithHooks from '../../../../../../.storybook/components/control-with-hooks';
import { fireEvent, waitFor, within } from '@storybook/testing-library';

const { WithInspectorStyles, WithStoryContextProvider, SharedDecorators } =
	Decorators;

SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Controls/InputControl',
	component: InputControl,
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
	render: (args) => <ControlWithHooks Control={InputControl} {...args} />,
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
					Control={InputControl}
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
					Control={InputControl}
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
					Control={InputControl}
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
					Control={InputControl}
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
					Control={InputControl}
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
					Control={InputControl}
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
					Control={InputControl}
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
					Control={InputControl}
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
					Control={InputControl}
					type="text"
					label="Validator → Not Valid"
					{...args}
					validator={(value) => {
						return value === 'text';
					}}
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: '',
				}}
			>
				<ControlWithHooks
					Control={InputControl}
					type="text"
					label="Placeholder"
					{...args}
					placeholder="Placeholder text..."
					defaultValue=""
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
						Control={InputControl}
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
						Control={InputControl}
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
						Control={InputControl}
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
						Control={InputControl}
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
						Control={InputControl}
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
						Control={InputControl}
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
						Control={InputControl}
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
						Control={InputControl}
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
						Control={InputControl}
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
						Control={InputControl}
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
						Control={InputControl}
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
						value: '',
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						label="Placeholder"
						{...args}
						type="number"
						placeholder="Placeholder text here..."
						defaultValue=""
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 0,
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						label="Drag Disabled"
						{...args}
						type="number"
						drag={false}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 1.2,
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						label="Float Number"
						{...args}
						type="number"
						float={true}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 1,
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						label="Integer Number"
						{...args}
						type="number"
						float={false}
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
						Control={InputControl}
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
						Control={InputControl}
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
						Control={InputControl}
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
						Control={InputControl}
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
						Control={InputControl}
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
						Control={InputControl}
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
						Control={InputControl}
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
						Control={InputControl}
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
						Control={InputControl}
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
						Control={InputControl}
						label="Drag Disabled"
						{...args}
						range={true}
						type="number"
						drag={false}
					/>
				</ControlContextProvider>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 0,
					}}
				>
					<p>Range + Small Size → Should hide range</p>
					<div style={{ width: '100px' }}>
						<ControlWithHooks
							Control={InputControl}
							label=""
							{...args}
							range={true}
							arrows={true}
							type="number"
							size="small"
						/>
					</div>
				</ControlContextProvider>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 0,
					}}
				>
					<p>Arrows + Extra Small Size → Should hide arrows</p>
					<div style={{ width: '50px' }}>
						<ControlWithHooks
							Control={InputControl}
							label=""
							{...args}
							range={true}
							arrows={true}
							type="number"
							size="extra-small"
						/>
					</div>
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
					Control={InputControl}
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
					Control={InputControl}
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
					Control={InputControl}
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
					Control={InputControl}
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
					Control={InputControl}
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
					Control={InputControl}
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
					Control={InputControl}
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
					Control={InputControl}
					{...args}
					range={true}
					unitType="general"
					label="Advanced"
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: 'calc(20px + 12px)func',
				}}
			>
				<h2 className="story-heading">
					Size<span>small</span>
				</h2>
				<div
					style={{
						width: '100px',
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						{...args}
						range={true}
						unitType="general"
						label="Advanced (Small)"
						size="small"
					/>
				</div>
				<div
					style={{
						width: '120px',
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						{...args}
						range={true}
						unitType="general"
						label="Advanced (Small)"
						size="small"
					/>
				</div>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: '1px',
				}}
			>
				<ControlWithHooks
					Control={InputControl}
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
					Control={InputControl}
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
					Control={InputControl}
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
					Control={InputControl}
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
					Control={InputControl}
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
					Control={InputControl}
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
					Control={InputControl}
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
					Control={InputControl}
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
					value: '',
				}}
			>
				<ControlWithHooks
					Control={InputControl}
					{...args}
					unitType="general"
					label="Placeholder"
					placeholder="Placeholder text here..."
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
					Control={InputControl}
					{...args}
					unitType="general"
					label="Drag Disable"
					drag={false}
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: '1.2px',
				}}
			>
				<ControlWithHooks
					Control={InputControl}
					{...args}
					unitType="general"
					label="Float Number"
					float={true}
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: '1px',
				}}
			>
				<ControlWithHooks
					Control={InputControl}
					{...args}
					unitType="general"
					label="Integer Number"
					float={false}
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: {
						percent: '10%',
						px: '10px',
						rem: '10rem',
						deg: '10deg',
						dvw: '10dvw',
						xyzg: '10xyzg',
						func: 'calc(10px + 10px)func',
					},
				}}
			>
				<Flex direction="column" gap="10px">
					<ControlWithHooks
						Control={InputControl}
						{...args}
						unitType="general"
						label="Units Length"
						id="percent"
					/>

					<ControlWithHooks
						Control={InputControl}
						{...args}
						unitType="general"
						id="percent"
						arrows={true}
					/>

					<ControlWithHooks
						Control={InputControl}
						{...args}
						unitType="general"
						id="px"
					/>

					<ControlWithHooks
						Control={InputControl}
						{...args}
						unitType="general"
						id="px"
						arrows={true}
					/>

					<ControlWithHooks
						Control={InputControl}
						{...args}
						unitType="general"
						id="rem"
					/>

					<ControlWithHooks
						Control={InputControl}
						{...args}
						unitType="general"
						id="rem"
						arrows={true}
					/>

					<ControlWithHooks
						Control={InputControl}
						{...args}
						unitType="general"
						id="deg"
					/>

					<ControlWithHooks
						Control={InputControl}
						{...args}
						unitType="general"
						id="deg"
						arrows={true}
					/>

					<ControlWithHooks
						Control={InputControl}
						{...args}
						unitType="general"
						id="dvw"
					/>

					<ControlWithHooks
						Control={InputControl}
						{...args}
						unitType="general"
						id="dvw"
						arrows={true}
					/>

					<ControlWithHooks
						Control={InputControl}
						{...args}
						unitType="general"
						id="xyzg"
					/>

					<ControlWithHooks
						Control={InputControl}
						{...args}
						unitType="general"
						id="xyzg"
						arrows={true}
					/>

					<ControlWithHooks
						Control={InputControl}
						{...args}
						unitType="general"
						id="func"
					/>
				</Flex>
			</ControlContextProvider>
		</Flex>
	),
};

export const ValueAddon = {
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
		<Flex direction="column" gap="50px">
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">
					Value Addon<span>Variable</span>
				</h2>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 'hello',
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						type="text"
						label="Field"
						{...args}
						defaultValue=""
						controlAddonTypes={['variable', 'dynamic-value']}
						variableTypes={['font-size']}
						dynamicValueTypes={['TEXT']}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: {
							settings: {
								name: 'Medium',
								size: 20,
								slug: 'medium',
								reference: 'preset',
								var: 'var:preset|font-size|medium',
								type: 'font-size',
							},
							id: 'medium',
							isValueAddon: true,
							valueType: 'variable',
						},
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						type="text"
						label="Field"
						{...args}
						defaultValue=""
						controlAddonTypes={['variable', 'dynamic-value']}
						variableTypes={[
							'font-size',
							'width-size',
							'spacing',
							'gradient',
						]}
						dynamicValueTypes={['TEXT']}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: {
							settings: {
								name: 'Medium',
								size: 20,
								slug: 'medium',
								reference: 'preset',
								var: 'var:preset|font-size|medium',
								type: 'font-size',
							},
							id: 'medium',
							isValueAddon: true,
							valueType: 'variable',
						},
					}}
				>
					<div style={{ width: '100px' }}>
						<ControlWithHooks
							Control={InputControl}
							type="text"
							label="Small Width"
							{...args}
							defaultValue=""
							controlAddonTypes={['variable', 'dynamic-value']}
							variableTypes={[
								'font-size',
								'width-size',
								'spacing',
								'gradient',
							]}
							dynamicValueTypes={['TEXT']}
							size="small"
						/>
					</div>
				</ControlContextProvider>
			</Flex>
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
		<ControlWithHooks
			Control={InputControl}
			controlAddonTypes={['variable', 'dynamic-value']}
			variableTypes={[
				'color',
				'font-size',
				'width-size',
				'spacing',
				'linear-gradient',
				'radial-gradient',
			]}
			dynamicValueTypes={['TEXT']}
			{...args}
		/>
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
