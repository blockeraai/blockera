// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';

/**
 * Publisher dependencies
 */
import { SearchControl } from '@publisher/controls';

export default function (): Element<any> {
	const DynamicValues = (): Array<Element<any>> => [];

	return (
		<>
			<SearchControl onChange={() => {}} />
			<DynamicValues />
		</>
	);
}
