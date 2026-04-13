//@flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { componentClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import type { GapProps } from './types';

export default function Grid({
	gap = '',
	columnGap = '',
	rowGap = '',
	gridTemplateColumns = '',
	gridTemplateRows = '',
	gridTemplate = '',
	alignContent = '',
	justifyContent = '',
	alignItems = '',
	justifyItems = '',
	children,
	className = '',
	style,
	...props
}: GapProps): MixedElement {
	return (
		<div
			style={{
				gap:
					columnGap || rowGap
						? (rowGap || '') + ' ' + (columnGap || '')
						: gap,
				gridTemplate,
				gridTemplateColumns,
				gridTemplateRows,
				alignContent,
				justifyContent,
				alignItems,
				justifyItems,
				...style,
			}}
			{...props}
			className={componentClassNames('grid', className)}
		>
			{children}
		</div>
	);
}
