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

export function PaddingBottomSideShape({
	...props
}: SideShapeProps): MixedElement {
	return (
		<SideShape
			shape="M182.054 92.7124L182.054 92.7125L182.059 92.7181L208.196 118.7C208.197 118.701 208.198 118.701 208.198 118.702C208.857 119.383 208.362 120.5 207.484 120.5H42.5151C41.6384 120.5 41.143 119.383 41.8009 118.703L68.1354 92.7194L68.1355 92.7194L68.1423 92.7124C68.9003 91.9345 69.9255 91.5 70.9917 91.5H179.204C180.27 91.5 181.296 91.9346 182.054 92.7124Z"
			{...props}
		/>
	);
}
