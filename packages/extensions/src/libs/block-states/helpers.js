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

export function onChangeBlockStates(
	newValue: Array<Object>,
	params: Object
): Object {
	const { changeExtensionCurrentBlockState: switchBlockState } =
		dispatch('publisher-core/extensions') || {};
	const { states, rootStates, onChange, currentStateType } = params;
	const prepareSelectedState = memoize(() =>
		newValue.find((item) => item.isSelected)
	);
	const selectedState = prepareSelectedState();

	if (!selectedState) {
		return;
	}

	const isEqualsWithCurrentState = (type: TStates) =>
		type === currentStateType;

	if (isEqualsWithCurrentState(selectedState.type) && states.length) {
		return;
	}

	switchBlockState(selectedState.type);

	if (newValue.length !== states.length) {
		const addOrModifyRootItems = {
			publisherCurrentState: selectedState.type,
		};

		const blockStates = rootStates;

		onChange(
			'publisherBlockStates',
			newValue.map((state, index) => {
				if (blockStates[index] && blockStates[index].isSelected) {
					return {
						...blockStates[index],
						isOpen: false,
						isSelected: false,
					};
				}
				if (blockStates[index]) {
					return {
						...blockStates[index],
						isOpen: false,
					};
				}

				return state;
			}),
			{
				addOrModifyRootItems,
			}
		);

		return;
	}

	if (!isEquals(selectedState.type, currentStateType)) {
		const publisherBlockStates = rootStates.map(
			(state: Object, stateId: number): Object => {
				if (stateId === newValue.indexOf(selectedState)) {
					return {
						...state,
						isOpen: false,
						isSelected: true,
						type: selectedState.type,
						label: selectedState.label,
					};
				}

				return {
					...state,
					isOpen: false,
					isSelected: false,
				};
			}
		);

		onChange('publisherCurrentState', selectedState.type, {
			addOrModifyRootItems: {
				publisherBlockStates,
			},
		});
	} else {
		onChange('publisherCurrentState', selectedState.type || 'normal');
	}
}
