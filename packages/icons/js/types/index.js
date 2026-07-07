//@flow

import type { MixedElement } from 'react';

export type IconLibraryTypes =
	| 'wp'
	| 'ui'
	| 'blockera'
	| 'cursor'
	| 'brands'
	| 'faregular'
	| 'fasolid'
	| 'fabrands'
	| 'essentials'
	| 'feather'
	| 'lucide'
	| 'untitledui'
	| 'tabler'
	| 'tabler-filled';

export type IconLibrary = {
	id: IconLibraryTypes,
	name: string,
	icon: MixedElement,
	count: number,
	author: string,
	link: string,
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
