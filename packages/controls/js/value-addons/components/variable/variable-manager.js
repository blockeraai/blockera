// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';

/**
 * Blockera dependencies
 */
import {
	generateVariableString,
	type DynamicVariableGroup,
} from '@blockera/data';

/**
 * Internal dependencies
 */
import { getVariableIcon } from '../../helpers';
import { isValid } from '../../utils';
import type { VariableCategoryDetail } from '../../types';
import { PickerValueItem } from '../picker';
import type { ValueAddonControlProps } from '../control/types';
import { Flex, Grid, ConditionalWrapper } from '../../../';

export type VariableManagerProps = {
	controlProps: ValueAddonControlProps,
	data: DynamicVariableGroup | VariableCategoryDetail,
	typeKey: string,
	keySuffix?: string,
};

export function VariableManager({
	controlProps,
	data,
	typeKey,
	keySuffix = 'value-type',
}: VariableManagerProps): Element<any> {
	const showTwoColumns = [
		'color',
		'linear-gradient',
		'radial-gradient',
		'spacing',
	].includes(data.type || typeKey);

	return (
		<ConditionalWrapper
			condition={showTwoColumns}
			wrapper={(children) => (
				<Grid gridTemplateColumns="1fr 1fr" gap="10px">
					{children}
				</Grid>
			)}
			elseWrapper={(children) => (
				<Flex gap="10px" direction="column">
					{children}
				</Flex>
			)}
		>
			{(!Array.isArray(data.items)
				? Object.values(data.items || {})
				: data.items || []
			).map((variable, _index) => {
				const itemData = {
					...variable,
					type: data?.type || typeKey,
					var:
						variable?.var ||
						generateVariableString({
							reference: variable.reference,
							type: data?.type || typeKey,
							id: variable.id,
						}),
				};
				const displayName = variable.name || variable.id;

				return (
					<PickerValueItem
						showValue={displayName.length < 4 || !showTwoColumns}
						value={controlProps.value}
						data={itemData}
						onClick={controlProps.handleOnClickVar}
						key={`${data?.type || typeKey}-${_index}-${keySuffix}`}
						name={displayName}
						type={data?.type || typeKey}
						valueType="variable"
						isCurrent={
							isValid(controlProps.value) &&
							controlProps.value.settings.type ===
								(data?.type || typeKey) &&
							controlProps.value.settings.id === itemData.id
						}
						icon={getVariableIcon({
							type: data?.type || typeKey,
							value: variable.value,
						})}
						status="active"
						style={{
							...(showTwoColumns
								? {
										gap: '5px',
										padding: '0px 4px 0px 6px',
										maxWidth: '118px',
									}
								: {}),
						}}
					/>
				);
			})}
		</ConditionalWrapper>
	);
}
