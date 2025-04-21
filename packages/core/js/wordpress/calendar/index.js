// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const Calendar: BlockType = {
	name: 'blockeraCalendar',
	targetBlock: 'core/calendar',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
