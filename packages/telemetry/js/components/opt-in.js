// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { dispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Blockera dependencies
 */
import { classNames } from '@blockera/classnames';
import { Modal, Flex, Button } from '@blockera/controls';

export const OptInModal = ({
	kind,
	name,
}: {
	kind: string,
	name: string,
}): MixedElement => {
	const [isOpen, setOpen] = useState(true);
	const closeModal = () => setOpen(false);

	if (!isOpen || ['ALLOW', 'SKIP'].includes(window.blockeraOptInStatus)) {
		return <></>;
	}

	const { saveEntityRecord } = dispatch(coreStore);
	const allowAndContinue = (prompt: 'ALLOW' | 'SKIP') => {
		const record = {
			'opt-in-agreed': prompt,
			action: 'telemetry-opt-in-status',
			nonce: window.blockeraNonceField,
		};

		saveEntityRecord(kind, name, record);

		closeModal();
	};

	return (
		<Modal
			headerTitle={__('Hello 👋', 'blockera')}
			size={'medium'}
			isDismissible={false}
		>
			<>
				<Flex
					direction={'column'}
					gap="10px"
					justifyContent={'space-between'}
				>
					<h1
						style={{
							fontSize: '22px',
							margin: '20px 0 10px',
						}}
					>
						{__('Thank You for Choosing Blockera!', 'blockera')}
					</h1>

					<p className={classNames('blockera-opt-in-text')}>
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
						variant={'primary'}
						onClick={() => allowAndContinue('ALLOW')}
					>
						{__('Allow & Continue', 'blockera')}
					</Button>

					<Button
						variant={'tertiary-on-hover'}
						onClick={() => allowAndContinue('SKIP')}
						style={{
							color: '#959595',
						}}
					>
						{__('Skip', 'blockera')}
					</Button>
				</Flex>
			</>
		</Modal>
	);
};
