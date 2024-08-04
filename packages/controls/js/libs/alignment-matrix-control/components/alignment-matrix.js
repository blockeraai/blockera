// @flow
/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { controlClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import type { TAlignmentMatrixBox } from '../types';
import { default as MatrixItemIcon } from '../icons/matrix-item.svg';
import { default as MatrixItemIconSelected } from '../icons/matrix-item-selected.svg';

export default function AlignmentMatrixBox({
	onChange,
	value,
	className,
	width,
}: TAlignmentMatrixBox): MixedElement {
	const matrixValidValues = [
		'top left',
		'top center',
		'top right',
		'center left',
		'center center',
		'center right',
		'bottom left',
		'bottom center',
		'bottom right',
	];

	return (
		<div
			className={className}
			style={{ width }}
			aria-label={__('Alignment Matrix Control', 'blockera')}
		>
			{matrixValidValues.map((_value) => (
				<span
					className={`${controlClassNames('matrix-item')} ${
						value === _value ? 'selected' : ''
					}`}
					key={_value}
					onClick={() => onChange(_value)}
					aria-label={sprintf(
						// translators: it's the aria label for matrix item
						__('%s item', 'blockera'),
						_value
					)}
					data-test="matrix-item"
				>
					{value === _value ? (
						<MatrixItemIconSelected />
					) : (
						<MatrixItemIcon />
					)}
				</span>
			))}
		</div>
	);
}
