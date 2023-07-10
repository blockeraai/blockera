/**
 * External dependencies
 */
import { nanoid } from 'nanoid';

/**
 * Publisher dependencies
 */
import { ControlContextProvider } from '@publisher/controls';

export const WithControlDataProvider = (Story, context) => {
	const controlInfo = context.allArgs.controlInfo ?? {
		name: nanoid(),
		value: undefined,
		onChange: () => null,
	};

	return (
		<ControlContextProvider value={controlInfo}>
			<Story />
		</ControlContextProvider>
	);
};
