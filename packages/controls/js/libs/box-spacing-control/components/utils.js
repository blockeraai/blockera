// @flow

/**
 * External Dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Blockera Dependencies
 */
import { Icon } from '@blockera/icons';

/**
 * Internal Dependencies
 */
import type { TNativeOption } from '../../select-control/types';

export function getSideSelectOptions(disable: string): Array<TNativeOption> {
	const options = [
		{
			label: __('No Lock', 'blockera'),
			value: 'none',
			icon: <Icon icon="side-lock-none" iconSize="18" />,
		},
	];

	if (disable !== 'horizontal' && disable !== 'all')
		options.push({
			label: __('Lock Horizontally', 'blockera'),
			value: 'horizontal',
			icon: <Icon icon="side-lock-horizontal" iconSize="18" />,
		});

	if (disable !== 'vertical' && disable !== 'all')
		options.push({
			label: __('Lock Vertically', 'blockera'),
			value: 'vertical',
			icon: <Icon icon="side-lock-vertical" iconSize="18" />,
		});

	if (disable === 'none') {
		options.push({
			label: __('Lock Vertically & Horizontally', 'blockera'),
			value: 'vertical-horizontal',
			icon: <Icon icon="side-lock-vertical-horizontal" iconSize="18" />,
		});

		options.push({
			label: __('Lock All', 'blockera'),
			value: 'all',
			icon: <Icon icon="side-lock-all" iconSize="18" />,
		});
	}

	return options;
}
