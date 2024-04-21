// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import 'eyedropper-polyfill';
import { useCallback, useState } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Button, Popover } from '@blockera/components';

/**
 * Internal dependencies
 */
import { BaseControl } from '../index';
import { useControlContext } from '../../context';
import type { ColorPickerControlProps } from './types';
import TrashIcon from './icons/trash';
import { ColorPallet } from './components';
import PickerIcon from './icons/picker';

export default function ColorPickerControl({
	popoverTitle = __('Color Picker', 'blockera-core'),
	isOpen = false,
	onClose = () => {},
	placement = 'left-start',
	isPopover = true,
	hasClearBtn = true,
	//
	id,
	label = '',
	columns,
	defaultValue = '',
	onChange,
	field = 'color-picker',
	//
	className,
	...props
}: ColorPickerControlProps): MixedElement {
	const { value, setValue, attribute, blockName, resetToDefault } =
		useControlContext({
			id,
			onChange,
			defaultValue,
			valueCleanup,
		});

	const [isPopoverHidden, setIsPopoverHidden] = useState(false);

	const eyeDropper = new window.EyeDropper();

	const pickColor = useCallback(() => {
		const openPicker = async () => {
			try {
				const color = await eyeDropper.open();
				setValue(color.sRGBHex);
				setIsPopoverHidden(false);
			} catch (e) {
				console.log(e);
				setIsPopoverHidden(false);
			}
		};
		openPicker();
	}, [eyeDropper.open]);

	// make sure always we treat colors as lower case
	function valueCleanup(value: string) {
		if (value !== '') {
			value = value.toLowerCase();
		}

		return value;
	}

	if (isPopover) {
		return (
			<BaseControl
				label={label}
				columns={columns}
				controlName={field}
				className={className}
				{...{ attribute, blockName, resetToDefault }}
			>
				{isOpen && (
					<Popover
						title={popoverTitle}
						offset={20}
						placement={placement}
						className={`components-palette-edit-popover ${
							isPopoverHidden ? 'hidden' : ''
						}`}
						onClose={onClose}
						titleButtonsRight={
							<>
								<Button
									tabIndex="-1"
									size={'extra-small'}
									className="btn-pick-color"
									onClick={() => {
										setIsPopoverHidden(true);
										pickColor();
									}}
									style={{ padding: '5px' }}
									aria-label={__(
										'Pick Color',
										'blockera-core'
									)}
								>
									<PickerIcon />
								</Button>
								{value && (
									<Button
										tabIndex="-1"
										size={'extra-small'}
										onClick={() => {
											setValue('');
											onClose();
										}}
										style={{ padding: '5px' }}
										aria-label={__(
											'Reset Color (Clear)',
											'blockera-core'
										)}
									>
										<TrashIcon />
									</Button>
								)}
							</>
						}
					>
						<ColorPallet
							enableAlpha={true}
							color={value}
							onChangeComplete={(color) => setValue(color.hex)}
							{...props}
						/>
					</Popover>
				)}
			</BaseControl>
		);
	}

	return (
		<BaseControl
			label={label}
			columns={columns}
			controlName={field}
			className={className}
			{...{ attribute, blockName, resetToDefault }}
		>
			<ColorPallet
				enableAlpha={false}
				color={value}
				onChangeComplete={(color) => setValue(color.hex)}
				{...props}
			/>
			{hasClearBtn && (
				<Button
					onClick={() => setValue('')}
					aria-label={__('Reset Color (Clear)', 'blockera-core')}
				>
					{__('Clear', 'blockera-core')}
				</Button>
			)}
		</BaseControl>
	);
}
