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
import type {
	InnerBlockModel,
	InnerBlockType,
} from '@publisher/extensions/src/libs/inner-blocks/types';

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
		innerBlocks: attributes.publisherInnerBlocks,
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
		const calculatedStyleDependencies = (
			blockAttributes: Object
		): {
			stateAttributes: Object,
			media: string,
		} => {
			const currentState = blockAttributes?.publisherBlockStates?.find(
				({ type }: { type: TStates }): boolean => type === state
			);

			if (!currentState) {
				return {
					media: '',
					stateAttributes: {},
				};
			}

			const currentBreakpoint = currentState.breakpoints.find(
				({ type }: { type: TBreakpoint }): boolean =>
					type === activeDeviceType.toLowerCase()
			);

			let { attributes: stateAttributes = {} } = currentBreakpoint;

			if ('normal' === state && 'desktop' === currentBreakpoint.type) {
				stateAttributes = blockAttributes;
			} else if (!Object.values(stateAttributes).length) {
				return {
					media: '',
					stateAttributes: {},
				};
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

			return {
				media,
				stateAttributes,
			};
		};

		const register = (
			media: string,
			blockType: 'master' | InnerBlockType,
			blockTypeAttributes: Object
		): void => {
			type StylesheetType =
				| GeneratorReturnType
				| Array<GeneratorReturnType>;

			const stylesheet: StylesheetType = callback({
				...callbackProps,
				selector: selectors[state][blockType],
				media,
				currentBlock: blockType,
				blockProps: {
					...callbackProps.blockProps,
					blockName,
					attributes: blockTypeAttributes,
				},
			});

			if (Array.isArray(stylesheet)) {
				stylesheet?.forEach((_stylesheet) =>
					registerStylesheet(_stylesheet)
				);

				return;
			}

			registerStylesheet(stylesheet);
		};

		const isValidStateAttributes = (stateAttributes: Object): boolean =>
			0 !== Object.values(stateAttributes).length;

		attributes?.publisherInnerBlocks?.forEach(
			(innerBlock: InnerBlockModel): void => {
				if (!selectors[state][innerBlock.type]) {
					return;
				}

				const { media, stateAttributes } = calculatedStyleDependencies(
					innerBlock.attributes
				);

				if (!isValidStateAttributes(stateAttributes)) {
					return;
				}

				register(media, innerBlock.type, stateAttributes);
			}
		);

		const { media, stateAttributes } =
			calculatedStyleDependencies(attributes);

		if (!isValidStateAttributes(stateAttributes)) {
			return;
		}

		register(media, 'master', stateAttributes);
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
