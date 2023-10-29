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
import { AttributesControl } from '../../index';
import { STORE_NAME } from '../../repeater-control/store';
import { WithControlDataProvider } from '../../../../../../.storybook/decorators/with-control-data-provider';
import { WithPlaygroundStyles } from '../../../../../../.storybook/decorators/with-playground-styles';
import { ControlContextProvider } from '../../../context';

const { WithInspectorStyles, SharedDecorators } = Decorators;
SharedDecorators.push(WithPlaygroundStyles);
SharedDecorators.push(WithControlDataProvider);

export default {
	title: 'Controls/AttributesControl',
	component: AttributesControl,
	tags: ['autodocs'],
};

export const Empty = {
	args: {
		label: 'Attributes',
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
		label: 'Attributes',
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
					<h2 className="story-heading">
						Attributes<span>General</span>
					</h2>
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									key: 'data-test',
									__key: 'data-test',
									value: '#test',
									isVisible: true,
									isOpen: true,
								},
								{
									key: 'aria-label',
									__key: 'aria-label',
									value: '#label',
									isVisible: true,
								},
								{
									key: 'lang',
									__key: 'lang',
									value: '#lang',
									isVisible: true,
								},
								{
									key: 'required',
									__key: 'required',
									value: '#required',
									isVisible: true,
								},
								{
									key: 'custom',
									__key: 'custom',
									value: '#custom',
									isVisible: true,
									isOpen: true,
								},
							],
						}}
					>
						<AttributesControl {...args} label="Attributes" />
					</ControlContextProvider>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '150px' }}
				>
					<h2 className="story-heading">
						Attributes<span>A Tag</span>
					</h2>
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									key: 'rel',
									__key: 'rel',
									value: 'nofollow',
									isVisible: true,
									isOpen: true,
								},
								{
									key: 'target',
									__key: 'target',
									value: '_blank',
									isVisible: true,
								},
								{
									key: 'hreflang',
									__key: 'hreflang',
									value: '#hreflang',
									isVisible: true,
								},
								{
									key: 'referrerpolicy',
									__key: 'referrerpolicy',
									value: 'no-referrer',
									isVisible: true,
								},
								{
									key: 'test',
									__key: 'custom',
									value: 'test-value',
									isVisible: true,
									isOpen: true,
								},
							],
						}}
					>
						<AttributesControl
							{...args}
							label="Attributes"
							attributeElement="a"
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Attributes<span>Button Tag</span>
					</h2>
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									key: 'type',
									__key: 'type',
									value: 'button',
									isVisible: true,
								},
								{
									key: 'test',
									__key: 'custom',
									value: '#value',
									isVisible: true,
								},
							],
						}}
					>
						<AttributesControl
							{...args}
							label="Attributes"
							attributeElement="button"
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Attributes<span>Ol Tag</span>
					</h2>
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									key: 'reversed',
									__key: 'reversed',
									value: '#reversed',
									isVisible: true,
								},
								{
									key: 'start',
									__key: 'start',
									value: '#start',
									isVisible: true,
								},
								{
									key: 'type',
									__key: 'type',
									value: '#type',
									isVisible: true,
								},
							],
						}}
					>
						<AttributesControl
							{...args}
							label="Attributes"
							attributeElement="ol"
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
				<AttributesControl {...Empty.args} />
			</Flex>

			<Filled.render />
		</Flex>
	),
};
