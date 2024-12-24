// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import apiFetch from '@wordpress/api-fetch';
import { useEffect, useState, useCallback } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { getUrlParams } from '@blockera/utils';
import { Button, Flex, LoadingComponent } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { Subscriptions } from './subscriptions';

export const ConnectWithBlockera = ({
	isConnected: _isConnected,
}: {
	isConnected: boolean,
}): MixedElement => {
	const [isUnsubscribed, setIsUnsubscribed] = useState(
		getUrlParams('unsubscribed')
	);
	const [isConnected, setIsConnected] = useState(false);
	const [isConnecting, setIsConnecting] = useState(_isConnected);
	const {
		blockeraVersion,
		blockeraAIAccount,
		blockeraCreateAccountLink,
		blockeraConnectAccountLink,
		blockeraConnectActionNonce,
		blockeraIsConnectedWithAccount,
		blockeraPluginData: { pluginURI },
	} = window;
	const [accountInfo, setAccountInfo] = useState(blockeraAIAccount);

	const doConnect = useCallback(() => {
		if (blockeraIsConnectedWithAccount) {
			return;
		}
		apiFetch({
			path: '/blockera/v1/auth/is-connected',
			data: {
				action: 'is_connected',
				is_connected: _isConnected,
			},
			method: 'POST',
			headers: {
				'X-Blockera-Nonce': blockeraConnectActionNonce,
			},
		})
			.then((response) => {
				if (response.success) {
					setIsConnected(response.data['is-connected']);
					window.blockeraIsConnectedWithAccount = Boolean(
						response.data['is-connected']
					);
				} else {
					setIsConnected(false);
				}

				setIsConnecting(false);
			})
			.catch(() => {
				setIsConnected(false);
				setIsConnecting(false);
			});
	}, [
		_isConnected,
		blockeraConnectActionNonce,
		blockeraIsConnectedWithAccount,
	]);

	useEffect(() => {
		const fetchSubscription = async () => {
			apiFetch({
				method: 'POST',
				path: '/blockera/v1/auth/subscriptions',
				headers: {
					'X-Blockera-Nonce': blockeraConnectActionNonce,
				},
				data: {
					action: 'subscriptions',
				},
			})
				.then((response) => {
					if (response.success) {
						setAccountInfo(response.data);
						setIsUnsubscribed(false);
					} else {
						setIsUnsubscribed(true);
						setAccountInfo(blockeraAIAccount);
					}
				})
				.catch(() => {
					setAccountInfo(blockeraAIAccount);
				});
		};

		if (!blockeraAIAccount?.subscriptions?.length) {
			fetchSubscription();
		}
	}, [blockeraConnectActionNonce, blockeraAIAccount]);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(doConnect, [blockeraConnectActionNonce]);

	if (accountInfo?.subscriptions?.length) {
		return <Subscriptions accountInfo={accountInfo} />;
	}

	if (
		'undefined' !== typeof _isConnected &&
		!isConnected &&
		isConnecting &&
		accountInfo?.email &&
		!isUnsubscribed
	) {
		return (
			<LoadingComponent
				loadingDescription={__('Connecting …', 'blockera')}
			/>
		);
	} else if (
		'undefined' !== typeof _isConnected &&
		!isConnecting &&
		!isConnected
	) {
		return (
			<div style={{ textAlign: 'center', padding: '50px 0' }}>
				<h1>
					{__(
						'🚨 Failed to connect to your subscription!',
						'blockera'
					)}
				</h1>
				<Flex
					justifyContent="space-between"
					style={{ width: '50%', margin: '50px auto 0 auto' }}
				>
					<Button
						onClick={() => {
							setIsConnecting(true);
							doConnect();
						}}
					>
						{__('Try Again', 'blockera')}
					</Button>
					<Button
						variant="primary"
						onClick={() =>
							(window.location.href = blockeraConnectAccountLink)
						}
					>
						{__('Connect to Subscription', 'blockera')}
					</Button>
					<Button
						variant="primary"
						onClick={() =>
							(window.location.href = blockeraCreateAccountLink)
						}
					>
						{__('Buy Subscription', 'blockera')}
					</Button>
				</Flex>
			</div>
		);
	}

	return (
		<>
			<img
				src={`${pluginURI}/assets/connect.png?v=${blockeraVersion}`}
				alt={__('Connect Blockera to your subscription', 'blockera')}
				style={{
					width: '410px',
					height: 'auto',
					margin: '0 auto',
					display: 'block',
				}}
			/>
			<Flex justifyContent="space-between">
				<Button
					variant="primary"
					onClick={() =>
						(window.location.href = blockeraConnectAccountLink)
					}
				>
					{__('Choose Subscription', 'blockera')}
				</Button>
				<Button
					variant="secondary"
					onClick={() =>
						(window.location.href = blockeraCreateAccountLink)
					}
				>
					{__('Buy Subscription', 'blockera')}
				</Button>
			</Flex>
		</>
	);
};
