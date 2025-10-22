// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { generateUuid4 } from '@blockera/blocks-core/js';

/**
 * Internal dependencies
 */
import { default as IconBlockIcon } from './block-icon.svg';

export const icon = {
	originBlockType: 'core/image',
	variationConfig: {
		name: 'blockera/icon',
		label: 'Icon',
		description: __('Insert an SVG icon or graphic.', 'blockera'),
		title: __('Icon', 'blockera'),
		icon: <IconBlockIcon />,
		attributes: {
			blockeraPropsId: generateUuid4(),
			className: 'blockera-is-icon-block',
			url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-hidden="true"><path d="M5.12321216,13.5468785 L5.07370078,13.6336248 C4.83077383,14.1322066 5.21892027,14.7352155 5.79113692,14.6825876 L10.2624715,14.270549 L9.82933866,21.7227919 C9.78597021,22.4686759 10.7447862,22.7937669 11.1544448,22.1720753 L18.8767932,10.4527553 L18.9263046,10.3660059 C19.1692295,9.86740676 18.7810449,9.2643915 18.2088152,9.31705918 L13.736563,9.72847448 L14.1706611,2.27720814 C14.2140292,1.5313296 13.2552248,1.20623489 12.8455606,1.82791614 L5.12321216,13.5468785 Z M12.5675925,4.88951961 L12.2425725,10.4921196 L12.2429925,10.5865822 C12.2702521,10.9894968 12.6214196,11.3022396 13.0308862,11.2645525 L16.8312941,10.9140428 L11.431442,19.1095038 L11.7574272,13.5078804 L11.7570075,13.4134218 C11.729751,13.0105235 11.3786124,12.697785 10.9691611,12.7354431 L7.16774032,13.0849806 L12.5675925,4.88951961 Z"></path></svg>',
			blockeraIcon: {
				value: {
					icon: '',
					library: '',
					renderedIcon:
						'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiPgogIDxwYXRoIGQ9Ik01LjEyMzIxMjE2LDEzLjU0Njg3ODUgTDUuMDczNzAwNzgsMTMuNjMzNjI0OCBDNC44MzA3NzM4MywxNC4xMzIyMDY2IDUuMjE4OTIwMjcsMTQuNzM1MjE1NSA1Ljc5MTEzNjkyLDE0LjY4MjU4NzYgTDEwLjI2MjQ3MTUsMTQuMjcwNTQ5IEw5LjgyOTMzODY2LDIxLjcyMjc5MTkgQzkuNzg1OTcwMjEsMjIuNDY4Njc1OSAxMC43NDQ3ODYyLDIyLjc5Mzc2NjkgMTEuMTU0NDQ0OCwyMi4xNzIwNzUzIEwxOC44NzY3OTMyLDEwLjQ1Mjc1NTMgTDE4LjkyNjMwNDYsMTAuMzY2MDA1OSBDMTkuMTY5MjI5NSw5Ljg2NzQwNjc2IDE4Ljc4MTA0NDksOS4yNjQzOTE1IDE4LjIwODgxNTIsOS4zMTcwNTkxOCBMMTMuNzM2NTYzLDkuNzI4NDc0NDggTDE0LjE3MDY2MTEsMi4yNzcyMDgxNCBDMTQuMjE0MDI5MiwxLjUzMTMyOTYgMTMuMjU1MjI0OCwxLjIwNjIzNDg5IDEyLjg0NTU2MDYsMS44Mjc5MTYxNCBMNS4xMjMyMTIxNiwxMy41NDY4Nzg1IFogTTEyLjU2NzU5MjUsNC44ODk1MTk2MSBMMTIuMjQyNTcyNSwxMC40OTIxMTk2IEwxMi4yNDI5OTI1LDEwLjU4NjU4MjIgQzEyLjI3MDI1MjEsMTAuOTg5NDk2OCAxMi42MjE0MTk2LDExLjMwMjIzOTYgMTMuMDMwODg2MiwxMS4yNjQ1NTI1IEwxNi44MzEyOTQxLDEwLjkxNDA0MjggTDExLjQzMTQ0MiwxOS4xMDk1MDM4IEwxMS43NTc0MjcyLDEzLjUwNzg4MDQgTDExLjc1NzAwNzUsMTMuNDEzNDIxOCBDMTEuNzI5NzUxLDEzLjAxMDUyMzUgMTEuMzc4NjEyNCwxMi42OTc3ODUgMTAuOTY5MTYxMSwxMi43MzU0NDMxIEw3LjE2Nzc0MDMyLDEzLjA4NDk4MDYgTDEyLjU2NzU5MjUsNC44ODk1MTk2MSBaIj48L3BhdGg+Cjwvc3ZnPg==',
				},
			},
			blockeraWidth: {
				value: '100px',
			},
			align: 'center',
		},
		category: 'media',
		scope: ['inserter'],
		isActive: (blockAttributes: Object): boolean => {
			return (
				blockAttributes &&
				blockAttributes?.className?.includes('blockera-is-icon-block')
			);
		},
		supports: {
			blockExtensions: {
				iconConfig: {
					blockeraIconPosition: {
						status: false,
						show: false,
						force: false,
					},
					blockeraIconGap: {
						status: false,
						show: false,
						force: false,
					},
					blockeraIconSize: {
						status: false,
						show: false,
						force: false,
					},
				},
			},
		},
	},
};
