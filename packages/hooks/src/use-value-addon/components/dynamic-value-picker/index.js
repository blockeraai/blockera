// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import type { DynamicValueTypes } from '../../types';

export default function ({
	types,
	onChoice,
}: {
	types: Array<DynamicValueTypes>,
	onChoice: (event: SyntheticMouseEvent<EventTarget>) => void,
}): Element<any> {
	const DynamicValues = (): Array<Element<any>> => [];

	return (
		<>
			<DynamicValues />
		</>
	);
}
