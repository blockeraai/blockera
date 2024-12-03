// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

/**
 * Blockera dependencies
 */
import { Button, Flex } from '@blockera/controls';

export const ConnectWithBlockera = ({
	isConnected: _isConnected,
}: {
	isConnected: boolean,
}): MixedElement => {
	const [isConnected, setIsConnected] = useState(false);
	const [isConnecting, setIsConnecting] = useState(_isConnected);
	const {
		blockeraVersion,
		blockeraCreateAccountLink,
		blockeraConnectAccountLink,
		blockeraConnectActionNonce,
		blockeraIsConnectedWithAccount,
		blockeraPluginData: { pluginURI },
	} = window;

	const doConnect = () => {
		if (blockeraIsConnectedWithAccount) {
			return;
		}
		apiFetch({
			path: '/blockera/v1/auth/is-connected',
			data: {
				action: 'is_connected',
				'is-connected': _isConnected,
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
	};

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(doConnect, [blockeraConnectActionNonce]);

	if (blockeraIsConnectedWithAccount) {
		return (
			<div style={{ textAlign: 'center', padding: '50px 0' }}>
				<h1>{__('🎉 Congratulations!', 'blockera')}</h1>
				<p>
					{__(
						'You are connected with your bought subscription.',
						'blockera'
					)}
				</p>
			</div>
		);
	}

	if ('undefined' !== typeof _isConnected && !isConnected && isConnecting) {
		return (
			<div style={{ textAlign: 'center', padding: '50px 0' }}>
				<h1>{__('Connecting …', 'blockera')}</h1>
				<div
					className="blockera-loading-circle"
					style={{
						width: '40px',
						height: '40px',
						margin: '20px auto',
						border: '4px solid #f3f3f3',
						borderTop: '4px solid #3498db',
						borderRadius: '50%',
						animation: 'blockera-spin 1s linear infinite',
					}}
				/>
				<style>
					{`
						@keyframes blockera-spin {
							0% { transform: rotate(0deg); }
							100% { transform: rotate(360deg); }
						}
					`}
				</style>
			</div>
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
							window.open(blockeraConnectAccountLink, '_blank')
						}
					>
						{__('Connect to Subscription', 'blockera')}
					</Button>
					<Button
						variant="primary"
						onClick={() =>
							window.open(blockeraCreateAccountLink, '_blank')
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
					{__('Connect to Subscription', 'blockera')}
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
