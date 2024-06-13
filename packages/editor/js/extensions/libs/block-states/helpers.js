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
import { Icon } from '@blockera/icons';

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
				<Icon
					icon="device-laptop"
					aria-label={__('Laptop', 'blockera')}
					onClick={onClick}
					{...props}
				/>
			);

		case 'desktop':
			return (
				<Icon
					icon="device-desktop"
					aria-label={__('Desktop', 'blockera')}
					onClick={onClick}
					{...props}
				/>
			);

		case 'tablet':
			return (
				<Icon
					icon="device-tablet"
					aria-label={__('Tablet', 'blockera')}
					onClick={onClick}
					{...props}
				/>
			);

		case 'mobile':
			return (
				<Icon
					icon="device-mobile"
					aria-label={__('Mobile', 'blockera')}
					onClick={onClick}
					{...props}
				/>
			);

		case 'mobile-landscape':
			return (
				<Icon
					icon="device-mobile-landscape"
					aria-label={__('Mobile Landscape', 'blockera')}
					onClick={onClick}
					{...props}
				/>
			);

		case 'large':
			return (
				<Icon
					icon="device-large-screen"
					aria-label={__('Large Screen', 'blockera')}
					onClick={onClick}
					{...props}
				/>
			);

		case 'extra-large':
			return (
				<Icon
					icon="device-extra-large"
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
	const onChangeValue: Object = { ...newValue };
	if (newValue.hasOwnProperty('modifyControlValue')) {
		newValue = onChangeValue?.value;
	}

	const {
		states: _states,
		onChange,
		currentBlock,
		valueCleanup,
		getStateInfo,
	} = params;
	const { getSelectedBlock } = select('core/block-editor');

	const {
		setBlockClientInnerState,
		setBlockClientMasterState,
		changeExtensionCurrentBlockState: setCurrentState,
		changeExtensionInnerBlockState: setInnerBlockState,
	} = dispatch('blockera-core/extensions') || {};

	let selectedState = null;

	Object.entries(newValue).forEach(
		([id, state]: [
			TStates,
			{ ...StateTypes, isSelected: boolean }
		]): void => {
			if (isInnerBlock(currentBlock) && state?.isSelected) {
				selectedState = id;
				setInnerBlockState(id);
				setBlockClientInnerState({
					currentState: id,
					innerBlockType: currentBlock,
					clientId: getSelectedBlock()?.clientId,
				});
			} else if (state?.isSelected) {
				selectedState = id;
				setCurrentState(id);
				setBlockClientMasterState({
					currentState: id,
					name: getSelectedBlock()?.name,
					clientId: getSelectedBlock()?.clientId,
				});
			}
		}
	);

	if (onChangeValue.hasOwnProperty('modifyControlValue')) {
		let blockStates = {};
		const { modifyControlValue, controlId } = onChangeValue;

		if (isInnerBlock(currentBlock)) {
			blockStates =
				getSelectedBlock()?.attributes.blockeraInnerBlocks[currentBlock]
					.attributes.blockeraBlockStates;
		} else {
			blockStates = getSelectedBlock()?.attributes.blockeraBlockStates;
		}

		modifyControlValue({
			controlId,
			value: Object.fromEntries(
				Object.entries(blockStates).map(
					([stateType, stateItem], index) => {
						const info = getStateInfo(index);

						if ('normal' === stateType) {
							info.deletable = false;
						}

						return [
							stateType,
							{
								...info,
								...stateItem,
								isSelected: stateType === selectedState,
							},
						];
					}
				)
			),
		});

		return;
	}

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
