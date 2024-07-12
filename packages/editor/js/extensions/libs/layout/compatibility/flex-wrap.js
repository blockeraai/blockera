// @flow

export function flexWrapFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	if (
		attributes?.blockeraFlexWrap?.value !== '' ||
		attributes?.layout?.flexWrap === ''
	) {
		return false;
	}

	// TODO: @ali please check below condition, it seems we should not change "blockeraFlexWrap" while current block not any attributes like below example.
	// Example: `<!-- wp:paragraph -->
	// <p>test</p>
	// <!-- /wp:paragraph -->`
	// @reza: we should add below condition to fix block clean up attributes.
	// please remove comments after checkup.
	if ('undefined' === typeof attributes?.layout?.flexWrap) {
		return false;
	}

	return {
		blockeraFlexWrap: {
			value: attributes?.layout?.flexWrap,
			reverse: false,
		},
	};
}

export function flexWrapToWPCompatibility({
	newValue,
	ref,
}: {
	newValue: Object,
	ref?: Object,
}): Object {
	if (
		'reset' === ref?.current?.action ||
		newValue === '' ||
		newValue?.value === ''
	) {
		return {
			layout: {
				flexWrap: undefined,
			},
		};
	}

	return {
		layout: {
			flexWrap: newValue?.value,
		},
	};
}
