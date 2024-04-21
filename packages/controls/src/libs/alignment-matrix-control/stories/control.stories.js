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
import { default as AlignmentMatrixControl } from '../index';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import { WithControlDataProvider } from '../../../../../../.storybook/decorators/with-control-data-provider';
import { ControlContextProvider } from '../../../context';
import ControlWithHooks from '../../../../../../.storybook/components/control-with-hooks';

const { WithInspectorStyles, SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);
SharedDecorators.push(WithControlDataProvider);

export default {
	title: 'Controls/AlignmentMatrixControl',
	component: AlignmentMatrixControl,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		inputFields: false,
		controlInfo: {
			name: nanoid(),
			value: {
				top: '50%',
				left: '50%',
			},
		},
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const CustomSize = {
	args: {
		controlInfo: {
			name: nanoid(),
			value: {
				top: '50%',
				left: '50%',
			},
		},
		size: 100,
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const All = {
	args: {
		value: 'center center',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="30px">
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">With Input</h2>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: { top: '50%', left: '50%' },
					}}
				>
					<ControlWithHooks
						Control={AlignmentMatrixControl}
						{...args}
						inputFields={true}
					/>
				</ControlContextProvider>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">With Field</h2>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: { top: '50%', left: '50%' },
					}}
				>
					<ControlWithHooks
						Control={AlignmentMatrixControl}
						{...args}
						inputFields={true}
						label="Position"
					/>
				</ControlContextProvider>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Custom Size</h2>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: { top: '50%', left: '50%' },
					}}
				>
					<ControlWithHooks
						Control={AlignmentMatrixControl}
						{...args}
						size="50"
					/>
				</ControlContextProvider>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Top Left</h2>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: { top: '0%', left: '0%' },
					}}
				>
					<ControlWithHooks
						Control={AlignmentMatrixControl}
						{...args}
					/>
				</ControlContextProvider>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Top Center</h2>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: { top: '0%', left: '50%' },
					}}
				>
					<ControlWithHooks
						Control={AlignmentMatrixControl}
						{...args}
						value="top center"
					/>
				</ControlContextProvider>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Top Right</h2>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: { top: '0%', left: '100%' },
					}}
				>
					<ControlWithHooks
						Control={AlignmentMatrixControl}
						{...args}
						value="top right"
					/>
				</ControlContextProvider>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Center Left</h2>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: { top: '50%', left: '0%' },
					}}
				>
					<ControlWithHooks
						Control={AlignmentMatrixControl}
						{...args}
						value="center left"
					/>
				</ControlContextProvider>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Center Center</h2>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: { top: '50%', left: '50%' },
					}}
				>
					<ControlWithHooks
						Control={AlignmentMatrixControl}
						{...args}
						value="center center"
					/>
				</ControlContextProvider>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Center Right</h2>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: { top: '50%', left: '100%' },
					}}
				>
					<ControlWithHooks
						Control={AlignmentMatrixControl}
						{...args}
						value="center right"
					/>
				</ControlContextProvider>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Bottom Left</h2>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: { top: '100%', left: '0%' },
					}}
				>
					<ControlWithHooks
						Control={AlignmentMatrixControl}
						{...args}
						value="bottom left"
					/>
				</ControlContextProvider>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Bottom Center</h2>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: { top: '100%', left: '50%' },
					}}
				>
					<ControlWithHooks
						Control={AlignmentMatrixControl}
						{...args}
						value="bottom center"
					/>
				</ControlContextProvider>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Bottom Right</h2>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: { top: '100%', left: '100%' },
					}}
				>
					<ControlWithHooks
						Control={AlignmentMatrixControl}
						{...args}
						value="bottom right"
					/>
				</ControlContextProvider>
			</Flex>
		</Flex>
	),
};
