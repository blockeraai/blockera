// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { select, dispatch } from '@wordpress/data';

/**
 * Publisher dependencies
 */
import { isEquals, mergeObject } from '@publisher/utils';

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
import { isInnerBlock } from '../../components/utils';

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
			return (
				<LaptopIcon
					aria-label={__('Laptop', 'publisher-core')}
					onClick={onClick}
					{...props}
				/>
			);

		case 'desktop':
			return (
				<DesktopIcon
					aria-label={__('Desktop', 'publisher-core')}
					onClick={onClick}
					{...props}
				/>
			);

		case 'tablet':
			return (
				<TabletIcon
					aria-label={__('Tablet', 'publisher-core')}
					onClick={onClick}
					{...props}
				/>
			);

		case 'mobile':
			return (
				<MobileIcon
					aria-label={__('Mobile', 'publisher-core')}
					onClick={onClick}
					{...props}
				/>
			);

		case 'mobile-landscape':
			return (
				<MobileLandscapeIcon
					aria-label={__('Mobile Landscape', 'publisher-core')}
					onClick={onClick}
					{...props}
				/>
			);

		case 'large':
			return (
				<LargeIcon
					aria-label={__('Large Screen', 'publisher-core')}
					onClick={onClick}
					{...props}
				/>
			);

		case 'extra-large':
			return (
				<ExtraLargeIcon
					aria-label={__('Extra Large Screen', 'publisher-core')}
					onClick={onClick}
					{...props}
				/>
			);

		default:
			return <></>;
	}
}

export function onChangeBlockStates(
	newValue: { [key: TStates]: { ...StateTypes, isSelected: boolean } },
	params: Object
): void {
	const { states: _states, onChange, currentBlock, valueCleanup } = params;
	const { getSelectedBlock } = select('core/block-editor');

	const {
		setBlockClientInnerState,
		setBlockClientMasterState,
		changeExtensionCurrentBlockState: setCurrentState,
		changeExtensionInnerBlockState: setInnerBlockState,
	} = dispatch('publisher-core/extensions') || {};

	Object.entries(newValue).forEach(
		([id, state]: [
			TStates,
			{ ...StateTypes, isSelected: boolean }
		]): void => {
			if (isInnerBlock(currentBlock) && state?.isSelected) {
				setInnerBlockState(id);
				setBlockClientInnerState({
					currentState: id,
					innerBlockType: currentBlock,
					clientId: getSelectedBlock()?.clientId,
				});
			} else if (state?.isSelected) {
				setCurrentState(id);
				setBlockClientMasterState({
					currentState: id,
					name: getSelectedBlock()?.name,
					clientId: getSelectedBlock()?.clientId,
				});
			}
		}
	);

	if (isEquals(_states, newValue)) {
		return;
	}

	onChange(
		'publisherBlockStates',
		mergeObject(valueCleanup(_states), valueCleanup(newValue))
	);
}
