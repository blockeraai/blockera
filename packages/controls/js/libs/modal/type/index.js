//@flow

export type ModalProps = {
	children?: any,
	visible?: boolean,
	onClose?: () => void,
	onRequestClose?: () => void,
	headerIcon?: any,
	headerTitle?: string,
	className?: string,
	size?: 'small' | 'medium' | 'large' | 'fill',
	isDismissible?: boolean,
};
