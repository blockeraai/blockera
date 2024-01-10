// @flow

/**
 * Publisher dependencies
 */
import { useCssSelectors } from '@publisher/extensions/src/hooks';
import type {
	BreakpointTypes,
	TBreakpoint,
	TStates,
} from '@publisher/extensions/src/libs/block-states/types';
import breakpoints from '@publisher/extensions/src/libs/block-states/default-breakpoints';

/**
 * Internal dependencies
 */
import type { CssGeneratorProps } from '../types';

export const useCssGenerator = ({
	callback,
	blockName,
	supportId,
	attributes,
	callbackProps,
	activeDeviceType,
	fallbackSupportId,
}: CssGeneratorProps): Array<string> => {
	const stylesheet: Array<string> = [];
	const selectors = useCssSelectors({
		blockName,
		supportId,
		fallbackSupportId,
	});

	Object.entries(selectors).forEach(([state]): void => {
		const currentState = attributes.publisherBlockStates.find(
			({ type }: { type: TStates }): boolean => type === state
		);

		if (!currentState) {
			return;
		}

		const currentBreakpoint = currentState.breakpoints.find(
			({ type }: { type: TBreakpoint }): boolean =>
				type === activeDeviceType.toLowerCase()
		);

		let { attributes: stateAttributes = {} } = currentBreakpoint;

		if ('normal' === state && 'desktop' === currentBreakpoint.type) {
			stateAttributes = attributes;
		} else if (!Object.values(stateAttributes).length) {
			return;
		}

		let media = '';

		const _currentBreakpoint = breakpoints().find(
			({ type }: BreakpointTypes): boolean =>
				type === activeDeviceType.toLowerCase()
		);

		if (_currentBreakpoint) {
			const { min, max } = _currentBreakpoint.settings;

			if (min && max) {
				media = `@media screen and (max-width: ${max}) and (min-width: ${min})`;
			} else if (min) {
				media = `@media screen and (min-width: ${min})`;
			} else if (max) {
				media = `@media screen and (max-width: ${max})`;
			}
		}

		if ('desktop' === activeDeviceType.toLowerCase()) {
			media = '';
		}

		stylesheet.push(
			callback({
				...callbackProps,
				selector: selectors[state],
				media,
				blockProps: {
					...callbackProps.blockProps,
					blockName,
					attributes: stateAttributes,
				},
			})
		);
	});

	return stylesheet;
};
