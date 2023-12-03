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
import { Flex, Popover } from '@publisher/components';

export default function ({
	type,
	onChoice,
}: {
	type: string,
	onChoice: (event: SyntheticMouseEvent<EventTarget>) => void,
}): Element<any> {
	const Variables = (): Array<Element<any>> => {
		const data = useGetVariables(type);

		return data.map((variable, index) => {
			return (
				<Flex direction={'row'} key={`${type}-${index}-value-type`}>
					<button
						data-variable={JSON.stringify({
							...variable,
							reference: 'preset',
							var: `var:preset|${type
								.replace('_', '-')
								.toLocaleLowerCase()}|${variable.slug}`,
						})}
						onClick={onChoice}
					>
						{variable.name}
					</button>
				</Flex>
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
