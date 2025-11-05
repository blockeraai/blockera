// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { useControlContext } from '../../context';

/**
 * Internal dependencies
 */
import type { LabelControlProps } from './types';
import { SimpleLabelControl } from './components';

const LabelControl = ({
	mode = 'simple',
	label = '',
	labelPopoverTitle = '',
	labelDescription,
	path,
	singularId,
	className = '',
	labelClassName = '',
	ariaLabel = '',
	attribute,
	blockName,
	isRepeater = false,
	repeaterItem,
	iconPosition = 'end',
	resetToDefault,
	...props
}: LabelControlProps): MixedElement => {
	if ('none' === mode) {
		return <></>;
	}

	const {
		components: { AdvancedLabelControl },
		// eslint-disable-next-line react-hooks/rules-of-hooks
	} = useControlContext();

	if ('advanced' === mode && AdvancedLabelControl) {
		return (
			<AdvancedLabelControl
				{...{
					label,
					singularId,
					className: `${className} ${labelClassName}`.trim(),
					ariaLabel,
					attribute,
					blockName,
					isRepeater,
					labelDescription,
					labelPopoverTitle,
					repeaterItem,
					iconPosition,
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
			className={`${className} ${labelClassName}`.trim()}
			labelDescription={labelDescription}
			iconPosition={iconPosition}
			{...props}
		/>
	);
};

export default LabelControl;
