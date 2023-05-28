/**
 * Internal dependencies
 */
import { controlClassNames } from '@publisher/classnames';

export default function LabelControl({
	label,
	className = controlClassNames('label-control'),
	...props
}) {
	return (
		<span {...props} className={className}>
			{label}
		</span>
	);
}
