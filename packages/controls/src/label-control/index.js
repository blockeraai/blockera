/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';

export default function LabelControl({
	label,
	className,
	ariaLabel = '',
	...props
}) {
	return (
		<>
			{label && (
				<span
					{...props}
					className={controlClassNames('label', className)}
					aria-label={ariaLabel || label}
				>
					{label}
				</span>
			)}
		</>
	);
}
