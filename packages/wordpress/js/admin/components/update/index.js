// @flow

/**
 * External dependencies
 */
import classnames from 'classnames';
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { dispatch } from '@wordpress/data';
import { ToastContainer, toast } from 'react-toastify';
import { store as coreStore } from '@wordpress/core-data';
import { useContext, useState, useEffect } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { isEquals, ucFirstWord } from '@blockera/utils';
import Button from '@blockera/components/js/button/button';
import type { TTabProps } from '@blockera/components/js/tabs/types';

/**
 * Internal dependencies
 */
import { Reset } from './reset';
import { TabsContext } from '../';
import { SettingsContext } from '../../context';

const statuses = {
	update: {
		status: 'update',
		label: __('Update', 'blockera'),
	},
	updated: {
		status: 'updated',
		label: __('Updated', 'blockera'),
	},
	updating: {
		status: 'updating',
		label: __('Updating ...', 'blockera'),
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
	hasUpdate,
	onUpdate: outSideOnUpdate,
	slugSettings,
}: {
	tab: TTabProps,
	slugSettings: any,
	hasUpdate: boolean,
	onUpdate: (hasUpdate: boolean) => void,
}): MixedElement | null => {
	const slug = tab?.settingSlug;

	if ('undefined' === typeof slug) {
		return null;
	}

	const [updateButtonStatus, setUpdateButtonStatus] = useState(
		statuses.update
	);

	useEffect(() => {
		if (!hasUpdate) {
			setUpdateButtonStatus(statuses.updated);

			return;
		}

		setUpdateButtonStatus(statuses.update);
	}, [hasUpdate]);

	const { settings, setSettings } = useContext(TabsContext);
	const { defaultSettings } = useContext(SettingsContext);
	const { saveEntityRecord } = dispatch(coreStore);
	const onUpdate = async (): Promise<string> => {
		const record = {
			...settings,
			[slug]: slugSettings,
		};

		setUpdateButtonStatus(statuses.updating);

		setSettings(record);

		const response = await saveEntityRecord(
			'blockera/v1',
			'settings',
			record
		);

		if (response) {
			outSideOnUpdate(!hasUpdate);
			setUpdateButtonStatus(statuses.updated);

			toast.success(`Blockera Updated ${tab.title}`, toastOptions);
		} else {
			setUpdateButtonStatus(statuses.update);

			toast.error(
				`Failed Blockera ${tab.title} updating process.`,
				toastOptions
			);
		}

		return response;
	};

	return (
		<div className={'blockera-settings-actions-wrapper'}>
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
			{!isEquals(defaultSettings[slug], settings[slug]) && (
				<Reset
					slug={slug}
					hasUpdate={
						!isEquals(slugSettings, defaultSettings[slug]) &&
						hasUpdate
					}
					defaultValue={defaultSettings[slug]}
					onReset={(_hasUpdate: boolean): void => {
						outSideOnUpdate(!_hasUpdate);
						setSettings({
							...settings,
							[slug]: defaultSettings[slug],
						});

						toast.success(
							`Blockera Reset ${tab.title}`,
							toastOptions
						);
					}}
					save={saveEntityRecord}
				/>
			)}
			<Button
				data-test={'update-settings'}
				style={{
					opacity: 'updated' === updateButtonStatus.status ? 0.5 : 1,
					cursor:
						'updated' === updateButtonStatus.status
							? 'not-allowed'
							: 'pointer',
				}}
				noBorder={true}
				disabled={'updated' === updateButtonStatus.status}
				isPressed={'updating' === updateButtonStatus.status}
				variant={'primary'}
				className={classnames(
					'blockera-settings-button blockera-settings-primary-button',
					{
						'blockera-settings-has-update':
							!isEquals(slugSettings, defaultSettings[slug]) &&
							hasUpdate,
					}
				)}
				text={updateButtonStatus.label}
				onClick={onUpdate}
			/>
		</div>
	);
};
