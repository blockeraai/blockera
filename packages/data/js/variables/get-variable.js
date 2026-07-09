// @flow
/**
 * Internal dependencies
 */
import { getWidthSize } from './width-size';
import { getFontSize } from './font-size';
import { getLineHeight } from './line-height';
import { getLinearGradient } from './linear-gradient';
import { getRadialGradient } from './radial-gradient';
import { getColor } from './color';
import { getSpacing } from './spacing';
import { getGlobalStylePresetVariableById } from './custom-global-style-presets';
import type { VariableItem } from './types';

/**
 * Resolves the current variable definition from editor settings (not memoized so
 * renames and value updates reflect immediately in the UI).
 */
export const getVariable = (type: string, id: string): ?VariableItem => {
	switch (type) {
		case 'width-size':
			return getWidthSize(id);

		case 'font-size':
			return getFontSize(id);

		case 'line-height':
			return getLineHeight(id);

		case 'linear-gradient':
			return getLinearGradient(id);

		case 'radial-gradient':
			return getRadialGradient(id);

		case 'spacing':
			return getSpacing(id);

		case 'color':
			return getColor(id);

		case 'shadow':
		case 'text-shadow':
		case 'border-radius':
		case 'border':
		case 'transition':
		case 'transform':
		case 'filter':
			return getGlobalStylePresetVariableById(type, id);
	}

	return null;
};
