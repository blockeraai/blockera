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
import { PickerTypeHeader, PopoverValueItem } from '../index';
import TrashIcon from '../../icons/trash';
import type { PointerProps } from '../pointer/types';

export default function ({
	pointerProps,
}: {
	pointerProps: PointerProps,
}): Element<any> {
	const DynamicValues = (): Array<Element<any>> => {
		const categories = ['post', 'featured-image'];

		return categories.map((item, index) => {
			const data = getDynamicValueItems(
				item,
				pointerProps.dynamicValueTypes
			);

			if (data?.name === '') {
				return <></>;
			}

			if (typeof data.items === 'undefined' || data.items?.length === 0) {
				return <></>;
			}

			return (
				<Flex
					direction="column"
					key={`type-${item}-${index}`}
					gap={'10px'}
				>
					<PickerTypeHeader>
						<>{data.name}</>
					</PickerTypeHeader>

					<Grid gridTemplateColumns="120px 120px" gap="10px">
						{data.items.map((_item, _index) => {
							const itemData = {
								..._item,
							};

							return (
								<PopoverValueItem
									value={pointerProps.value}
									data={itemData}
									onClick={pointerProps.handleOnClickDV}
									key={`${item}-${_index}-value-type`}
									name={_item.name}
									type={_item.type}
									valueType="dynamic-value"
									isCurrent={
										isValid(pointerProps.value) &&
										pointerProps.value.settings.id ===
											itemData.id
									}
									icon={getDynamicValueIcon(itemData.type)}
								/>
							);
						})}
					</Grid>
				</Flex>
			);
		});
	};

	return (
		<Popover
			title={__('Choose Dynamic Value', 'publisher-core')}
			offset={125}
			placement="left-start"
			onClose={() => {
				pointerProps.setOpenDV(false);
			}}
			className={controlInnerClassNames('popover-dynamic-values')}
			titleButtonsRight={
				<>
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
				<DynamicValues />
			</Flex>
		</Popover>
	);
}
