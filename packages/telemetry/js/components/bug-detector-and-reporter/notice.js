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
					data-test="report-bug"
					variant={'primary'}
					size={'small'}
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
