// @flow
/**
 * External dependencies
 */
import memoize from 'fast-memoize';
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
	const {
		changeExtensionCurrentBlockState: setCurrentState,
		changeExtensionInnerBlockState: setInnerBlockState,
	} = dispatch('publisher-core/extensions') || {};
	const {
		states,
		rootStates,
		onChange,
		currentBlock,
		innerBlockState,
		currentStateType,
	} = params;
	const prepareSelectedState = memoize(() =>
		newValue.find((item) => item.isSelected)
	);
	const selectedState = prepareSelectedState();

	if (!selectedState) {
		return;
	}

	const isEqualsWithCurrentState = (type: TStates) => {
		if (isInnerBlock(currentBlock)) {
			return type === innerBlockState;
		}

		return type === currentStateType;
	};

	if (isEqualsWithCurrentState(selectedState.type) && states.length) {
		return;
	}

	if (isInnerBlock(currentBlock)) {
		setInnerBlockState(selectedState.type);
	} else {
		setCurrentState(selectedState.type);
	}

	if (newValue.length !== Object.keys(states).length) {
		const blockStates = rootStates;

		const _newValue: {
			[key: TStates]: { ...StateTypes, isSelected: boolean },
		} = {};

		newValue.forEach((state) => {
			if (blockStates[state.type] && blockStates[state.type].isSelected) {
				_newValue[state.type] = {
					...blockStates[state.type],
					isOpen: false,
					isSelected: false,
				};

				return;
			}

			if (blockStates[state.type]) {
				_newValue[state.type] = {
					...blockStates[state.type],
					isOpen: false,
				};

				return;
			}

			if (blockStates[state.type]) {
				_newValue[state.type] = blockStates[state.type];
			} else {
				_newValue[state.type] = state;
			}
		});

		onChange('publisherBlockStates', _newValue);

		return;
	}

	if (!isEquals(selectedState.type, currentStateType)) {
		const publisherBlockStates: {
			[key: TStates]: { ...StateTypes, isSelected: boolean },
		} = {};

		Object.values(rootStates).forEach(
			(state: Object, stateId: number): void => {
				if (stateId === newValue.indexOf(selectedState)) {
					publisherBlockStates[state.type] = {
						...state,
						isOpen: false,
						isSelected: true,
						type: selectedState.type,
						label: selectedState.label,
					};

					return;
				}

				publisherBlockStates[state.type] = {
					...state,
					isOpen: false,
					isSelected: false,
				};
			}
		);

		onChange('publisherInnerBlockStates', publisherBlockStates);
	}
}
