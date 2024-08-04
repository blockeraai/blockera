/**
 * External dependencies
 */
import { nanoid } from 'nanoid';

/**
 * Blockera dependencies
 */
import { default as Decorators } from '@blockera/dev-storybook/js/decorators';

/**
 * Internal dependencies
 */
import { Flex } from '../../';
import { ControlContextProvider, TextAreaControl } from '../../../index';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import { WithControlDataProvider } from '../../../../../../.storybook/decorators/with-control-data-provider';
import ControlWithHooks from '../../../../../../.storybook/components/control-with-hooks';

const { WithInspectorStyles, WithStoryContextProvider, SharedDecorators } =
	Decorators;

SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Controls/TextAreaControl',
	component: TextAreaControl,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		controlInfo: {
			name: nanoid(),
			value: '',
		},
		label: 'My Label',
	},
	render: (args) => <ControlWithHooks Control={TextAreaControl} {...args} />,
	decorators: [
		WithInspectorStyles,
		WithControlDataProvider,
		...SharedDecorators,
	],
	parameters: {},
};

export const TextArea = {
	args: {
		controlInfo: {
			name: nanoid(),
			value: 'content is here...',
		},
		type: 'text',
		defaultValue: 'default',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="15px">
			<h2 className="story-heading">Textarea Input</h2>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: '',
				}}
			>
				<ControlWithHooks
					Control={TextAreaControl}
					type="text"
					label="Empty"
					{...args}
					defaultValue=""
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: '',
				}}
			>
				<ControlWithHooks
					Control={TextAreaControl}
					label="Placeholder"
					{...args}
					placeholder="Placeholder text..."
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
					Control={TextAreaControl}
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
					Control={TextAreaControl}
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
					Control={TextAreaControl}
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
					Control={TextAreaControl}
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
					Control={TextAreaControl}
					label="Custom height"
					height={100}
					{...args}
				/>
			</ControlContextProvider>
		</Flex>
	),
};
