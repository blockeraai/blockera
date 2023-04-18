/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	BaseControl,
	TextControl,
	ToggleControl,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
} from '@wordpress/components';
import { useContext, useState, useEffect, memo } from '@wordpress/element';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import Header from './header';
import ColorControl from '../../color-control';
import { PanelTab } from '@publisher/components';
import { RepeaterContext } from '../../repeater-control/context';

function BoxShadowFields({ item, itemId }) {
	const classNames = classnames('publisher-control-box-shadow-text-field');
	const [isOpenColorPicker, setOpenColorPicker] = useState(false);

	const { initialState, removeItem, changeItem } =
		useContext(RepeaterContext);

	const [fields, setFields] = useState(
		!Object.keys(item).length ? initialState : item
	);

	const { x, y, blur, spread, inset, color, isPanelOpen } = fields;

	useEffect(() => {
		changeItem(itemId, fields);
	}, [fields, itemId, changeItem]);

	function handleUpdateFields(key, value) {
		if ('boolean' !== typeof value && !value.trim()) {
			value = 0;
		}

		const _fields = { ...fields };
		_fields[key] = value;

		setFields(_fields);
	}

	return (
		<PanelTab
			label={<Header {...fields} />}
			isOpen={isPanelOpen}
			setOpen={() =>
				setFields({
					...fields,
					isPanelOpen: !isPanelOpen,
				})
			}
			onDelete={() => removeItem(itemId)}
		>
			<>
				<BaseControl id={`p-blocks-repeater-item-${itemId}`}>
					<VStack>
						<HStack justify="space-between">
							<TextControl
								className={classNames}
								type="number"
								label={__('X', 'publisher')}
								value={x}
								onChange={(xInput) =>
									handleUpdateFields('x', xInput)
								}
							/>
							<TextControl
								className={classNames}
								type="number"
								label={__('Y', 'publisher')}
								value={y}
								onChange={(yInput) =>
									handleUpdateFields('y', yInput)
								}
							/>
						</HStack>
						<HStack justify="space-between">
							<TextControl
								className={classNames}
								type="number"
								label={__('BLUR', 'publisher')}
								value={blur}
								onChange={(blurInput) =>
									handleUpdateFields('blur', blurInput)
								}
							/>
							<TextControl
								className={classNames}
								type="number"
								label={__('SPREAD', 'publisher')}
								value={spread}
								onChange={(spreadInput) =>
									handleUpdateFields('spread', spreadInput)
								}
							/>
						</HStack>
						<HStack justify="space-between">
							<ColorControl
								color={color}
								onChange={handleUpdateFields}
								isOpenColorPicker={isOpenColorPicker}
								toggleOpenColorPicker={setOpenColorPicker}
							/>
							<ToggleControl
								label={__('Inset', 'publisher')}
								help=""
								checked={inset}
								onChange={() =>
									handleUpdateFields('inset', !inset)
								}
							/>
						</HStack>
					</VStack>
				</BaseControl>
			</>
		</PanelTab>
	);
}

export default memo(BoxShadowFields);
