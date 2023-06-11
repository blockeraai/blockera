/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { InputField, Field } from '@publisher/fields';

/**
 * Internal dependencies
 */
import BaseControl from '../../base';
import { RepeaterContext } from '../../repeater-control/context';
import { BorderControl } from '../../index';

const Fields = ({ itemId, item }) => {
	const { changeItem } = useContext(RepeaterContext);

	return (
		<BaseControl id={`repeater-item-${itemId}`}>
			<Field label={__('Outline', 'publisher-core')}>
				<BorderControl
					lines="horizontal"
					initValue={{
						width: '2px',
						style: 'solid',
						color: '#B6B6B6',
					}}
					value={{
						width: item.width,
						style: item.style,
						color: item.color,
					}}
					onValueChange={(newValue) =>
						changeItem(itemId, {
							...item,
							width: newValue.width,
							color: newValue.color,
							style: newValue.style,
						})
					}
				/>
			</Field>

			<InputField
				label={__('Offset', 'publisher-core')}
				settings={{
					type: 'css',
					unitType: 'outline',
					range: true,
					min: 0,
					max: 40,
				}}
				//
				initValue="2px"
				value={item.offset}
				onValueChange={(offset) =>
					changeItem(itemId, { ...item, offset })
				}
			/>
		</BaseControl>
	);
};

export default memo(Fields);
