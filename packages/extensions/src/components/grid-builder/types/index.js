// @flow

import type { MixedElement } from 'react';
import type { TBlockProps } from '../../../libs/types';

export type GridBuilderProps = {
	type: string,
	id: string,
	children: MixedElement,
	position: { top: number, left: number },
	dimension: { width: number, height: number },
	block: TBlockProps,
};
