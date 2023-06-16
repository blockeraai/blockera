/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { InputField } from '@publisher/fields';

/**
 * Internal dependencies
 */
import BaseControl from '../../base';
import { RepeaterContext } from '../../repeater-control/context';

const Fields = ({ itemId, item }) => {
	const { changeItem } = useContext(RepeaterContext);

	return (
		<BaseControl id={`repeater-item-${itemId}`}>
			<InputField
				label={__('Key', 'publisher-core')}
				settings={{
					type: 'text',
				}}
				//
				initValue=""
				value={item.key}
				onValueChange={(key) => changeItem(itemId, { ...item, key })}
			/>

			<InputField
				label={__('Value', 'publisher-core')}
				settings={{
					type: 'text',
				}}
				//
				initValue=""
				value={item.value}
				onValueChange={(value) =>
					changeItem(itemId, { ...item, value })
				}
			/>
		</BaseControl>
	);
};

export default memo(Fields);
