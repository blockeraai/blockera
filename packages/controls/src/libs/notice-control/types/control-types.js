// @flow

export type TNoticeControlProps = {
	label?: string,
	field?: string,
	columns?: string,
	className?: string,
	onDismiss?: () => void,
	showIcon?: boolean,
	type: 'information' | 'warning' | 'success' | 'error',
	children: string | any,
	isDismissible?: boolean,
	onShown?: () => void,
	isShown?: boolean,
	style?: Object,
};
