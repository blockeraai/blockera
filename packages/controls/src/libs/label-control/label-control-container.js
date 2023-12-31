// @flow
/**
 * Publisher Dependencies
 */
import { controlClassNames } from '@publisher/classnames';

export default function LabelControlContainer({
	height = '30px',
	className,
	children,
}: {
	height?: string,
	className?: string,
	children?: string | MixedElement,
}) {
	return (
		<span
			className={controlClassNames('label-container', className)}
			style={{
				display: 'flex',
				alignItems: 'center',
				minHeight: height,
			}}
		>
			{children}
		</span>
	);
}
