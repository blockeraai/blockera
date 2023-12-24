// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import {
	Button,
	Flex,
	Grid,
	Popover,
	ConditionalWrapper,
} from '@publisher/components';
import { controlInnerClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import {
	getVariableCategory,
	getVariableIcon,
	generateVariableString,
	canUnlinkVariable,
	isValid,
} from '../../helpers';
import { PickerValueItem, PickerCategory } from '../index';
import PlusIcon from '../../icons/plus';
import UnlinkIcon from '../../icons/unlink';
import TrashIcon from '../../icons/trash';
import type { ValueAddonControlProps } from '../control/types';

export default function ({
	controlProps,
	onClose,
}: {
	controlProps: ValueAddonControlProps,
	onClose?: () => void,
}): Element<any> {
	const CustomVariables = (): Element<any> => {
		return (
			<PickerCategory
				key={`type-custom-variabes`}
				title={
					<>
						{__('Custom Variables', 'publisher-core')}

						<Button
							size="extra-small"
							className={controlInnerClassNames('btn-add')}
							disabled={true}
							showTooltip={true}
							label={__(
								'Add New Variable (Coming soon…)',
								'publisher-core'
							)}
						>
							<PlusIcon />
						</Button>
					</>
				}
			>
				<span style={{ opacity: '0.5', fontSize: '12px' }}>
					{__('Coming soon…', 'publisher-core')}
				</span>
			</PickerCategory>
		);
	};

	const Variables = (): Array<Element<any>> => {
		return controlProps.variableTypes.map((type, index) => {
			const data = getVariableCategory(type);

			if (data?.name === '') {
				return <></>;
			}

			if (
				typeof data.variables === 'undefined' ||
				data.variables?.length === 0
			) {
				return (
					<PickerCategory
						key={`type-${type}-${index}`}
						title={data.name}
					>
						<span style={{ opacity: '0.5', fontSize: '12px' }}>
							{__('No variable!', 'publisher-core')}
						</span>
					</PickerCategory>
				);
			}

			const showTwoColumns = [
				'color',
				'linear-gradient',
				'radial-gradient',
				'spacing',
			].includes(type);

			return (
				<PickerCategory key={`type-${type}-${index}`} title={data.name}>
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
						{data.variables.map((variable, _index) => {
							const itemData = {
								...variable,
								type,
								var: generateVariableString({
									reference: variable.reference,
									type,
									slug: variable.slug,
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
										controlProps.value.settings.slug ===
											itemData.slug
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
			title={__('Choose Variable', 'publisher-core')}
			offset={125}
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
							label={__(
								'Unlink Variable Value',
								'publisher-core'
							)}
						>
							<UnlinkIcon />
						</Button>
					)}

					{isValid(controlProps.value) && (
						<Button
							tabIndex="-1"
							size={'extra-small'}
							onClick={controlProps.handleOnClickRemove}
							style={{ padding: '5px' }}
							label={__('Remove', 'publisher-core')}
						>
							<TrashIcon />
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
