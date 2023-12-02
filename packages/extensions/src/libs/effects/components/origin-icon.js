// @flow

/**
 * Internal dependencies
 */

import OriginCustom from '../icons/origin/custom';
import OriginTopLeft from '../icons/origin/top-left';
import OriginTopCenter from '../icons/origin/top-center';
import OriginTopRight from '../icons/origin/top-right';
import OriginCenterLeft from '../icons/origin/center-left';
import OriginCenter from '../icons/origin/center';
import OriginCenterRight from '../icons/origin/center-right';
import OriginBottomLeft from '../icons/origin/bottom-left';
import OriginBottomCenter from '../icons/origin/bottom-center';
import OriginBottomRight from '../icons/origin/bottom-right';

export const OriginIcon = (top: string, left: string): any => {
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
