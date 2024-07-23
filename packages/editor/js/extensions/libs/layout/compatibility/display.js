// @flow

export function displayFromWPCompatibility({
	attributes,
	blockId,
	defaultValue,
	activeVariation,
}: {
	attributes: Object,
	blockId?: string,
	defaultValue?: string,
	activeVariation?: string,
}): Object {
	/**
	 * custom display compatibility for blocks because of WP blocks have
	 * different defaults and behaviors and we need to compatible with all possibles.
	 */
	switch (blockId) {
		case 'core/group':
			// different default values base on block variation
			switch (activeVariation) {
				case 'group-grid':
					defaultValue = 'grid';
					break;
				case 'group-stack':
				case 'group-row':
					defaultValue = 'flex';
					break;
				default:
					defaultValue = 'constrained';
					break;
			}

			if (attributes?.blockeraDisplay === defaultValue) {
				return attributes;
			}

			if (attributes?.layout?.type === 'constrained') {
				// it means the variation is switched and the value was remain from old variation and should be cleared
				// for special display value other than `flex` and `grid` it should not cleared!
				if (['flex', 'grid'].includes(attributes.blockeraDisplay)) {
					attributes.blockeraDisplay = '';
				}
			} else {
				attributes.blockeraDisplay = attributes?.layout?.type;
			}

			return attributes;
	}

	if (
		attributes?.blockeraDisplay === defaultValue &&
		attributes?.layout?.type !== 'constrained'
	) {
		attributes.blockeraDisplay = attributes?.layout?.type;
	}

	return attributes;
}

export function displayToWPCompatibility({
	newValue,
	ref,
	blockId,
	activeVariation,
}: {
	newValue: Object,
	ref?: Object,
	blockId: string,
	activeVariation?: string,
}): Object {
	switch (blockId) {
		case 'core/group':
			//
			// Reset to default based on active variation
			//
			if ('reset' === ref?.current?.action) {
				switch (activeVariation) {
					case 'group-grid':
						return {
							layout: {
								type: 'grid',
							},
						};

					case 'group-stack':
					case 'group-row':
						return {
							layout: {
								type: 'flex',
							},
						};

					case 'group':
					default:
						return {
							layout: {
								type: 'constrained',
							},
						};
				}
			}

			// prevent error
			if (!['flex', 'grid'].includes(newValue)) {
				return {
					layout: {
						type: 'constrained',
					},
				};
			}

			return {
				layout: {
					type: newValue,
				},
			};

		case 'core/buttons':
			if ('reset' === ref?.current?.action || newValue === '') {
				return {
					layout: {
						type: 'flex',
					},
				};
			}

			return {
				layout: {
					type: newValue,
				},
			};
	}

	return null;
}
