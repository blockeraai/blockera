// @flow

/**
 * Internal dependencies
 */
// import * as config from '../base/config';
import type { StylesProps } from '../types';
import type { CssRule } from '../../../style-engine/types';

export const IconStyles = ({
	// eslint-disable-next-line
	state,
	// eslint-disable-next-line
	clientId,
	// eslint-disable-next-line
	blockName,
	// eslint-disable-next-line
	currentBlock,
	// supports,
	// activeDeviceType,
	// eslint-disable-next-line
	selectors: blockSelectors,
	// eslint-disable-next-line
	attributes: currentBlockAttributes,
}: StylesProps): Array<CssRule> => {
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

	return styleGroup;
};
