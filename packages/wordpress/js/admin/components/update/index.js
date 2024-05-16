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
import { isEquals } from '@blockera/utils';
import Button from '@blockera/components/js/button/button';

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
	slug,
	hasUpdate,
	onUpdate: outSideOnUpdate,
	slugSettings,
	defaultValue,
}: {
	slug?: string,
	slugSettings: any,
	hasUpdate: boolean,
	defaultValue: any,
	onUpdate: (hasUpdate: boolean) => void,
}): MixedElement | null => {
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
	const updateSettings = (value: any): void => {
		setSettings({
			...settings,
			[slug]: value,
		});
	};
	const onUpdate = async (): Promise<string> => {
		const record = {
			...settings,
			[slug]: slugSettings,
		};

		setUpdateButtonStatus(statuses.updating);

		updateSettings(slugSettings);

		const response = await saveEntityRecord(
			'blockera/v1',
			'settings',
			record
		);

		if (response) {
			outSideOnUpdate(!hasUpdate);
			setUpdateButtonStatus(statuses.updated);

			toast.success('Blockera Updated Settings.', toastOptions);
		} else {
			setUpdateButtonStatus(statuses.update);

			toast.error(
				'Failed Blockera settings updating process.',
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
			{!isEquals(defaultSettings, settings) && (
				<Reset
					slug={slug}
					hasUpdate={hasUpdate}
					defaultValue={defaultValue}
					onReset={(_hasUpdate: boolean): void => {
						outSideOnUpdate(!_hasUpdate);
						updateSettings(defaultValue);
					}}
					save={saveEntityRecord}
				/>
			)}
			<Button
				style={{
					opacity: 'updated' === updateButtonStatus.status ? 0.5 : 1,
					cursor:
						'updated' === updateButtonStatus.status
							? 'not-allowed'
							: 'pointer',
				}}
				disabled={'updated' === updateButtonStatus.status}
				isPressed={'updating' === updateButtonStatus.status}
				variant={'primary'}
				className={classnames(
					'blockera-settings-button blockera-settings-primary-button',
					{
						'blockera-settings-has-update': hasUpdate,
					}
				)}
				text={updateButtonStatus.label}
				onClick={onUpdate}
			/>
		</div>
	);
};
