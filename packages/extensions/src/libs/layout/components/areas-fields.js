// @flow
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useContext } from '@wordpress/element';

/**
 * External dependencies
 */
import type { Element } from 'react';

/**
 * Internal dependencies
 */
import { RepeaterContext } from '../../../../../controls/src/libs/repeater-control/context';
import { InputControl, BaseControl } from '@publisher/controls';
import { Flex } from '@publisher/components';
import { useControlContext } from '../../../../../controls/src/context';
import type { TAreasFieldItem as TFieldItem } from '../types/layout-props';

const AreasFields: TFieldItem = memo<TFieldItem>(
	({ itemId, item }: TFieldItem): Element<any> => {
		const {
			controlInfo: { name: controlId },
			dispatch: { changeRepeaterItem },
		} = useControlContext();
		const {
			repeaterId,
			getControlId,
			defaultRepeaterItemValue,
			customProps: { gridRows, gridColumns },
		} = useContext(RepeaterContext);

		return (
			<div id={`repeater-item-${itemId}`}>
				<InputControl
					repeaterItem={itemId}
					id={getControlId(itemId, 'name')}
					singularId={'name'}
					label={__('Name', 'publisher-core')}
					columns="columns-2"
					size="input"
					type="text"
					onChange={(name) =>
						changeRepeaterItem({
							controlId,
							repeaterId,
							itemId,
							value: { ...item, name },
						})
					}
					defaultValue={defaultRepeaterItemValue.name}
				/>

				<BaseControl
					columns="columns-2"
					label={__('Column', 'publisher-core')}
				>
					<Flex>
						<InputControl
							repeaterItem={itemId}
							id={getControlId(itemId, '[column-start]')}
							singularId={'[column-start]'}
							label={__('Start', 'publisher-core')}
							columns="columns-1"
							size="small"
							type="number"
							className="control-first label-center small-gap"
							onChange={(newValue) =>
								changeRepeaterItem({
									controlId,
									repeaterId,
									itemId,
									value: {
										...item,
										'column-start': newValue,
									},
								})
							}
							defaultValue={
								defaultRepeaterItemValue['column-start'] || ''
							}
							min={0}
							max={gridColumns.length}
						/>
						<InputControl
							repeaterItem={itemId}
							id={getControlId(itemId, '[column-end]')}
							singularId={'[column-end]'}
							label={__('End', 'publisher-core')}
							columns="columns-1"
							size="small"
							type="number"
							className="control-first label-center small-gap"
							onChange={(newValue) =>
								changeRepeaterItem({
									controlId,
									repeaterId,
									itemId,
									value: {
										...item,
										'column-end': newValue,
									},
								})
							}
							defaultValue={
								defaultRepeaterItemValue['column-end'] || ''
							}
							min={0}
							max={gridColumns.length}
						/>
					</Flex>
				</BaseControl>

				<BaseControl
					columns="columns-2"
					label={__('Row', 'publisher-core')}
				>
					<Flex>
						<InputControl
							repeaterItem={itemId}
							id={getControlId(itemId, '[row-start]')}
							singularId={'[row-start]'}
							label={__('Start', 'publisher-core')}
							columns="columns-1"
							size="small"
							type="number"
							className="control-first label-center small-gap"
							onChange={(newValue) =>
								changeRepeaterItem({
									controlId,
									repeaterId,
									itemId,
									value: {
										...item,
										'row-start': newValue,
									},
								})
							}
							defaultValue={
								defaultRepeaterItemValue['row-start'] || ''
							}
							min={0}
							max={gridRows.length}
						/>
						<InputControl
							repeaterItem={itemId}
							id={getControlId(itemId, '[row-end]')}
							singularId={'[row-end]'}
							label={__('End', 'publisher-core')}
							columns="columns-1"
							size="small"
							type="number"
							className="control-first label-center small-gap"
							onChange={(newValue) =>
								changeRepeaterItem({
									controlId,
									repeaterId,
									itemId,
									value: {
										...item,
										'row-end': newValue,
									},
								})
							}
							defaultValue={
								defaultRepeaterItemValue['row-end'] || ''
							}
							min={0}
							max={gridColumns.length}
						/>
					</Flex>
				</BaseControl>
			</div>
		);
	}
);
export default AreasFields;
