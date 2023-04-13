/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import { Icon } from '@publisher/components';

export default function registerIcons({
	size,
	library,
	iconType,
	handleOnIconClick,
}) {
	let value;
	let stack = [];

	for (const key in library) {
		if (!library.hasOwnProperty.call(library, key)) {
			continue;
		}

		const icon = library[key];
		const isFAIcon = -1 !== iconType.indexOf('fa');

		if (isFAIcon && !icon[1]?.icon) {
			continue;
		}

		value = Icon({
			type: iconType,
			size,
			key: Math.random(),
			icon: icon[1],
			onClick: (event) =>
				handleOnIconClick(event, {
					type: 'UPDATE_ICON',
					name: icon[0],
					iconType,
				}),
			datatype: icon[0],
			className: classnames(
				'publisher-core-icon-pointer',
				`publisher-core-icon-${icon[0]}`,
				isFAIcon ? 'publisher-core-is-pro-icon' : ''
			),
		});

		stack.push(value);
	}

	return stack;
}
