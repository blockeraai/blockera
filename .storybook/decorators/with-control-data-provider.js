/**
 * Publisher dependencies
 */
import { ControlContextProvider } from '@publisher/controls';

export const WithControlDataProvider = (Story, context) => {
	const controlInfo = context.allArgs.controlInfo ?? {
		name: `${context.componentId}/${context.name}`,
		value: [],
		onChange: () => null,
	};

	return (
		<ControlContextProvider value={controlInfo}>
			<Story />
		</ControlContextProvider>
	);
};
