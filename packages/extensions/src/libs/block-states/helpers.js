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
	newValue: Array<{ ...StateTypes, isSelected: boolean }>,
	params: Object
): Object {
	const { states: _states, onChange, currentBlock, calculatedValue } = params;
	const {
		changeExtensionCurrentBlockState: setCurrentState,
		changeExtensionInnerBlockState: setInnerBlockState,
	} = dispatch('publisher-core/extensions') || {};
	const _newValue: {
		[key: TStates]: {
			...StateTypes,
			isSelected: boolean,
		},
	} = {};

	newValue.forEach((state, id) => {
		if (isInnerBlock(currentBlock) && state?.isSelected) {
			setInnerBlockState(state?.type || calculatedValue[id]?.type);
		} else if (state?.isSelected) {
			setCurrentState(state?.type || calculatedValue[id]?.type);
		}

		_newValue[state?.type || calculatedValue[id]?.type] = {
			...(calculatedValue[id] || {}),
			...state,
		};
	});

	if (isEquals(_states, _newValue)) {
		return;
	}

	onChange('publisherBlockStates', _newValue);
}
