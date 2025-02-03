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
		<Modal size={'medium'} isDismissible={false}>
			<Flex direction="column" gap={25}>
				<Flex direction="column" gap={15}>
					<Icon
						icon={'blockera'}
						library={'blockera'}
						iconSize={36}
						style={{
							fill: 'var(--blockera-controls-primary-color)',
						}}
					/>

					<p
						style={{
							margin: 0,
							fontSize: 24,
							fontWeight: 600,
							color: '#1d2327',
						}}
					>
						{__('Hello 👋', 'blockera')}
					</p>

					<h1
						data-test="thank-you-heading"
						style={{
							fontSize: '22px',
							margin: '0',
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

				<Flex direction={'row'} justifyContent={'space-between'}>
					<Button
						data-test="allow-and-continue"
						variant={'primary'}
						onClick={() => allowAndContinue('ALLOW')}
					>
						{__('Allow & Continue', 'blockera')}
					</Button>

					<Button
						data-test="skip-and-continue"
						variant={'tertiary'}
						onClick={() => allowAndContinue('SKIP')}
						style={{
							color: '#959595',
						}}
					>
						{__('Skip', 'blockera')}
					</Button>
				</Flex>
			</Flex>
		</Modal>
	);
};
