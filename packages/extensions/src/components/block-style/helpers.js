// @flow

/**
 * Internal dependencies
 */
import {
	BackgroundStyles,
	BorderAndShadowStyles,
	CustomStyleStyles,
	EffectsStyles,
	FlexChildStyles,
	IconStyles,
	LayoutStyles,
	MouseStyles,
	PositionStyles,
	SizeStyles,
	SpacingStyles,
	TypographyStyles,
} from '../../libs';
import * as config from '../../libs/base/config';
import type { InnerBlockType } from '../../libs/inner-blocks/types';
import type { TStates } from '../../libs/block-states/types';

export const convertToStylesheet = (media, cssRules) => {
	return `${media}{${cssRules}}`;
};

export const convertToStringStyleRule = (style: Object): string => {
	if ('undefined' === typeof style?.cssRules || !style.cssRules.trim()) {
		return '';
	}

	return `${style.selector}{${style.cssRules}}`;
};

export const getSelector = ({
	state,
	clientId,
	className,
	selectors,
	currentBlock,
}: {
	state: TStates,
	clientId: string,
	className: string,
	selectors: Array<Object>,
	currentBlock: 'master' | InnerBlockType,
}): string => {
	if (!state) {
		return '';
	}

	let selector = selectors[state][currentBlock];

	if (className) {
		selector = selector.replace(/\.{{className}}/g, `.${className}`);
	}
	if (clientId) {
		selector = selector.replace(/\.{{BLOCK_ID}}/g, `#block-${clientId}`);
	}

	return selector;
};

export const getCssRules = (
	attributes: Object,
	blockProps: Object
): Array<string> => {
	if (!Object.values(attributes)?.length) {
		return [];
	}

	const params = {
		media: '',
		selector: '',
		blockProps: {
			...blockProps,
			attributes,
		},
		...config,
	};

	return [
		...SizeStyles(params),
		...IconStyles(params),
		...IconStyles(params),
		...MouseStyles(params),
		...LayoutStyles(params),
		...SpacingStyles(params),
		...EffectsStyles(params),
		...PositionStyles(params),
		...FlexChildStyles(params),
		...TypographyStyles(params),
		...BackgroundStyles(params),
		...CustomStyleStyles(params),
		...BorderAndShadowStyles(params),
	];
};
