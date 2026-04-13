// @flow

/** Cross-axis align icons: rotate when parent flex direction is column. */
export function getFlexChildAlignIconStyle(flexDirection: string | void): {|
	transform: string,
|} {
	const f = flexDirection ?? '';
	return {
		transform: ['column', 'column-reverse'].includes(f)
			? 'rotate(-90deg)'
			: 'rotate(0deg)',
	};
}

/** Self size (grow/shrink) icons: rotate when parent is row. */
export function getFlexChildSizingIconStyle(flexDirection: string | void): {|
	transform: string,
|} {
	const f = flexDirection ?? '';
	return {
		transform: !['column', 'column-reverse'].includes(f)
			? 'rotate(-90deg)'
			: 'rotate(0deg)',
	};
}

/** Order icons: rotate when parent is column. */
export function getFlexChildOrderIconStyle(flexDirection: string | void): {|
	transform: string,
|} {
	const f = flexDirection ?? '';
	return {
		transform: ['column', 'column-reverse'].includes(f)
			? 'rotate(90deg)'
			: 'rotate(0deg)',
	};
}
