/**
 * Publisher dependencies
 */
import { defaultItemValue } from '@publisher/controls/src/libs/repeater-control';

/**
 * Internal dependencies
 */
import defaultStates from './states';
import getBreakpoints from './default-breakpoints';

export const attributes = {
	publisherBlockStates: {
		type: 'object',
		default: {
			normal: {
				...defaultStates.normal,
				...defaultItemValue,
				isOpen: false,
				display: false,
				deletable: false,
				selectable: true,
				isSelected: true,
				visibilitySupport: false,
				breakpoints: getBreakpoints('normal'),
			},
		},
	},
};
