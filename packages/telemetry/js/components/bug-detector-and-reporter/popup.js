// @flow

/**
 * External dependencies
 */
import { __, isRTL, sprintf } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { serialize } from '@wordpress/blocks';
import { select } from '@wordpress/data';
import { useState, useEffect, useCallback } from '@wordpress/element';

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
	DynamicHtmlFormatter,
} from '@blockera/controls';
import { componentClassNames } from '@blockera/classnames';

import { sender } from '../opt-in/sender';

export const Popup = ({
	id,
	error,
	state,
	setState,
	handleReport,
	isReportingErrorCompleted,
	setIsReportingErrorCompleted,
}: {
	id: string,
	error: Object,
	handleReport: (failedCallback: any) => void,
	state: {
		isLoading: boolean,
		isOpenPopup: boolean,
		isReported: boolean,
		reportedCount: number,
	},
	setState: (state: {
		isLoading: boolean,
		isOpenPopup: boolean,
		isReported: boolean,
		reportedCount: number,
	}) => void,
	isReportingErrorCompleted: boolean,
	setIsReportingErrorCompleted: (isReportingErrorCompleted: boolean) => void,
}): ?MixedElement => {
	const { isLoading, isOpenPopup, isReported, reportedCount } = state;
	const setIsOpenPopup = useCallback(
		(isOpen: boolean) => {
			setState({
				...state,
				isOpenPopup: isOpen,
			});
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[state]
	);
	const {
		blockeraOptInStatus,
		blockeraCommunityUrl,
		blockeraPermissionsLink,
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
		useState(
			!isReportingErrorCompleted && !['', 'SKIP'].includes(optInStatus)
		);

	useEffect(() => {
		if (isReportingErrorCompleted) {
			setIsEnabledManuallyReporting(false);
		}
	}, [isReportingErrorCompleted]);

	if (isLoading) {
		return (
			<Modal isDismissible={false} headerTitle=" ">
				<BlockeraLoading
					text={
						(isReported &&
							0 === reportedCount &&
							!window[id]?.isReported) ||
						isReportingErrorCompleted
							? __('Reporting…', 'blockera')
							: __('Loading…', 'blockera')
					}
				/>
			</Modal>
		);
	}

	let body: MixedElement = <></>;

	let modalTitle = '';
	let modalIcon: MixedElement = <></>;
	let modalActions: MixedElement = <></>;
	let modalStyle: Record<string, string> = {};

	if (optInStatus === 'ALLOW') {
		modalTitle =
			0 === reportedCount || !window[id]?.isReported
				? __('Bug reported automatically', 'blockera')
				: __('Bug already reported!', 'blockera');
		modalIcon = <Icon icon={'check-circle'} />;
		modalStyle = {
			'--blockera-controls-primary-color': '#00A20B',
			'--blockera-controls-primary-color-darker-20': '#008F0A',
		};

		body = (
			<Flex
				data-test="successfully-reported-bug"
				direction={'column'}
				gap={30}
			>
				<Flex direction={'column'} gap={10}>
					<p style={{ margin: 0 }}>
						{0 === reportedCount || !window[id]?.isReported
							? __(
									'You’re already enrolled in our bug reporting program, so we’ve automatically logged this issue.',
									'blockera'
								)
							: __(
									'It looks like this issue has been reported before.',
									'blockera'
								)}
					</p>
					<p style={{ margin: 0 }}>
						{0 === reportedCount || !window[id]?.isReported
							? __(
									'We’ll review it and get in touch if we need any additional details.',
									'blockera'
								)
							: __(
									'No further action is needed. We’ll keep you updated if we have any new information.',
									'blockera'
								)}
					</p>
				</Flex>
			</Flex>
		);

		modalActions = (
			<>
				<Button
					variant={'primary'}
					onClick={() => setIsOpenPopup(false)}
				>
					{__('Close', 'blockera')}
				</Button>

				<Button
					onClick={() => {
						setIsReportingErrorCompleted(false);
						setIsEnabledManuallyReporting(true);
					}}
					variant={'tertiary'}
					target={blockeraCommunityUrl}
				>
					{__('Also, Report manually', 'blockera')}
				</Button>
			</>
		);
	} else if (['', 'SKIP'].includes(optInStatus)) {
		modalTitle = __('Help us fix this issue', 'blockera');
		modalIcon = <Icon icon={'flag'} />;
		modalStyle = {
			'--blockera-controls-primary-color': '#e20b0b',
			'--blockera-controls-primary-color-darker-20': '#b30808',
		};

		body = (
			<Flex
				data-test="bug-detector-and-reporter-popup"
				direction={'column'}
				gap={40}
			>
				<Flex direction="column" gap={30}>
					<Flex direction="column" gap={15}>
						<p style={{ margin: 0 }}>
							{__(
								'We’ve detected an error and need your help to resolve it. Would you like to send us the report automatically or handle it yourself?',
								'blockera'
							)}
						</p>
					</Flex>

					<Flex direction={'column'} gap={5}>
						<Flex alignItems={'center'}>
							<ControlContextProvider
								value={{
									name: `agree-to-report`,
									value: isChecked,
								}}
							>
								<ToggleControl
									data-test="agree-to-opting-in-and-report"
									label={__(
										'I agree to share the bug and site diagnostic data for troubleshooting.',
										'blockera'
									)}
									labelType={'self'}
									id={`agree-to-report`}
									defaultValue={isChecked}
									onChange={setIsChecked}
								/>
							</ControlContextProvider>
						</Flex>

						<Flex
							style={{
								paddingLeft: isRTL() ? '0' : '42px',
								paddingRight: isRTL() ? '42px' : '0',
							}}
						>
							<a
								href={blockeraPermissionsLink}
								target="_blank"
								rel="noreferrer"
								style={{
									color: '#989898',
									fontSize: 13,
									display: 'inline',
								}}
							>
								{__(
									'What permission are being granted?',
									'blockera'
								)}
							</a>
						</Flex>
					</Flex>
				</Flex>
			</Flex>
		);

		modalActions = (
			<>
				<Button
					variant={'tertiary'}
					onClick={() => setIsOpenPopup(false)}
				>
					{__('Close', 'blockera')}
				</Button>

				<Button
					variant={'secondary'}
					onClick={() => {
						setIsReportingErrorCompleted(false);
						setIsEnabledManuallyReporting(true);
					}}
					target={blockeraCommunityUrl}
				>
					{__('Report Manually', 'blockera')}
				</Button>

				<Button
					data-test="send-report-automatically"
					variant={'primary'}
					disabled={!isChecked}
					onClick={() => {
						setState({
							...state,
							isLoading: true,
						});
						sender('ALLOW', {
							shareUsageData: true,
							emailUpdates: true,
							handleResponse: (response) => {
								window.blockeraOptInStatus = response.success
									? 'ALLOW'
									: '';
								if (response.success) {
									if ('function' === typeof handleReport) {
										handleReport((status) => {
											setOptInStatus(
												'ALLOW' === status
													? 'ALLOW'
													: ''
											);
											setIsEnabledManuallyReporting(
												'ALLOW' === status
													? false
													: true
											);
										});
									}
								} else {
									setState({
										...state,
										isReported: true,
										isLoading: false,
									});

									setIsReportingErrorCompleted(false);
								}
							},
							handleError: () => {
								window.blockeraOptInStatus = '';
								setOptInStatus('');

								setIsOpenPopup(false);
								setState({
									...state,
									isReported: true,
									isLoading: false,
								});

								setIsReportingErrorCompleted(false);
								setIsEnabledManuallyReporting(true);
							},
						});
					}}
					style={{
						opacity: isChecked ? '1' : '0.3',
					}}
				>
					{__('Send Report Automatically', 'blockera')}
				</Button>
			</>
		);
	}

	if (isEnabledManuallyReporting) {
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

		modalTitle = isReportingErrorCompleted
			? __('Oops! Report submission failed!', 'blockera')
			: __('Report bug manually', 'blockera');
		modalIcon = <Icon icon={'tools'} />;
		modalStyle = {
			'--blockera-controls-primary-color': '#e20b0b',
			'--blockera-controls-primary-color-darker-20': '#b30808',
		};

		body = (
			<Flex
				data-test="manually-reporting-bug"
				direction={'column'}
				gap={40}
			>
				<Flex direction="column" gap={30}>
					<Flex direction="column" gap={15}>
						<p style={{ margin: 0 }}>
							{isReportingErrorCompleted
								? __(
										'Something went wrong when trying to log your bug. Follow the manual submission process below to share the necessary info.',
										'blockera'
									)
								: __(
										'If you’d prefer not to send the data automatically, please submit a manual report by following these steps:',
										'blockera'
									)}
						</p>
					</Flex>

					<Flex direction={'column'} gap={20}>
						<p
							style={{
								color: 'var(--blockera-controls-primary-color)',
								fontSize: 16,
								fontWeight: 600,
								lineHeight: 1.5,
								margin: 0,
							}}
						>
							{__('Steps:', 'blockera')}
						</p>

						<Flex direction={'column'} gap={8}>
							<Flex direction={'row'} gap={8}>
								<p style={{ margin: 0 }}>
									<strong
										style={{
											color: 'var(--blockera-controls-primary-color)',
											fontWeight: 600,
										}}
									>
										{__('1.', 'blockera')}{' '}
									</strong>
									{__('Copy the bug details', 'blockera')}
								</p>

								{false === canNotCopyToClipboard && (
									<div
										style={{
											color: 'var(--blockera-controls-primary-color)',
											margin: !isRTL()
												? '0 0 0 auto'
												: '0 auto 0 0',
											textAlign: isRTL()
												? 'right'
												: 'left',
											fontWeight: 600,
										}}
									>
										{__(
											'Failed to copy text. Please try selecting and copying manually.',
											'blockera'
										)}
									</div>
								)}

								{true === canNotCopyToClipboard && (
									<p
										style={{
											color: '#00A20B',
											margin: !isRTL()
												? '0 0 0 auto'
												: '0 auto 0 0',
											fontWeight: 600,
											textAlign: isRTL()
												? 'right'
												: 'left',
										}}
									>
										{__(
											'Debug data copied to clipboard!',
											'blockera'
										)}
									</p>
								)}
							</Flex>

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
												document.createElement(
													'textarea'
												);
											textArea.value =
												JSON.stringify(errorLog);
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
						</Flex>

						<p
							style={{
								margin: 0,
							}}
						>
							<strong
								style={{
									color: 'var(--blockera-controls-primary-color)',
									fontWeight: 600,
								}}
							>
								{__('2.', 'blockera')}{' '}
							</strong>

							<DynamicHtmlFormatter
								text={sprintf(
									// translators: %1$s: support email link placeholder, %2$s: bug ticket link placeholder.
									__(
										'Send an email to %1$s or %2$s.',
										'blockera'
									),
									'{support-email}',
									'{bug-ticket}'
								)}
								replacements={{
									'support-email': (
										<a
											href="mailto:support@blockera.ai"
											style={{
												color: 'var(--blockera-controls-primary-color)',
											}}
										>
											{__(
												'support@blockera.ai',
												'blockera'
											)}
										</a>
									),
									'bug-ticket': (
										<a
											href={blockeraCommunityUrl}
											target="_blank"
											rel="noreferrer"
											style={{
												color: 'var(--blockera-controls-primary-color)',
											}}
										>
											{__(
												'create a bug ticket',
												'blockera'
											)}
										</a>
									),
								}}
							/>
						</p>

						<p
							style={{
								margin: 0,
							}}
						>
							<strong
								style={{
									color: 'var(--blockera-controls-primary-color)',
									fontWeight: 600,
								}}
							>
								{__('3.', 'blockera')}{' '}
							</strong>
							{__(
								'Stay tuned. We’ll review your report and reach out if we need more information.',
								'blockera'
							)}
						</p>
					</Flex>
				</Flex>
			</Flex>
		);

		modalActions = (
			<>
				<Button
					variant={'primary'}
					onClick={() => {
						setIsOpenPopup(false);
						if (isReportingErrorCompleted) {
							setIsEnabledManuallyReporting(false);
						}
					}}
				>
					{__('Close', 'blockera')}
				</Button>
			</>
		);
	}

	if (!isOpenPopup) {
		return <></>;
	}

	return (
		<Modal
			isDismissible={false}
			headerTitle={modalTitle}
			headerIcon={modalIcon}
			actions={modalActions}
			className="blockera-bug-reporting-modal"
			style={modalStyle}
		>
			{body}
		</Modal>
	);
};
