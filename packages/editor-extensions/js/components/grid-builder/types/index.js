// @flow

import type { MixedElement } from 'react';

export type GridBuilderProps = {
	type: string,
	id: string,
	children: MixedElement,
	position: { top: number, left: number },
	dimension: { width: number, height: number },
};
