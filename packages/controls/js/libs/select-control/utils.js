// @flow

/**
 * Blockera dependencies
 */
import { isArray, isUndefined } from '@blockera/utils';

/**
 * External Internal dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import type { TSelectOptions, TNativeOption } from './types';
// renders a option of select (single or grouped) for native HTML select
// recursive

// $FlowFixMe
export const renderSelectNativeOption = function (
	item: TNativeOption,
	index: string | number
): MixedElement {
	if (
		item?.type &&
		(item.type === 'group' || item.type === 'optgroup') &&
		item?.options
	) {
		return (
			<optgroup label={item.label} key={index}>
				{item.options.map(renderSelectNativeOption)}
			</optgroup>
		);
	}

	return (
		<option {...item} key={index}>
			{item.label}
		</option>
	);
};

// $FlowFixMe
export const prepareSelectCustomOptions = function (options: TSelectOptions) {
	const selectOptions = [];
	let groupCounter = 0; // we save it to make tests will pass!

	function convertOption(item: TNativeOption, customClass?: string = '') {
		return {
			name: (
				<>
					{item?.icon ? (
						<span className="item-icon">{item.icon}</span>
					) : (
						''
					)}

					{item?.label ? (
						<span className="item-label">{item.label}</span>
					) : (
						''
					)}
				</>
			),
			key: item.value,
			style: item?.style,
			className:
				(item?.className ? item.className : '') +
				(item?.icon ? ' width-icon' : '') +
				(item?.disabled ? ' disabled' : '') +
				` ${customClass}`,
		};
	}

	function convertOptionGroup(item: { label: string }) {
		groupCounter++;

		return {
			name: <span className="item-label">{item.label}</span>,
			key: 'group-' + groupCounter,
			className: ' option-group',
		};
	}

	options?.map((item) => {
		if (!isUndefined(item.options) && isArray(item.options)) {
			selectOptions.push(
				convertOptionGroup({
					label: item.label,
				})
			);

			item.options?.map((_item) => {
				selectOptions.push(convertOption(_item, 'level-2-item'));
				return null;
			});
		} else if (!isUndefined(item.value))
			selectOptions.push(convertOption(item));

		return null;
	});

	return selectOptions;
};
