/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { __experimentalUseCustomUnits as useCustomUnits } from '@wordpress/components';
import { memo, useState, useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Header from './header';
import BaseControl from '../../base';
import UnitControl from '../../unit-control';
import ColorControl from '../../color-control';
import classnames from '@publisher/classnames';
import ToggleControl from '../../toggle-control';
import { VStack, HStack } from '@publisher/components';
import { RepeaterContext } from '../../repeater-control/context';

const BoxShadowFields = ({
	item,
	itemId,
	isVisible,
	setVisibility,
	ActionsUI: RepeaterItemActionsUI,
	VisibleElement: RepeaterItemVisibleElement,
}) => {
	const [isOpen, setOpen] = useState(false);

	const { changeItem } = useContext(RepeaterContext);

	const { x, y, blur, spread, inset, color, unit } = item;
	const sharedProps = {
		unit,
		max: 32,
		min: -32,
		units: useCustomUnits({
			availableUnits: ['px', '%', 'em'],
			defaultValues: { px: 0 },
		}),
		className: classnames('control', 'box-shadow', 'unit-control'),
		onUnitChange: (unitValue) =>
			changeItem(itemId, { ...item, unit: unitValue }),
	};

	return (
		<>
			<div className="header">
				<Header {...{ item, itemId }}>
					<>
						<RepeaterItemVisibleElement
							{...{ setVisibility, isVisible }}
						/>
						<RepeaterItemActionsUI
							{...{ itemId, setOpen, isOpen }}
						/>
					</>
				</Header>
			</div>
			{isOpen && (
				<div className="content">
					<BaseControl id={`repeater-item-${itemId}`}>
						<VStack>
							<HStack justify="space-between">
								<UnitControl
									value={x}
									{...sharedProps}
									onChange={(xInput) =>
										changeItem(itemId, {
											...item,
											x: xInput,
										})
									}
									label={__('X', 'publisher')}
								/>
								<UnitControl
									value={y}
									{...sharedProps}
									onChange={(yInput) =>
										changeItem(itemId, {
											...item,
											y: yInput,
										})
									}
									label={__('Y', 'publisher')}
								/>
							</HStack>
							<HStack justify="space-between">
								<UnitControl
									value={blur}
									{...sharedProps}
									onChange={(blurInput) =>
										changeItem(itemId, {
											...item,
											blur: blurInput,
										})
									}
									label={__('BLUR', 'publisher')}
								/>
								<UnitControl
									value={spread}
									{...sharedProps}
									onChange={(spreadInput) =>
										changeItem(itemId, {
											...item,
											spread: spreadInput,
										})
									}
									label={__('SPREAD', 'publisher')}
								/>
							</HStack>
							<HStack justify="space-between">
								<ColorControl
									color={color}
									onChange={(colorInput) =>
										changeItem(itemId, {
											...item,
											color: colorInput,
										})
									}
								/>
								<ToggleControl
									label={__('Inset', 'publisher')}
									help=""
									checked={inset}
									onChange={() =>
										changeItem(itemId, {
											...item,
											inset: !inset,
										})
									}
								/>
							</HStack>
						</VStack>
					</BaseControl>
				</div>
			)}
		</>
	);
};

export default memo(BoxShadowFields);
