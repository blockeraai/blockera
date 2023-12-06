// @flow

export type TPositionButtonProps = {
	label?: string,
	popoverLabel?: string,
	alignmentMatrixLabel?: string,
	id?: string,
	onChange?: () => {},
	defaultValue?: { top: string, left: string },
	props?: Object,
	columns?: string,
	field?: string,
	className?: string,
	buttonLabel?: string,
};

export type TRenderPositionIcon = {
	top: string,
	left: string,
	defaultValue?: { top: string, left: string },
};
