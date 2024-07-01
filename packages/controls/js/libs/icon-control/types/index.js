// @flow

export type IconControlProps = {
	label: string,
	columns: string,
	field: string,
	/**
	 * Choose label
	 */
	labelChoose: string,
	/**
	 * Open icon library label
	 */
	labelIconLibrary: string,
	/**
	 * upload svg label
	 */
	labelUploadSvg: string,
	/**
	 * It sets the control default value if the value not provided.
	 * By using it the control will not fire onChange event for this default value on control first render,
	 */
	defaultValue: {
		icon: string,
		library: string,
		uploadSVG: string | Element | Object,
	},
	onChange: () => void,
	//
	className: string,
};
