/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { controlClassNames } from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { Tooltip } from '../../index';

export function PoweredBy() {
	return (
		<div className={controlClassNames('extensions-powered-by')}>
			<Tooltip text={__('Powered by Blockera', 'blockera')}>
				<a
					href="https://blockera.ai/products/site-builder/?utm_source=block-section-powered-by&utm_medium=referral&utm_campaign=powered-by&utm_content=cta-link"
					target="_blank"
					rel="noopener noreferrer"
				>
					{'Blockera'}
					<Icon library="blockera" icon="blockera" iconSize={18} />
				</a>
			</Tooltip>
		</div>
	);
}
