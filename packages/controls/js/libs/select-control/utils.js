// @flow

/**
 * Blockera dependencies
 */
import { isArray, isObject, isUndefined } from '@blockera/utils';

/**
 * External Internal dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import type { TSelectOptions, TNativeOption } from './types';

/**
 * Normalize a control / attribute slice to a string for matching `option.value`.
 * Supports primitives and `{ value: string | number }` wrappers from block attributes.
 */
export function normalizeSelectControlValue(raw: mixed): string {
	if (raw === null || raw === undefined) {
		return '';
	}

	if (typeof raw === 'string') {
		return raw;
	}

	if (typeof raw === 'number' || typeof raw === 'boolean') {
		return String(raw);
	}

	if (isObject(raw)) {
		const inner: any = raw;
		if (
			typeof inner.value === 'string' ||
			typeof inner.value === 'number'
		) {
			return String(inner.value);
		}
	}

	return '';
}

/**
 * Find the first flat or nested select option whose `value` strictly equals `needle`.
 * Matches parent entries before recursing into `options` (same order as unit lists).
 */
export function getSelectedSelectOption(
	needle: mixed,
	options: ?$ReadOnlyArray<any>
): any | null {
	if (!options || !isArray(options)) {
		return null;
	}

	for (let i = 0, n = options.length; i < n; i++) {
		const item = options[i];

		if (item && item.value === needle) {
			return item;
		}

		if (item?.options && isArray(item.options)) {
			const found = getSelectedSelectOption(needle, item.options);

			if (found !== null) {
				return found;
			}
		}
	}

	return null;
}

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
		} else if (!isUndefined(item.value)) {
			selectOptions.push(convertOption(item));
		}

		return null;
	});

	return selectOptions;
};
