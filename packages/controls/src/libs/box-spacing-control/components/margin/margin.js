// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import { controlInnerClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { LabelControl, SelectControl } from '../../../index';
import type { SideProps } from '../../types';
import { getSideSelectOptions } from '../utils';

export function Margin({
	id,
	getId,
	//
	value,
	setValue,
	attribute,
	blockName,
	description,
	defaultValue,
	resetToDefault,
	getControlPath,
	//
	setFocusSide,
	setOpenPopover,
	marginDisable,
	setControlClassName,
}: SideProps): MixedElement {
	return (
		<>
			{marginDisable === 'all' ? (
				<span
					className={controlInnerClassNames(
						'box-model-label',
						'box-mode-margin'
					)}
				>
					<LabelControl
						ariaLabel={__('Margin Spacing')}
						label={__('Margin', 'publisher-core')}
					/>
				</span>
			) : (
				<span
					className={controlInnerClassNames(
						'box-model-label',
						'box-mode-margin'
					)}
				>
					<LabelControl
						mode={'advanced'}
						ariaLabel={__('Margin Spacing')}
						label={__('Margin', 'publisher-core')}
						{...{
							value,
							attribute,
							blockName,
							description,
							defaultValue,
							resetToDefault,
							fieldId: 'margin',
							path: getControlPath(attribute, 'margin'),
						}}
					/>
				</span>
			)}

			{marginDisable !== 'all' && (
				<SelectControl
					id={getId(id, 'marginLock')}
					defaultValue={defaultValue.marginLock}
					type="custom"
					noBorder={true}
					customHideInputLabel={true}
					customHideInputCaret={true}
					className={controlInnerClassNames(
						'spacing-lock',
						'margin-lock'
					)}
					onChange={(newValue) => {
						setOpenPopover('');
						setValue({
							...value,
							marginLock: newValue,
						});

						const shakeSide = 'margin-' + newValue;

						if (shakeSide) {
							if (shakeSide === 'margin-none') {
								setFocusSide('margin-top');
								setControlClassName('disable-pointer-events');

								setTimeout(() => {
									setFocusSide('margin-right');

									setTimeout(() => {
										setFocusSide('margin-bottom');

										setTimeout(() => {
											setFocusSide('margin-left');

											setTimeout(() => {
												setFocusSide('');
												setControlClassName('');
											}, 200);
										}, 200);
									}, 200);
								}, 200);
							} else if (
								shakeSide === 'margin-vertical-horizontal'
							) {
								setFocusSide('margin-vertical');
								setControlClassName('disable-pointer-events');

								setTimeout(() => {
									setFocusSide('');

									setTimeout(() => {
										setFocusSide('margin-horizontal');

										setTimeout(() => {
											setFocusSide('');
											setControlClassName('');
										}, 300);
									}, 100);
								}, 300);
							} else {
								setFocusSide(shakeSide);
								setControlClassName('disable-pointer-events');

								setTimeout(() => {
									setFocusSide('');

									setTimeout(() => {
										setFocusSide(shakeSide);

										setTimeout(() => {
											setFocusSide('');
											setControlClassName('');
										}, 200);
									}, 200);
								}, 200);
							}
						}
					}}
					options={getSideSelectOptions(marginDisable)}
				/>
			)}
		</>
	);
}
