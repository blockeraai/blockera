// @flow

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { createRoot } from '@wordpress/element';

const App = () => {
	return (
		<div className="blockera-compatibility-notice">
			<div className="wrap">
				<h1>
					{window.blockeraPluginName}{' '}
					{__('Compatibility', 'blockera')}
				</h1>
				<p>
					{window.blockeraPluginName}{' '}
					{__('detected an incompatible', 'blockera')}{' '}
					{window.blockeraPluginRequiredPluginSlug}{' '}
					{__('version.', 'blockera')}
				</p>
				<ul style={{ lineHeight: '1.8' }}>
					<li>
						<strong>
							{window.blockeraPluginName}{' '}
							{__('version:', 'blockera')}
						</strong>{' '}
						{window.blockeraPluginVersion}
					</li>
					<li>
						<strong>
							{window.blockeraPluginRequiredPluginSlug}{' '}
							{__('installed version:', 'blockera')}
						</strong>{' '}
						{window.blockeraPluginRequiredPluginVersion ||
							__('Not installed or inactive', 'blockera')}
					</li>
					<li>
						<strong>
							{window.blockeraPluginRequiredPluginSlug}{' '}
							{__('required version:', 'blockera')}
						</strong>{' '}
						{window.blockeraPluginRequiredVersion}
					</li>
				</ul>
				<p>
					{__('Please update', 'blockera')}{' '}
					{window.blockeraPluginRequiredPluginSlug}{' '}
					{__('to the required version to re-enable', 'blockera')}{' '}
					{window.blockeraPluginRequiredPluginSlug}{' '}
					{__('features.', 'blockera')}
				</p>
				<p>
					<a
						className="button button-primary"
						href={`${window.location.origin}/wp-admin/update-core.php`}
					>
						{__('Go to Updates', 'blockera')}
					</a>{' '}
					<a
						className="button"
						href={`${window.location.origin}/wp-admin/plugins.php?s=${window.blockeraPluginRequiredPluginSlug}`}
					>
						{__('View Plugins', 'blockera')}
					</a>
				</p>
			</div>
		</div>
	);
};

createRoot(document.getElementById('root')).render(<App />);
