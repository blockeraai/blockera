/**
 * Internal dependencies
 */
import { PopoverContextData } from './context';
import { useState } from '@wordpress/element';

export const WithPopoverDataProvider = (Story, context) => {
	const [value, setValue] = useState(
		context.allArgs.popoverContextValue ?? {
			resize: false,
			shift: false,
			flip: false,
			onFocusOutside: () => false,
		}
	);

	return (
		<PopoverContextData.Provider value={{ ...value, setValue }}>
			<Story />
		</PopoverContextData.Provider>
	);
};
