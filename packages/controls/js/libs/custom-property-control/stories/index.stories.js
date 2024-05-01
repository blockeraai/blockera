/**
 * External dependencies
 */
import { nanoid } from 'nanoid';

/**
 * Blockera dependencies
 */
import { Flex } from '@blockera/components';
import { default as Decorators } from '@blockera/dev-storybook/js/decorators';

/**
 * Internal dependencies
 */
import { CustomPropertyControl } from '../../index';
import { STORE_NAME } from '../../repeater-control/store';
import { WithControlDataProvider } from '../../../../../../.storybook/decorators/with-control-data-provider';
import { WithPlaygroundStyles } from '../../../../../../.storybook/decorators/with-playground-styles';
import { ControlContextProvider } from '../../../context';

const { WithInspectorStyles, SharedDecorators } = Decorators;
SharedDecorators.push(WithPlaygroundStyles);
SharedDecorators.push(WithControlDataProvider);

export default {
	title: 'Controls/CustomPropertyControl',
	component: CustomPropertyControl,
	tags: ['autodocs'],
};

export const Empty = {
	args: {
		label: 'Custom CSS Properties',
		controlInfo: {
			name: nanoid(),
			value: [],
		},
		storeName: STORE_NAME,
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const Filled = {
	args: {
		label: 'Custom CSS Properties',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="50px">
				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '150px' }}
				>
					<h2 className="story-heading">Properties</h2>
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [{ name: 'opacity', value: '0.5' }],
						}}
					>
						<CustomPropertyControl {...args} label="CSS Property" />
					</ControlContextProvider>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '150px' }}
				>
					<h2 className="story-heading">Multiple Properties</h2>
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{ name: 'opacity', value: '0.5' },
								{ name: 'color', value: '#ccc' },
								{ name: 'margin', value: '10px' },
								{ name: 'font-size', value: '1rem' },
							],
						}}
					>
						<CustomPropertyControl
							{...args}
							label="CSS Properties"
						/>
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
					<CustomPropertyControl {...Empty.args} />
				</ControlContextProvider>
			</Flex>

			<Filled.render />
		</Flex>
	),
};
