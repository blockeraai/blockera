// @flow

/**
 * External dependencies
 */
import type { Element } from 'react';

export type TShapeProps = {
	id: string,
	icon: Element<any>,
	selected?: boolean,
	onClick: (id: string) => void,
	isBottom?: boolean,
};
