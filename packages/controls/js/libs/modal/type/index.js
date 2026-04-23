//@flow

export type ModalProps = {
	children?: any,
	/** Footer action buttons; wrapped in a styled Flex bar when set. */
	actions?: any,
	visible?: boolean,
	onClose?: () => void,
	onRequestClose?: () => void,
	headerIcon?: any,
	headerTitle?: string,
	className?: string,
	size?: 'small' | 'medium' | 'large' | 'fill',
	isDismissible?: boolean,
	'data-test'?: string,
	style?: Object,
};
