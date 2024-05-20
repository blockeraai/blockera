// @flow

/**
 * External dependencies
 */
import classnames from 'classnames';
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { dispatch } from '@wordpress/data';
import { cloud, Icon } from '@wordpress/icons';
import { ToastContainer, toast } from 'react-toastify';
import { Animate, Spinner } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useContext, useState } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Modal, Button, Flex } from '@blockera/components';

/**
 * Internal dependencies
 */
import { TabsContext } from '../';
import { type TabsProps } from '../tabs/types';
import { SettingsContext } from '../../context';

const statuses = {
	saved: {
		name: 'saved',
		label: __('Saved', 'blockera'),
	},
	saving: {
		name: 'saving',
		label: __('Saving', 'blockera'),
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

const toastOptions = {
	position: 'bottom-right',
	autoClose: 5000,
	hideProgressBar: false,
	closeOnClick: true,
	pauseOnHover: true,
	draggable: true,
	progress: undefined,
	theme: 'dark',
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
	const slug = tab.settingSlug;
	const { settings, setSettings, hasUpdate, setHasUpdates } =
		useContext(TabsContext);
	const [status, setStatus] = useState(statuses.saved);
	const [resetModalOpen, setResetModalOpen] = useState(false);
	const { defaultSettings } = useContext(SettingsContext);
	const { saveEntityRecord } = dispatch(coreStore);
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
			if (['reset', 'reset-all'].includes(type)) {
				setStatus(statuses.reset);
				setResetModalOpen(false);

				if ('reset-all' === type) {
					setSettings(defaultSettings);

					toast.success(`Blockera Reset All Done!`, toastOptions);
				} else {
					setSettings({
						...settings,
						[slug]: defaultSettings[slug],
					});

					toast.success(
						`Blockera Reset ${tab.title} Done!`,
						toastOptions
					);
				}
			} else {
				setSettings(record);
				setStatus(statuses.saved);
				toast.success(`Blockera ${tab.title} Updated!`, toastOptions);
			}

			setHasUpdates(!hasUpdate);
		} else {
			setStatus(statuses.error);

			toast.error(
				`Failed Blockera ${tab.title} updating process.`,
				toastOptions
			);
		}

		return response;
	};

	return (
		<>
			<ToastContainer
				position="bottom-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="dark"
			/>
			{[
				'saving' === status.name && (
					<Animate type="loading">
						{({ className: animateClassName }) => (
							<span
								className={classnames(
									'message',
									animateClassName
								)}
							>
								<Icon icon={cloud} />
								{status.label}
							</span>
						)}
					</Animate>
				),
				'error' === status.name && (
					<span className="message update-failed">
						{status.label}
					</span>
				),
			]}
			{'saving' !== status.name && (
				<Button
					className="reset-settings__save-button"
					onClick={() => setResetModalOpen(true)}
					isTertiary
				>
					{__('Reset Settings', 'blockera')}
				</Button>
			)}
			<Button
				variant={'primary'}
				className={classnames('save-settings__save-button', {
					'is-busy': 'saving' === status.name,
					'blockera-settings-has-update': hasUpdate,
				})}
				onClick={() => onUpdate()}
				disabled={!hasUpdate && status !== 'error'}
				isPrimary
			>
				{updateButton}
			</Button>
			{resetModalOpen && (
				<Modal
					className="blockera-settings-reset-modal"
					title={__('Reset Settings', 'blockera')}
					onRequestClose={() => setResetModalOpen(false)}
				>
					<p>
						{__(
							'Resetting will restore all configured settings on the current tab to their default values.',
							'blockera'
						)}
						<strong>
							{__(
								'To restore all plugin settings, choose Reset All.',
								'blockera'
							)}
						</strong>
					</p>
					<Flex direction={'row'} justifyContent={'space-between'}>
						<Flex
							direction={'row'}
							justifyContent={'space-between'}
						>
							<Button
								isPrimary
								variant={'primary'}
								onClick={() => onUpdate('reset')}
							>
								{__('Reset', 'blockera')}
							</Button>
							<Button
								isSecondary
								variant={'secondary'}
								onClick={() => onUpdate('reset-all')}
							>
								{__('Reset All', 'blockera')}
							</Button>
							{'resetting' === status.name && <Spinner />}
						</Flex>
						<Flex
							direction={'row'}
							justifyContent={'space-between'}
						>
							<Button
								isTertiary
								variant={'tertiary'}
								onClick={() => setResetModalOpen(false)}
							>
								{__('Cancel', 'blockera')}
							</Button>
						</Flex>
					</Flex>
					{'error' === status.name && (
						<div className="message update-failed">
							{status.label}
						</div>
					)}
				</Modal>
			)}
		</>
	);
};
