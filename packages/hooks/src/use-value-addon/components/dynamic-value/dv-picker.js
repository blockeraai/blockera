// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { Button, Flex, Popover, Grid } from '@blockera/components';
import { controlInnerClassNames } from '@blockera/classnames';
import { STORE_NAME } from '@blockera/core-data';

/**
 * Internal dependencies
 */
import { getDynamicValueIcon, isValid } from '../../helpers';
import { PickerCategory, PickerValueItem } from '../index';
import TrashIcon from '../../icons/trash';
import type { ValueAddonControlProps } from '../control/types';
import { select } from '@wordpress/data';

export default function ({
	controlProps,
	onClose,
}: {
	controlProps: ValueAddonControlProps,
	onClose?: () => void,
}): Element<any> {
	const DynamicValues = (): Array<Element<any>> => {
		const { getDynamicValueGroups } = select(STORE_NAME);

		const groups = getDynamicValueGroups();

		return Object.entries(groups).map(([name, item], index) => {
			if (!item?.label || !item.items) {
				return <></>;
			}

			return (
				<PickerCategory
					key={`type-${name}-${index}`}
					title={item?.label}
				>
					<Grid gridTemplateColumns="120px 120px" gap="10px">
						{Object.values(item.items).map((_item) => {
							const itemData = {
								..._item,
							};

							return (
								<PickerValueItem
									value={controlProps.value}
									data={itemData}
									onClick={controlProps.handleOnClickDV}
									key={`${_item?.id}-value-type`}
									name={_item.name}
									type={_item.type}
									valueType="dynamic-value"
									isCurrent={
										controlProps.value?.id === itemData.id
									}
									icon={getDynamicValueIcon(itemData.type)}
									status={_item?.status}
								/>
							);
						})}
					</Grid>
				</PickerCategory>
			);
		});
	};

	return (
		<Popover
			title={__('Choose Dynamic Value', 'blockera')}
			offset={125}
			placement="left-start"
			onClose={() => {
				controlProps.setOpen('');
				if (onClose) onClose();
			}}
			className={controlInnerClassNames('popover-dynamic-values')}
			titleButtonsRight={
				<>
					{isValid(controlProps.value) && (
						<Button
							tabIndex="-1"
							size={'extra-small'}
							onClick={controlProps.handleOnClickRemove}
							style={{ padding: '5px' }}
							label={__('Remove', 'blockera')}
						>
							<TrashIcon />
						</Button>
					)}
				</>
			}
		>
			<Flex direction="column" gap="25px">
				<DynamicValues />
			</Flex>
		</Popover>
	);
}
