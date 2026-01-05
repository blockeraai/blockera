/**
 * WordPress dependencies
 */
import type { ReactNode } from 'react';

/**
 * Internal dependencies
 */
import GenericSlot from './components/Slot';
import { FillOrderProvider } from './context';
import { SLOTS_CONFIG } from './constants';

/**
 * Generic Slot component.
 * This should be registered as a plugin to render slots.
 */
export { default as Slot } from './components/Slot';

/**
 * Plugin component that registers all configured slots.
 * Register this with WordPress plugins API.
 * Automatically creates slots for all entries in SLOTS_CONFIG.
 *
 * @return The slot components wrapped in provider.
 */
export function BlockeraSlots(): ReactNode {
	return (
		<FillOrderProvider>
			{SLOTS_CONFIG.map((slotConfig) => (
				<GenericSlot key={slotConfig.id} slotId={slotConfig.id} />
			))}
		</FillOrderProvider>
	);
}

export default {
	Slot: GenericSlot,
	Plugin: BlockeraSlots,
};

// Export bootstrap function
export { bootstrapSlots } from './bootstrap';
