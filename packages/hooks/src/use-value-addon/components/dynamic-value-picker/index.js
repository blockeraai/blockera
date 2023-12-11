// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import type { DynamicValueTypes, ValueAddon } from '../../types';

export default function ({
	value,
	types,
	onChoice,
}: {
	value: ValueAddon,
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
