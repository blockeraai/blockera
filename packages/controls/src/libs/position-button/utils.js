// @flow

/**
 * Internal dependencies
 */
import type { TRenderPositionIcon } from './types';
import OriginCustom from './icons/custom';
import OriginTopLeft from './icons/top-left';
import OriginTopCenter from './icons/top-center';
import OriginTopRight from './icons/top-right';
import OriginCenterLeft from './icons/center-left';
import OriginCenter from './icons/center';
import OriginCenterRight from './icons/center-right';
import OriginBottomLeft from './icons/bottom-left';
import OriginBottomCenter from './icons/bottom-center';
import OriginBottomRight from './icons/bottom-right';

export const renderPositionIcon = ({ top, left }: TRenderPositionIcon): any => {
	if (top === '0%' && left === '0%') return <OriginTopLeft />;
	if (top === '0%' && left === '50%') return <OriginTopCenter />;
	if (top === '0%' && left === '100%') return <OriginTopRight />;
	if (top === '50%' && left === '0%') return <OriginCenterLeft />;
	if (top === '50%' && left === '50%') return <OriginCenter />;
	if (top === '50%' && left === '100%') return <OriginCenterRight />;
	if (top === '100%' && left === '0%') return <OriginBottomLeft />;
	if (top === '100%' && left === '50%') return <OriginBottomCenter />;
	if (top === '100%' && left === '100%') return <OriginBottomRight />;

	return <OriginCustom />;
};
