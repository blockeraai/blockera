// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { serialize } from '@wordpress/blocks';
import { select } from '@wordpress/data';
import { useState } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import {
	Modal,
	Flex,
	Button,
	ToggleControl,
	BlockeraLoading,
	ControlContextProvider,
} from '@blockera/controls';
import { componentClassNames } from '@blockera/classnames';

import { sender } from '../opt-in/sender';

export const Popup = ({
	error,
	setIsOpenPopup,
	handleReport,
	state: { isLoading, isOpenPopup },
}: {
	error: Object,
	handleReport: () => void,
	state: { isLoading: boolean, isOpenPopup: boolean },
	setIsOpenPopup: (isOpenPopup: boolean) => void,
}): ?MixedElement => {
	const {
		blockeraOptInStatus,
		blockeraCommunityUrl,
		blockeraTelemetryPrivacyPolicyUrl,
	} = window;
	const [optInStatus, setOptInStatus] = useState(blockeraOptInStatus);
	const selectedBlock = select('core/block-editor').getSelectedBlock();
	let blockCode: string = '';

	if (selectedBlock) {
		blockCode = serialize(selectedBlock);
	}
	const [canNotCopyToClipboard, setCanNotCopyToClipboard] = useState(null);
	const [isChecked, setIsChecked] = useState(true);
	const [isEnabledManuallyReporting, setIsEnabledManuallyReporting] =
		useState(false);

	if (isLoading) {
		return (
			<Modal isDismissible={false} headerTitle=" ">
				<BlockeraLoading />
			</Modal>
		);
	}

	let body: MixedElement = <></>;
	let headerTitle: string = '';
	let headerIcon: MixedElement = <></>;

	if (optInStatus === 'ALLOW') {
		headerTitle = __('Bug reported automatically', 'blockera');
		headerIcon = <Icon icon={'check'} />;
		body = (
			<Flex direction={'column'} gap={40}>
				<Flex direction={'column'} gap={10}>
					<p>
						{__(
							'You’re already enrolled in our bug reporting program, so we’ve automatically logged this issue.',
							'blockera'
						)}
					</p>
					<p>
						{__(
							'We’ll review it and get in touch if we need any additional details.',
							'blockera'
						)}
					</p>
				</Flex>
				<Flex justifyContent={'space-between'}>
					<Flex>
						<Button
							variant={'secondary'}
							onClick={() => setIsOpenPopup(false)}
							className={componentClassNames('close-button')}
						>
							{__('Close', 'blockera')}
						</Button>
						<Button
							onClick={() => setIsEnabledManuallyReporting(true)}
							variant={'link'}
							target={blockeraCommunityUrl}
							className={componentClassNames(
								'manually-report',
								'secondary-button',
								'automatically-reported'
							)}
						>
							{__('Also, Report Manually', 'blockera')}
						</Button>
					</Flex>
				</Flex>
			</Flex>
		);
	} else {
		headerTitle = isChecked
			? __('Error reporting', 'blockera')
			: __('Help us fix this issue', 'blockera');
		headerIcon = <Icon icon={'tools'} />;
		body = (
			<Flex direction={'column'} gap={40}>
				<Flex direction={'column'} gap={10}>
					<p>
						{isChecked
							? __(
									'We’ve detected an error and need your help to resolve it. Would you like to send us the report automatically or handle it yourself?',
									'blockera'
							  )
							: __(
									'An issue has been detected. Please tell us how you’d like to report it. Either send the data automatically or manually submit the report—your feedback is essential for us to fix the bug.',
									'blockera'
							  )}
					</p>
					<Flex alignItems={'center'}>
						<ControlContextProvider
							value={{
								name: `agree-to-report`,
								value: isChecked,
							}}
						>
							<ToggleControl
								label={__(
									'I agree to share bug and site diagnostic data for troubleshooting',
									'blockera'
								)}
								labelType={'self'}
								id={`agree-to-report`}
								defaultValue={isChecked}
								onChange={setIsChecked}
							/>
						</ControlContextProvider>
					</Flex>
					<a
						className={'link'}
						href={blockeraTelemetryPrivacyPolicyUrl}
						target="_blank"
						rel="noreferrer"
					>
						{__('What permission are being granted?', 'blockera')}
					</a>
				</Flex>
				<Flex justifyContent={'space-between'}>
					<Flex>
						<Button
							disabled={!isChecked}
							onClick={() => {
								sender('ALLOW', 'debug', {
									handleReport,
									setOptInStatus,
								});
							}}
							className={componentClassNames(
								'report-automatically',
								'send-button',
								'primary-button'
							)}
						>
							{__('Send Report Automatically', 'blockera')}
						</Button>
						<Button
							onClick={() => setIsEnabledManuallyReporting(true)}
							variant={'link'}
							target={blockeraCommunityUrl}
							className={componentClassNames(
								'manually-report',
								'secondary-button'
							)}
						>
							{__('Report Manually', 'blockera')}
						</Button>
					</Flex>
					<Button
						variant={'secondary'}
						onClick={() => setIsOpenPopup(false)}
						className={componentClassNames(
							'cancel-button',
							'secondary-button'
						)}
					>
						{__('Cancel', 'blockera')}
					</Button>
				</Flex>
			</Flex>
		);
	}

	if (isEnabledManuallyReporting) {
		headerTitle = __('Report bug manually', 'blockera');
		headerIcon = <Icon icon={'check'} />;
		const errorLog = {
			error_details: {
				block_code: blockCode,
			},
			error_message: error.message,
			stack_trace: error.stack,
			error_type: 'react',
			browser_info: {
				userAgent: navigator.userAgent,
				platform: navigator.platform,
				language: navigator.language,
				cookieEnabled: navigator.cookieEnabled,
				version: navigator.appVersion,
			},
			...(window?.blockeraTelemetryDebugData || {}),
		};

		body = (
			<Flex direction={'column'} gap={40}>
				<Flex direction={'column'} gap={10}>
					<p>
						{__(
							'If you’d prefer not to send the data automatically, please submit a manual report by following these steps:',
							'blockera'
						)}
					</p>
					<strong>{__('Steps:', 'blockera')}</strong>
					<p className={componentClassNames('manually-report-step')}>
						<strong>{__('1.', 'blockera')}</strong>
						{__(' Copy the bug details', 'blockera')}
					</p>
					{false === canNotCopyToClipboard && (
						<div style={{ color: '#cc3333' }}>
							{__(
								'Failed to copy text. Please try selecting and copying manually.',
								'blockera'
							)}
						</div>
					)}
					{true === canNotCopyToClipboard && (
						<div style={{ color: '#00a20b' }}>
							{__('Code copied to clipboard!', 'blockera')}
						</div>
					)}
					<div
						className={componentClassNames('code-block')}
						onClick={() => {
							try {
								// Modern browsers
								if (
									navigator.clipboard &&
									// $FlowFixMe
									navigator.clipboard.writeText
								) {
									// $FlowFixMe
									navigator.clipboard.writeText(
										JSON.stringify(errorLog)
									);
								}
								// Fallback for older browsers
								else if (document.body) {
									const textArea =
										document.createElement('textarea');
									textArea.value = JSON.stringify(errorLog);
									// $FlowFixMe
									document.body.appendChild(textArea);
									textArea.select();
									document.execCommand('copy');
									// $FlowFixMe
									document.body.removeChild(textArea);
								}

								setCanNotCopyToClipboard(true);
							} catch (err) {
								setCanNotCopyToClipboard(true);
							}
						}}
						onKeyDown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								e.currentTarget.click();
							}
						}}
					>
						{JSON.stringify(errorLog)}
					</div>
					<p className={componentClassNames('manually-report-step')}>
						<strong>{__('2.', 'blockera')}</strong>
						{__(' Send en email to ', 'blockera')}
						<a href="mailto:support@blockera.ai">
							{__('support@blockera.ai', 'blockera')}
						</a>
						{__(' or ', 'blockera')}
						<a
							href={blockeraCommunityUrl}
							target="_blank"
							rel="noreferrer"
						>
							{__('create a bug ticket', 'blockera')}
						</a>
					</p>
					<p className={componentClassNames('manually-report-step')}>
						<strong>{__('3.', 'blockera')}</strong>
						{__(
							' Stay tuned. We’ll review your report and reach out if we need more information.',
							'blockera'
						)}
					</p>
				</Flex>
				<Flex justifyContent={'space-between'}>
					<Button
						variant={'secondary'}
						onClick={() => setIsOpenPopup(false)}
						className={componentClassNames(
							'cancel-button',
							'secondary-button'
						)}
					>
						{__('Cancel', 'blockera')}
					</Button>
				</Flex>
			</Flex>
		);
	}

	if (!isOpenPopup) {
		return <></>;
	}

	return (
		<Modal
			isDismissible={false}
			headerIcon={headerIcon}
			headerTitle={headerTitle}
		>
			{body}
		</Modal>
	);
};
