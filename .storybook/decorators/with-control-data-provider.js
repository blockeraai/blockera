/**
 * External dependencies
 */
import { nanoid } from 'nanoid';

/**
 *  dependencies
 */
import { ControlContextProvider } from '@blockera/controls';

export const WithControlDataProvider = (Story, context) => {
	const controlInfo = context.allArgs.controlInfo ?? {
		name: nanoid(),
		value: undefined,
	};

	return (
		<ControlContextProvider
			storeName={context?.allArgs?.storeName ?? 'blockera-core/controls'}
			value={controlInfo}
		>
			<Story />
		</ControlContextProvider>
	);
};

