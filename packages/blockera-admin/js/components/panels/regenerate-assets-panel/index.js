// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { Flex, Button, LoadingComponent } from '@blockera/controls';

export const RegenerateAssetsPanel = (): MixedElement => {
	const { blockeraAdminNonce } = window;
	const [regenerated, setRegenerated] = useState(false);
	const [loading, setLoading] = useState({
		regenerated: false,
		regenerating: false,
	});

	const regenerateAssets = () => {
		setLoading({
			regenerated: false,
			regenerating: true,
		});
		apiFetch({
			method: 'POST',
			path: '/blockera/v1/regenerate-assets',
			headers: {
				'X-Blockera-Nonce': blockeraAdminNonce,
			},
			data: {
				action: 'regenerate-assets',
			},
		}).then((response) => {
			if (response.success) {
				setRegenerated(response.data);
				setLoading({
					regenerated: true,
					regenerating: false,
				});
			}
		});
	};

	return (
		<Flex
			direction={'column'}
			className={'blockera-settings-panel-container'}
			gap={40}
		>
			<Flex direction={'column'} className={'blockera-settings-section'}>
				<h3 className={'blockera-settings-general section-title'}>
					<Icon
						icon={'tools'}
						iconSize={24}
						style={{
							color: 'var(--blockera-controls-primary-color)',
						}}
					/>
					{__('Regenerate Assets', 'blockera')}
				</h3>

				<div className={'blockera-settings-general control-wrapper'}>
					<Button
						disabled={regenerated}
						onClick={regenerateAssets}
						className={'blockera-settings-general control'}
						variant={'primary'}
					>
						{loading.regenerating && (
							<>
								{__('Regenerating', 'blockera')}
								<LoadingComponent color={'#ffffff'} />
							</>
						)}
						{!loading.regenerating &&
							!loading.regenerated &&
							__('Regenerate Assets', 'blockera')}
						{loading.regenerated && __('Regenerated', 'blockera')}
					</Button>
				</div>
			</Flex>
		</Flex>
	);
};
