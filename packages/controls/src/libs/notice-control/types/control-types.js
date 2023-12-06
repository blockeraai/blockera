// @flow

export type TNoticeControlProps = {
	label?: string,
	field?: string,
	columns?: string,
	className?: string,
	onDismiss?: () => {},
	showIcon?: boolean,
	type?: 'information' | 'warning' | 'success' | 'error',
	children?: string | any,
	isDismissible?: boolean,
};
