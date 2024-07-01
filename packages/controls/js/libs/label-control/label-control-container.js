// @flow
/**
 * External Dependencies
 */
import type { MixedElement } from 'react';

/**
 *  Dependencies
 */
import { controlClassNames } from '@blockera/classnames';

export default function LabelControlContainer({
	height = '30px',
	className,
	style,
	children,
}: {
	height?: string,
	className?: string,
	style?: Object,
	children?: string | MixedElement,
}): MixedElement {
	return (
		<span
			className={controlClassNames('label-container', className)}
			style={{
				height,
				...style,
			}}
		>
			{children}
		</span>
	);
}
