// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useInstanceId } from '@wordpress/compose';
import type { MixedElement } from 'react';
import { useCallback, useEffect, useRef, useState } from '@wordpress/element';

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
import { Button, Popover, BaseControl, NoticeControl } from '../index';
import {
	isColorControllableBySketchPicker,
	validHex,
	valueCleanupColorString,
} from './utils/css-color';

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
	labelProps: propsForLabelControl = {},
	columns,
	defaultValue = '',
	onChange,
	field = 'color-picker',
	//
	className,
	children,
}: ColorPickerControlProps): MixedElement {
	const valueCleanup = useCallback((newValue: string) => {
		return valueCleanupColorString(newValue);
	}, []);

	const { value, setValue, attribute, blockName, resetToDefault } =
		useControlContext({
			id,
			onChange,
			defaultValue,
			valueCleanup,
		});

	const [isPopoverHidden, setIsPopoverHidden] = useState(false);
	const cssValueInputId = useInstanceId(
		ColorPickerControl,
		'blockera-color-picker-css'
	);
	// Some color pickers blur the active element on drag; null relatedTarget can close the popover on focus-outside.
	const focusOutsideSuppressionRef = useRef(false);

	useEffect(() => {
		if (!isOpen || !isPopover) {
			return undefined;
		}
		const doc = typeof document !== 'undefined' ? document : null;
		if (!doc) {
			return undefined;
		}
		const onPointerDownCapture = (ev: PointerEvent) => {
			const t = ev.target;
			if (t instanceof Element && t.closest('.sketch-picker')) {
				focusOutsideSuppressionRef.current = true;
			}
		};
		const clearSuppression = () => {
			focusOutsideSuppressionRef.current = false;
		};
		doc.addEventListener('pointerdown', onPointerDownCapture, true);
		doc.addEventListener('pointerup', clearSuppression, true);
		doc.addEventListener('pointercancel', clearSuppression, true);
		return () => {
			doc.removeEventListener('pointerdown', onPointerDownCapture, true);
			doc.removeEventListener('pointerup', clearSuppression, true);
			doc.removeEventListener('pointercancel', clearSuppression, true);
			focusOutsideSuppressionRef.current = false;
		};
	}, [isOpen, isPopover]);

	const eyeDropper: any = window?.EyeDropper ? new window.EyeDropper() : null;

	const pickColor = useCallback(() => {
		const openPicker = async () => {
			try {
				const color = await eyeDropper?.open();
				const raw = color?.sRGBHex;
				if (typeof raw === 'string' && raw !== '') {
					const candidate = raw.startsWith('#') ? raw : '#' + raw;
					if (validHex(candidate)) {
						setValue(candidate.toLowerCase());
					} else {
						setValue(raw);
					}
				} else {
					setValue('');
				}
				setIsPopoverHidden(false);
			} catch (e) {
				/* @debug-ignore */
				console.warn(
					'EyeDropper was not supported with your browser. please for use of color picker switch to Google Chrome browser.'
				);
				setIsPopoverHidden(false);
			}
		};
		openPicker();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [eyeDropper?.open]);

	let colorPickerLabel = '';

	if (!/Chrome|Opera/gi.exec(navigator.userAgent)) {
		colorPickerLabel = __(
			"The EyeDropper feature of the color picker isn't supported in your browser. Please switch to a compatible browser such as Chrome.",
			'blockera'
		);
	} else if ('http:' === window.location.protocol) {
		colorPickerLabel = __(
			'The EyeDropper feature is only available in secure contexts (HTTPS) and may not work in all supported browsers unless accessed over a secure connection.',
			'blockera'
		);
	} else if (!eyeDropper) {
		colorPickerLabel = __(
			"The EyeDropper feature of the color picker isn't supported in your browser. Please switch to a compatible browser such as Chrome.",
			'blockera'
		);
	}

	function showEyeDropperNotice() {
		if (eyeDropper) {
			return null;
		}

		return (
			<div style={{ paddingBottom: '15px' }}>
				<NoticeControl
					type="error"
					icon={<Icon icon="eye-dropper" iconSize="18" />}
				>
					{colorPickerLabel}
				</NoticeControl>
			</div>
		);
	}

	const sketchControllable = isColorControllableBySketchPicker(value);

	const sketchStackClassName =
		'blockera-color-picker-sketch-stack' +
		(sketchControllable
			? ''
			: ' blockera-color-picker-sketch-stack--locked');

	const sketchLockedNotice = !sketchControllable ? (
		<div
			className="blockera-color-picker-sketch-notice"
			data-cy="color-picker-sketch-locked-notice"
		>
			<NoticeControl type="warning">
				{__(
					'This color cannot be changed with the color picker. Use the color value field with a hex code, rgb(), or a named color to enable the picker.',
					'blockera'
				)}
			</NoticeControl>
		</div>
	) : null;

	const colorValueField = (
		<div className="blockera-color-picker-css-field">
			<label
				className="blockera-color-picker-css-field__label"
				htmlFor={cssValueInputId}
			>
				{__('Color value', 'blockera')}
			</label>
			<input
				id={cssValueInputId}
				type="text"
				className="blockera-color-picker-css-field__input"
				data-cy="color-picker-css-value"
				value={value}
				onChange={(e) => {
					setValue(e.target.value);
				}}
				autoComplete="off"
				spellCheck={false}
				placeholder={__(
					'#fff, rgb(), currentColor, var(--token)',
					'blockera'
				)}
			/>
		</div>
	);

	if (isPopover) {
		return (
			<BaseControl
				label={label}
				columns={columns}
				controlName={field}
				className={className}
				{...{
					attribute,
					blockName,
					resetToDefault,
				}}
				{...propsForLabelControl}
			>
				{isOpen && (
					<Popover
						title={popoverTitle}
						offset={120}
						placement={placement}
						className={`blockera-color-picker-popover ${
							isPopoverHidden ? 'hidden' : ''
						}`}
						onClose={onClose}
						focusOutsideSuppressionRef={focusOutsideSuppressionRef}
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
									style={{
										padding: '5px',
									}}
									disabled={eyeDropper === null}
									aria-label={__('Pick Color', 'blockera')}
								>
									<Icon icon="eye-dropper" iconSize="18" />
								</Button>

								<Button
									tabIndex="-1"
									size={'extra-small'}
									onClick={() => {
										if (value) {
											setValue('');
											onClose();
										}
									}}
									style={{ padding: '5px' }}
									aria-label={__(
										'Reset Color (Clear)',
										'blockera'
									)}
									disabled={!value}
								>
									<Icon icon="trash" iconSize="20" />
								</Button>
							</>
						}
					>
						{colorValueField}

						<div className={sketchStackClassName}>
							<ColorPallet
								disabled={!sketchControllable}
								enableAlpha={true}
								color={value}
								onChangeComplete={(stored: string) =>
									setValue(stored)
								}
							/>
							{sketchLockedNotice}
						</div>

						{children}

						{showEyeDropperNotice()}
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
			<div className={sketchStackClassName}>
				<ColorPallet
					disabled={!sketchControllable}
					enableAlpha={false}
					color={value}
					onChangeComplete={(stored: string) => setValue(stored)}
				/>
				{sketchLockedNotice}
			</div>

			{colorValueField}

			{children}

			{hasClearBtn && (
				<Button
					onClick={() => setValue('')}
					aria-label={__('Reset Color (Clear)', 'blockera')}
				>
					{__('Clear', 'blockera')}
				</Button>
			)}

			{showEyeDropperNotice()}
		</BaseControl>
	);
}
