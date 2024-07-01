/**
 * Blockera dependencies
 */
import { default as Decorators } from '@blockera/dev-storybook/js/decorators';

/**
 * Internal dependencies
 */
import { Flex } from '../../';
import { WithPlaygroundStyles } from '../../../../../.storybook/preview';

import { PickerValueItem } from '../components';
import { getDynamicValueIcon, getVariableIcon } from '../helpers';

const { WithInspectorStyles, SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Value Addon/PickerValueItem',
	component: PickerValueItem,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		value: '',
		name: 'Post Title',
		icon: getDynamicValueIcon('text'),
		type: 'dynamic-value',
		valueType: 'text',
		data: {
			name: 'Post Title',
			id: 'post-title',
			reference: {
				type: 'core',
			},
			category: 'post',
			type: 'text',
		},
		onClick: () => {},
		isCurrent: false,
		status: 'core',
		showValue: true,
	},
	render: (args) => <PickerValueItem {...args} />,
	decorators: [WithInspectorStyles, ...SharedDecorators],
	parameters: {},
};

export const DynamicValueItems = {
	args: {
		value: '',
		name: 'Post Title',
		icon: getDynamicValueIcon('text'),
		type: 'dynamic-value',
		valueType: '',
		data: {},
		onClick: () => {},
		isCurrent: false,
		status: 'core',
		showValue: true,
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="50px">
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Dynamic Value Items</h2>

				<PickerValueItem {...args} />

				<PickerValueItem
					{...args}
					name={'Post Link'}
					icon={getDynamicValueIcon('link')}
				/>

				<PickerValueItem
					{...args}
					name={'Featured Image'}
					icon={getDynamicValueIcon('image')}
				/>

				<PickerValueItem
					{...args}
					name={'Post ID'}
					icon={getDynamicValueIcon('id')}
				/>

				<PickerValueItem
					{...args}
					name={'Post Date'}
					icon={getDynamicValueIcon('date')}
				/>

				<PickerValueItem
					{...args}
					name={'Post Meta'}
					icon={getDynamicValueIcon('meta')}
				/>

				<PickerValueItem
					{...args}
					name={'Admin Email'}
					icon={getDynamicValueIcon('email')}
				/>

				<PickerValueItem
					{...args}
					name={'Shortcode'}
					icon={getDynamicValueIcon('shortcode')}
				/>

				<PickerValueItem
					{...args}
					name={'Post Categories'}
					icon={getDynamicValueIcon('category')}
				/>

				<PickerValueItem
					{...args}
					name={'Post Tags'}
					icon={getDynamicValueIcon('tag')}
				/>

				<PickerValueItem
					{...args}
					name={'Post Terms'}
					icon={getDynamicValueIcon('term')}
				/>

				<PickerValueItem
					{...args}
					name={'Post Comments'}
					icon={getDynamicValueIcon('comment')}
				/>

				<PickerValueItem
					{...args}
					name={'Post Reading Time'}
					icon={getDynamicValueIcon('time')}
				/>

				<PickerValueItem
					{...args}
					name={'Current Item'}
					icon={getDynamicValueIcon('time')}
					isCurrent={true}
				/>
			</Flex>
		</Flex>
	),
};

export const VariableItems = {
	args: {
		value: '',
		name: '',
		icon: '',
		type: '',
		valueType: 'variable',
		data: {},
		onClick: () => {},
		isCurrent: false,
		status: 'core',
		showValue: false,
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="50px">
			<Flex direction="column" gap="30px">
				<h2 className="story-heading">Dynamic Value Items</h2>

				<Flex direction="column" gap="10px">
					<PickerValueItem
						{...args}
						name={'Color'}
						icon={getVariableIcon({
							type: 'color',
							value: '#007cba',
						})}
						type="color"
					/>
					<PickerValueItem
						{...args}
						name={'Color'}
						icon={getVariableIcon({
							type: 'color',
							value: '#007cba',
						})}
						data={{
							value: '#007cba',
						}}
						showValue={true}
						type="color"
					/>
				</Flex>

				<Flex direction="column" gap="10px">
					<PickerValueItem
						{...args}
						name={'Font Size'}
						icon={getVariableIcon({
							type: 'font-size',
							value: '12px',
						})}
						type="font-size"
					/>
					<PickerValueItem
						{...args}
						name={'Font Size'}
						icon={getVariableIcon({
							type: 'font-size',
							value: '12px',
						})}
						data={{
							value: '12px',
						}}
						showValue={true}
						type="font-size"
					/>
					<PickerValueItem
						{...args}
						name={'Fluid Font Size'}
						icon={getVariableIcon({
							type: 'font-size',
							value: '12px',
						})}
						data={{
							value: '12px',
							fluid: {
								min: '8px',
								max: '16px',
							},
						}}
						showValue={true}
						type="font-size"
					/>
				</Flex>

				<Flex direction="column" gap="10px">
					<PickerValueItem
						{...args}
						name={'Linear Gradient'}
						icon={getVariableIcon({
							type: 'linear-gradient',
							value: 'linear-gradient(to bottom, #cfcabe 0%, #F9F9F9 100%)',
						})}
						type="linear-gradient"
					/>
					<PickerValueItem
						{...args}
						name={'Linear Gradient'}
						icon={getVariableIcon({
							type: 'linear-gradient',
							value: 'linear-gradient(to bottom, #cfcabe 0%, #F9F9F9 100%)',
						})}
						data={{
							value: 'linear-gradient(to bottom, #cfcabe 0%, #F9F9F9 100%)',
						}}
						showValue={true}
						type="linear-gradient"
					/>
				</Flex>

				<Flex direction="column" gap="10px">
					<PickerValueItem
						{...args}
						name={'Radial Gradient'}
						icon={getVariableIcon({
							type: 'radial-gradient',
							value: 'radial-gradient(rgb(250,0,145) 0%,rgb(209,230,0) 100%)',
						})}
						type="radial-gradient"
					/>
					<PickerValueItem
						{...args}
						name={'Radial Gradient'}
						icon={getVariableIcon({
							type: 'radial-gradient',
							value: 'radial-gradient(rgb(250,0,145) 0%,rgb(209,230,0) 100%)',
						})}
						data={{
							value: 'radial-gradient(rgb(250,0,145) 0%,rgb(209,230,0) 100%)',
						}}
						showValue={true}
						type="radial-gradient"
					/>
				</Flex>

				<Flex direction="column" gap="10px">
					<PickerValueItem
						{...args}
						name={'Spacing'}
						icon={getVariableIcon({
							type: 'spacing',
							value: '20px',
						})}
						type="spacing"
					/>
					<PickerValueItem
						{...args}
						name={'Spacing'}
						icon={getVariableIcon({
							type: 'spacing',
							value: '20px',
						})}
						data={{
							value: '20px',
						}}
						showValue={true}
						type="spacing"
					/>
				</Flex>

				<Flex direction="column" gap="10px">
					<PickerValueItem
						{...args}
						name={'Width Size'}
						icon={getVariableIcon({
							type: 'width-size',
							value: '1200px',
						})}
						type="width-size"
					/>
					<PickerValueItem
						{...args}
						name={'Width Size'}
						icon={getVariableIcon({
							type: 'width-size',
							value: '1200px',
						})}
						data={{
							value: '1200px',
						}}
						showValue={true}
						type="width-size"
					/>
				</Flex>
			</Flex>
		</Flex>
	),
};
