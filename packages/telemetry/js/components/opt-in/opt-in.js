// @flow

/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { useState } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { classNames } from '@blockera/classnames';
import { Icon } from '@blockera/icons';
import {
	Modal,
	Flex,
	Button,
	CheckboxControl,
	DynamicHtmlFormatter,
	ControlContextProvider,
} from '@blockera/controls';

/**
 * Internal dependencies
 */
import teamAvatarAliaUrl from './images/team-alia.png';
import teamAvatarAlibUrl from './images/team-alib.png';
import teamAvatarRezaUrl from './images/team-reza.png';
import teamAvatarHakanUrl from './images/team-hakan.png';
import teamAvatarElaUrl from './images/team-ela.png';
import IconHi from './icons/hi.svg';

import { sender } from './sender';

export const OptInModal = (): MixedElement => {
	const [isOpen, setOpen] = useState(true);
	const [shareUsageData, setShareUsageData] = useState(true);
	const [emailUpdates, setEmailUpdates] = useState(true);
	const closeModal = () => setOpen(false);

	if (!isOpen || ['ALLOW', 'SKIP'].includes(window.blockeraOptInStatus)) {
		return <></>;
	}

	const dismissAsSkip = () => {
		sender('SKIP');
		closeModal();
	};

	const savePreferences = () => {
		sender('ALLOW', {
			shareUsageData,
			emailUpdates,
		});
		closeModal();
	};

	let leadGreetingText = sprintf(
		// translators: %1$s is a wave icon, %2$s is the plugin name.
		__('Hey %1$s Thanks for installing %2$s.', 'blockera'),
		'{wave}',
		'{brand-name}'
	);

	if (!leadGreetingText.includes('{brand-name}')) {
		leadGreetingText = __(
			'Hey {wave} Thanks for installing {brand-name}.',
			'blockera'
		);
	}
	const leadGreeting = (
		<DynamicHtmlFormatter
			text={leadGreetingText}
			replacements={{
				wave: <IconHi />,
				'brand-name': <>{__('Blockera', 'blockera')}</>,
			}}
		/>
	);

	return (
		<Modal
			className={classNames('blockera-opt-in-modal')}
			size={'large'}
			headerIcon={<Icon icon={'comment'} library={'wp'} size={22} />}
			headerTitle={__('A quick note from Blockera team', 'blockera')}
			isDismissible={true}
			onRequestClose={dismissAsSkip}
			actions={
				<Flex
					direction="row"
					alignItems="center"
					justifyContent="space-between"
					style={{ width: '100%' }}
				>
					<Flex
						direction="row"
						alignItems="center"
						gap={8}
						className="blockera-opt-in-modal__footer-profile"
					>
						<span
							aria-hidden="true"
							style={{
								display: 'inline-flex',
								alignItems: 'center',
								justifyContent: 'center',
								width: '36px',
								height: '36px',
								borderRadius: '50%',
								background:
									'color-mix(in srgb, var(--blockera-controls-primary-color) 12%, #fff)',
								overflow: 'hidden',
							}}
						>
							<Icon
								icon="blockera"
								library="blockera"
								iconSize={24}
								style={{
									fill: 'var(--blockera-controls-primary-color)',
								}}
							/>
						</span>

						<Flex direction="column" gap={0}>
							<strong
								style={{
									fontSize: '14px',
									fontWeight: 600,
									color: '#1d2327',
								}}
							>
								{__('The Blockera team', 'blockera')}
							</strong>
							<span
								style={{
									fontSize: '12px',
									color: '#757575',
								}}
							>
								{__('Thanks for building with us', 'blockera')}
							</span>
						</Flex>
					</Flex>
					<Flex direction="row" gap={8}>
						<Button
							data-test="maybe-later"
							variant={'tertiary'}
							onClick={dismissAsSkip}
						>
							{__('Maybe later', 'blockera')}
						</Button>

						<Button
							data-test="save-preferences"
							variant={'primary'}
							onClick={savePreferences}
						>
							{__('Save preferences', 'blockera')}
						</Button>
					</Flex>
				</Flex>
			}
		>
			<div data-test="opt-in-modal-content">
				<Flex direction="column" gap={20}>
					<Flex
						direction="column"
						gap={12}
						style={{
							flexDirection: 'column',
							gap: '12px',
							background:
								'color-mix(in srgb, var(--blockera-controls-primary-color) 10%, #ffffff 100%)',
							border: '1px solid color-mix(in srgb,var(--blockera-controls-primary-color) 25%,#0000)',
							borderRadius: '5px',
							padding: '20px 22px',
							margin: '0',
							position: 'relative',
						}}
					>
						<p
							className="blockera-opt-in-modal__lead"
							data-test="opt-in-modal-lead"
							style={{
								margin: 0,
								fontSize: '16px',
								fontWeight: 600,
								display: 'flex',
								alignItems: 'center',
								gap: '5px',
							}}
						>
							{leadGreeting}
						</p>
						<p className="blockera-opt-in-modal__body">
							{DynamicHtmlFormatter({
								text: sprintf(
									// translators: %s is wrapped emphasis (bold phrase): "supercharging the WordPress block editor".
									__(
										"We're focused on %s so building sites feels like it should — fast, flexible, and honestly, a bit more fun.",
										'blockera'
									),
									'{supercharge}'
								),
								replacements: {
									supercharge: (
										<b>
											{__(
												'supercharging the WordPress block editor',
												'blockera'
											)}
										</b>
									),
								},
							})}
						</p>
						<p className="blockera-opt-in-modal__body">
							{__(
								'Installs like yours are why we do this. Seriously, thank you.',
								'blockera'
							)}
						</p>
						<div
							className="blockera-opt-in-modal__team-row"
							aria-hidden="true"
						>
							<span className="blockera-opt-in-modal__team-dots">
								<span
									className={classNames(
										'blockera-opt-in-modal__team-dot',
										'blockera-opt-in-modal__team-dot--image'
									)}
								>
									<img
										src={teamAvatarAliaUrl}
										alt=""
										width={28}
										height={28}
										decoding="async"
										loading="lazy"
									/>
								</span>
								<span
									className={classNames(
										'blockera-opt-in-modal__team-dot',
										'blockera-opt-in-modal__team-dot--image'
									)}
								>
									<img
										src={teamAvatarRezaUrl}
										alt=""
										width={28}
										height={28}
										decoding="async"
										loading="lazy"
									/>
								</span>
								<span
									className={classNames(
										'blockera-opt-in-modal__team-dot',
										'blockera-opt-in-modal__team-dot--image'
									)}
								>
									<img
										src={teamAvatarHakanUrl}
										alt=""
										width={28}
										height={28}
										decoding="async"
										loading="lazy"
									/>
								</span>
								<span
									className={classNames(
										'blockera-opt-in-modal__team-dot',
										'blockera-opt-in-modal__team-dot--image'
									)}
								>
									<img
										src={teamAvatarAlibUrl}
										alt=""
										width={28}
										height={28}
										decoding="async"
										loading="lazy"
									/>
								</span>
								<span
									className={classNames(
										'blockera-opt-in-modal__team-dot',
										'blockera-opt-in-modal__team-dot--image'
									)}
								>
									<img
										src={teamAvatarElaUrl}
										alt=""
										width={28}
										height={28}
										decoding="async"
										loading="lazy"
									/>
								</span>
							</span>
							<span className="blockera-opt-in-modal__signoff">
								{__('— The Blockera team,', 'blockera')}{' '}
								<em>{__('with gratitude', 'blockera')}</em>
							</span>
						</div>
					</Flex>

					<Flex direction="column" gap={15}>
						<p
							style={{
								margin: '0',
								fontSize: '13px',
								lineHeight: '1.5',
								color: '#50575e',
							}}
						>
							{__(
								'Two quick opt-ins below help us move faster. Skip either and nothing changes about how Blockera works for you.',
								'blockera'
							)}
						</p>

						<Flex direction="column" gap={8}>
							<Flex
								direction="column"
								gap={16}
								style={{
									borderRadius: '5px',
									padding: '20px 22px 18px',
									background: '#ffffff',
									border: '1px solid rgb(228 228 229)',
								}}
							>
								<ControlContextProvider
									value={{
										name: 'blockera-telemetry-opt-in-email-updates',
										value: emailUpdates,
									}}
								>
									<CheckboxControl
										className="blockera-opt-in-modal__checkbox"
										data-test="opt-in-email-updates"
										checkboxLabel={__(
											'Email me about important updates',
											'blockera'
										)}
										description={__(
											'Security fixes and big releases. Nothing more.',
											'blockera'
										)}
										isBold={true}
										onChange={setEmailUpdates}
									/>
								</ControlContextProvider>

								<ControlContextProvider
									value={{
										name: 'blockera-telemetry-opt-in-share-usage',
										value: shareUsageData,
									}}
								>
									<CheckboxControl
										className="blockera-opt-in-modal__checkbox"
										data-test="opt-in-share-usage"
										checkboxLabel={__(
											'Share anonymous usage data',
											'blockera'
										)}
										description={__(
											'Helps us catch bugs and decide what to build next.',
											'blockera'
										)}
										isBold={true}
										onChange={setShareUsageData}
									/>
								</ControlContextProvider>
							</Flex>

							<p className="blockera-opt-in-modal__links">
								{DynamicHtmlFormatter({
									text: sprintf(
										// translators: %1$s: privacy policy link placeholder ("privacy policy"), %2$s: telemetry details link placeholder ("see what's collected")
										__(
											'Read our %1$s or %2$s.',
											'blockera'
										),
										'{privacy}',
										'{permissions}'
									),
									replacements: {
										privacy: (
											<a
												href={
													window.blockeraPrivacyAndPolicyLink
												}
											>
												{__(
													'privacy policy',
													'blockera'
												)}
											</a>
										),
										permissions: (
											<a
												href={
													window.blockeraPermissionsLink
												}
											>
												{__(
													"see what's collected",
													'blockera'
												)}
											</a>
										),
									},
								})}
							</p>
						</Flex>
					</Flex>
				</Flex>
			</div>
		</Modal>
	);
};
