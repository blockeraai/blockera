// @flow

/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { dispatch } from '@wordpress/data';
import { Animate, Spinner, TextControl } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import {
	createInterpolateElement,
	useContext,
	useState,
} from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Modal, Button, Flex } from '@blockera/controls';
import { Icon } from '@blockera/icons';
import { classNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { TabsContext } from '../';
import { type TabsProps } from '../tabs/types';
import { SettingsContext } from '../../context';

const RESET_ALL_CONFIRM_PHRASE = 'reset';

const statuses = {
	saved: {
		name: 'saved',
		label: __('Saved', 'blockera'),
	},
	saving: {
		name: 'saving',
		label: __('Saving…', 'blockera'),
	},
	error: {
		name: 'error',
		label: __(
			'Update failed. Try again or get in touch with support.',
			'blockera'
		),
	},
	reset: {
		name: 'reset',
		label: __('Reset', 'blockera'),
	},
	resetting: {
		name: 'resetting',
		label: __('Resetting', 'blockera'),
	},
};

export const Update = ({
	tab,
	kind,
	name,
	slugSettings,
}: {
	kind: string,
	name: string,
	tab: TabsProps,
	slugSettings: any,
}): MixedElement | null => {
	const { settings, setSettings, hasUpdate, setHasUpdates } =
		useContext(TabsContext);
	const [status, setStatus] = useState(statuses.saved);
	const [resetModalOpen, setResetModalOpen] = useState(false);
	const [resetModalStep, setResetModalStep] = useState('tab');
	const [resetConfirmInput, setResetConfirmInput] = useState('');
	const { defaultSettings } = useContext(SettingsContext);

	const closeResetModal = (): void => {
		setResetModalOpen(false);
		setResetModalStep('tab');
		setResetConfirmInput('');
	};

	const openResetModal = (): void => {
		setResetModalStep('tab');
		setResetConfirmInput('');
		setResetModalOpen(true);
	};

	const resetAllPhraseMatches =
		resetConfirmInput.trim().toLowerCase() === RESET_ALL_CONFIRM_PHRASE;
	const { saveEntityRecord } = dispatch(coreStore);

	if (!tab.settingSlug) {
		return null;
	}

	const slug: string = tab.settingSlug;

	const updateButton =
		'saving' === status.name
			? __('Updating…', 'blockera')
			: __('Update', 'blockera');

	const onUpdate = async (type: string = ''): Promise<string> => {
		let record = {};

		switch (type) {
			case 'reset':
				setStatus(statuses.resetting);
				record = {
					action: 'reset',
					reset: slug,
					default: defaultSettings[slug],
				};
				break;
			case 'reset-all':
				setStatus(statuses.resetting);
				record = {
					action: 'reset-all',
				};
				break;
			default:
				setStatus(statuses.saving);
				record = {
					...settings,
					[slug]: slugSettings,
				};
				break;
		}

		const response = await saveEntityRecord(kind, name, record);

		if (response) {
			const isResetAction = ['reset', 'reset-all'].includes(type);
			if (isResetAction) {
				setStatus(statuses.reset);
				closeResetModal();

				if ('reset-all' === type) {
					setSettings(defaultSettings);
				} else {
					setSettings({
						...settings,
						[slug]: defaultSettings[slug],
					});
				}
			} else {
				setSettings(record);
				setStatus(statuses.saved);
			}

			window.blockeraSettings = {
				...window.blockeraSettings,
				...record,
			};

			setHasUpdates(isResetAction ? false : !hasUpdate);
		} else {
			setStatus(statuses.error);
		}

		return response;
	};

	return (
		<Flex direction="row" gap={15} alignItems="center">
			{[
				'saving' === status.name && (
					<Animate type="loading">
						{({ className: animateClassName }) => (
							<Flex
								className={classNames(
									'message',
									animateClassName
								)}
								direction="row"
								gap={5}
								alignItems="center"
								style={{ fontSize: '14px', marginRight: '5px' }}
							>
								<Icon icon={'cloud'} library="wp" />

								{status.label}
							</Flex>
						)}
					</Animate>
				),
				'error' === status.name && (
					<Flex
						className="message update-failed"
						direction="row"
						gap={5}
						alignItems="center"
						style={{ fontSize: '14px' }}
					>
						<Icon icon={'warning'} iconsSize={18} />

						{status.label}
					</Flex>
				),
			]}

			{'saving' !== status.name && (
				<Button
					data-test={'reset-settings'}
					className="reset-settings__save-button"
					onClick={openResetModal}
					variant={'tertiary'}
					isDestructive={true}
				>
					{__('Reset Settings', 'blockera')}
				</Button>
			)}

			<Button
				variant={'primary'}
				className={classNames('save-settings__save-button', {
					'is-busy': 'saving' === status.name,
					'blockera-settings-has-update': hasUpdate,
				})}
				data-test={'update-settings'}
				onClick={() => onUpdate()}
				disabled={!hasUpdate && status !== 'error'}
				isPrimary
			>
				{updateButton}
			</Button>

			{resetModalOpen && (
				<Modal
					headerIcon={
						'all' === resetModalStep ? (
							<Icon icon={'warning'} iconSize={22} />
						) : (
							<Icon icon={'undo'} />
						)
					}
					className={classNames(
						'blockera-settings-reset-modal',
						'tab' === resetModalStep
							? 'blockera-settings-reset-modal--tab'
							: 'blockera-settings-reset-modal--all'
					)}
					headerTitle={
						'tab' === resetModalStep
							? sprintf(
									/* translators: %s: Settings tab title, e.g. "General Settings". */
									__('Reset %s?', 'blockera'),
									tab.title
								)
							: __('Reset All Settings?', 'blockera')
					}
					size="small"
					onRequestClose={closeResetModal}
					actions={
						<Flex
							direction={'row'}
							justifyContent={'space-between'}
							alignItems={'center'}
							style={{ width: '100%' }}
						>
							{'resetting' === status.name ? (
								<Spinner />
							) : (
								<span />
							)}

							<Flex
								direction={'row'}
								gap={8}
								justifyContent={'flex-end'}
							>
								<Button
									data-test={'cancel-reset-action'}
									isTertiary
									variant={'tertiary'}
									onClick={closeResetModal}
								>
									{__('Cancel', 'blockera')}
								</Button>

								{'tab' === resetModalStep ? (
									<Button
										data-test={'reset-current-tab-settings'}
										variant={'primary'}
										className={
											'blockera-settings-reset-modal__btn-reset-tab'
										}
										disabled={'resetting' === status.name}
										onClick={() => onUpdate('reset')}
									>
										{__('Reset tab', 'blockera')}
									</Button>
								) : (
									<Button
										data-test={'reset-all-settings'}
										variant={'primary'}
										className={
											'blockera-settings-reset-modal__btn-reset-all'
										}
										disabled={
											!resetAllPhraseMatches ||
											'resetting' === status.name
										}
										onClick={() => onUpdate('reset-all')}
									>
										{__('Reset everything', 'blockera')}
									</Button>
								)}
							</Flex>
						</Flex>
					}
				>
					{'tab' === resetModalStep ? (
						<>
							<p className="blockera-settings-reset-modal__lead">
								{createInterpolateElement(
									__(
										'All <tab /> on this tab will return to their defaults. Other tabs are unaffected.',
										'blockera'
									),
									{
										tab: <strong>{tab.title}</strong>,
									}
								)}
							</p>

							<p className="blockera-settings-reset-modal__muted">
								{__(
									'This action cannot be undone.',
									'blockera'
								)}
							</p>

							<Flex
								direction="row"
								gap={8}
								className="blockera-settings-reset-modal__link-row"
							>
								{__('Need to reset all settings?', 'blockera')}{' '}
								<Button
									type="button"
									variant="link"
									data-test={'reset-modal-open-all'}
									className="blockera-settings-reset-modal__link-to-all"
									onClick={() => {
										setResetModalStep('all');
										setResetConfirmInput('');
									}}
									disabled={'resetting' === status.name}
								>
									{__('Reset all →', 'blockera')}
								</Button>
							</Flex>
						</>
					) : (
						<>
							<p className="blockera-settings-reset-modal__lead">
								{createInterpolateElement(
									__(
										'This resets <all /> across every tab. <lost /> and cannot be recovered.',
										'blockera'
									),
									{
										all: (
											<strong>
												{__('all settings', 'blockera')}
											</strong>
										),
										lost: (
											<strong>
												{__(
													'All configuration will be lost',
													'blockera'
												)}
											</strong>
										),
									}
								)}
							</p>
							<p className="blockera-settings-reset-modal__confirm-label">
								{createInterpolateElement(
									__(
										'To confirm, type <code /> below:',
										'blockera'
									),
									{
										code: (
											<code className="blockera-settings-reset-modal__confirm-token">
												reset
											</code>
										),
									}
								)}
							</p>
							<div data-test={'reset-all-confirm-input'}>
								<TextControl
									value={resetConfirmInput}
									onChange={setResetConfirmInput}
									placeholder={RESET_ALL_CONFIRM_PHRASE}
									autoComplete="off"
									__next40pxDefaultSize
									__nextHasNoMarginBottom
									className="blockera-settings-reset-modal__confirm-input"
								/>
							</div>
						</>
					)}

					{'error' === status.name && (
						<div
							className="message update-failed"
							style={{ marginTop: '24px' }}
						>
							{status.label}
						</div>
					)}
				</Modal>
			)}
		</Flex>
	);
};
