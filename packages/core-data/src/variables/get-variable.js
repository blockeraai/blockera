// @flow
/**
 * External dependencies
 */
import { default as memoize } from 'fast-memoize';

/**
 * Internal dependencies
 */
import { getWidthSize } from './width-size';
import { getFontSize } from './font-size';
import { getLinearGradient } from './linear-gradient';
import { getRadialGradient } from './radial-gradient';
import { getThemeColor } from './theme-color';
import { getSpacing } from './spacing';
import type { VariableItem } from './types';

const _getVariable = function (type: string, slug: string): ?VariableItem {
	switch (type) {
		case 'width-size':
			return getWidthSize(slug);

		case 'font-size':
			return getFontSize(slug);

		case 'linear-gradient':
			return getLinearGradient(slug);

		case 'radial-gradient':
			return getRadialGradient(slug);

		case 'spacing':
			return getSpacing(slug);

		case 'theme-color':
			return getThemeColor(slug);
	}

	return {};
};

const _getVariableMemoized = memoize(_getVariable);

export const getVariable = (type: string, slug: string): ?VariableItem => {
	return _getVariableMemoized(type, slug);
};
