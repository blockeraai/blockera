// @flow

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import type { NoticeControlType } from './types';

export function NoticeIcon(type: NoticeControlType): any {
	switch (type) {
		case 'information':
			return (
				<Icon
					icon="information"
					iconSize="18"
					data-test="notice-control-icon-info"
				/>
			);
		case 'warning':
			return (
				<Icon
					icon="warning"
					iconSize="18"
					data-test="notice-control-icon-warning"
				/>
			);
		case 'error':
			return (
				<Icon
					icon="error"
					iconSize="18"
					data-test="notice-control-icon-error"
				/>
			);
		case 'success':
			return (
				<Icon
					icon="success"
					iconSize="18"
					data-test="notice-control-icon-success"
				/>
			);
		default:
			return null;
	}
}
