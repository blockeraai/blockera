// @flow

/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * publisher dependencies
 */
import { Popover } from '@publisher/components';
import {
	ToggleSelectControl,
	InputControl,
	CheckboxControl,
	NoticeControl,
	ControlContextProvider,
} from '@publisher/controls';
import { useBlockContext } from '../../../hooks';
import { generateExtensionId } from '../../../libs/utils';

/**
 * Internal dependencies
 */
import { default as GridIcon } from '../icons/grid-column';

export const SizeSetting = ({
	item,
	block,
	popoverTitle,
	items,
	attributeId,
}) => {
	const { handleOnChangeAttributes } = useBlockContext();

	const filteredItems = items.value.filter((_item) => _item.id !== item.id);
	const currentItemIndex = items.value.findIndex(
		(_item) => _item.id === item.id
	);

	const isAutoFitEnabled =
		item['auto-fit'] ||
		items.value
			.map((item) => {
				if (item['auto-generated']) return item;
				if (item['auto-fit']) return null;
				if (
					item['sizing-mode'] === 'normal' &&
					(item.size.slice(-2) === 'fr' || item.size === 'auto')
				)
					return null;

				if (
					item['sizing-mode'] === 'min/max' &&
					item['min-size'] === 'auto' &&
					item['max-size'] === 'auto'
				)
					return null;
				if (
					item['sizing-mode'] === 'min/max' &&
					item['min-size'] === 'auto' &&
					item['max-size'].slice(-2) === 'fr'
				)
					return null;

				return item;
			})
			.every((item) => item !== null);

	return (
		<Popover
			title={
				<>
					<span
						className={`popover-icon ${
							popoverTitle === 'row' ? 'reverse' : ''
						}`}
					>
						<GridIcon />
					</span>

					{sprintf(
						// translators: %s is a shape name.
						__('%s ', 'publisher-core'),
						popoverTitle
					)}
				</>
			}
		>
			<ControlContextProvider
				value={{
					name: generateExtensionId(block, 'grid-sizing-mode'),
					value: item,
					attributeId,
					blockName: block.blockName,
				}}
			>
				<ToggleSelectControl
					id={"['sizing-mode']"}
					singularId={"['sizing-mode']"}
					label={__('Sizing Mode', 'publisher-core')}
					columns="columns-2"
					options={[
						{
							label: __('Normal', 'publisher-core'),
							value: 'normal',
						},
						{
							label: __('Min / Max', 'publisher-core'),
							value: 'min/max',
						},
					]}
					onChange={(newValue: string, ref: Object): void => {
						if (newValue === 'min/max') {
							handleOnChangeAttributes(
								attributeId,
								{
									...items,
									value: [
										...filteredItems.slice(
											0,
											currentItemIndex
										),
										{
											...item,
											'sizing-mode': newValue,
											'min-size': '150px',
											'max-size': item.size,
										},
										...filteredItems.slice(
											currentItemIndex
										),
									],
								},
								{
									ref,
								}
							);
						} else {
							handleOnChangeAttributes(
								attributeId,
								{
									...items,
									value: [
										...filteredItems.slice(
											0,
											currentItemIndex
										),
										{ ...item, 'sizing-mode': newValue },
										...filteredItems.slice(
											currentItemIndex
										),
									],
								},
								{
									ref,
								}
							);
						}
					}}
					defaultValue={item['sizing-mode'] || ''}
				/>

				{item['sizing-mode'] === 'normal' ? (
					<InputControl
						id={'size'}
						label={__('Size', 'publisher-core')}
						columns="columns-2"
						unitType={item['auto-fit'] ? 'essential' : 'grid-size'}
						range={true}
						min={0}
						onChange={(size: string, ref: Object): void =>
							handleOnChangeAttributes(
								attributeId,
								{
									...items,
									value: [
										...filteredItems.slice(
											0,
											currentItemIndex
										),
										{ ...item, size },
										...filteredItems.slice(
											currentItemIndex
										),
									],
								},
								{
									ref,
								}
							)
						}
						defaultValue={item.size || ''}
						controlAddonTypes={['variable']}
						variableTypes={['width-size']}
					/>
				) : (
					<>
						<InputControl
							id={"['min-size']"}
							singularId={"['min-size']"}
							label={__('Min', 'publisher-core')}
							columns="columns-2"
							unitType={item['auto-fit'] ? 'essential' : 'width'}
							range={true}
							min={0}
							onChange={(newValue: string, ref: Object): void =>
								handleOnChangeAttributes(
									attributeId,
									{
										...items,
										value: [
											...filteredItems.slice(
												0,
												currentItemIndex
											),
											{ ...item, 'min-size': newValue },
											...filteredItems.slice(
												currentItemIndex
											),
										],
									},
									{
										ref,
									}
								)
							}
							defaultValue={item['min-size'] || ''}
							controlAddonTypes={['variable']}
							variableTypes={['width-size']}
						/>

						<InputControl
							id={"['max-size']"}
							singularId={"['max-size']"}
							label={__('Max', 'publisher-core')}
							columns="columns-2"
							unitType="grid-size"
							range={true}
							min={0}
							onChange={(newValue: string, ref: Object): void =>
								handleOnChangeAttributes(
									attributeId,
									{
										...items,
										value: [
											...filteredItems.slice(
												0,
												currentItemIndex
											),
											{ ...item, 'max-size': newValue },
											...filteredItems.slice(
												currentItemIndex
											),
										],
									},
									{
										ref,
									}
								)
							}
							defaultValue={item['max-size'] || ''}
							controlAddonTypes={['variable']}
							variableTypes={['width-size']}
						/>
					</>
				)}

				<>
					<CheckboxControl
						id={"['auto-fit']"}
						singularId={"['auto-fit']"}
						columns="columns-2"
						className="publisher-grid-auto-fit"
						checkboxLabel={__('', 'publisher-core')}
						label={__('Auto Fit', 'publisher-core')}
						disabled={!isAutoFitEnabled}
						onChange={(newValue: boolean, ref: Object): void =>
							handleOnChangeAttributes(
								attributeId,
								{
									...items,
									value: [
										...filteredItems.slice(
											0,
											currentItemIndex
										),
										{ ...item, 'auto-fit': newValue },
										...filteredItems.slice(
											currentItemIndex
										),
									],
								},
								{
									ref,
								}
							)
						}
						defaultValue={item['auto-fit'] || false}
					/>
					{!isAutoFitEnabled && (
						<NoticeControl
							type="information"
							style={{ marginTop: '10px', marginBottom: '10px' }}
						>
							{__(
								`Auto-fit cannot be enabled if there are columns or rows with 'auto', flexible (FR), minmax(auto, fr), minmax(auto, auto), or similar settings.`,
								'publisher-core'
							)}
						</NoticeControl>
					)}
				</>

				{/* <Button
					onClick={() => {
						const itemIndex = items.value.findIndex(
							(_item) => _item.id === item.id
						);

						const deletedAreas = publisherGridAreas
							.filter(
								(_item) =>
									_item['column-start'] === itemIndex + 1 &&
									_item['column-end'] === itemIndex + 2
							)
							.map(({ id }) => id);

						const mergedItems = publisherGridAreas.filter(
							(_item) =>
								_item.mergedArea &&
								(_item['column-start'] === itemIndex + 1 ||
									_item['column-end'] === itemIndex + 2)
						);

						const filteredAreas = publisherGridAreas.filter(
							(item) => !deletedAreas.includes(item.id)
						);

						const mutedMergedItems = mergedItems
							.map((_item) => {
								if (
									_item['column-start'] === itemIndex + 1 &&
									_item['column-end'] === itemIndex + 2
								) {
									return null;
								}
								if (_item['column-start'] === itemIndex + 1) {
									return {
										..._item,
										'column-end': itemIndex + 2,
									};
								}
								if (_item['column-end'] === itemIndex + 2) {
									return {
										..._item,
										'column-end': itemIndex + 1,
									};
								}
							})
							.filter((item) => item);

						const nextItems = publisherGridAreas
							.filter(
								(_item) =>
									_item['column-start'] > itemIndex + 1 &&
									_item['column-end'] > itemIndex + 2
							)
							.map((_item) => ({
								..._item,
								'column-start': _item['column-start'] - 1,
								'column-end': _item['column-end'] - 1,
							}));

						const prevItems = publisherGridAreas.filter(
							(_item) =>
								_item['column-start'] < itemIndex + 1 &&
								_item['column-end'] < itemIndex + 2
						);

						handleOnChangeAttributes(
							attributeId,
							{
								length: items.length - 1,
								value: [...filteredItems],
							},
							{
								addOrModifyRootItems: {
									publisherGridAreas: [
										...prevItems,
										...mutedMergedItems,
										...nextItems,
									],
								},
							}
						);
					}}
				>
					remove
				</Button> */}
			</ControlContextProvider>
		</Popover>
	);
};
