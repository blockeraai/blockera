// @flow

/**
 * External dependencies
 */
import classnames from 'classnames';
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import Button from '@blockera/components/js/button/button';

export const Reset = ({
	slug,
	save,
	hasUpdate,
	onReset,
	defaultValue,
}: {
	slug?: string,
	save: (kind: string, name: string, record: Object) => Promise<string>,
	hasUpdate: boolean,
	defaultValue: any,
	onReset: (hasUpdate: boolean) => void,
}): MixedElement => {
	const handleOnReset = async (resetType?: string): Promise<string> => {
		let response: string = '';

		if ('undefined' === typeof slug || 'undefined' === typeof resetType) {
			return response;
		}

		response = await save('blockera/v1', 'settings', {
			action: 'reset',
			reset: resetType,
			default: defaultValue,
		});

		if (response) {
			onReset(!hasUpdate);
		}

		return response;
	};

	return (
		<Button
			data-test={'reset-settings'}
			className={classnames(
				'blockera-settings-button blockera-settings-secondary-button'
			)}
			text={__('Reset', 'blockera')}
			onClick={() => handleOnReset(slug)}
		/>
	);
};
