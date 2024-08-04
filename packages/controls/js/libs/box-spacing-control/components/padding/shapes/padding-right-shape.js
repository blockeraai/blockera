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

export function PaddingRightShape({ ...props }: SideShapeProps): MixedElement {
	return (
		<SideShape
			shape="M184.717 67.7891L184.717 67.7891L184.714 67.7923C183.936 68.5567 183.5 69.5916 183.5 70.6687V87.3655C183.5 88.4427 183.936 89.4776 184.714 90.242L184.717 90.2449L210.701 116.194C210.702 116.194 210.702 116.195 210.703 116.195C211.378 116.856 212.5 116.368 212.5 115.473L212.5 42.5271C212.5 41.6319 211.378 41.1443 210.703 41.8048C210.702 41.8053 210.702 41.8057 210.701 41.8062L184.717 67.7891Z"
			{...props}
		/>
	);
}
