// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { useCallback } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { classNames, componentInnerClassNames } from '@blockera/classnames';
import {
	Flex,
	Image,
	Avatar,
	Button,
	LoadingComponent,
} from '@blockera/controls';
import { Icon } from '@blockera/icons';

const License = ({
	name,
	isActive,
	thumbnail,
	isExpired,
	licenseKey,
	nextPaymentDueDate,
}: {
	name: string,
	thumbnail: string,
	isActive: boolean,
	isExpired: boolean,
	licenseKey: string,
	nextPaymentDueDate: string,
}): MixedElement => {
	const Renew = (): MixedElement => (
		<Flex
			className={classNames('blockera-subscription-actions')}
			justifyContent="flex-start"
			gap="30"
		>
			<Button
				disabled={!licenseKey}
				variant="primary"
				onClick={() => {
					console.log('Renewing ...');
				}}
			>
				{__('Renew', 'blockera')}
			</Button>
		</Flex>
	);

	const splitName = name.split(' - ');
	const productName = splitName[1];
	const plan = splitName[3] + __(' Subscription', 'blockera');

	return (
		<div className="license-box-wrapper">
			<Flex
				className="license-card-separator product-header"
				alignItems="center"
				justifyContent="space-between"
			>
				<Flex
					alignItems="center"
					className={componentInnerClassNames('license', {
						active: isActive,
						'is-expired': isExpired,
					})}
				>
					<Image
						src={thumbnail}
						alt={name}
						className={{
							'division-68': true,
							'product-logo': true,
						}}
					/>
					<Flex direction="column">
						<h3 className="product-title">{productName}</h3>
						<Flex gap={40}>
							<p className="product-details">
								{plan}
								<Icon icon={'lineDotted'} library="wp" />
								<span>{nextPaymentDueDate}</span>
							</p>
						</Flex>
					</Flex>
					{!isExpired && (
						<div className="product-status">
							<Icon icon={'check'} />
						</div>
					)}
				</Flex>
				{isExpired && <Renew />}
				{!isActive && <Renew />}
			</Flex>
		</div>
	);
};

export const Licenses = ({
	accountInfo: { name, email, avatar, licenses },
}: {
	accountInfo: {
		licenses: Array<{
			name: string,
			status: string,
			startDate: string,
			licenseKey: string,
			nextPaymentDueDate: string,
		}>,
		product_id: string,
		name: string,
		email: string,
		avatar: string,
	},
}): MixedElement => {
	const renew = useCallback(() => {
		console.log('renew');
	}, []);

	if (!name || !licenses.length) {
		return (
			<LoadingComponent
				loadingDescription={__('Connecting …', 'blockera')}
			/>
		);
	}

	return (
		<Flex
			direction="column"
			gap="20"
			className={componentInnerClassNames('blockera-license-container')}
		>
			<h6 className="blockera-licenses-subtitle">
				{__('Your Blockera Account', 'blockera')}
			</h6>
			<Flex
				justifyContent="space-between"
				alignItems="center"
				className="account-info"
			>
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
			<h6 className="blockera-licenses-subtitle">
				{__('Your Blockera Licenses', 'blockera')}
			</h6>

			{licenses.map(
				(
					{
						name,
						status,
						thumbnail,
						licenseKey,
						nextPaymentDueDate,
					}: Object,
					index: number
				) => {
					const isActive = status === 'active';
					const isExpired = new Date(nextPaymentDueDate) < new Date();

					return (
						<License
							key={index + name}
							{...{
								name,
								isActive: isActive && !isExpired,
								isExpired,
								thumbnail,
								licenseKey,
								nextPaymentDueDate,
							}}
						/>
					);
				}
			)}
		</Flex>
	);
};
