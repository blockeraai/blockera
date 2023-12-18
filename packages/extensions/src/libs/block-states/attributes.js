/**
 * Publisher dependencies
 */
import { defaultItemValue } from '@publisher/controls/src/libs/repeater-control';

/**
 * Internal dependencies
 */
import states from './states';
import getBreakpoints from './default-breakpoints';

export const attributes = {
	publisherBlockStates: {
		type: 'array',
		default: [
			{
				...states.normal,
				...defaultItemValue,
				deletable: false,
				selectable: true,
				isSelected: true,
				visibilitySupport: false,
				breakpoints: getBreakpoints('normal'),
			},
		],
	},
	publisherCurrentState: {
		type: 'string',
		default: 'normal',
	},
};
