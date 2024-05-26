// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { select, dispatch } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { isEquals, mergeObject } from '@blockera/utils';

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
	className?: string,
	onClick?: (event: MouseEvent) => void,
}): MixedElement {
	switch (name) {
		case 'laptop':
			return (
				<LaptopIcon
					aria-label={__('Laptop', 'blockera')}
					onClick={onClick}
					{...props}
				/>
			);

		case 'desktop':
			return (
				<DesktopIcon
					aria-label={__('Desktop', 'blockera')}
					onClick={onClick}
					{...props}
				/>
			);

		case 'tablet':
			return (
				<TabletIcon
					aria-label={__('Tablet', 'blockera')}
					onClick={onClick}
					{...props}
				/>
			);

		case 'mobile':
			return (
				<MobileIcon
					aria-label={__('Mobile', 'blockera')}
					onClick={onClick}
					{...props}
				/>
			);

		case 'mobile-landscape':
			return (
				<MobileLandscapeIcon
					aria-label={__('Mobile Landscape', 'blockera')}
					onClick={onClick}
					{...props}
				/>
			);

		case 'large':
			return (
				<LargeIcon
					aria-label={__('Large Screen', 'blockera')}
					onClick={onClick}
					{...props}
				/>
			);

		case 'extra-large':
			return (
				<ExtraLargeIcon
					aria-label={__('Extra Large Screen', 'blockera')}
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
	} = dispatch('blockera-core/extensions') || {};

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

	if (isEquals(valueCleanup(_states), valueCleanup(newValue))) {
		return;
	}

	const deletedProps = [];

	Object.entries(_states).forEach(([name]: [string, any]): void => {
		if (!newValue.hasOwnProperty(name)) {
			deletedProps.push(name);
			newValue = {
				...newValue,
				[name]: undefined,
			};
		}
	});

	onChange(
		'blockeraBlockStates',
		mergeObject(valueCleanup(_states), valueCleanup(newValue), {
			deletedProps,
		})
	);
}

export const blockStatesValueCleanup = (value: {
	[key: TStates]: {
		...StateTypes,
		isVisible: boolean,
		'css-class'?: string,
	},
}): Object => {
	const clonedValue: {
		[key: TStates]: {
			breakpoints: {
				[key: TBreakpoint]: {
					attributes: Object,
				},
			},
			isVisible: boolean,
			'css-class'?: string,
		},
	} = {};
	const currentBreakpoint = select(
		'blockera-core/extensions'
	).getExtensionCurrentBlockStateBreakpoint();

	Object.entries(value).forEach(
		([itemId, item]: [
			TStates,
			{
				...StateTypes,
				isVisible: boolean,
				'css-class'?: string,
			}
		]): void => {
			/**
			 * To compatible with deleted props of mergeObject api.
			 *
			 * @see ../helpers.js on line 179
			 */
			if (undefined === item) {
				clonedValue[itemId] = item;

				return;
			}

			const breakpoints: {
				[key: TBreakpoint]: {
					attributes: Object,
				},
			} = {};

			Object.entries(item?.breakpoints)?.forEach(
				([breakpointType, breakpoint]: [TBreakpoint, Object]) => {
					if (
						!Object.keys(breakpoint?.attributes || {}).length &&
						'laptop' !== breakpointType
					) {
						return;
					}

					const { attributes = {} } = breakpoint;

					if (
						!Object.keys(attributes).length &&
						'normal' !== itemId
					) {
						return;
					}

					breakpoints[breakpointType] = {
						attributes,
					};
				}
			);

			if (!Object.values(breakpoints).length && 'normal' !== itemId) {
				breakpoints[currentBreakpoint] = {
					attributes: {},
				};
			}

			if (['custom-class', 'parent-class'].includes(itemId)) {
				clonedValue[itemId] = {
					breakpoints,
					isVisible: item?.isVisible,
					'css-class': item['css-class'] || '',
				};

				return;
			}

			clonedValue[itemId] = {
				breakpoints,
				isVisible: item?.isVisible,
			};
		}
	);

	return clonedValue;
};
