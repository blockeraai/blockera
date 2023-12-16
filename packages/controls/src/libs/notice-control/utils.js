// @flow

/**
 * Internal dependencies
 */
import SuccessIcon from './icons/success-icon';
import WarningIcon from './icons/warning-icon';
import ErrorIcon from './icons/error-icon';
import InformationIcon from './icons/information-icon';
import type { NoticeControlType } from './types';

export function NoticeIcon(type: NoticeControlType): any {
	switch (type) {
		case 'information':
			return <InformationIcon />;
		case 'warning':
			return <WarningIcon />;
		case 'error':
			return <ErrorIcon />;
		case 'success':
			return <SuccessIcon />;
		default:
			return null;
	}
}
