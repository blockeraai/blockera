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

export function PaddingLeftShape({ ...props }: SideShapeProps): MixedElement {
	return (
		<SideShape
			shape="M65.283 67.7891L65.283 67.7891L65.2862 67.7923C66.0645 68.5567 66.5 69.5916 66.5 70.6687V87.3655C66.5 88.4427 66.0645 89.4776 65.2862 90.242L65.2832 90.2449L39.2986 116.194C39.2982 116.194 39.2977 116.195 39.2972 116.195C38.6222 116.856 37.5 116.368 37.5 115.473L37.5 42.5271C37.5 41.6319 38.6224 41.1443 39.2972 41.8048C39.2977 41.8053 39.2982 41.8057 39.2986 41.8062L65.283 67.7891Z"
			{...props}
		/>
	);
}
