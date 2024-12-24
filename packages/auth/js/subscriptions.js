// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import apiFetch from '@wordpress/api-fetch';
import { useCallback } from '@wordpress/element';
/**
 * Blockera dependencies
 */
import { classNames } from '@blockera/classnames';
import { Flex, Avatar, Button, LoadingComponent } from '@blockera/controls';

/**
 * Internal dependencies
 */

export const Subscriptions = ({
	accountInfo: { name, email, avatar, subscriptions },
}: {
	accountInfo: {
		subscriptions: Array<{
			id: string,
			// end_date: string,
			product_id: string,
			start_date: string,
			subscription_name: string,
			subscription_status: string,
			next_payment_due_date: string,
		}>,
		name: string,
		email: string,
		avatar: string,
	},
}): MixedElement => {
	const { blockeraConnectActionNonce } = window;

	const unsubscribe = useCallback(
		(license: string) => {
			apiFetch({
				method: 'POST',
				path: '/blockera/v1/auth/unsubscribe',
				headers: {
					'X-Blockera-Nonce': blockeraConnectActionNonce,
				},
				data: {
					id: license,
					action: 'unsubscribe',
				},
			}).then((response) => {
				if (response.success) {
					window.location.href += '&unsubscribed=true';
				}
			});
		},
		[blockeraConnectActionNonce]
	);

	const renew = useCallback(() => {
		console.log('renew');
	}, []);

	if (!name || !subscriptions.length) {
		return (
			<LoadingComponent
				loadingDescription={__('Connecting …', 'blockera')}
			/>
		);
	}

	return (
		<Flex direction="column" gap="20">
			<Flex justifyContent="space-between" alignItems="center">
				<Flex gap="16" alignItems="center">
					<Avatar
						src={avatar}
						alt={name}
						className="account-avatar"
					/>
					<Flex direction="column" gap="4">
						<h3 style={{ margin: 0 }}>{name}</h3>
						<p style={{ margin: 0 }}>{email}</p>
					</Flex>
				</Flex>
			</Flex>

			{subscriptions.map(
				({
					id,
					product_id: productId,
					start_date: startDate,
					subscription_name: subscriptionName,
					subscription_status: subscriptionStatus,
					next_payment_due_date: nextPaymentDueDate,
				}: {
					id: string,
					product_id: string,
					subscription_name: string,
					subscription_status: string,
					start_date: string,
					next_payment_due_date: string,
				}) => {
					const isExpired = new Date(nextPaymentDueDate) < new Date();

					return (
						<Flex key={id} direction="column" gap="20">
							<Flex gap="30" style={{ alignItems: 'center' }}>
								<Flex
									direction="column"
									justifyContent="space-between"
								>
									<span
										className={classNames(
											'blockera-subscription-field'
										)}
									>
										{__('Subscription ID:', 'blockera')}
									</span>
									<span
										className={classNames(
											'blockera-subscription-field'
										)}
									>
										{__('Product ID:', 'blockera')}
									</span>
									<span
										className={classNames(
											'blockera-subscription-field'
										)}
									>
										{__('Subscription:', 'blockera')}
									</span>
									<span
										className={classNames(
											'blockera-subscription-field'
										)}
									>
										{__('Status:', 'blockera')}
									</span>
									<span
										className={classNames(
											'blockera-subscription-field'
										)}
									>
										{__('Start Date:', 'blockera')}
									</span>
									{/* <span className={classNames('blockera-subscription-field')}>
									{__('End Date:', 'blockera')}
					</span> */}
									<span
										className={classNames(
											'blockera-subscription-field'
										)}
									>
										{__('Expiry Date:', 'blockera')}
									</span>
								</Flex>
								<Flex
									direction="column"
									justifyContent="space-between"
								>
									<span
										className={classNames(
											'blockera-subscription-value'
										)}
									>
										{id}
									</span>
									<span
										className={classNames(
											'blockera-subscription-value'
										)}
									>
										{productId}
									</span>
									<span
										className={classNames(
											'blockera-subscription-value'
										)}
									>
										{subscriptionName}
									</span>
									<span
										className={classNames(
											'blockera-subscription-value',
											{
												'blockera-subscription-value-valid':
													!isExpired,
												'blockera-subscription-value-expired':
													isExpired,
												'blockera-subscription-value-status': true,
											}
										)}
									>
										{subscriptionStatus}
									</span>
									<span
										className={classNames(
											'blockera-subscription-value'
										)}
									>
										{startDate}
									</span>
									{/* <span
									className={classNames('blockera-subscription-value', {
										'blockera-subscription-value-expired': isExpired,
								})}
									dangerouslySetInnerHTML={{ __html: endDate }}
								/> */}
									<span
										className={classNames(
											'blockera-subscription-value'
										)}
									>
										{nextPaymentDueDate}
									</span>
								</Flex>
							</Flex>

							<Flex
								className={classNames(
									'blockera-subscription-actions'
								)}
								justifyContent="flex-start"
								gap="30"
							>
								<Button
									disabled={!id}
									variant="primary"
									onClick={renew}
								>
									{__('Renew', 'blockera')}
								</Button>
								<Button
									variant="secondary"
									onClick={() => unsubscribe(id)}
								>
									{__('Unsubscribe', 'blockera')}
								</Button>
							</Flex>
						</Flex>
					);
				}
			)}
		</Flex>
	);
};
