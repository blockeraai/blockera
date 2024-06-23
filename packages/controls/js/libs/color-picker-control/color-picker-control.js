// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { useCallback, useState } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { ColorPallet } from './components';
import { useControlContext } from '../../context';
import type { ColorPickerControlProps } from './types';
import { Button, Popover, BaseControl } from '../index';

export default function ColorPickerControl({
	popoverTitle = __('Color Picker', 'blockera'),
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
	children,
}: ColorPickerControlProps): MixedElement {
	const { value, setValue, attribute, blockName, resetToDefault } =
		useControlContext({
			id,
			onChange,
			defaultValue,
			valueCleanup,
		});

	const [isPopoverHidden, setIsPopoverHidden] = useState(false);

	const eyeDropper: any = window?.EyeDropper ? new window.EyeDropper() : null;

	const pickColor = useCallback(() => {
		const openPicker = async () => {
			try {
				const color = await eyeDropper?.open();
				setValue(color?.sRGBHex);
				setIsPopoverHidden(false);
			} catch (e) {
				console.warn(
					'EyeDropper was not supported with your browser. please for use of color picker switch to Google Chrome browser.'
				);
				setIsPopoverHidden(false);
			}
		};
		openPicker();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [eyeDropper?.open]);

	// make sure always we treat colors as lower case
	function valueCleanup(value: string) {
		if (value !== '') {
			value = value.toLowerCase();
		}

		return value;
	}

	let colorPickerLabel = '';

	if (!/Chrome|Opera/gi.exec(navigator.userAgent)) {
		colorPickerLabel = __(
			'This feature is not supported with your browser, switch to (Chrome, or Opera) browsers.',
			'blockera'
		);
	} else if ('http:' === window.location.protocol) {
		colorPickerLabel = __(
			'This feature is available only in secure contexts (HTTPS), in some or all supporting browsers.',
			'blockera'
		);
	} else if (!eyeDropper) {
		colorPickerLabel = __(
			'This feature is not supported with your browser, switch to (Chrome, or Opera) browsers.',
			'blockera'
		);
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
									label={colorPickerLabel}
									tabIndex="-1"
									size={'extra-small'}
									className="btn-pick-color"
									onClick={() => {
										setIsPopoverHidden(true);
										pickColor();
									}}
									style={{
										padding: '5px',
										...(!eyeDropper
											? {
													opacity: 0.5,
											  }
											: {}),
									}}
									aria-label={__('Pick Color', 'blockera')}
								>
									<Icon icon="eye-dropper" size="18" />
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
											'blockera'
										)}
									>
										<Icon icon="trash" size="20" />
									</Button>
								)}
							</>
						}
					>
						<ColorPallet
							enableAlpha={true}
							color={value}
							onChangeComplete={(color: Object) =>
								setValue(color.hex)
							}
						/>

						{children}
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
				onChangeComplete={(color: Object) => setValue(color.hex)}
			/>

			{children}

			{hasClearBtn && (
				<Button
					onClick={() => setValue('')}
					aria-label={__('Reset Color (Clear)', 'blockera')}
				>
					{__('Clear', 'blockera')}
				</Button>
			)}
		</BaseControl>
	);
}
