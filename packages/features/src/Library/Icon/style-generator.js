// @flow

/**
 * Internal dependencies
 */
// import * as config from '../base/config';
import type { CssRule } from '@blockera/editor/js/style-engine/types';
import type { StylesProps } from '@blockera/editor/js/extensions/libs/types';

export const IconStyleGenerator = (Props: StylesProps): Array<CssRule> => {
	// const {
	// blockeraIcon,
	// blockeraIconOptions,
	// blockeraIconPosition,
	// blockeraIconGap,
	// blockeraIconSize,
	// blockeraIconColor,
	// blockeraIconLink,
	// } = config.iconConfig;
	// const blockProps = {
	// 	clientId,
	// 	blockName,
	// 	attributes: currentBlockAttributes,
	// };
	// const sharedParams = {
	// 	...props,
	// 	state,
	// 	clientId,
	// 	currentBlock,
	// 	blockSelectors,
	// 	className: currentBlockAttributes?.className,
	// };
	const styleGroup: Array<CssRule> = [];

	console.log(Props);

	return styleGroup;
};
