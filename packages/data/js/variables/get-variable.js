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
import { getColor } from './color';
import { getSpacing } from './spacing';
import type { VariableItem } from './types';

export const getVariable: (type: string, id: string) => ?VariableItem = memoize(
	function (type: string, id: string): ?VariableItem {
		switch (type) {
			case 'width-size':
				return getWidthSize(id);

			case 'font-size':
				return getFontSize(id);

			case 'linear-gradient':
				return getLinearGradient(id);

			case 'radial-gradient':
				return getRadialGradient(id);

			case 'spacing':
				return getSpacing(id);

			case 'color':
				return getColor(id);
		}

		return null;
	}
);
