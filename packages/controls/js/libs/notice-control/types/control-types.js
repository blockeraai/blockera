// @flow
/**
 * Internal dependencies
 */
import type { ControlGeneralTypes } from '../../../types';

export type NoticeControlType = 'information' | 'warning' | 'success' | 'error';

export type TNoticeControlProps = {
	...ControlGeneralTypes,
	/**
	 * Function that will be fired while clicking on dismiss.
	 */
	onDismiss?: () => void,
	/**
	 * flag to show icon or not.
	 */
	showIcon?: boolean,
	/**
	 * define colors and icons based on type
	 */
	type: NoticeControlType,
	/**
	 * flag to show dismiss or not
	 */
	isDismissible?: boolean,
	/**
	 * Function that will be fired when control rendered
	 */
	onShown?: () => void,
	/**
	 * flag to render control or not
	 */
	isShown?: boolean,
};
