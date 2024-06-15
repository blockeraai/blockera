// @flow

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import SuccessIcon from './icons/success-icon';
import ErrorIcon from './icons/error-icon';
import type { NoticeControlType } from './types';

export function NoticeIcon(type: NoticeControlType): any {
	switch (type) {
		case 'information':
			return (
				<Icon
					icon="information"
					iconSize="18"
					dataTest="notice-control-icon-info"
				/>
			);
		case 'warning':
			return (
				<Icon
					icon="warning"
					iconSize="18"
					dataTest="notice-control-icon-warning"
				/>
			);
		case 'error':
			return <ErrorIcon />;
		case 'success':
			return <SuccessIcon />;
		default:
			return null;
	}
}
