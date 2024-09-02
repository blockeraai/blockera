// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import {
	STORE_NAME,
	generateVariableString,
	type DynamicVariableGroup,
} from '@blockera/data';
import { Icon } from '@blockera/icons';
import { controlInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import {
	getVariableIcon,
	canUnlinkVariable,
	getVariableCategory,
} from '../../helpers';
import { isValid } from '../../utils';
import type { VariableCategoryDetail } from '../../types';
import { PickerValueItem, PickerCategory } from '../index';
import type { ValueAddonControlProps } from '../control/types';
import { Button, Flex, Grid, Popover, ConditionalWrapper } from '../../../';

export default function ({
	controlProps,
	onClose,
	popoverOffset = 125,
}: {
	controlProps: ValueAddonControlProps,
	onClose?: () => void,
	popoverOffset?: number,
}): Element<any> {
	const CustomVariables = (): Element<any> => {
		return (
			<PickerCategory
				key={`type-custom-variables`}
				title={
					<>
						{__('Custom Variables', 'blockera')}

						<Button
							size="extra-small"
							className={controlInnerClassNames('btn-add')}
							disabled={true}
							showTooltip={true}
							label={__(
								'Add New Variable (Coming soon…)',
								'blockera'
							)}
						>
							<Icon icon="plus" iconSize="20" />
						</Button>
					</>
				}
			>
				<span style={{ opacity: '0.5', fontSize: '12px' }}>
					{__('Coming soon…', 'blockera')}
				</span>
			</PickerCategory>
		);
	};

	const Variables = (): Array<Element<any>> => {
		const { getVariableGroups } = select(STORE_NAME);

		return [
			...controlProps.variableTypes,
			...Object.keys(getVariableGroups()),
		].map((type, index) => {
			let data: DynamicVariableGroup | VariableCategoryDetail =
				getVariableCategory(type);

			if (data?.label === '') {
				const { getVariableGroup } = select(STORE_NAME);

				data = getVariableGroup(type);

				if (
					!data?.type ||
					!controlProps.variableTypes.includes(data.type)
				) {
					return <></>;
				}
			}

			if (data.items?.length === 0) {
				return (
					<PickerCategory
						key={`type-${type}-${index}`}
						title={data.label}
					>
						<span style={{ opacity: '0.5', fontSize: '12px' }}>
							{__('No variable!', 'blockera')}
						</span>
					</PickerCategory>
				);
			}

			const showTwoColumns = [
				'color',
				'linear-gradient',
				'radial-gradient',
				'spacing',
			].includes(data.type || type);

			return (
				<PickerCategory
					key={`type-${type}-${index}`}
					title={data.label}
				>
					<ConditionalWrapper
						condition={showTwoColumns}
						wrapper={(children) => (
							<Grid gridTemplateColumns="120px 120px" gap="10px">
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
							? Object.values(data.items)
							: data.items
						).map((variable, _index) => {
							const itemData = {
								...variable,
								type,
								var: generateVariableString({
									reference: variable.reference,
									type,
									id: variable.id,
								}),
							};

							return (
								<PickerValueItem
									showValue={
										variable.name.length < 4 ||
										!showTwoColumns
									}
									value={controlProps.value}
									data={itemData}
									onClick={controlProps.handleOnClickVar}
									key={`${type}-${_index}-value-type`}
									name={variable.name}
									type={type}
									valueType="variable"
									isCurrent={
										isValid(controlProps.value) &&
										controlProps.value.settings.type ===
											type &&
										controlProps.value.settings.id ===
											itemData.id
									}
									icon={getVariableIcon({
										type,
										value: variable.value,
									})}
									status="active"
									style={{
										...(showTwoColumns
											? {
													gap: '5px',
													padding: '0px 4px 0px 6px',
											  }
											: {}),
									}}
								/>
							);
						})}
					</ConditionalWrapper>
				</PickerCategory>
			);
		});
	};

	return (
		<Popover
			title={__('Choose Variable', 'blockera')}
			offset={popoverOffset}
			placement="left-start"
			onClose={() => {
				controlProps.setOpen('');
				if (onClose) onClose();
			}}
			className={controlInnerClassNames('popover-variables')}
			titleButtonsRight={
				<>
					{canUnlinkVariable(controlProps.value) && (
						<Button
							tabIndex="-1"
							size={'extra-small'}
							onClick={controlProps.handleOnUnlinkVar}
							style={{ padding: '5px' }}
							label={__('Unlink Variable Value', 'blockera')}
						>
							<Icon icon="unlink" iconSize="20" />
						</Button>
					)}

					{isValid(controlProps.value) && (
						<Button
							tabIndex="-1"
							size={'extra-small'}
							onClick={controlProps.handleOnClickRemove}
							style={{ padding: '5px' }}
							label={__('Remove', 'blockera')}
						>
							<Icon icon="trash" iconSize="20" />
						</Button>
					)}
				</>
			}
		>
			<Flex direction="column" gap="25px">
				<CustomVariables />

				<Variables />
			</Flex>
		</Popover>
	);
}
