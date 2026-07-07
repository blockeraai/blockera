/**
 * External dependencies
 */
import type { CSSProperties, ReactNode } from 'react';

/**
 * Blockera dependencies
 */
import { classNames } from '@blockera/classnames';

export interface VariablePreviewProps {
	children: ReactNode;
	type?: 'global' | string;
	style?: CSSProperties;
}

export function VariablePreview({
	type = 'global',
	style = {},
	children,
}: VariablePreviewProps) {
	return (
		<div
			className={classNames(
				'global-styles-variable-preview',
				`global-styles-${type}-preview`
			)}
			style={style}
		>
			{children}
		</div>
	);
}
