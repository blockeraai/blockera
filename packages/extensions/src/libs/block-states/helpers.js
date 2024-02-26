// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { dispatch } from '@wordpress/data';

/**
 * Publisher dependencies
 */
import { isEquals } from '@publisher/utils';

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
import { isInnerBlock } from '../../components';

export const getStateInfo = (state: TStates | number): StateTypes => {
	return 'number' === typeof state
		? Object.values(states)[state]
		: states[state];
};

export const getBreakpointInfo = (
	breakpoint: TBreakpoint,
	parentState: TStates = 'normal'
): BreakpointTypes | void => {
	return breakpoints(parentState)[breakpoint];
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

export function onChangeBlockStates(
	newValue: { [key: TStates]: { ...StateTypes, isSelected: boolean } },
	params: Object
): void {
	const { states: _states, onChange, currentBlock, calculatedValue } = params;
	const {
		changeExtensionCurrentBlockState: setCurrentState,
		changeExtensionInnerBlockState: setInnerBlockState,
	} = dispatch('publisher-core/extensions') || {};

	Object.entries(newValue).forEach(
		([id, state]: [
			TStates,
			{ ...StateTypes, isSelected: boolean }
		]): void => {
			if (isInnerBlock(currentBlock) && state?.isSelected) {
				console.log('inner', state);
				setInnerBlockState(state?.type || calculatedValue[id]?.type);
			} else if (state?.isSelected) {
				setCurrentState(state?.type || calculatedValue[id]?.type);
			}
		}
	);

	if (isEquals(_states, newValue)) {
		return;
	}

	onChange('publisherBlockStates', newValue);
}
