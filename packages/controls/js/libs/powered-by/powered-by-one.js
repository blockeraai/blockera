// @flow
/**
 * External dependencies
 */
import type { Node } from 'react';

/**
 * Internal dependencies
 */
import { PoweredBy, type PoweredByProps } from './powered-by';

const BLOCKERA_ONE_HREF =
	'https://blockera.ai/products/one/?utm_source=block-section-powered-by&utm_medium=referral&utm_campaign=powered-by&utm_content=cta-link';

const BLOCKERA_ONE_PRIMARY_COLOR = '#2f9e5b';

/**
 * Product-specific PoweredBy preset for Blockera One.
 * Forwards any PoweredBy props so callers can still override defaults.
 */
export function PoweredByOne(props: PoweredByProps): Node {
	return (
		<PoweredBy
			primaryColor={BLOCKERA_ONE_PRIMARY_COLOR}
			tooltipBg={BLOCKERA_ONE_PRIMARY_COLOR}
			icon="blockera-one"
			iconLibrary="blockera"
			href={BLOCKERA_ONE_HREF}
			brandName="Blockera One"
			{...props}
		/>
	);
}
