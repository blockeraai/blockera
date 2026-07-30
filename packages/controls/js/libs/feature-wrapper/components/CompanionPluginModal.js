// @flow

/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useCallback, useState } from '@wordpress/element';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { componentInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import Modal from '../../modal';
import { Button } from '../../button';
import { FEATURE_WRAPPER_TEST_ID } from '../constants/testIds';
import { useCompanionPluginInstall } from '../hooks/useCompanionPluginInstall';
import { useEditorUnsavedChanges } from '../hooks/useEditorUnsavedChanges';
import { useReloadCountdown } from '../hooks/useReloadCountdown';
import { getEditorUnsavedChangesSnapshot } from '../utils/getEditorUnsavedChangesSnapshot';
import { CompanionInstallProgress } from './CompanionInstallProgress';

type PostInstallView = 'install' | 'countdown' | 'confirm';

export function CompanionPluginModal({
	isOpen,
	onRequestClose,
}: {
	isOpen: boolean,
	onRequestClose: () => void,
}): MixedElement | null {
	const { isSaving, saveChanges } = useEditorUnsavedChanges();
	const [postInstallView, setPostInstallView] =
		useState<PostInstallView>('install');

	const reloadPage = useCallback(() => {
		if (typeof window.__blockeraCompanionTestReload === 'function') {
			window.__blockeraCompanionTestReload();
			return;
		}

		window.location.reload();
	}, []);

	const countdownSeconds =
		typeof window.__blockeraCompanionTestCountdownSeconds === 'number'
			? window.__blockeraCompanionTestCountdownSeconds
			: undefined;

	const {
		countdown,
		isActive: isCountdownActive,
		start: startCountdown,
		cancel: cancelCountdown,
		reloadNow,
	} = useReloadCountdown(reloadPage, countdownSeconds);

	const handleInstallComplete = useCallback(() => {
		const { hasUnsavedChanges } = getEditorUnsavedChangesSnapshot();

		if (hasUnsavedChanges) {
			setPostInstallView('confirm');
			return;
		}

		setPostInstallView('countdown');
		startCountdown();
	}, [startCountdown]);

	const {
		phase,
		progress,
		statusMessage,
		errorMessage,
		isBusy,
		installButtonLabel,
		installButtonClassName,
		canInstall,
		handleInstall,
	} = useCompanionPluginInstall(handleInstallComplete);

	const handleModalClose = useCallback(
		(event?: { stopPropagation?: () => void }) => {
			event?.stopPropagation?.();

			if (isBusy) {
				return;
			}

			cancelCountdown();
			setPostInstallView('install');
			onRequestClose();
		},
		[cancelCountdown, isBusy, onRequestClose]
	);

	if (!isOpen) {
		return null;
	}

	const showProgress = 'installing' === phase || 'activating' === phase;
	const isConfirmView = 'confirm' === postInstallView;
	const isCountdownView = 'countdown' === postInstallView;

	const modalTitle = isConfirmView
		? __('Reload editor to unlock features?', 'blockera')
		: __('Install Companion Plugin', 'blockera');

	const modalIcon = isConfirmView ? (
		<Icon icon="warning" />
	) : (
		<Icon icon="blockera" library="blockera" iconSize="18" />
	);

	let modalActions: MixedElement;

	const modalActionsClassName = componentInnerClassNames(
		'feature-wrapper-companion-modal__actions'
	);

	if (isConfirmView) {
		modalActions = (
			<div className={modalActionsClassName}>
				<Button
					{...({
						'test-id':
							FEATURE_WRAPPER_TEST_ID.companionReloadCancel,
					}: Record<string, string>)}
					variant="tertiary"
					onClick={(event) => {
						handleModalClose(event);
					}}
					disabled={isSaving}
				>
					{__('Cancel', 'blockera')}
				</Button>

				<Button
					{...({
						'test-id':
							FEATURE_WRAPPER_TEST_ID.companionReloadDiscard,
					}: Record<string, string>)}
					variant="secondary"
					isDestructive
					onClick={reloadPage}
					disabled={isSaving}
				>
					{__('Discard & reload', 'blockera')}
				</Button>

				<Button
					{...({
						'test-id': FEATURE_WRAPPER_TEST_ID.companionReloadSave,
					}: Record<string, string>)}
					variant="primary"
					onClick={() => {
						void (async () => {
							const saved = await saveChanges();

							if (saved) {
								reloadPage();
							}
						})();
					}}
					isBusy={isSaving}
					disabled={isSaving}
				>
					{__('Save & reload', 'blockera')}
				</Button>
			</div>
		);
	} else if (isCountdownView) {
		modalActions = (
			<div className={modalActionsClassName}>
				<Button
					{...({
						'test-id': FEATURE_WRAPPER_TEST_ID.companionClose,
					}: Record<string, string>)}
					variant="tertiary"
					onClick={(event) => {
						handleModalClose(event);
					}}
				>
					{__('Cancel', 'blockera')}
				</Button>

				<Button
					{...({
						'test-id': FEATURE_WRAPPER_TEST_ID.companionReloadNow,
					}: Record<string, string>)}
					variant="primary"
					onClick={reloadNow}
				>
					{__('Reload now', 'blockera')}
				</Button>
			</div>
		);
	} else {
		modalActions = (
			<div className={modalActionsClassName}>
				<Button
					{...({
						'test-id': FEATURE_WRAPPER_TEST_ID.companionClose,
					}: Record<string, string>)}
					variant="tertiary"
					onClick={(event) => {
						handleModalClose(event);
					}}
					disabled={isBusy}
				>
					{__('Close', 'blockera')}
				</Button>

				<Button
					{...({
						'test-id': FEATURE_WRAPPER_TEST_ID.companionInstall,
					}: Record<string, string>)}
					variant="primary"
					className={installButtonClassName}
					onClick={handleInstall}
					isBusy={isBusy}
					disabled={!canInstall || isBusy || 'complete' === phase}
				>
					{installButtonLabel}
				</Button>
			</div>
		);
	}

	let modalContent: MixedElement;

	if (isConfirmView) {
		modalContent = (
			<p>
				{__(
					'Blockera Site Builder was installed successfully. Reloading unlocks all companion features, but you have unsaved editor changes.',
					'blockera'
				)}
			</p>
		);
	} else if (isCountdownView) {
		modalContent = (
			<div
				data-test={FEATURE_WRAPPER_TEST_ID.companionReloadCountdown}
				className={componentInnerClassNames(
					'feature-wrapper-companion-modal__countdown'
				)}
			>
				<p
					className={componentInnerClassNames(
						'feature-wrapper-companion-modal__success-message'
					)}
				>
					{__(
						'Blockera Site Builder was installed successfully.',
						'blockera'
					)}
				</p>

				<p
					className={componentInnerClassNames(
						'feature-wrapper-companion-modal__countdown-message'
					)}
				>
					{sprintf(
						/* translators: %d: seconds remaining until reload */
						__(
							'Reloading in %d seconds to unlock all features…',
							'blockera'
						),
						countdown
					)}
				</p>

				<div
					className={componentInnerClassNames(
						'feature-wrapper-companion-modal__countdown-value'
					)}
				>
					{countdown}
				</div>
			</div>
		);
	} else {
		modalContent = (
			<>
				<p>
					{__(
						'For using all features you have to install the companion plugin: Blockera Site Builder.',
						'blockera'
					)}
				</p>

				{showProgress ? (
					<CompanionInstallProgress
						value={progress}
						message={statusMessage}
					/>
				) : null}

				{'complete' === phase && 'install' === postInstallView ? (
					<p
						className={componentInnerClassNames(
							'feature-wrapper-companion-modal__success-message'
						)}
					>
						{statusMessage}
					</p>
				) : null}

				{errorMessage ? (
					<p
						data-test={
							FEATURE_WRAPPER_TEST_ID.companionInstallError
						}
						className={componentInnerClassNames(
							'feature-wrapper-companion-modal__error-message'
						)}
					>
						{errorMessage}
					</p>
				) : null}

				{!canInstall ? (
					<p
						className={componentInnerClassNames(
							'feature-wrapper-companion-modal__permission-message'
						)}
					>
						{__(
							'You do not have permission to install plugins. Please contact your site administrator.',
							'blockera'
						)}
					</p>
				) : null}
			</>
		);
	}

	return (
		<Modal
			data-test={
				isConfirmView
					? FEATURE_WRAPPER_TEST_ID.companionReloadDialog
					: FEATURE_WRAPPER_TEST_ID.companionModal
			}
			headerIcon={modalIcon}
			headerTitle={modalTitle}
			onRequestClose={handleModalClose}
			shouldCloseOnClickOutside={!isBusy && !isCountdownActive}
			shouldCloseOnEsc={!isBusy && !isCountdownActive}
			actions={modalActions}
			className={componentInnerClassNames(
				'feature-wrapper-companion-modal',
				isConfirmView ? 'feature-wrapper-companion-reload-dialog' : ''
			)}
		>
			{modalContent}
		</Modal>
	);
}
