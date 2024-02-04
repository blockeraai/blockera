// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import { SupportItem } from './support-item';

export const Supports = ({
	update,
	supports,
	allFeatures,
}: {
	update: (setting: Object) => void,
	supports: Object,
	allFeatures: Object,
}): Array<MixedElement> =>
	Object.values(supports).map((support: Object, index: number) => {
		const supportKeys = Object.keys(supports);
		const name = supportKeys[index];

		return (
			<SupportItem
				name={name}
				update={update}
				setting={support}
				supports={allFeatures}
				key={`${name}-${index}`}
			/>
		);
	});
