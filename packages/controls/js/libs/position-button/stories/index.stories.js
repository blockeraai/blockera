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
import { Flex, PositionButtonControl } from '../../index';
import { ControlContextProvider } from '../../../context';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import ControlWithHooks from '../../../../../../.storybook/components/control-with-hooks';

const { WithInspectorStyles, SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Controls/PositionButtonControl',
	component: PositionButtonControl,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		value: { top: '', left: '' },
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="20px">
				<h2 className="story-heading">Position Button</h2>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: args.value,
					}}
				>
					<ControlWithHooks Control={PositionButtonControl} />
				</ControlContextProvider>
			</Flex>
		);
	},
};

export const States = {
	args: {
		value: { top: '', left: '' },
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="50px">
				<Flex direction="column" gap="15px">
					<h3 className="story-heading">Without Value</h3>
					<ControlContextProvider
						value={{
							name: nanoid(),
						}}
					>
						<ControlWithHooks
							Control={PositionButtonControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h3 className="story-heading">Custom</h3>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: { top: '10%', left: '20%' },
						}}
					>
						<ControlWithHooks
							Control={PositionButtonControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>
				<Flex direction="column" gap="15px">
					<h3 className="story-heading">Default Value</h3>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: { top: '', left: '' },
						}}
					>
						<ControlWithHooks
							Control={PositionButtonControl}
							{...args}
							defaultValue={{ top: '', left: '' }}
						/>
					</ControlContextProvider>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: { top: '50%', left: '50%' },
						}}
					>
						<ControlWithHooks
							Control={PositionButtonControl}
							{...args}
							defaultValue={{ top: '50%', left: '50%' }}
						/>
					</ControlContextProvider>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: { top: '0%', left: '0%' },
						}}
					>
						<ControlWithHooks
							Control={PositionButtonControl}
							{...args}
							defaultValue={{ top: '0%', left: '0%' }}
						/>
					</ControlContextProvider>
				</Flex>
				<Flex direction="column" gap="15px">
					<h3 className="story-heading">With Value</h3>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: { top: '50%', left: '50%' },
						}}
					>
						<ControlWithHooks
							Control={PositionButtonControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>
				<Flex direction="column" gap="15px">
					<h3 className="story-heading">Default Position Icons</h3>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: { top: '0%', left: '0%' },
						}}
					>
						<ControlWithHooks
							Control={PositionButtonControl}
							{...args}
						/>
					</ControlContextProvider>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: { top: '0%', left: '50%' },
						}}
					>
						<ControlWithHooks
							Control={PositionButtonControl}
							{...args}
						/>
					</ControlContextProvider>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: { top: '0%', left: '100%' },
						}}
					>
						<ControlWithHooks
							Control={PositionButtonControl}
							{...args}
						/>
					</ControlContextProvider>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: { top: '50%', left: '0%' },
						}}
					>
						<ControlWithHooks
							Control={PositionButtonControl}
							{...args}
						/>
					</ControlContextProvider>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: { top: '50%', left: '50%' },
						}}
					>
						<ControlWithHooks
							Control={PositionButtonControl}
							{...args}
						/>
					</ControlContextProvider>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: { top: '50%', left: '100%' },
						}}
					>
						<ControlWithHooks
							Control={PositionButtonControl}
							{...args}
						/>
					</ControlContextProvider>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: { top: '100%', left: '0%' },
						}}
					>
						<ControlWithHooks
							Control={PositionButtonControl}
							{...args}
						/>
					</ControlContextProvider>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: { top: '100%', left: '50%' },
						}}
					>
						<ControlWithHooks
							Control={PositionButtonControl}
							{...args}
						/>
					</ControlContextProvider>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: { top: '100%', left: '100%' },
						}}
					>
						<ControlWithHooks
							Control={PositionButtonControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>
				<Flex direction="column" gap="15px">
					<h3 className="story-heading">
						With Custom Alignment Matrix Label
					</h3>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: { top: '20%', left: '30%' },
						}}
					>
						<ControlWithHooks
							Control={PositionButtonControl}
							{...args}
							alignmentMatrixLabel="Custom Position Label"
						/>
					</ControlContextProvider>
				</Flex>
				<Flex direction="column" gap="15px">
					<h3 className="story-heading">
						With Custom Alignment Matrix Label
					</h3>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: { top: '50%', left: '50%' },
						}}
					>
						<ControlWithHooks
							Control={PositionButtonControl}
							{...args}
							label="Position Button Control"
						/>
					</ControlContextProvider>
				</Flex>
			</Flex>
		);
	},
};

export const All = {
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: () => (
		<Flex direction="column" gap="50px">
			<States.render {...States.args} />
		</Flex>
	),
};
