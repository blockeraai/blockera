/**
 * Blockera dependencies
 */
import { Flex } from '@blockera/components';
import { default as Decorators } from '@blockera/dev-storybook/js/decorators';

/**
 * Internal dependencies
 */
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';

import { PickerValueItem } from '../components';
import { getVariableIcon } from '../helpers';

const { WithInspectorStyles, SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Value Addon/PickerValueItem',
	component: PickerValueItem,
	tags: ['autodocs'],
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
