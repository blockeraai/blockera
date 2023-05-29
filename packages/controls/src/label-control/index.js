/**
 * Internal dependencies
 */
import { controlClassNames } from '@publisher/classnames';

import './style.scss';

export default function LabelControl({ label, className, ...props }) {
	return (
		<>
			{label && (
				<span
					{...props}
					className={controlClassNames('label', className)}
				>
					{label}
				</span>
			)}
		</>
	);
}
