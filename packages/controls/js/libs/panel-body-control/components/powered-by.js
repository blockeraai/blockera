/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { controlClassNames } from '@blockera/classnames';
import { Icon } from '@blockera/icons';

export function PoweredBy() {
	return (
		<div className={controlClassNames('extensions-powered-by')}>
			<a
				href="https://blockera.ai/blockera-page-builder/"
				target="_blank"
				rel="noopener noreferrer"
			>
				<span>{__('Powered by', 'blockera')}</span>
				{'Blockera'}
				<Icon library="blockera" icon="blockera" iconSize={18} />
			</a>
		</div>
	);
}
