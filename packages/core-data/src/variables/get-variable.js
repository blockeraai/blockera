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

const _getVariable = function (slug: string): ?{
	slug: string,
	name: string,
	value: string,
} {
	switch (slug) {
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

export const getVariable = (
	slug: string
): ?{
	slug: string,
	name: string,
	value: string,
} => {
	return _getVariableMemoized(slug);
};
