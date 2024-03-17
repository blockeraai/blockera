// @flow

/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * publisher dependencies
 */
import { Popover, Button } from '@publisher/components';
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
import { generateAreas } from '../utils';
import type { TSizeSettingProps } from '../types';

export const SizeSetting = ({
	item,
	block,
	popoverTitle,
	items,
	attributeId,
	extensionProps,
	onClose,
}: TSizeSettingProps): MixedElement => {
	const { handleOnChangeAttributes, getAttributes } = useBlockContext();

	const {
		publisherGridColumns,
		publisherGridRows,
		publisherGridAreas,
		publisherGridDirection,
	} = getAttributes();

	const filteredItems = items.value.filter((_item) => _item.id !== item.id);
	const currentItemIndex = items.value.findIndex(
		(_item) => _item.id === item.id
	);

	const notDeletable = publisherGridAreas.find((_item) => {
		if (attributeId === 'publisherGridColumns') {
			const colCoordinates = _item?.coordinates?.map(
				(coord) => `${coord['column-start']}/${coord['column-end']}`
			);

			if (
				_item['column-start'] === currentItemIndex + 1 &&
				_item['column-end'] === currentItemIndex + 2
			)
				return null;

			return colCoordinates?.includes(
				`${currentItemIndex + 1}/${currentItemIndex + 2}`
			);
		}

		const rowCoordinates = _item?.coordinates?.map(
			(coord) => `${coord['row-start']}/${coord['row-end']}`
		);

		if (
			_item['row-start'] === currentItemIndex + 1 &&
			_item['row-end'] === currentItemIndex + 2
		)
			return null;

		return rowCoordinates?.includes(
			`${currentItemIndex + 1}/${currentItemIndex + 2}`
		);
	});

	const isAutoFitEnabled =
		item['auto-fit'] ||
		items.value
			.map((item) => {
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
						// translators: %s is popover icon.
						__('%s ', 'publisher-core'),
						popoverTitle
					)}
				</>
			}
			offset={20}
			onClose={onClose}
		>
			<ControlContextProvider
				value={{
					name: generateExtensionId(
						block,
						`grid-sizing-${popoverTitle}-${item.id}`
					),
					value: item,
					attribute: attributeId,
					blockName: block.blockName,
					type: 'nested',
					hasSideEffect: true,
				}}
			>
				<ToggleSelectControl
					id={'sizing-mode'}
					singularId={'sizing-mode'}
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
										{
											...item,
											'sizing-mode': newValue,
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
						}
					}}
					defaultValue={'normal'}
					{...extensionProps}
				/>

				{item['sizing-mode'] === 'normal' ? (
					<InputControl
						id={'size'}
						singularId={'size'}
						label={__('Size', 'publisher-core')}
						columns="columns-2"
						unitType={item['auto-fit'] ? 'essential' : 'grid-size'}
						range={true}
						min={0}
						onChange={(size: string, ref: Object): void => {
							handleOnChangeAttributes(
								attributeId,
								{
									...items,
									value: [
										...filteredItems.slice(
											0,
											currentItemIndex
										),
										{ ...item, size, 'max-size': size },
										...filteredItems.slice(
											currentItemIndex
										),
									],
								},
								{
									ref,
								}
							);
						}}
						defaultValue={
							popoverTitle === 'column' ? '1fr' : 'auto'
						}
						controlAddonTypes={['variable']}
						variableTypes={['width-size']}
						{...extensionProps}
					/>
				) : (
					<>
						<InputControl
							id={'min-size'}
							singularId={'min-size'}
							label={__('Min', 'publisher-core')}
							columns="columns-2"
							unitType={
								item['auto-fit'] ? 'essential' : 'grid-min-size'
							}
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
											{
												...item,
												'min-size': newValue,
											},
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
							defaultValue={'150px'}
							controlAddonTypes={['variable']}
							variableTypes={['width-size']}
							{...extensionProps}
						/>

						<InputControl
							id={'max-size'}
							singularId={'max-size'}
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
											{
												...item,
												'max-size': newValue,
											},
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
							defaultValue={item.size}
							controlAddonTypes={['variable']}
							variableTypes={['width-size']}
							{...extensionProps}
						/>
					</>
				)}

				<>
					<CheckboxControl
						id={'auto-fit'}
						singularId={'auto-fit'}
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
						defaultValue={false}
						{...extensionProps}
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
				<Button
					disabled={notDeletable || items.length <= 1 ? true : false}
					onClick={() => {
						const filteredAreas = publisherGridAreas.filter(
							(_item) => {
								if (attributeId === 'publisherGridColumns') {
									return (
										_item['column-start'] !==
											currentItemIndex + 1 &&
										_item['column-end'] !==
											currentItemIndex + 2
									);
								}
								return (
									_item['row-start'] !==
										currentItemIndex + 1 &&
									_item['row-end'] !== currentItemIndex + 2
								);
							}
						);

						const mutedAreas = filteredAreas.map((_item) => {
							if (
								_item.mergedArea &&
								_item['column-start'] > currentItemIndex + 1 &&
								attributeId === 'publisherGridColumns'
							) {
								const updatedCoordinates =
									_item.coordinates?.map((coord) => {
										return {
											...coord,
											'column-start':
												coord['column-start'] - 1,
											'column-end':
												coord['column-end'] - 1,
										};
									});

								return {
									..._item,
									'column-start': _item['column-start'] - 1,
									'column-end': _item['column-end'] - 1,
									coordinates: updatedCoordinates,
								};
							}

							if (
								attributeId === 'publisherGridRows' &&
								_item['row-start'] > currentItemIndex + 1
							) {
								if (_item.mergedArea) {
									const updatedCoordinates =
										_item.coordinates?.map((coord) => {
											return {
												...coord,
												'row-start':
													coord['row-start'] - 1,
												'row-end': coord['row-end'] - 1,
											};
										});

									return {
										..._item,
										'row-start': _item['row-start'] - 1,
										'row-end': _item['row-end'] - 1,
										coordinates: updatedCoordinates,
									};
								}

								return {
									..._item,
									'row-start': _item['row-start'] - 1,
									'row-end': _item['row-end'] - 1,
								};
							}

							return _item;
						});

						handleOnChangeAttributes(
							attributeId,
							{
								length: items.length - 1,
								value: [...filteredItems],
							},
							{
								effectiveItems: {
									publisherGridAreas: generateAreas({
										gridRows:
											attributeId === 'publisherGridRows'
												? filteredItems
												: publisherGridRows.value,
										gridColumns:
											attributeId ===
											'publisherGridColumns'
												? filteredItems
												: publisherGridColumns.value,
										prevGridAreas: mutedAreas,
										publisherGridDirection,
									}),
								},
							}
						);
					}}
					data-test="delete"
				>
					{__('Delete', 'publisher-core')}
				</Button>

				{notDeletable && (
					<NoticeControl
						type="information"
						style={{ marginTop: '10px', marginBottom: '10px' }}
					>
						{notDeletable &&
							__(
								`It cannot be deleted because of mergedArea`,
								'publisher-core'
							)}
					</NoticeControl>
				)}
			</ControlContextProvider>
		</Popover>
	);
};
