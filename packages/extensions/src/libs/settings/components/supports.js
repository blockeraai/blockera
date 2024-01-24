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
}: {
	supports: Object,
	update: (setting: Object) => void,
}): Array<MixedElement> =>
	Object.values(supports).map((support: Object, index: number) => {
		const supportKeys = Object.keys(supports);
		const name = supportKeys[index];

		return (
			<SupportItem
				name={name}
				update={update}
				setting={support}
				supports={supports}
				key={`${name}-${index}`}
			/>
		);
	});
