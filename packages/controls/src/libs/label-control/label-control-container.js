// @flow
/**
 * External Dependencies
 */
import type { MixedElement } from 'react';

/**
 * Publisher Dependencies
 */
import { controlClassNames } from '@publisher/classnames';

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
