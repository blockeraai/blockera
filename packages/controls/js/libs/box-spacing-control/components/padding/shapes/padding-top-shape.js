// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import { SideShape } from '../../side-shape';
import type { SideShapeProps } from '../../../types';

export function PaddingTopShape({ ...props }: SideShapeProps): MixedElement {
	return (
		<SideShape
			shape="M182.205 65.2829L182.2 65.2875C181.442 66.0654 180.415 66.5 179.348 66.5H70.6827C69.6157 66.5 68.5897 66.0654 67.8312 65.2875L67.8313 65.2875L67.8265 65.2827L41.802 39.2978C41.1427 38.618 41.6374 37.5 42.5161 37.5H207.484C208.363 37.5 208.857 38.6185 208.197 39.2981C208.197 39.2987 208.196 39.2993 208.196 39.2999L182.205 65.2829Z"
			{...props}
		/>
	);
}
