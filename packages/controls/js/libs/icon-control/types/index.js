// @flow

export type IconControlProps = {
	label: string,
	columns: string,
	field: string,
	//
	labelChoose: string,
	labelIconLibrary: string,
	labelUploadSvg: string,
	//
	defaultValue: {
		icon: string,
		library: string,
		uploadSVG: string | Element | Object,
	},
	onChange: () => void,
	//
	className: string,
};
