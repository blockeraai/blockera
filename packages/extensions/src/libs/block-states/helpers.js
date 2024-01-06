// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import states from './states';
import breakpoints from './default-breakpoints';
import type {
	StateTypes,
	BreakpointTypes,
	TBreakpoint,
	TStates,
} from './types';
import DesktopIcon from './icons/desktop';
import TabletIcon from './icons/tablet';
import MobileIcon from './icons/mobile';
import MobileLandscapeIcon from './icons/mobile-landscape';
import LaptopIcon from './icons/laptop';
import ExtraLargeIcon from './icons/extra-large';
import LargeIcon from './icons/large';

export const getStateInfo = (state: TStates | number): StateTypes => {
	return 'number' === typeof state
		? Object.values(states)[state]
		: states[state];
};

export const getBreakpointInfo = (
	breakpoint: TBreakpoint | number,
	parentState: TStates = 'normal'
): BreakpointTypes | void => {
	return 'number' === typeof breakpoint
		? breakpoints()[breakpoint]
		: breakpoints(parentState).find((b: BreakpointTypes): boolean => {
				return [b.type, b.label].includes(breakpoint);
		  });
};

export function BreakpointIcon({
	name,
	onClick,
	...props
}: {
	name: TBreakpoint,
	onClick?: (event: MouseEvent) => void,
}): MixedElement {
	switch (name) {
		case 'laptop':
			return <LaptopIcon onClick={onClick} {...props} />;

		case 'desktop':
			return <DesktopIcon onClick={onClick} {...props} />;

		case 'tablet':
			return <TabletIcon onClick={onClick} {...props} />;

		case 'mobile':
			return <MobileIcon onClick={onClick} {...props} />;

		case 'mobile-landscape':
			return <MobileLandscapeIcon onClick={onClick} {...props} />;

		case 'large':
			return <LargeIcon onClick={onClick} {...props} />;

		case 'extra-large':
			return <ExtraLargeIcon onClick={onClick} {...props} />;

		default:
			return <></>;
	}
}
