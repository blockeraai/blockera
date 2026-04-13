/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import type { ReactNode } from 'react';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import packageInfo from '../../../../package.json';

/** Blockera marketing site (matches plugin header). */
const BLOCKERA_WEBSITE_URL =
	'https://blockera.ai/products/site-builder/?utm_source=blockera-editor&utm_medium=footer-toolbar&utm_campaign=brand-link';

type BlockeraDataSelect = {
	getEntity: (slug: string) => { version?: string } | undefined;
};

/**
 * Footer toolbar content: brand and future footer items.
 *
 * @return Footer items markup.
 */
export default function FooterToolbarItems(): ReactNode {
	const pluginVersion = useSelect((select) => {
		const data = select('blockera/data') as BlockeraDataSelect | undefined;
		return data?.getEntity('blockera')?.version ?? packageInfo.version;
	}, []);

	const versionLabel = sprintf(
		/* translators: %s: plugin semver (e.g. 2.0.1). */
		__('v%s', 'blockera'),
		pluginVersion
	);

	return (
		<div className="blockera-footer-toolbar-items">
			<a
				className="blockera-footer-toolbar-brand"
				href={BLOCKERA_WEBSITE_URL}
				target="_blank"
				rel="noreferrer noopener"
			>
				<Icon
					aria-hidden={true}
					className="blockera-footer-toolbar-logo-icon"
					icon="blockera"
					iconSize={14}
					library="blockera"
				/>

				<span className="blockera-footer-toolbar-name">
					{__('Blockera', 'blockera')}
				</span>

				<span className="blockera-footer-toolbar-version">
					{versionLabel}
				</span>
			</a>
		</div>
	);
}
