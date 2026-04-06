/**
 * External dependencies
 */
import type { ReactNode } from 'react';

/**
 * Blockera dependencies
 */
import { Flex } from '@blockera/controls';

/**
 * Intro paragraph for global-styles preset panels that use the same layout as Spacing
 * (padding + global-styles-ui-header__description).
 */
export function GlobalStylesPanelDescription({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<Flex
			direction="column"
			gap="8px"
			style={{ padding: '0 16px', width: '100%' }}
		>
			<p className="global-styles-ui-header__description">{children}</p>
		</Flex>
	);
}
