// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { dispatch } from '@wordpress/data';
import { Animate, Spinner } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useContext, useState } from '@wordpress/element';

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

const statuses = {
	saved: {
		name: 'saved',
		label: __('Saved', 'blockera'),
	},
	saving: {
		name: 'saving',
		label: __('Saving...', 'blockera'),
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

			setHasUpdates(!hasUpdate);
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
					onClick={() => setResetModalOpen(true)}
					variant={'tertiary'}
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
					className="blockera-settings-reset-modal"
					headerTitle={__('Reset Settings', 'blockera')}
					size="small"
					onRequestClose={() => setResetModalOpen(false)}
				>
					<p>
						{__(
							'Resetting will restore all configured settings on the current tab to their default values.',
							'blockera'
						)}
					</p>

					<p>
						{__(
							'To restore all plugin settings, choose Reset All.',
							'blockera'
						)}
					</p>

					<Flex
						direction={'row'}
						justifyContent={'space-between'}
						style={{ marginTop: '40px' }}
					>
						<Flex
							direction={'row'}
							justifyContent={'space-between'}
						>
							<Button
								data-test={'reset-current-tab-settings'}
								isPrimary
								variant={'primary'}
								onClick={() => onUpdate('reset')}
							>
								{__('Reset', 'blockera')}
							</Button>
							<Button
								data-test={'reset-all-settings'}
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
								data-test={'cancel-reset-action'}
								isTertiary
								variant={'tertiary'}
								onClick={() => setResetModalOpen(false)}
							>
								{__('Cancel', 'blockera')}
							</Button>
						</Flex>
					</Flex>

					{'error' === status.name && (
						<div
							className="message update-failed"
							style={{ marginTop: '40px' }}
						>
							{status.label}
						</div>
					)}
				</Modal>
			)}
		</Flex>
	);
};
