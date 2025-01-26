// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { componentClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { Flex, Button, NoticeControl } from '@blockera/controls';

export const Notice = ({
	state,
	description,
	onClick,
}: {
	state: { isOpenPopup: boolean, isLoading: boolean, isReported: boolean },
	description: string,
	onClick: () => void,
}): MixedElement => {
	return (
		<NoticeControl type="error" style={{ marginTop: '10px' }}>
			<Flex direction={'column'} gap="10px">
				<h3>{__('Whoops! An error occurred', 'blockera')}</h3>
				<p>{description}</p>
				<Button
					variant={'primary'}
					disabled={state.isOpenPopup || state.isReported}
					onClick={onClick}
					type={'button'}
					className={componentClassNames('report-bug')}
				>
					{__('Report Bug', 'blockera')}
				</Button>
			</Flex>
		</NoticeControl>
	);
};
