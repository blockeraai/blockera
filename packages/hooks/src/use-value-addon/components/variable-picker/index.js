// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { Flex, Popover } from '@publisher/components';
import type { VariableTypes } from '../../types';

/**
 * Internal dependencies
 */
import { getVariables, getVariableIcon } from '../../helpers';
import { TypeHeader, PopoverValueItem } from '../index';

export default function ({
	types,
	onChoice,
}: {
	types: Array<VariableTypes>,
	onChoice: (event: SyntheticMouseEvent<EventTarget>) => void,
}): Element<any> {
	const Variables = (): Array<Element<any>> => {
		return types.map((type, index) => {
			const data = getVariables(type);

			if (data?.name === '') {
				return <></>;
			}

			return (
				<Flex
					direction="column"
					key={`type-${type}-${index}`}
					gap={'10px'}
				>
					<TypeHeader name={data.name} />

					{data.variables.map((variable, _index) => {
						const itemData = {
							name: variable.name,
							value: variable.value,
							slug: variable.slug,
							reference: 'preset',
							type,
							var: `var:preset|${type
								.replace('_', '-')
								.toLocaleLowerCase()}|${variable.slug}`,
						};

						return (
							<PopoverValueItem
								data={itemData}
								onClick={onChoice}
								key={`${type}-${_index}-value-type`}
								name={variable.name}
								type={type}
								icon={getVariableIcon({
									type,
									value: variable.value,
								})}
							/>
						);
					})}
				</Flex>
			);
		});
	};

	return (
		<Popover
			title={__('Choose Variable', 'publisher-core')}
			offset={125}
			placement="left-start"
		>
			<Flex direction="column" gap="25px">
				<Variables />
			</Flex>
		</Popover>
	);
}
