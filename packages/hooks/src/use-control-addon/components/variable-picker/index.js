// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';

/**
 * Publisher dependencies
 */
import { SearchControl } from '@publisher/controls';
import useGetVariables from './use-get-variables';
import { Popover } from '@publisher/components';

export default function ({ type }: { type: string }): Element<any> {
	const Variables = (): Array<Element<any>> => {
		const data = useGetVariables(type);

		return data.map((variable, index) => {
			return (
				<div key={`${type}-${index}-value-type`}>{variable.name}</div>
			);
		});
	};

	return (
		<Popover>
			<SearchControl />
			<Variables />
		</Popover>
	);
}
