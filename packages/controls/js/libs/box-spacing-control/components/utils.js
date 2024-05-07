// @flow

/**
 * External Dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal Dependencies
 */
import type { TNativeOption } from '../../select-control/types';
import LockNoneIcon from '../icons/lock-none';
import LockHorizontalIcon from '../icons/lock-horizontal';
import LockVerticalIcon from '../icons/lock-vertical';
import LockVerticalHorizontalIcon from '../icons/lock-vertical-horizontal';
import LockAllIcon from '../icons/lock-all';

export function getSideSelectOptions(disable: string): Array<TNativeOption> {
	const options = [
		{
			label: __('No Lock', 'blockera'),
			value: 'none',
			icon: <LockNoneIcon />,
		},
	];

	if (disable !== 'horizontal' && disable !== 'all')
		options.push({
			label: __('Lock Horizontally', 'blockera'),
			value: 'horizontal',
			icon: <LockHorizontalIcon />,
		});

	if (disable !== 'vertical' && disable !== 'all')
		options.push({
			label: __('Lock Vertically', 'blockera'),
			value: 'vertical',
			icon: <LockVerticalIcon />,
		});

	if (disable === 'none') {
		options.push({
			label: __('Lock Vertically & Horizontally', 'blockera'),
			value: 'vertical-horizontal',
			icon: <LockVerticalHorizontalIcon />,
		});
		options.push({
			label: __('Lock All', 'blockera'),
			value: 'all',
			icon: <LockAllIcon />,
		});
	}

	return options;
}