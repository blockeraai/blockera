// @flow

import SuccessIcon from './icons/success-icon';
import WarningIcon from './icons/warning-icon';
import ErrorIcon from './icons/error-icon';
import InformationIcon from './icons/information-icon';
export function NoticeIcon(type: string): any {
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
