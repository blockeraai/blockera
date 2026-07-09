// @flow

/**
 * External dependencies.
 */
import { __, sprintf } from '@wordpress/i18n';
import { applyFilters } from '@wordpress/hooks';
import { createRoot } from '@wordpress/element';

const App = () => {
	const {
		blockeraPluginName,
		blockeraPluginUpdateUrl,
		blockeraPluginRequiredName,
		blockeraPluginRequiredVersion,
		blockeraPluginRequiredPluginSlug,
		blockeraIsActiveCompatiblePlugin,
		blockeraPluginRequiredPluginVersion,
	} = window;

	const hasDirectUpdateURL = applyFilters(
		'blockera.compatibility.directUpdateRequiredPlugin',
		blockeraIsActiveCompatiblePlugin,
		blockeraPluginUpdateUrl
	);

	const requiredPluginType = blockeraPluginRequiredPluginSlug.endsWith('-pro')
		? 'pro'
		: 'free';

	return (
		<div className="blockera-compatibility-notice">
			<div className="blockera-compatibility-notice-header">
				<a
					href="https://blockera.ai/"
					target="_blank"
					rel="noreferrer"
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: '8px',
						textDecoration: 'none',
						color: '#0051E7',
						fontWeight: '600',
						fontSize: '18px',
					}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="32"
						height="32"
						viewBox="0 0 24 24"
						size="24"
						fill="#0051E7"
					>
						<path
							fillRule="evenodd"
							d="M20.133 6.696 12 11.39 3.867 6.696 12 2zm-8.916 8.985V12.95c0-.28-.149-.538-.39-.678L3 7.754v9l7.924 4.575a.196.196 0 0 0 .293-.17v-2.565a.39.39 0 0 0-.195-.34l-.783-.451a.39.39 0 0 1-.196-.339v-1.953c0-.075.082-.122.147-.085l.734.424a.196.196 0 0 0 .293-.17m-2.885 2.194-3.375-1.948V14.36l3.326 1.92c.12.07.195.2.195.34v1.17a.098.098 0 0 1-.146.084m0-3.13-3.375-1.949v-1.565l3.326 1.92c.12.07.195.2.195.339v1.17a.098.098 0 0 1-.146.085m4.45-2.24L21 7.76v9l-8.217 4.745z"
							clipRule="evenodd"
						></path>
					</svg>

					{__('Blockera', 'blockera')}
				</a>

				<a
					href="https://community.blockera.ai/changelog-9l8hbrv0"
					target="_blank"
					rel="noreferrer"
					className="button"
				>
					<svg
						width="12"
						height="13"
						viewBox="0 0 12 13"
						fill="currentColor"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M0.640658 0.49384C0.994483 0.49384 1.28131 0.780672 1.28131 1.1345V3.48357L7.23124 3.48357C7.51227 2.45398 8.4542 1.69713 9.5729 1.69713C10.9133 1.69713 12 2.78378 12 4.12423C12 5.46468 10.9133 6.55133 9.5729 6.55133C8.4542 6.55133 7.51227 5.79448 7.23124 4.76489L1.28131 4.76489V7.22074C1.28131 7.73156 1.28181 8.07615 1.30353 8.3419C1.32463 8.60018 1.36253 8.72708 1.4062 8.81279C1.51605 9.02838 1.69133 9.20366 1.90693 9.31351C1.99263 9.35718 2.11953 9.39508 2.37781 9.41619C2.64356 9.4379 2.98815 9.4384 3.49897 9.4384H7.23124C7.51227 8.40881 8.4542 7.65195 9.5729 7.65195C10.9133 7.65195 12 8.7386 12 10.0791C12 11.4195 10.9133 12.5062 9.5729 12.5062C8.4542 12.5062 7.51227 11.7493 7.23124 10.7197H3.47278C2.9948 10.7197 2.5976 10.7197 2.27347 10.6932C1.93596 10.6657 1.62166 10.6062 1.32522 10.4552C0.868533 10.2225 0.497234 9.85118 0.264539 9.39449C0.113496 9.09805 0.054043 8.78376 0.0264672 8.44624C-1.56622e-05 8.12211 -8.42556e-06 7.7249 3.16125e-07 7.24692L5.98115e-07 1.1345C5.98115e-07 0.780672 0.286833 0.49384 0.640658 0.49384ZM9.5729 2.97844C8.94009 2.97844 8.4271 3.49143 8.4271 4.12423C8.4271 4.75703 8.94009 5.27002 9.5729 5.27002C10.2057 5.27002 10.7187 4.75703 10.7187 4.12423C10.7187 3.49143 10.2057 2.97844 9.5729 2.97844ZM9.5729 8.93327C8.94009 8.93327 8.4271 9.44625 8.4271 10.0791C8.4271 10.7119 8.94009 11.2248 9.5729 11.2248C10.2057 11.2248 10.7187 10.7119 10.7187 10.0791C10.7187 9.44625 10.2057 8.93327 9.5729 8.93327Z"
						/>
					</svg>

					{__('Changelog', 'blockera')}
				</a>
			</div>

			<div className="wrap">
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						flexDirection: 'column',
						gap: '20px',
					}}
				>
					<svg
						width="60"
						height="60"
						viewBox="0 0 60 60"
						fill="#B80000"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M30.0018 6.56604C31.4371 6.56604 32.7553 7.35694 33.4387 8.61651L54.5293 47.6731C55.1835 48.8839 55.1542 50.3485 54.4512 51.5299C53.7482 52.7114 52.4691 53.434 51.0923 53.434H8.9112C7.53445 53.434 6.26511 52.7114 5.55233 51.5299C4.83955 50.3485 4.82002 48.8839 5.47422 47.6731L26.5648 8.61651C27.2483 7.35694 28.5664 6.56604 30.0018 6.56604ZM30.0018 22.9698C28.7031 22.9698 27.6584 24.0146 27.6584 25.3132V36.2491C27.6584 37.5477 28.7031 38.5925 30.0018 38.5925C31.3004 38.5925 32.3452 37.5477 32.3452 36.2491V25.3132C32.3452 24.0146 31.3004 22.9698 30.0018 22.9698ZM32.6088 44.0604C32.6306 43.7052 32.5794 43.3494 32.4585 43.0148C32.3375 42.6802 32.1494 42.3739 31.9056 42.1147C31.6619 41.8556 31.3676 41.649 31.041 41.5079C30.7145 41.3667 30.3624 41.2939 30.0066 41.2939C29.6509 41.2939 29.2988 41.3667 28.9722 41.5079C28.6457 41.649 28.3514 41.8556 28.1077 42.1147C27.8639 42.3739 27.6757 42.6802 27.5548 43.0148C27.4339 43.3494 27.3827 43.7052 27.4045 44.0604C27.3827 44.4155 27.4339 44.7713 27.5548 45.1059C27.6757 45.4405 27.8639 45.7469 28.1077 46.006C28.3514 46.2652 28.6457 46.4717 28.9722 46.6129C29.2988 46.754 29.6509 46.8269 30.0066 46.8269C30.3624 46.8269 30.7145 46.754 31.041 46.6129C31.3676 46.4717 31.6619 46.2652 31.9056 46.006C32.1494 45.7469 32.3375 45.4405 32.4585 45.1059C32.5794 44.7713 32.6306 44.4155 32.6088 44.0604Z" />
					</svg>

					<h1>
						{sprintf(
							// translators: it's the product name (a theme or plugin name)
							__('Update Required for %s', 'blockera'),
							blockeraPluginRequiredName
						)}
					</h1>

					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							flexDirection: 'column',
							gap: '5px',
						}}
					>
						<p>
							{requiredPluginType === 'free'
								? sprintf(
										// translators: it's the product name (a theme or plugin name)
										__(
											'Your %s plugin is out of date and the Pro plugin has been temporarily deactivated.',
											'blockera'
										),
										blockeraPluginRequiredPluginSlug
								  )
								: sprintf(
										// translators: it's the product name (a theme or plugin name)
										__(
											'Your %s plugin is out of date and has been temporarily deactivated.',
											'blockera'
										),
										blockeraPluginRequiredPluginSlug
								  )}
						</p>
						<p>
							{sprintf(
								// translators: it's the product name (a theme or plugin name)
								__(
									'Your %1$s version is older than the %2$s version you just installed and needs to be updated.',
									'blockera'
								),
								requiredPluginType === 'pro'
									? __('Pro', 'blockera')
									: __('Free', 'blockera'),
								requiredPluginType === 'pro'
									? __('Free', 'blockera')
									: __('Pro', 'blockera')
							)}
						</p>
					</div>
				</div>

				<ul>
					<li>
						<svg
							width="25"
							height="24"
							viewBox="0 0 25 24"
							fill="#008F0A"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path d="M12.25 4C16.6683 4 20.25 7.58172 20.25 12C20.25 16.4183 16.6683 20 12.25 20C7.83172 20 4.25 16.4183 4.25 12C4.25 7.58172 7.83172 4 12.25 4ZM15.9746 9.57324C15.6072 9.25295 15.0111 9.25313 14.6436 9.57324L11.0732 12.6855L9.85645 11.625C9.48888 11.3047 8.89291 11.3046 8.52539 11.625C8.1581 11.9454 8.15814 12.4648 8.52539 12.7852L10.4082 14.4268C10.5846 14.5804 10.8239 14.6669 11.0732 14.667C11.3228 14.667 11.5628 14.5806 11.7393 14.4268L15.9746 10.7344C16.3422 10.4139 16.3422 9.89367 15.9746 9.57324Z" />
						</svg>

						{sprintf(
							// translators: it's the product type (Free or Pro)
							__('Required %s Version:', 'blockera'),
							requiredPluginType === 'pro'
								? __('Pro', 'blockera')
								: __('Free', 'blockera')
						)}

						<strong style={{ color: '#008F0A' }}>
							v{blockeraPluginRequiredVersion}
						</strong>
					</li>

					<li>
						<svg
							width="25"
							height="24"
							viewBox="0 0 25 24"
							fill="#B80000"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path d="M12.75 4C17.1683 4 20.75 7.58172 20.75 12C20.75 16.4183 17.1683 20 12.75 20C8.33172 20 4.75 16.4183 4.75 12C4.75 7.58172 8.33172 4 12.75 4ZM16.0293 8.7207C15.6908 8.38225 15.1422 8.38225 14.8037 8.7207L12.75 10.7744L10.6963 8.7207C10.3578 8.38226 9.80916 8.38227 9.4707 8.7207C9.13225 9.05916 9.13225 9.60783 9.4707 9.94629L11.5244 12L9.4707 14.0537C9.13225 14.3922 9.13225 14.9408 9.4707 15.2793C9.80916 15.6177 10.3578 15.6177 10.6963 15.2793L12.75 13.2256L14.8037 15.2793C15.1422 15.6178 15.6908 15.6178 16.0293 15.2793C16.3677 14.9408 16.3677 14.3922 16.0293 14.0537L13.9756 12L16.0293 9.94629C16.3677 9.60784 16.3677 9.05916 16.0293 8.7207Z" />
						</svg>

						{sprintf(
							// translators: it's the product type (Free or Pro)
							__('Current %s Version:', 'blockera'),
							requiredPluginType === 'pro'
								? __('Pro', 'blockera')
								: __('Free', 'blockera')
						)}

						<strong style={{ color: '#B80000' }}>
							v{blockeraPluginRequiredPluginVersion}
						</strong>
					</li>
				</ul>

				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						flexDirection: 'column',
						gap: '15px',
					}}
				>
					<p
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							flexDirection: 'row',
							gap: '15px',
						}}
					>
						{!blockeraIsActiveCompatiblePlugin && (
							<a
								className="button button-primary"
								href={`${window.location.origin}/wp-admin/update-core.php`}
							>
								{sprintf(
									// translators: it's the plugin name
									__(
										'Install or Update %s Plugin',
										'blockera'
									),
									blockeraPluginName
								)}
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
								{__('Download and Update Manually', 'blockera')}
							</a>
						)}

						<a
							className="button"
							href={`${window.location.origin}/wp-admin/plugins.php?s=${blockeraPluginRequiredPluginSlug}`}
						>
							{__('Manage Plugin', 'blockera')}
						</a>
					</p>

					<p>
						{__(
							'Once updated, Pro features will return instantly.',
							'blockera'
						)}
					</p>
				</div>

				<p style={{ color: '#8A8A8A' }}>
					{__('Need help?', 'blockera')}{' '}
					<a href="https://blockera.ai/contact/">
						{__('Contact support team', 'blockera')}
					</a>
				</p>
			</div>
		</div>
	);
};

createRoot(document.getElementById('root')).render(<App />);
