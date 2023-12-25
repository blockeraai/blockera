// @flow

import { controlClassNames } from '@publisher/classnames';

export const SimpleLabelControl = ({
	label,
	className,
	ariaLabel,
	...props
}) => {
	return (
		<>
			{label && (
				<span
					{...props}
					className={controlClassNames('label', className)}
					aria-label={ariaLabel || label}
					data-cy="label-control"
				>
					{label}
				</span>
			)}
		</>
	);
};
