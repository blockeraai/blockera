// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import {
	// BackgroundStyles,
	// BorderAndShadowStyles,
	// FlexChildStyles,
	isInnerBlock,
	// LayoutStyles,
	// MouseStyles,
	// PositionStyles,
	SizeStyles,
	// SpacingStyles,
	// TypographyStyles,
} from '@publisher/extensions';
import type { TStates } from '@publisher/extensions/src/libs/block-states/types';
import { default as blockStates } from '@publisher/extensions/src/libs/block-states/states';

/**
 * Internal dependencies
 */
import type { StateStyleProps } from './types';

export const StateStyle = ({
	selectors,
	currentBlock,
	currentState,
	currentBreakpoint,
	...props
}: StateStyleProps): Array<MixedElement> | MixedElement => {
	const states: Array<TStates | string> = Object.keys(blockStates);

	return states.map((state: TStates | string): MixedElement => {
		let _props = {
			...props,
			state,
			selectors,
			currentBlock,
		};

		if ('normal' !== state && !isInnerBlock(currentBlock)) {
			if (!_props.attributes.publisherBlockStates[state]) {
				return <></>;
			}

			_props = {
				..._props,
				attributes:
					_props.attributes.publisherBlockStates[state].breakpoints[
						currentBreakpoint
					].attributes,
			};
		} else if ('normal' !== state && isInnerBlock(currentBlock)) {
			if (
				!_props.attributes?.publisherBlockStates ||
				!_props.attributes?.publisherBlockStates[state]
			) {
				return <></>;
			}

			_props = {
				..._props,
				attributes:
					_props.attributes?.publisherBlockStates[state].breakpoints[
						currentBreakpoint
					].attributes,
			};
		}

		return (
			<>
				{/*<IconStyles {..._props} />*/}
				<SizeStyles {..._props} />
				{/*<MouseStyles {..._props} />*/}
				{/*<LayoutStyles {..._props} />*/}
				{/*<SpacingStyles {..._props} />*/}
				{/*<PositionStyles {..._props} />*/}
				{/*<FlexChildStyles {..._props} />*/}
				{/*<TypographyStyles {..._props} />*/}
				{/*<BackgroundStyles {..._props} />*/}
				{/*<CustomStyleStyles {..._props} />*/}
				{/*<BorderAndShadowStyles {..._props} />*/}
			</>
		);
	});
};
