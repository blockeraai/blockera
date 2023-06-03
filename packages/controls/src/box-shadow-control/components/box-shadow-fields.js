/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import BaseControl from '../../base';
import { InputField, SelectField, ColorField } from '@publisher/fields';
import { RepeaterContext } from '../../repeater-control/context';

const BoxShadowFields = ({ item, itemId }) => {
	const { changeItem, blockName } = useContext(RepeaterContext);

	return (
		<BaseControl id={`repeater-item-${itemId}`}>
			<SelectField
				attribute="type"
				label={__('Position', 'publisher-core')}
				options={[
					{
						label: __('Inner', 'publisher-core'),
						value: 'inner',
					},
					{
						label: __('Outer', 'publisher-core'),
						value: 'outer',
					},
				]}
				onChange={(input) =>
					changeItem(itemId, {
						...item,
						type: input,
					})
				}
				initValue="inside"
			/>

			<InputField
				attribute="x"
				label={__('X', 'publisher-core')}
				name={blockName}
				settings={{
					type: 'css',
					unitType: 'essential',
					range: true,
				}}
				onChange={(input) =>
					changeItem(itemId, {
						...item,
						x: input,
					})
				}
			/>

			<InputField
				attribute="y"
				label={__('Y', 'publisher-core')}
				name={blockName}
				settings={{
					type: 'css',
					unitType: 'essential',
					range: true,
				}}
				onChange={(input) =>
					changeItem(itemId, {
						...item,
						y: input,
					})
				}
			/>

			<InputField
				attribute="blur"
				label={__('Blur', 'publisher-core')}
				name={blockName}
				settings={{
					type: 'css',
					unitType: 'essential',
					range: true,
				}}
				onChange={(input) =>
					changeItem(itemId, {
						...item,
						blur: input,
					})
				}
			/>

			<InputField
				attribute="spread"
				label={__('Spread', 'publisher-core')}
				name={blockName}
				settings={{
					type: 'css',
					unitType: 'essential',
					range: true,
				}}
				onChange={(input) =>
					changeItem(itemId, {
						...item,
						spread: input,
					})
				}
			/>

			<ColorField
				attribute="color"
				label={__('Color', 'publisher-core')}
				name={blockName}
				onChange={(input) =>
					changeItem(itemId, {
						...item,
						color: input,
					})
				}
			/>
		</BaseControl>
	);
};

export default memo(BoxShadowFields);
