/**
 * External dependencies
 */
import type { ElementType, MouseEvent as ReactMouseEvent } from 'react';
import { memo, useContext, useMemo, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { classNames, controlInnerClassNames } from '@blockera/classnames';
import {
	GroupControl,
	RepeaterContext,
	useControlContext,
	useVarPickerPresetContext,
} from '@blockera/controls';

/**
 * Internal dependencies
 */
import type { PresetFieldsPropsResolver } from '../preset-group';
import type { VariableType } from '../types';
import {
	applyVariablePickerRepeaterSelection,
	buildPresetVariablePickerPayload,
} from '../variable-picker-preset-utils';
import { isTaxonomyPopoverOpenEvent } from './is-taxonomy-popover-open-event';
import { PresetTaxonomyPresetFields } from './taxonomy-preset-fields';
import { isPresetTaxonomyInterfaceSizeSmall } from './preset-taxonomy-utils';

type TaxonomyRepeaterCtx = {
	popoverTitle?: string;
	popoverClassName?: string;
	popoverOffset?: number;
	repeaterItems?: Record<string, unknown>;
	controlId?: string | null;
	onChange?: (payload: unknown) => void;
	onSelectableItemActivate?: (
		itemId: string | number,
		row: Record<string, unknown>
	) => void;
};

export type PresetTaxonomyPopoverRowProps = {
	item: Record<string, unknown>;
	itemId: string | number;
	origin: string;
	PresetFields: ElementType;
	repeaterItemHeader: ElementType;
	presetFieldsPropsResolver?: PresetFieldsPropsResolver;
};

export const PresetTaxonomyPopoverRow = memo(function PresetTaxonomyPopoverRow({
	item,
	itemId,
	origin,
	PresetFields,
	presetFieldsPropsResolver,
	repeaterItemHeader: RepeaterItemHeader,
}: PresetTaxonomyPopoverRowProps) {
	const [isOpen, setOpen] = useState(false);
	const rowVisible = item?.isVisible !== false;

	const interfaceSmall = useMemo(
		() => isPresetTaxonomyInterfaceSizeSmall(item),
		[item]
	);
	const pickerCtx = useVarPickerPresetContext();
	const repeaterCtx = useContext(RepeaterContext) as TaxonomyRepeaterCtx;

	const {
		dispatch: { modifyControlValue },
		controlInfo: { name: controlStoreId },
	} = useControlContext();

	const itemsEffective = useMemo(() => {
		const raw = repeaterCtx.repeaterItems;
		if (
			pickerCtx.active !== true ||
			typeof pickerCtx.variableType !== 'string' ||
			!pickerCtx.controlProps
		) {
			return raw ?? {};
		}
		return applyVariablePickerRepeaterSelection(raw, {
			variableType: pickerCtx.variableType,
			origin,
			pickerValue: pickerCtx.controlProps.value,
		}) as Record<string, Record<string, unknown>>;
	}, [
		repeaterCtx.repeaterItems,
		pickerCtx.active,
		pickerCtx.variableType,
		pickerCtx.controlProps,
		origin,
	]);

	const storeRow =
		itemsEffective[String(itemId)] &&
		typeof itemsEffective[String(itemId)] === 'object' &&
		!Array.isArray(itemsEffective[String(itemId)])
			? (itemsEffective[String(itemId)] as Record<string, unknown>)
			: undefined;

	const selectableRow = Boolean(storeRow?.selectable);
	const isSelected = Boolean(storeRow?.isSelected);

	const itemForHeader = useMemo(() => {
		if (!selectableRow) {
			return item;
		}
		return {
			...item,
			selectable: true,
			isSelected,
		};
	}, [item, selectableRow, isSelected]);

	let headerVariableSlug: string | undefined;
	if (!selectableRow) {
		headerVariableSlug = undefined;
	} else if (
		item.slug !== null &&
		item.slug !== undefined &&
		String(item.slug) !== ''
	) {
		headerVariableSlug = String(item.slug);
	} else if (
		item.id !== null &&
		item.id !== undefined &&
		String(item.id) !== ''
	) {
		headerVariableSlug = String(item.id);
	} else {
		headerVariableSlug = String(itemId);
	}

	const headerNode = (
		<RepeaterItemHeader
			contextType="taxonomy"
			item={itemForHeader}
			itemId={String(itemId)}
			isOpen={isOpen}
			setOpen={setOpen}
			isOpenPopoverEvent={isTaxonomyPopoverOpenEvent}
			variationsAccordionOpen={false}
			showLeadingValuePreview={true}
		/>
	);

	const controlId =
		typeof repeaterCtx.controlId === 'string' &&
		repeaterCtx.controlId !== ''
			? repeaterCtx.controlId
			: controlStoreId;

	const handleGroupClick = (
		event?: ReactMouseEvent<HTMLElement> | MouseEvent
	): boolean | void => {
		if (!selectableRow) {
			return true;
		}

		const target = event?.target;
		if (
			target instanceof Element &&
			target.closest(`.${controlInnerClassNames('action-buttons')}`)
		) {
			return false;
		}

		const newItems: Record<string, unknown> = {};
		Object.entries(itemsEffective).forEach(([id, row]) => {
			if (!row || typeof row !== 'object' || Array.isArray(row)) {
				newItems[id] = row;
				return;
			}
			const r = row as Record<string, unknown>;
			newItems[id] =
				id === String(itemId)
					? { ...r, isSelected: true }
					: { ...r, isSelected: false };
		});

		modifyControlValue({
			controlId,
			value: newItems,
		});

		if (typeof repeaterCtx.onChange === 'function') {
			repeaterCtx.onChange({
				modifyControlValue,
				controlId,
				value: newItems,
			});
		}

		const activated = newItems[String(itemId)] as Record<string, unknown>;

		if (typeof repeaterCtx.onSelectableItemActivate === 'function') {
			repeaterCtx.onSelectableItemActivate(itemId, activated);
		} else if (
			pickerCtx.controlProps?.handleOnClickVar &&
			typeof pickerCtx.variableType === 'string'
		) {
			const payload = buildPresetVariablePickerPayload(
				activated,
				origin,
				pickerCtx.variableType
			);
			pickerCtx.controlProps.handleOnClickVar(payload as never);
		}
	};

	return (
		<div
			className={classNames(
				controlInnerClassNames(
					'repeater-item',
					rowVisible ? ' is-active' : ' is-inactive'
				),
				'blockera-preset-taxonomy-row',
				interfaceSmall &&
					'blockera-preset-taxonomy-row--interface-small'
			)}
			data-cy="repeater-item"
			data-id={String(itemId)}
			data-test={String(itemId)}
		>
			<GroupControl
				mode="popover"
				design="minimal"
				toggleOpenBorder={true}
				isOpen={isOpen}
				onOpen={() => setOpen(true)}
				onClose={() => setOpen(false)}
				onClick={handleGroupClick}
				popoverTitle={
					repeaterCtx.popoverTitle || __('Edit Variable', 'blockera')
				}
				popoverOffset={repeaterCtx.popoverOffset ?? 35}
				popoverClassName={repeaterCtx.popoverClassName}
				actionButtonsType="inline"
				actionMenuButtonLabel={__('More Options', 'blockera')}
				headerVariableSlug={headerVariableSlug}
				className={controlInnerClassNames('repeater-item-group', {
					'is-selected-item': selectableRow ? isSelected : false,
				})}
				header={headerNode}
				headerOpenButton={true}
			>
				<PresetTaxonomyPresetFields
					item={item as unknown as VariableType}
					itemId={itemId}
					origin={origin}
					PresetFields={PresetFields}
					presetFieldsPropsResolver={presetFieldsPropsResolver}
				/>
			</GroupControl>
		</div>
	);
});
