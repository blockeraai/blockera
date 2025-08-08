//@flow

export type IconLibraryTypes = 'wp' | 'ui' | 'blockera' | 'cursor' | 'social';

export type UploadSVGProps = {
	title: string,
	url: string,
};

export type IconProps = {
	icon: string,
	library?: IconLibraryTypes,
	iconSize?: number,
	className?: string,
	uploadSVG?: UploadSVGProps,
	props?: Object,
	width?: number,
	height?: number,
};
