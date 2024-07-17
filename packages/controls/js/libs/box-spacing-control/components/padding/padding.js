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

export function Padding({
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
	paddingDisable,
	setControlClassName,
	paddingLock,
	setPaddingLock,
}: SideProps): MixedElement {
	return (
		<>
			{paddingDisable === 'all' ? (
				<span
					className={controlInnerClassNames(
						'box-model-label',
						'box-mode-padding'
					)}
					data-cy="box-spacing-padding"
				>
					<LabelControl
						ariaLabel={__('Padding Spacing', 'blockera')}
						label={__('Padding', 'blockera')}
					/>
				</span>
			) : (
				<span
					className={controlInnerClassNames(
						'box-model-label',
						'box-mode-padding'
					)}
					data-cy="box-spacing-padding"
				>
					<LabelControl
						mode={'advanced'}
						ariaLabel={__('Padding Spacing', 'blockera')}
						label={__('Padding', 'blockera')}
						labelDescription={
							<>
								<p>
									{__(
										"Define the spacing between the block's content and its border, ensuring control over layout and aesthetics.",
										'blockera'
									)}
								</p>
							</>
						}
						{...{
							attribute,
							blockName,
							resetToDefault,
							mode: 'advanced',
							singularId: 'padding',
							value: value?.padding,
							defaultValue: defaultValue?.padding,
							path: getControlPath(attribute, 'padding'),
						}}
					/>
				</span>
			)}

			{paddingDisable !== 'all' && (
				<SelectControl
					id={getId(id, 'paddingLock')}
					defaultValue={paddingLock}
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
						setPaddingLock(newValue);

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
