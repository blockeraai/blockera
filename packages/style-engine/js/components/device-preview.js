// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import type { TBreakpoint } from '@blockera/editor-extensions/js/libs/block-states/types';

export const DevicePreview = ({
	breakpoint,
	children,
}: {
	breakpoint: TBreakpoint,
	children: MixedElement,
}): MixedElement => {
	return (
		<>
			{`.is-${breakpoint}-preview{`}
			{children}
			{'}'}
		</>
	);
};