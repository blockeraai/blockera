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
