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
			url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><path fill-rule="evenodd" d="M9.706 8.646a.25.25 0 01-.188.137l-4.626.672a.25.25 0 00-.139.427l3.348 3.262a.25.25 0 01.072.222l-.79 4.607a.25.25 0 00.362.264l4.138-2.176a.25.25 0 01.233 0l4.137 2.175a.25.25 0 00.363-.263l-.79-4.607a.25.25 0 01.072-.222l3.347-3.262a.25.25 0 00-.139-.427l-4.626-.672a.25.25 0 01-.188-.137l-2.069-4.192a.25.25 0 00-.448 0L9.706 8.646zM12 7.39l-.948 1.921a1.75 1.75 0 01-1.317.957l-2.12.308 1.534 1.495c.412.402.6.982.503 1.55l-.362 2.11 1.896-.997a1.75 1.75 0 011.629 0l1.895.997-.362-2.11a1.75 1.75 0 01.504-1.55l1.533-1.495-2.12-.308a1.75 1.75 0 01-1.317-.957L12 7.39z" clip-rule="evenodd"/></svg>',
			blockeraIcon: {
				value: {
					icon: 'star-empty',
					library: 'wp',
					uploadSVG: '',
					renderedIcon:
						'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBhcmlhLWhpZGRlbj0idHJ1ZSIgZm9jdXNhYmxlPSJmYWxzZSIgc3R5bGU9IndpZHRoOiA1MHB4OyBoZWlnaHQ6IDUwcHg7IG1hcmdpbi1yaWdodDogNXB4OyI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNOS43MDYgOC42NDZhLjI1LjI1IDAgMDEtLjE4OC4xMzdsLTQuNjI2LjY3MmEuMjUuMjUgMCAwMC0uMTM5LjQyN2wzLjM0OCAzLjI2MmEuMjUuMjUgMCAwMS4wNzIuMjIybC0uNzkgNC42MDdhLjI1LjI1IDAgMDAuMzYyLjI2NGw0LjEzOC0yLjE3NmEuMjUuMjUgMCAwMS4yMzMgMGw0LjEzNyAyLjE3NWEuMjUuMjUgMCAwMC4zNjMtLjI2M2wtLjc5LTQuNjA3YS4yNS4yNSAwIDAxLjA3Mi0uMjIybDMuMzQ3LTMuMjYyYS4yNS4yNSAwIDAwLS4xMzktLjQyN2wtNC42MjYtLjY3MmEuMjUuMjUgMCAwMS0uMTg4LS4xMzdsLTIuMDY5LTQuMTkyYS4yNS4yNSAwIDAwLS40NDggMEw5LjcwNiA4LjY0NnpNMTIgNy4zOWwtLjk0OCAxLjkyMWExLjc1IDEuNzUgMCAwMS0xLjMxNy45NTdsLTIuMTIuMzA4IDEuNTM0IDEuNDk1Yy40MTIuNDAyLjYuOTgyLjUwMyAxLjU1bC0uMzYyIDIuMTEgMS44OTYtLjk5N2ExLjc1IDEuNzUgMCAwMTEuNjI5IDBsMS44OTUuOTk3LS4zNjItMi4xMWExLjc1IDEuNzUgMCAwMS41MDQtMS41NWwxLjUzMy0xLjQ5NS0yLjEyLS4zMDhhMS43NSAxLjc1IDAgMDEtMS4zMTctLjk1N0wxMiA3LjM5eiIgY2xpcC1ydWxlPSJldmVub2RkIj48L3BhdGg+PC9zdmc+',
				},
			},
			blockeraIconPosition: {
				value: 'start',
			},
			blockeraIconGap: {
				value: '5px',
			},
			blockeraIconSize: {
				value: '50px',
			},
		},
		category: 'media',
		scope: ['inserter'],
		isActive: (blockAttributes: Object) => {
			return (
				blockAttributes &&
				blockAttributes?.className?.includes('blockera-is-icon-block')
			);
		},
		supports: {
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
			},
		},
	},
};
