/**
 * Blockera dependencies
 */
import { defaultItemValue } from '@blockera/controls/src/libs/repeater-control';

/**
 * Internal dependencies
 */
import defaultStates from './states';
import getBreakpoints from './default-breakpoints';
import { blockStatesValueCleanup } from './helpers';

export const attributes = {
	blockeraBlockStates: {
		type: 'object',
		default: blockStatesValueCleanup({
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
		}),
	},
};
