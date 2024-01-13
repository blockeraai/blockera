// @flow

/**
 * Publisher dependencies
 */
import type {
	BreakpointTypes,
	TBreakpoint,
	TStates,
} from '@publisher/extensions/src/libs/block-states/types';
import breakpoints from '@publisher/extensions/src/libs/block-states/default-breakpoints';

/**
 * Internal dependencies
 */
import type { CssGeneratorProps, GeneratorReturnType } from '../types';
import { useCssSelectors } from './use-css-selectors';

export const useCssGenerator = ({
	callback,
	blockName,
	supportId,
	attributes,
	callbackProps,
	activeDeviceType,
	fallbackSupportId,
}: CssGeneratorProps): Array<string> => {
	const stylesheets: Array<GeneratorReturnType> = [];
	const selectors = useCssSelectors({
		blockName,
		supportId,
		fallbackSupportId,
		currentState: attributes.publisherCurrentState,
	});

	const isValidStylesheet = (stylesheet: GeneratorReturnType): boolean =>
		!(
			'undefined' !== typeof stylesheet?.properties &&
			!stylesheet?.properties.trim()
		);

	const registerStylesheet = (stylesheet: GeneratorReturnType): void => {
		if (!isValidStylesheet(stylesheet)) {
			return;
		}

		stylesheets.push(stylesheet);
	};

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

		const stylesheet: GeneratorReturnType | Array<GeneratorReturnType> =
			callback({
				...callbackProps,
				selector: selectors[state],
				media,
				blockProps: {
					...callbackProps.blockProps,
					blockName,
					attributes: stateAttributes,
				},
			});

		if (Array.isArray(stylesheet)) {
			stylesheet?.forEach((_stylesheet) =>
				registerStylesheet(_stylesheet)
			);

			return;
		}

		registerStylesheet(stylesheet);
	});

	return stylesheets.map((style) => {
		if (
			'undefined' === typeof style?.properties ||
			'undefined' === typeof style?.selector
		) {
			return '';
		}

		if (!style.media) {
			return `${style.selector}{${style.properties}}`;
		}

		return `${style.media}{${style.selector}{${style.properties}}}`;
	});
};
