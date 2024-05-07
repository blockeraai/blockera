// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import type { SideShapeProps, Side } from '../types';
import { SideShapePath } from './side-shape-path';

export function SideShape({
	side,
	...props
}: {
	...SideShapeProps,
	side: Side,
}): MixedElement {
	switch (side) {
		case 'top':
			return (
				<SideShapePath
					shape="M219.205 28.2829L219.2 28.2875C218.442 29.0654 217.415 29.5 216.348 29.5H33.6827C32.6157 29.5 31.5897 29.0654 30.8312 28.2875L30.8313 28.2875L30.8265 28.2827L4.80203 2.29776C4.14271 1.61799 4.63741 0.5 5.51606 0.5H244.484C245.363 0.5 245.857 1.61791 245.198 2.29764C245.197 2.29841 245.197 2.29917 245.196 2.29994L219.205 28.2829Z"
					{...props}
				/>
			);

		case 'right':
			return (
				<SideShapePath
					shape="M221.717 30.7891L221.717 30.7891L221.714 30.7923C220.936 31.5567 220.5 32.5916 220.5 33.6687V50.3655C220.5 51.4427 220.936 52.4776 221.714 53.242L221.717 53.2449L247.701 79.1937C247.702 79.1942 247.702 79.1946 247.703 79.1951C248.378 79.8559 249.5 79.3681 249.5 78.4734L249.5 5.52714C249.5 4.63185 248.378 4.14426 247.703 4.80478C247.702 4.80525 247.702 4.80572 247.701 4.8062L221.717 30.7891Z"
					{...props}
				/>
			);

		case 'bottom':
			return (
				<SideShapePath
					shape="M219.054 55.7124L219.054 55.7125L219.059 55.7181L245.196 81.6996C245.197 81.7005 245.198 81.7014 245.198 81.7023C245.857 82.3825 245.362 83.5 244.484 83.5H5.5151C4.63839 83.5 4.14298 82.3832 4.80088 81.7028L31.1354 55.7194L31.1355 55.7194L31.1423 55.7124C31.9003 54.9345 32.9255 54.5 33.9917 54.5H216.204C217.27 54.5 218.296 54.9346 219.054 55.7124Z"
					{...props}
				/>
			);

		case 'left':
			return (
				<SideShapePath
					shape="M28.283 30.7891L28.283 30.7891L28.2862 30.7923C29.0645 31.5567 29.5 32.5916 29.5 33.6687V50.3655C29.5 51.4427 29.0645 52.4776 28.2862 53.242L28.2832 53.2449L2.29863 79.1937C2.29817 79.1942 2.29771 79.1946 2.29725 79.1951C1.62224 79.8559 0.5 79.3681 0.5 78.4734L0.500001 5.52714C0.500001 4.63185 1.62239 4.14426 2.29719 4.80478C2.29767 4.80525 2.29815 4.80572 2.29864 4.8062L28.283 30.7891Z"
					{...props}
				/>
			);
	}

	return <></>;
}