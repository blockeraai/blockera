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
