// @flow
/**
 * External Dependencies
 */
import type { MixedElement } from 'react';

/**
 * Publisher Dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@publisher/classnames';

/**
 * Internal Dependencies
 */
import HelpSmallIcon from '../icons/help-small';
import type { SimpleLabelControlProps } from '../types';

export const SimpleLabelControl = ({
	label,
	className,
	ariaLabel,
	labelDescription,
	advancedIsOpen = false,
	...props
}: SimpleLabelControlProps): MixedElement => {
	return (
		<>
			{label && (
				<span
					{...props}
					className={controlClassNames(
						'label',
						className,
						advancedIsOpen ? 'show-help' : ''
					)}
					aria-label={ariaLabel || label}
					data-cy="label-control"
				>
					{label}

					{labelDescription && (
						<HelpSmallIcon
							className={controlInnerClassNames('help-icon')}
						/>
					)}
				</span>
			)}
		</>
	);
};
