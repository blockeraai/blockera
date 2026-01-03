/**
 * Simple state management for "Command Bar Mode"
 *
 * When the + button is clicked, we enter command bar mode which filters
 * the command bar to show only navigation commands for adding tabs.
 */

/**
 * Type for command bar mode listener function.
 */
type CommandBarModeListener = (isMode: boolean) => void;

let isCommandBarMode = false;
const listeners = new Set<CommandBarModeListener>();

/**
 * Check if we're in command bar mode (add tab mode)
 *
 * @returns True if in command bar mode
 */
export function getIsCommandBarMode(): boolean {
	return isCommandBarMode;
}

/**
 * Set command bar mode state
 *
 * @param value - New state value
 */
export function setCommandBarMode(value: boolean): void {
	if (isCommandBarMode !== value) {
		isCommandBarMode = value;
		listeners.forEach((listener) => listener(isCommandBarMode));
	}
}

/**
 * Subscribe to command bar mode changes
 *
 * @param listener - Callback function called when mode changes
 * @returns Unsubscribe function
 */
export function subscribeToCommandBarMode(
	listener: CommandBarModeListener
): () => void {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}

