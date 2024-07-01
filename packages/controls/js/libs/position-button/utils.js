// @flow

/**
 * Internal dependencies
 */
import type { TRenderPositionIcon } from './types';
import { default as OriginCustom } from './icons/custom.svg';
import { default as OriginTopLeft } from './icons/top-left.svg';
import { default as OriginTopCenter } from './icons/top-center.svg';
import { default as OriginTopRight } from './icons/top-right.svg';
import { default as OriginCenterLeft } from './icons/center-left.svg';
import { default as OriginCenter } from './icons/center.svg';
import { default as OriginCenterRight } from './icons/center-right.svg';
import { default as OriginBottomLeft } from './icons/bottom-left.svg';
import { default as OriginBottomCenter } from './icons/bottom-center.svg';
import { default as OriginBottomRight } from './icons/bottom-right.svg';

export const renderPositionIcon = ({
	top,
	left,
	defaultValue,
}: TRenderPositionIcon): any => {
	if ((!top || !left) && !defaultValue?.top && !defaultValue?.left)
		return <OriginCustom data-test="position-icon-custom" />;

	if (top === '0%' && left === '0%')
		return <OriginTopLeft data-test="position-icon-top-left" />;
	if (top === '0%' && left === '50%')
		return <OriginTopCenter data-test="position-icon-top-center" />;
	if (top === '0%' && left === '100%')
		return <OriginTopRight data-test="position-icon-top-right" />;
	if (top === '50%' && left === '0%')
		return <OriginCenterLeft data-test="position-icon-center-left" />;
	if (top === '50%' && left === '50%')
		return <OriginCenter data-test="position-icon-center-center" />;
	if (top === '50%' && left === '100%')
		return <OriginCenterRight data-test="position-icon-center-right" />;
	if (top === '100%' && left === '0%')
		return <OriginBottomLeft data-test="position-icon-bottom-left" />;
	if (top === '100%' && left === '50%')
		return <OriginBottomCenter data-test="position-icon-bottom-center" />;
	if (top === '100%' && left === '100%')
		return <OriginBottomRight data-test="position-icon-bottom-right" />;

	return <OriginCustom data-test="position-icon-custom" />;
};
