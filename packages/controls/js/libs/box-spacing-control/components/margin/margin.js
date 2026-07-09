// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';

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
	attribute,
	blockName,
	defaultValue,
	resetToDefault,
	getControlPath,
	//
	setFocusSide,
	setOpenPopover,
	marginDisable,
	setControlClassName,
	marginLock,
	setMarginLock,
}: SideProps): MixedElement {
	return (
		<>
			{marginDisable === 'all' ? (
				<span
					className={controlInnerClassNames(
						'box-model-label',
						'box-mode-margin'
					)}
					data-cy="box-spacing-margin"
				>
					<LabelControl
						ariaLabel={__('Margin Spacing', 'blockera')}
						label={__('Margin', 'blockera')}
					/>
				</span>
			) : (
				<span
					className={controlInnerClassNames(
						'box-model-label',
						'box-mode-margin'
					)}
					data-cy="box-spacing-margin"
				>
					<LabelControl
						mode={'advanced'}
						ariaLabel={__('Margin Spacing', 'blockera')}
						labelDescription={
							<>
								<p>
									{__(
										'Use margin to create separation between blocks, optimizing layout and enhancing visual balance.',
										'blockera'
									)}
								</p>
								<p>
									{__(
										"It's beneficial for improving layout and boosting visual harmony, especially in adaptive, responsive designs.",
										'blockera'
									)}
								</p>
							</>
						}
						label={__('Margin', 'blockera')}
						offset={130}
						{...{
							attribute,
							blockName,
							resetToDefault,
							mode: 'advanced',
							singularId: 'margin',
							value: value?.margin,
							defaultValue: defaultValue?.margin,
							path: getControlPath(attribute, 'margin'),
						}}
					/>
				</span>
			)}

			{marginDisable !== 'all' && (
				<SelectControl
					id={getId(id, 'marginLock')}
					defaultValue={marginLock}
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
						setMarginLock(newValue);

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
