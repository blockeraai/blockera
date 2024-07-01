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
			<Tooltip text={__('Powered by Blockera Page Builder', 'blockera')}>
				<a
					href="https://blockera.ai/blockera-page-builder/"
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
