// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { useState } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { classNames } from '@blockera/classnames';
import { Icon } from '@blockera/icons';
import { Modal, Flex, Button } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { sender } from './sender';

export const OptInModal = (): MixedElement => {
	const [isOpen, setOpen] = useState(true);
	const closeModal = () => setOpen(false);

	if (!isOpen || ['ALLOW', 'SKIP'].includes(window.blockeraOptInStatus)) {
		return <></>;
	}

	const allowAndContinue = (prompt: 'ALLOW' | 'SKIP') => {
		sender(prompt);

		closeModal();
	};

	return (
		<Modal
			size={'medium'}
			headerIcon={
				<Icon icon="blockera" library="blockera" iconSize={36} />
			}
			headerTitle={__('Hello 👋', 'blockera')}
			isDismissible={false}
			actions={
				<>
					<Button
						data-test="skip-and-continue"
						variant={'tertiary-on-hover'}
						onClick={() => allowAndContinue('SKIP')}
						style={{
							color: '#959595',
						}}
					>
						{__('Skip', 'blockera')}
					</Button>

					<Button
						data-test="allow-and-continue"
						variant={'primary'}
						onClick={() => allowAndContinue('ALLOW')}
					>
						{__('Allow & Continue', 'blockera')}
					</Button>
				</>
			}
		>
			<Flex direction="column" gap={25}>
				<Flex direction="column" gap={15}>
					<h1
						data-test="thank-you-heading"
						style={{
							fontSize: '22px',
							margin: '20px 0 0 0',
							color: '#1d2327',
						}}
					>
						{__('Thank you for choosing Blockera!', 'blockera')}
					</h1>
				</Flex>

				<Flex
					direction={'column'}
					gap="10px"
					justifyContent={'space-between'}
				>
					<p
						style={{
							color: '#707070',
							margin: 0,
							fontSize: 14,
						}}
					>
						{window.blockeraOptInDescription}
					</p>

					<Flex
						direction="row"
						gap="15px"
						className={classNames('blockera-opt-in-text')}
					>
						<a href={window.blockeraTermsOfServicesLink}>
							{__('Terms of service', 'blockera')}
						</a>

						<a href={window.blockeraPermissionsLink}>
							{__('Permissions', 'blockera')}
						</a>

						<a href={window.blockeraPrivacyAndPolicyLink}>
							{__('Privacy Policy', 'blockera')}
						</a>
					</Flex>
				</Flex>
			</Flex>
		</Modal>
	);
};
