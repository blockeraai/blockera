// @flow
/**
 * External Dependencies
 */
import type { MixedElement } from 'react';

/**
 *  Dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@blockera/classnames';

/**
 * Internal Dependencies
 */
import HelpSmallIcon from '../icons/help-small';
import ResetIcon from '../icons/reset';
import type { SimpleLabelControlProps } from '../types';

export const SimpleLabelControl = ({
	label,
	className,
	ariaLabel,
	labelDescription,
	advancedIsOpen = false,
	resetToDefault,
	...props
}: SimpleLabelControlProps): MixedElement => {
	if (!label) {
		return <></>;
	}

	let labelClass = '';
	if (advancedIsOpen) {
		labelClass = resetToDefault ? 'show-reset' : 'show-help';
	}

	return (
		<span
			{...props}
			className={controlClassNames('label', className, labelClass)}
			aria-label={ariaLabel || label}
			data-cy="label-control"
			onClick={(event) => {
				if (resetToDefault && event.shiftKey) {
					event.stopPropagation();
					resetToDefault();
				} else if (props.onClick) {
					props.onClick(event);
				}
			}}
		>
			{label}

			{labelDescription && (
				<>
					{resetToDefault ? (
						<ResetIcon
							className={controlInnerClassNames('reset-icon')}
							onClick={(event) => {
								event.stopPropagation();

								resetToDefault();
							}}
						/>
					) : (
						<HelpSmallIcon
							className={controlInnerClassNames('help-icon')}
						/>
					)}
				</>
			)}
		</span>
	);
};
