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
	className,
	ariaLabel = '',
	attribute,
	blockName,
	isRepeater = false,
	repeaterItem,
	resetToDefault,
	...props
}: LabelControlProps): MixedElement => {
	const {
		components: { EditorAdvancedLabelControl },
	} = useControlContext();

	if ('advanced' === mode && EditorAdvancedLabelControl) {
		return (
			<EditorAdvancedLabelControl
				{...{
					label,
					singularId,
					className,
					ariaLabel,
					attribute,
					blockName,
					isRepeater,
					labelDescription,
					labelPopoverTitle,
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
			labelDescription={labelDescription}
			{...props}
		/>
	);
};

export default LabelControl;
