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

export function Padding({
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
	paddingDisable,
	setControlClassName,
}: SideProps): MixedElement {
	return (
		<>
			{paddingDisable === 'all' ? (
				<span
					className={controlInnerClassNames(
						'box-model-label',
						'box-mode-padding'
					)}
				>
					<LabelControl
						ariaLabel={__('Padding Spacing')}
						label={__('Padding', 'publisher-core')}
					/>
				</span>
			) : (
				<span
					className={controlInnerClassNames(
						'box-model-label',
						'box-mode-padding'
					)}
				>
					<LabelControl
						mode={'advanced'}
						ariaLabel={__('Padding Spacing')}
						label={__('Padding', 'publisher-core')}
						{...{
							value,
							attribute,
							blockName,
							description,
							defaultValue,
							resetToDefault,
							fieldId: 'padding',
							path: getControlPath(attribute, 'padding'),
						}}
					/>
				</span>
			)}

			{paddingDisable !== 'all' && (
				<SelectControl
					id={getId(id, 'paddingLock')}
					defaultValue={defaultValue.paddingLock}
					type="custom"
					noBorder={true}
					customHideInputLabel={true}
					customHideInputCaret={true}
					className={controlInnerClassNames(
						'spacing-lock',
						'padding-lock'
					)}
					onChange={(newValue) => {
						setOpenPopover('');
						setValue({
							...value,
							paddingLock: newValue,
						});

						const shakeSide = 'padding-' + newValue;

						if (shakeSide) {
							if (shakeSide === 'padding-none') {
								setFocusSide('padding-top');
								setControlClassName('disable-pointer-events');

								setTimeout(() => {
									setFocusSide('padding-right');

									setTimeout(() => {
										setFocusSide('padding-bottom');

										setTimeout(() => {
											setFocusSide('padding-left');

											setTimeout(() => {
												setFocusSide('');
												setControlClassName('');
											}, 200);
										}, 200);
									}, 200);
								}, 200);
							} else if (
								shakeSide === 'padding-vertical-horizontal'
							) {
								setFocusSide('padding-vertical');
								setControlClassName('disable-pointer-events');

								setTimeout(() => {
									setFocusSide('');

									setTimeout(() => {
										setFocusSide('padding-horizontal');

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
					options={getSideSelectOptions(paddingDisable)}
				/>
			)}
		</>
	);
}
