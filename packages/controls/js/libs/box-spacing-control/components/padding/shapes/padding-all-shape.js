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

export function PaddingAllSideShape({
	...props
}: SideShapeProps): MixedElement {
	return (
		<SideShape
			shape="M37.5 41.0976C37.5 39.102 39.0859 37.5 41.0229 37.5H208.977C210.914 37.5 212.5 39.102 212.5 41.0976V116.902C212.5 118.898 210.914 120.5 208.977 120.5H41.0229C39.0859 120.5 37.5 118.898 37.5 116.902V41.0976ZM69.0114 66.4512C67.6158 66.4512 66.5 67.6011 66.5 69V89C66.5 90.3989 67.6158 91.5488 69.0114 91.5488H181C182.396 91.5488 183.511 90.3989 183.511 89V69C183.511 67.6011 182.396 66.4512 181 66.4512H69.0114Z"
			{...props}
		/>
	);
}
