// @flow

export type TPositionButtonProps = {
	label?: string,
	popoverLabel?: string,
	alignmentMatrixLabel?: string,
	id?: string,
	onChange?: () => {},
	defaultValue?: { top: string, left: string },
	props?: Object,
};

export type TRenderPositionIcon = {
	top: string,
	left: string,
};
