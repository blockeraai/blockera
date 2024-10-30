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

const remindText = 'Error, Remind me later!';

export const OptInModal = ({
	kind,
	name,
}: {
	kind: string,
	name: string,
}): MixedElement => {
	const [response, setResponse] = useState(null);
	const [isOpen, setOpen] = useState(true);
	const [allowButtonTitle, setAllowButton] = useState(
		__('Allow & Continue', 'blockera')
	);
	const [variant, setVariant] = useState('primary');
	const closeModal = () => setOpen(false);

	if (!isOpen || ['ALLOW', 'SKIP'].includes(window.blockeraOptInStatus)) {
		return <></>;
	}

	const { saveEntityRecord } = dispatch(coreStore);
	const allowAndContinue = async (prompt: 'ALLOW' | 'SKIP') => {
		if (remindText === allowButtonTitle) {
			return closeModal();
		}

		const record = {
			'opt-in-agreed': prompt,
			action: 'data-stream-opt-in-status',
			nonce: window.blockeraNonceField,
		};

		const response = await saveEntityRecord(kind, name, record);

		if (!response?.success) {
			setVariant('tertiary');

			if ('http_request_failed' === response.code) {
				return setAllowButton(remindText);
			}

			return setTimeout(() => setVariant('primary'), 1500);
		}

		setResponse(response);

		setTimeout(() => closeModal(), 3000);
	};

	return (
		<Modal
			headerTitle={__('Hello 🖐', 'blockera')}
			size={'medium'}
			isDismissible={false}
		>
			{null !== response && (
				<>
					<Flex direction={'column'} justifyContent={'space-between'}>
						<h1 style={{ lineHeight: '45px' }}>
							{response?.data?.message}
						</h1>
					</Flex>
				</>
			)}
			{null === response && (
				<>
					<Flex direction={'column'} justifyContent={'space-between'}>
						<h1>
							{__('Thank You for Choosing Blockera!', 'blockera')}
						</h1>
						<p className={classNames('blockera-opt-in-text')}>
							{window.blockeraOptInDescription}
							<a href={window.blockeraTermsOfServicesLink}>
								{__('Terms of service', 'blockera')}
							</a>
							<a href={window.blockeraPrivacyAndPolicyLink}>
								{__('Privacy Policy', 'blockera')}
							</a>
						</p>
					</Flex>
					<Flex direction={'row'} justifyContent={'flex-start'}>
						<Button
							variant={variant}
							onClick={() => allowAndContinue('ALLOW')}
						>
							{allowButtonTitle}
						</Button>
						<Button
							variant={'secondary'}
							onClick={() => allowAndContinue('SKIP')}
						>
							{__('Skip', 'blockera')}
						</Button>
					</Flex>
				</>
			)}
		</Modal>
	);
};
