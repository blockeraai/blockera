// @flow

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { applyFilters } from '@wordpress/hooks';
import { createRoot } from '@wordpress/element';

const App = () => {
	const {
		blockeraPluginName,
		blockeraPluginVersion,
		blockeraPluginUpdateUrl,
		blockeraPluginRequiredVersion,
		blockeraPluginRequiredPluginSlug,
		blockeraPluginRequiredPluginVersion,
	} = window;

	const hasDirectUpdateURL = applyFilters(
		'blockera.compatibility.directUpdateRequiredPlugin',
		blockeraPluginExists,
		blockeraPluginUpdateUrl
	);

	return (
		<div className="blockera-compatibility-notice">
			<div className="wrap">
				<h1>
					{blockeraPluginName} {__('Compatibility', 'blockera')}
				</h1>
				<p>
					{blockeraPluginName}{' '}
					{__('detected an incompatible', 'blockera')}{' '}
					{blockeraPluginRequiredPluginSlug}{' '}
					{__('version.', 'blockera')}
				</p>
				<ul style={{ lineHeight: '1.8' }}>
					<li>
						<strong>
							{blockeraPluginName} {__('version:', 'blockera')}
						</strong>{' '}
						{blockeraPluginVersion}
					</li>
					<li>
						<strong>
							{blockeraPluginRequiredPluginSlug}{' '}
							{__('installed version:', 'blockera')}
						</strong>{' '}
						{blockeraPluginRequiredPluginVersion ||
							__('Not installed or inactive', 'blockera')}
					</li>
					<li>
						<strong>
							{blockeraPluginRequiredPluginSlug}{' '}
							{__('required version:', 'blockera')}
						</strong>{' '}
						{blockeraPluginRequiredVersion}
					</li>
				</ul>
				<p>
					{__('Please update', 'blockera')}{' '}
					{blockeraPluginRequiredPluginSlug}{' '}
					{__('to the required version to re-enable', 'blockera')}{' '}
					{blockeraPluginRequiredPluginSlug}{' '}
					{__('features.', 'blockera')}
				</p>
				<p>
					{!blockeraPluginExists && (
						<a
							className="button button-primary"
							href={`${window.location.origin}/wp-admin/update-core.php`}
						>
							{__('Install or Update ', 'blockera')}
							{blockeraPluginName}
							{__(' Plugin', 'blockera')}
						</a>
					)}
					{hasDirectUpdateURL && (
						<a
							className="button button-primary"
							href={blockeraPluginUpdateUrl}
						>
							{__('Update Required Plugin', 'blockera')}
						</a>
					)}
					{!hasDirectUpdateURL && (
						<a
							target="_blank"
							className="button button-primary"
							href={'https://blockera.ai/my-account/licenses'}
							rel="noreferrer"
						>
							{__('Update Manually', 'blockera')}
						</a>
					)}
					<a
						className="button"
						href={`${window.location.origin}/wp-admin/plugins.php?s=${blockeraPluginRequiredPluginSlug}`}
					>
						{__('View Plugins', 'blockera')}
					</a>
				</p>
			</div>
		</div>
	);
};

createRoot(document.getElementById('root')).render(<App />);
