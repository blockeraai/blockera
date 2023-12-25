// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import type { LabelControlProps } from './types';
import { AdvancedLabelControl, SimpleLabelControl } from './components';

const LabelControl = ({
	mode = 'simple',
	label = '',
	popoverTitle = '',
	path,
	singularId,
	className,
	ariaLabel = '',
	attribute,
	blockName,
	isRepeater = false,
	description,
	repeaterItem,
	resetToDefault,
	...props
}: LabelControlProps): MixedElement => {
	if ('advanced' === mode) {
		return (
			<AdvancedLabelControl
				{...{
					label,
					singularId,
					className,
					ariaLabel,
					attribute,
					blockName,
					isRepeater,
					description,
					popoverTitle,
					repeaterItem,
					resetToDefault,
					path: isRepeater ? path || attribute : path,
					...props,
				}}
			/>
		);
	}

	return (
		<SimpleLabelControl
			label={label}
			ariaLabel={ariaLabel}
			className={className}
			{...props}
		/>
	);
};

export default LabelControl;
