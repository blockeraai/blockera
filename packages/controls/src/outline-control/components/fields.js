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
import { RepeaterContext } from '../../repeater-control/context';
import { BorderControl } from '../../index';

const Fields = ({ itemId, item }) => {
	const { changeItem } = useContext(RepeaterContext);

	return (
		<div id={`repeater-item-${itemId}`}>
			<Field label={__('Outline', 'publisher-core')}>
				<BorderControl
					linesDirection="horizontal"
					value={{
						width: item.width,
						style: item.style,
						color: item.color,
					}}
					onChange={(newValue) =>
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
				value={item.offset}
				onChange={(offset) => changeItem(itemId, { ...item, offset })}
			/>
		</div>
	);
};

export default memo(Fields);
