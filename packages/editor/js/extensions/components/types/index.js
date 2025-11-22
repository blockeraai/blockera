// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

export type BlockBaseProps = {
	additional: Object,
	children: MixedElement,
	name: string,
	clientId: string,
	attributes: Object,
	setAttributes: (attributes: Object) => void,
	className: string,
	defaultAttributes: Object,
	originDefaultAttributes: Object,
	insideBlockInspector?: boolean,
};

export * from './block-sections';
export * from './block-app-context';
export * from './block-portals-props';
