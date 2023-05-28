/**
 * Internal dependencies
 */
import { controlClassNames } from '@publisher/classnames';

export default function LabelControl({ label, className, ...props }) {
	return (
		<span {...props} className={controlClassNames('label', className)}>
			{label}
		</span>
	);
}
