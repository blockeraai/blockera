// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { Button, Buttons, Flex, Grid } from '@blockera/controls';
import { Icon } from '@blockera/icons';

export const DashboardPanel = (): MixedElement => {
	const {
		blockeraVersion,
		blockeraPluginData: { pluginURI },
	} = window;

	const videoUrl = '#';

	return (
		<Flex
			direction={'column'}
			className={'blockera-settings-panel-container'}
			gap={'40px'}
			style={{
				position: 'relative',
			}}
		>
			<Flex direction={'row'} gap="0">
				<Flex direction={'column'} gap="25px" style={{ flexGrow: '1' }}>
					<h4
						className="story-heading"
						style={{
							color: 'var(--blockera-controls-primary-color)',
							fontSize: '16px',
							margin: '0',
						}}
					>
						{__('Hello', 'blockera')} 👋
					</h4>

					<h1
						style={{
							fontSize: '26px',
							lineHeight: '1.3',
							margin: '0',
						}}
					>
						{__(
							'The Full Potential of Block Editor is Unlocked 🎉',
							'blockera'
						)}
					</h1>

					<p
						style={{
							margin: '0',
							fontSize: '14px',
							color: '#707070',
						}}
					>
						{__(
							'Blockera is the advanced mode for the WordPress block editor, transforming it into a powerful page builder by enhancing the functionality of core blocks.',
							'blockera'
						)}
					</p>

					<Buttons>
						<Button
							href="/wp-admin/post-new.php?post_type=page"
							variant="primary"
						>
							{__('Create a Page', 'blockera')}
						</Button>

						<Button
							href={videoUrl}
							variant="secondary"
							style={{ gap: '4px' }}
						>
							<Icon
								library={'ui'}
								icon={'video-circle'}
								iconSize={24}
							/>

							{__('Watch a Guide', 'blockera')}
						</Button>
					</Buttons>
				</Flex>

				<div
					style={{
						position: 'relative',
						right: '-30px',
						minWidth: '410px',
						height: '270px',
						overflow: 'hidden',
					}}
				>
					<a
						className={'blockera-dashboard-preview-video-btn'}
						href={videoUrl}
						target="_blank"
						rel="noreferrer"
					>
						<svg
							width="18"
							height="25"
							viewBox="0 0 18 25"
							fill="currentColor"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path d="M0 3.94472C0 1.48283 2.80171 0.0689525 4.78213 1.53142L16.782 10.3929C18.3909 11.581 18.4087 13.9811 16.8174 15.1929L4.81757 24.3312C2.84273 25.8352 0 24.4268 0 21.9445V3.94472Z" />
						</svg>
					</a>

					<img
						src={`${pluginURI}/assets/dashboard-preview.png?v=${blockeraVersion}`}
						alt={__(
							'Blockera - The Advanced Mode for the WordPress Block Editor',
							'blockera'
						)}
						style={{
							width: '410px',
							height: 'auto',
							position: 'absolute',
							right: '-20px',
							top: '0',
						}}
					/>
				</div>
			</Flex>

			<Grid gridTemplateColumns="1fr 1fr" gap="25px">
				<Flex
					direction={'column'}
					className={'blockera-settings-section'}
					gap="18px"
				>
					<Icon
						library={'ui'}
						icon={'tutorials'}
						iconSize={30}
						style={{
							fill: 'var(--blockera-controls-primary-color)',
						}}
					/>
					<h1
						style={{
							fontSize: '16px',
							lineHeight: '1.3',
							margin: '0',
						}}
					>
						{__('Help and Tutorials', 'blockera')}
					</h1>

					<p
						style={{
							margin: '0',
							fontSize: '14px',
							color: '#707070',
						}}
					>
						{__(
							'Get started with Blockera through our tutorials and guides. Learn how to create stunning websites with our video tutorials.',
							'blockera'
						)}
					</p>

					<Buttons>
						<Button
							href="https://blockera.ai/resources/"
							variant="secondary"
						>
							{__('Explore Tutorials', 'blockera')}

							<Icon
								library={'ui'}
								icon={'arrow-new-tab'}
								iconSize={22}
								style={{
									fill: 'currentColor',
								}}
							/>
						</Button>
					</Buttons>
				</Flex>

				<Flex
					direction={'column'}
					className={'blockera-settings-section'}
					gap="18px"
				>
					<Icon
						library={'ui'}
						icon={'support'}
						iconSize={30}
						style={{
							fill: 'var(--blockera-controls-primary-color)',
						}}
					/>
					<h1
						style={{
							fontSize: '16px',
							lineHeight: '1.3',
							margin: '0',
						}}
					>
						{__('Get 5-star Support', 'blockera')}
					</h1>

					<p
						style={{
							margin: '0',
							fontSize: '14px',
							color: '#707070',
							flexGrow: '1',
						}}
					>
						{__(
							'Need some help? Our awesome support team is here to help you with any question you have.',
							'blockera'
						)}
					</p>

					<Buttons>
						<Button href="#1" variant="secondary">
							{__('Get Support', 'blockera')}

							<Icon
								library={'ui'}
								icon={'arrow-new-tab'}
								iconSize={22}
								style={{
									fill: 'currentColor',
								}}
							/>
						</Button>
					</Buttons>
				</Flex>

				<Flex
					direction={'column'}
					className={'blockera-settings-section'}
					gap="18px"
				>
					<Icon
						library={'ui'}
						icon={'community-conversation'}
						iconSize={30}
						style={{
							fill: 'var(--blockera-controls-primary-color)',
						}}
					/>
					<h1
						style={{
							fontSize: '16px',
							lineHeight: '1.3',
							margin: '0',
						}}
					>
						{__('Join the Community', 'blockera')}
					</h1>

					<p
						style={{
							margin: '0',
							fontSize: '14px',
							color: '#707070',
							flexGrow: '1',
						}}
					>
						{__(
							'Got a question about the plugin, want to share your awesome project or just say hi? Join our wonderful community!',
							'blockera'
						)}
					</p>

					<Buttons>
						<Button
							href="https://community.blockera.ai/"
							variant="secondary"
						>
							{__('Join Now', 'blockera')}

							<Icon
								library={'ui'}
								icon={'arrow-new-tab'}
								iconSize={22}
								style={{
									fill: 'currentColor',
								}}
							/>
						</Button>
					</Buttons>
				</Flex>

				<Flex
					direction={'column'}
					className={'blockera-settings-section'}
					gap="18px"
				>
					<Icon
						library={'ui'}
						icon={'bolb'}
						iconSize={30}
						style={{
							fill: 'var(--blockera-controls-primary-color)',
						}}
					/>
					<h1
						style={{
							fontSize: '16px',
							lineHeight: '1.3',
							margin: '0',
						}}
					>
						{__('Missing Any Feature?', 'blockera')}
					</h1>

					<p
						style={{
							margin: '0',
							fontSize: '14px',
							color: '#707070',
						}}
					>
						{__(
							"We're always striving to improve Blockera. If you have any feature requests or ideas for new blocks, we'd love to hear from you.",
							'blockera'
						)}
					</p>

					<Buttons>
						<Button
							href="https://community.blockera.ai/feature-request-1rsjg2ck"
							variant="secondary"
						>
							{__('Request Feature', 'blockera')}

							<Icon
								library={'ui'}
								icon={'arrow-new-tab'}
								iconSize={22}
								style={{
									fill: 'currentColor',
								}}
							/>
						</Button>
					</Buttons>
				</Flex>
			</Grid>
		</Flex>
	);
};
