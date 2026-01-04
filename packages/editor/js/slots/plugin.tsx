/**
 * WordPress dependencies
 */
import { registerPlugin } from '@wordpress/plugins';

/**
 * Internal dependencies
 */
import { BlockeraSlots } from './index';

/**
 * Register the slots system as a WordPress plugin.
 * This ensures all configured slots are available for other components to fill.
 */
registerPlugin('blockera-slots', {
	render: BlockeraSlots,
	icon: null,
});
