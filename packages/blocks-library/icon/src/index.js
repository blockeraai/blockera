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
			blockeraIcon: {
				value: {
					icon: 'star-filled',
					library: 'wp',
					uploadSVG: '',
					renderedIcon:
						'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBhcmlhLWhpZGRlbj0idHJ1ZSIgZm9jdXNhYmxlPSJmYWxzZSIgc3R5bGU9IndpZHRoOiA1MHB4OyBoZWlnaHQ6IDUwcHg7IG1hcmdpbi1yaWdodDogNXB4OyI+PHBhdGggZD0iTTExLjc3NiA0LjQ1NGEuMjUuMjUgMCAwMS40NDggMGwyLjA2OSA0LjE5MmEuMjUuMjUgMCAwMC4xODguMTM3bDQuNjI2LjY3MmEuMjUuMjUgMCAwMS4xMzkuNDI2bC0zLjM0OCAzLjI2M2EuMjUuMjUgMCAwMC0uMDcyLjIyMmwuNzkgNC42MDdhLjI1LjI1IDAgMDEtLjM2Mi4yNjNsLTQuMTM4LTIuMTc1YS4yNS4yNSAwIDAwLS4yMzIgMGwtNC4xMzggMi4xNzVhLjI1LjI1IDAgMDEtLjM2My0uMjYzbC43OS00LjYwN2EuMjUuMjUgMCAwMC0uMDcxLS4yMjJMNC43NTQgOS44ODFhLjI1LjI1IDAgMDEuMTM5LS40MjZsNC42MjYtLjY3MmEuMjUuMjUgMCAwMC4xODgtLjEzN2wyLjA2OS00LjE5MnoiPjwvcGF0aD48L3N2Zz4=',
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
	},
};
