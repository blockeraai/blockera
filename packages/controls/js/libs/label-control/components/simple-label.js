// @flow
/**
 * External Dependencies
 */
import type { MixedElement } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Blockera Dependencies
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
import { Tooltip } from '../../';

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

			{resetToDefault ? (
				<Tooltip
					text={__('Reset to default', 'blockera')}
					style={{
						'--tooltip-bg': '#e20000',
					}}
					delay={300}
				>
					<ResetIcon
						className={controlInnerClassNames('reset-icon')}
						onClick={(event) => {
							event.stopPropagation();

							resetToDefault();
						}}
					/>
				</Tooltip>
			) : (
				<>
					{labelDescription && (
						<HelpSmallIcon
							className={controlInnerClassNames('help-icon')}
						/>
					)}
				</>
			)}
		</span>
	);
};
