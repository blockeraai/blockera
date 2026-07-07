// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import { IconContextProvider } from './context';

type Props = {
	iconContextValue: Object,
	children: MixedElement,
};

/**
 * Provides IconContext required by IconPickerModal outside the inspector.
 */
export function IconPickerModalProvider({
	iconContextValue,
	children,
}: Props): MixedElement {
	return (
		<IconContextProvider {...iconContextValue}>
			{children}
		</IconContextProvider>
	);
}
