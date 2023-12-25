// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import { Button, Popover } from '@publisher/components';

/**
 * Internal dependencies
 */
import { BaseControl } from '../index';
import { useControlContext } from '../../context';
import type { ColorPickerControlProps } from './types';
import TrashIcon from './icons/trash';
import { ColorPallet } from './components';

export default function ColorPickerControl({
	popoverTitle = __('Color Picker', 'publisher-core'),
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
	const {
		value,
		setValue,
		attribute,
		blockName,
		description,
		resetToDefault,
	} = useControlContext({
		id,
		onChange,
		defaultValue,
		valueCleanup,
	});

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
				{...{ attribute, blockName, description, resetToDefault }}
			>
				{isOpen && (
					<Popover
						title={popoverTitle}
						offset={20}
						placement={placement}
						className="components-palette-edit-popover"
						onClose={onClose}
						titleButtonsRight={
							<>
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
											'publisher-core'
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
			{...{ attribute, blockName, description, resetToDefault }}
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
					aria-label={__('Reset Color (Clear)', 'publisher-core')}
				>
					{__('Clear', 'publisher-core')}
				</Button>
			)}
		</BaseControl>
	);
}
