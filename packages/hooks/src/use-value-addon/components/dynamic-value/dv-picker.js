// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { Button, Flex, Popover, Grid } from '@publisher/components';
import { controlInnerClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import {
	getDynamicValueIcon,
	isValid,
	getDynamicValueItems,
} from '../../helpers';
import { PickerCategory, PickerValueItem } from '../index';
import TrashIcon from '../../icons/trash';
import type { ValueAddonControlProps } from '../control/types';

export default function ({
	controlProps,
}: {
	controlProps: ValueAddonControlProps,
}): Element<any> {
	const DynamicValues = (): Array<Element<any>> => {
		const categories = ['post', 'featured-image'];

		return categories.map((item, index) => {
			const data = getDynamicValueItems(
				item,
				controlProps.dynamicValueTypes
			);

			if (data?.name === '') {
				return <></>;
			}

			if (typeof data.items === 'undefined' || data.items?.length === 0) {
				return <></>;
			}

			return (
				<PickerCategory key={`type-${item}-${index}`} title={data.name}>
					<Grid gridTemplateColumns="120px 120px" gap="10px">
						{data.items.map((_item) => {
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
			title={__('Choose Dynamic Value', 'publisher-core')}
			offset={125}
			placement="left-start"
			onClose={() => {
				controlProps.setOpen('');
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
							label={__('Remove', 'publisher-core')}
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
