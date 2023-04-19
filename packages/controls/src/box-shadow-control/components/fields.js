/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	BaseControl,
	ToggleControl,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
	__experimentalUseCustomUnits as useCustomUnits,
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
import UnitControl from '../../unit-control';
import ColorControl from '../../color-control';
import { PanelTab } from '@publisher/components';
import { RepeaterContext } from '../../repeater-control/context';

function BoxShadowFields({ item, itemId }) {
	const [isPanelOpen, setPanelOpen] = useState(false);
	const [isOpenColorPicker, setOpenColorPicker] = useState(false);

	const { initialState, removeItem, changeItem } =
		useContext(RepeaterContext);

	const [fields, setFields] = useState(
		!Object.keys(item).length ? initialState : item
	);

	const { x, y, blur, spread, inset, color, unit, isVisible } = fields;
	const sharedProps = {
		unit,
		max: 32,
		min: -32,
		units: useCustomUnits({
			availableUnits: ['px', '%', 'em'],
			defaultValues: { px: 0 },
		}),
		className: classnames('publisher-control-box-shadow-unit-control'),
		onUnitChange: (unitValue) => handleUpdateFields('unit', unitValue),
	};

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
			className={isVisible ? 'visible' : 'invisible'}
			label={
				<Header {...fields} onChangeVisibility={handleUpdateFields} />
			}
			isOpen={isPanelOpen}
			setOpen={() => setPanelOpen(!isPanelOpen)}
			onDelete={() => removeItem(itemId)}
		>
			<>
				<BaseControl id={`p-blocks-repeater-item-${itemId}`}>
					<VStack>
						<HStack justify="space-between">
							<UnitControl
								value={x}
								{...sharedProps}
								onChange={(xInput) =>
									handleUpdateFields('x', xInput)
								}
								label={__('X', 'publisher')}
							/>
							<UnitControl
								value={y}
								{...sharedProps}
								onChange={(yInput) =>
									handleUpdateFields('y', yInput)
								}
								label={__('Y', 'publisher')}
							/>
						</HStack>
						<HStack justify="space-between">
							<UnitControl
								value={blur}
								{...sharedProps}
								onChange={(blurInput) =>
									handleUpdateFields('blur', blurInput)
								}
								label={__('BLUR', 'publisher')}
							/>
							<UnitControl
								value={spread}
								{...sharedProps}
								onChange={(spreadInput) =>
									handleUpdateFields('spread', spreadInput)
								}
								label={__('SPREAD', 'publisher')}
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
