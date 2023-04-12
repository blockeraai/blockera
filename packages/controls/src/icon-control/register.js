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

		//FIXME: refactor this validator!
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
				'p-blocks-icon-pointer',
				`p-blocks-icon-${icon[0]}`
			),
		});

		stack.push(value);
	}

	return stack;
}
