// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { AnglePickerControl as WordPressAnglePickerControl } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { Button, Flex, BaseControl } from '../';
import { useControlContext } from '../../context';
import { addAngle, subtractAngle } from './utils';
import type { AnglePickerControlProps } from './types';

export default function AnglePickerControl({
	rotateButtons = true,
	//
	id,
	label,
	labelPopoverTitle,
	labelDescription,
	repeaterItem,
	singularId,
	columns,
	defaultValue = 0,
	onChange,
	field = 'angle-picker',
	//
	className,
	...props
}: AnglePickerControlProps): MixedElement {
	const {
		value,
		setValue,
		attribute,
		blockName,
		resetToDefault,
		getControlPath,
	} = useControlContext({
		id,
		onChange,
		defaultValue,
	});

	const labelProps = {
		value,
		singularId,
		attribute,
		blockName,
		label,
		labelPopoverTitle,
		labelDescription,
		repeaterItem,
		defaultValue,
		resetToDefault,
		mode: 'advanced',
		path: getControlPath(attribute, id),
	};

	return (
		<BaseControl
			columns={columns}
			controlName={field}
			className={className}
			{...labelProps}
		>
			<Flex
				direction="row"
				alignItems="center"
				className={controlClassNames('angle', className)}
			>
				<WordPressAnglePickerControl
					{...props}
					value={value}
					onChange={(newValue) => {
						setValue(newValue);
					}}
					label=""
					__nextHasNoMarginBottom
				/>

				{rotateButtons && (
					<>
						<Button
							className={controlInnerClassNames(
								'btn-rotate-left'
							)}
							showTooltip={true}
							label={__('Rotate Anti-clockwise', 'blockera')}
							icon={
								<Icon
									icon="rotate-anti-clockwise"
									iconSize="24"
								/>
							}
							onClick={() => {
								setValue(subtractAngle(value, 45));
							}}
						/>

						<Button
							className={controlInnerClassNames(
								'btn-rotate-right'
							)}
							showTooltip={true}
							label={__('Rotate Clockwise', 'blockera')}
							icon={
								<Icon icon="rotate-clockwise" iconSize="24" />
							}
							onClick={() => {
								setValue(addAngle(value, 45));
							}}
						/>
					</>
				)}
			</Flex>
		</BaseControl>
	);
}
