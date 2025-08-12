//@flow

import type { MixedElement } from 'react';

export type IconLibraryTypes =
	| 'wp'
	| 'ui'
	| 'blockera'
	| 'cursor'
	| 'social'
	| 'faregular'
	| 'fasolid'
	| 'fabrands';

export type IconLibrary = {
	id: IconLibraryTypes,
	name: string,
	icon: MixedElement,
	count: number,
};

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
