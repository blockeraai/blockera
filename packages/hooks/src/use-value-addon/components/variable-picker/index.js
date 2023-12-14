// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { Button, Flex, Popover } from '@publisher/components';
import { isBlockTheme } from '@publisher/utils';
import { controlInnerClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import {
	getVariables,
	getVariableIcon,
	generateVariableString,
	canUnlinkVariable,
	isValid,
} from '../../helpers';
import { PickerTypeHeader, PopoverValueItem } from '../index';
import PlusIcon from '../../icons/plus';
import UnlinkIcon from '../../icons/unlink';
import TrashIcon from '../../icons/trash';
import type { PointerProps } from '../pointer/types';

export default function ({
	pointerProps,
}: {
	pointerProps: PointerProps,
}): Element<any> {
	let noVariablesText = __('No variable!', 'publisher-core');
	const _isBlockTheme = isBlockTheme();

	const CustomVariables = (): Element<any> => {
		return (
			<Flex direction="column" key={`type-custom-variabes`} gap={'10px'}>
				<PickerTypeHeader>
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
				</PickerTypeHeader>

				<span style={{ opacity: '0.5', fontSize: '12px' }}>
					{__('Coming soon…', 'publisher-core')}
				</span>
			</Flex>
		);
	};

	const Variables = (): Array<Element<any>> => {
		return pointerProps.variableTypes.map((type, index) => {
			const data = getVariables(type);

			if (data?.name === '') {
				return <></>;
			}

			if (data.variables?.length === 0 && !_isBlockTheme) {
				noVariablesText = __(
					'Your theme is not a block theme.',
					'publisher-core'
				);
			}

			if (data.variables?.length === 0) {
				return (
					<Flex
						direction="column"
						key={`type-${type}-${index}`}
						gap={'10px'}
					>
						<PickerTypeHeader>
							<>{data.name}</>
						</PickerTypeHeader>

						<span style={{ opacity: '0.5', fontSize: '12px' }}>
							{noVariablesText}
						</span>
					</Flex>
				);
			}

			return (
				<Flex
					direction="column"
					key={`type-${type}-${index}`}
					gap={'10px'}
				>
					<PickerTypeHeader>
						<>{data.name}</>
					</PickerTypeHeader>

					{data.variables.map((variable, _index) => {
						const itemData = {
							...variable,
							type,
							reference: 'preset',
							var: generateVariableString({
								reference: 'preset',
								type,
								slug: variable.slug,
							}),
						};

						return (
							<PopoverValueItem
								value={pointerProps.value}
								data={itemData}
								onClick={pointerProps.handleOnClickVar}
								key={`${type}-${_index}-value-type`}
								name={variable.name}
								type={type}
								valueType="variable"
								isCurrent={
									isValid(pointerProps.value) &&
									pointerProps.value.settings.type === type &&
									pointerProps.value.settings.slug ===
										itemData.slug
								}
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
			onClose={() => pointerProps.setOpen('')}
			className={controlInnerClassNames('popover-variables')}
			titleButtonsRight={
				<>
					{canUnlinkVariable(pointerProps.value) && (
						<Button
							tabIndex="-1"
							size={'extra-small'}
							onClick={pointerProps.handleOnUnlinkVar}
							style={{ padding: '5px' }}
							label={__(
								'Unlink Variable Value',
								'publisher-core'
							)}
						>
							<UnlinkIcon />
						</Button>
					)}

					{isValid(pointerProps.value) && (
						<Button
							tabIndex="-1"
							size={'extra-small'}
							onClick={pointerProps.handleOnClickRemove}
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
				<Variables />

				<CustomVariables />
			</Flex>
		</Popover>
	);
}
