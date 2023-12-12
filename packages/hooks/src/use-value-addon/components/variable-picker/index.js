// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import type { ValueAddon, VariableTypes } from '../../types';
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

export default function ({
	value,
	types,
	onChoice,
	onClose,
	onUnlink,
	onRemove,
}: {
	value: ValueAddon,
	types: Array<VariableTypes>,
	onChoice: (event: SyntheticMouseEvent<EventTarget>) => void,
	onClose: (event: SyntheticMouseEvent<EventTarget>) => void,
	onUnlink: (event: SyntheticMouseEvent<EventTarget>) => void,
	onRemove: (event: SyntheticMouseEvent<EventTarget>) => void,
}): Element<any> {
	let noVariablesText = __('No variable!', 'publisher-core');
	const _isBlockTheme = isBlockTheme();

	const CustomVariables = (): Element => {
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
		return types.map((type, index) => {
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
								value={value}
								data={itemData}
								onClick={onChoice}
								key={`${type}-${_index}-value-type`}
								name={variable.name}
								type={type}
								valueType="variable"
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
			onClose={onClose}
			className={controlInnerClassNames('popover-variables')}
			titleButtonsRight={
				<>
					{canUnlinkVariable(value) && (
						<Button
							tabIndex="-1"
							size={'extra-small'}
							onClick={onUnlink}
							style={{ padding: '5px' }}
							label={__(
								'Unlink Variable Value',
								'publisher-core'
							)}
						>
							<UnlinkIcon />
						</Button>
					)}

					{isValid(value) && (
						<Button
							tabIndex="-1"
							size={'extra-small'}
							onClick={onRemove}
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
