// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import type { TBreakpoint } from '@publisher/extensions/src/libs/block-states/types';

export const DevicePreview = ({
	breakpoint,
	children,
}: {
	breakpoint: TBreakpoint,
}): MixedElement => {
	return (
		<>
			{`.is-${breakpoint}-preview{`}
			{children}
			{'}'}
		</>
	);
};
