// @flow

/**
 * Publisher dependencies
 */
import { isArray, isUndefined } from '@publisher/utils';

// renders a option of select (single or grouped) for native HTML select
// recursive
export const renderSelectNativeOption = function (item) {
	if (
		item?.type &&
		(item.type === 'group' || item.type === 'optgroup') &&
		item?.options
	) {
		return (
			<optgroup label={item.label}>
				{item.options.map(renderSelectNativeOption)}
			</optgroup>
		);
	}

	return <option {...item}>{item.label}</option>;
};

export const prepareSelectCustomOptions = function (options) {
	const selectOptions = [];
	let groupCounter = 0; // we save it to make tests will pass!

	function convertOption(item, customClass = '') {
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

	function convertOptionGroup(item) {
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
		} else {
			selectOptions.push(convertOption(item));
		}

		return null;
	});

	return selectOptions;
};
