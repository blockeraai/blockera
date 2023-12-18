// @flow
/**
 * Internal dependencies
 */
import type { ControlGeneralTypes } from '../../../types';

export type NoticeControlType = 'information' | 'warning' | 'success' | 'error';

export type TNoticeControlProps = {
	...ControlGeneralTypes,
	onDismiss?: () => void,
	showIcon?: boolean,
	type: NoticeControlType,
	isDismissible?: boolean,
	onShown?: () => void,
	isShown?: boolean,
};
