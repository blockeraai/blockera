/**
 * External dependencies
 */
import type {
	ComponentType,
	ElementType,
	MouseEvent as ReactMouseEvent,
} from 'react';
import {
	memo,
	useContext,
	useMemo,
	useState,
	useCallback,
} from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { isBoolean } from '@blockera/utils';
import { classNames, controlInnerClassNames } from '@blockera/classnames';
import {
	GroupControl,
	RepeaterContext,
	RepeaterItemVariationsPane,
	useControlContext,
	useVarPickerPresetContext,
} from '@blockera/controls';

/**
 * Internal dependencies
 */
import type { PresetFieldsPropsResolver } from '../preset-group';
import type { VariableType } from '../types';
import { buildPresetVariablePickerPayload } from '../variable-picker-preset-utils';
import { isTaxonomyPopoverOpenEvent } from './is-taxonomy-popover-open-event';
import { PresetTaxonomyPresetFields } from './taxonomy-preset-fields';
import { isPresetTaxonomyInterfaceSizeSmall } from './preset-taxonomy-utils';
import { usePresetTaxonomyEditSessionOptional } from '../preset-taxonomy/preset-taxonomy-edit-session-context';

type TaxonomyRepeaterCtx = {
	popoverTitle?: string;
	popoverClassName?: string;
	popoverProps?: Record<string, unknown>;
	design?: string;
	mode?: string;
	actionMenuButtonLabel?: string | null;
	repeaterItems?: Record<string, unknown>;
	controlId?: string | null;
	onChange?: (payload: unknown) => void;
	onSelectableItemActivate?: (
		itemId: string | number,
		row: Record<string, unknown>
	) => void;
	repeaterItemVariations?: ComponentType<{
		item: VariableType | Record<string, unknown>;
		itemId: string;
	}> | null;
	repeaterItemChildren?: ComponentType<{
		item: VariableType | Record<string, unknown>;
		itemId: string | number;
	}>;
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
	const [variationsAccordionOpen, setVariationsAccordionOpen] =
		useState(false);
	const rowVisible = item?.isVisible !== false;

	const interfaceSmall = useMemo(
		() => isPresetTaxonomyInterfaceSizeSmall(item),
		[item]
	);
	const pickerCtx = useVarPickerPresetContext();
	const repeaterCtx = useContext(RepeaterContext) as TaxonomyRepeaterCtx;
	const editSession = usePresetTaxonomyEditSessionOptional();
	const rowSlug = String(item.slug ?? itemId);

	const handlePopoverOpen = useCallback(() => {
		setOpen(true);
		editSession?.beginEditSession(rowSlug);
	}, [editSession, rowSlug]);

	const handlePopoverClose = useCallback(() => {
		editSession?.flushSession(rowSlug);
		editSession?.endEditSession(rowSlug);
		setOpen(false);
	}, [editSession, rowSlug]);

	const RepeaterItemVariations = repeaterCtx.repeaterItemVariations ?? null;
	const RepeaterItemChildren = repeaterCtx.repeaterItemChildren;

	const showVariationsBranch = Boolean(
		RepeaterItemVariations &&
		isBoolean(item?.hasVariations) &&
		item.hasVariations === true
	);

	let headerContextType: 'repeater' | 'taxonomy';
	if (showVariationsBranch) {
		headerContextType = 'repeater';
	} else if ((item as { baseSlug?: string }).baseSlug) {
		headerContextType = 'repeater';
	} else {
		headerContextType = 'taxonomy';
	}

	const {
		dispatch: { modifyControlValue },
		controlInfo: { name: controlStoreId },
	} = useControlContext();

	const itemsEffective = useMemo(() => {
		return (repeaterCtx.repeaterItems ?? {}) as Record<
			string,
			Record<string, unknown>
		>;
	}, [repeaterCtx.repeaterItems]);

	const storeRow =
		itemsEffective[String(itemId)] &&
		typeof itemsEffective[String(itemId)] === 'object' &&
		!Array.isArray(itemsEffective[String(itemId)])
			? (itemsEffective[String(itemId)] as Record<string, unknown>)
			: undefined;

	const selectableRow = Boolean(storeRow?.selectable);
	const isSelected = Boolean(storeRow?.isSelected);

	/** While taxonomy tree layout is frozen, repeater store still holds live field edits. */
	const itemForFields = useMemo(() => {
		if (!storeRow) {
			return item;
		}
		return { ...item, ...storeRow };
	}, [item, storeRow]);

	const itemForHeader = useMemo(() => {
		const base = storeRow ? { ...item, ...storeRow } : item;
		if (!selectableRow) {
			return base;
		}
		return {
			...base,
			selectable: true,
			isSelected,
		};
	}, [item, storeRow, selectableRow, isSelected]);

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
		<div className={controlInnerClassNames('repeater-item-header-holder')}>
			<RepeaterItemHeader
				contextType={headerContextType}
				enableVariationPickerStripSelection={true}
				item={itemForHeader}
				itemId={String(itemId)}
				isOpen={isOpen}
				setOpen={setOpen}
				isOpenPopoverEvent={isTaxonomyPopoverOpenEvent}
				variationsAccordionOpen={
					showVariationsBranch ? variationsAccordionOpen : false
				}
				showLeadingValuePreview={true}
			/>
		</div>
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

	const popoverTitle =
		repeaterCtx.popoverTitle || __('Edit Variable', 'blockera');
	const design = repeaterCtx.design ?? 'minimal';
	const mode = repeaterCtx.mode ?? 'popover';

	const presetFieldsFallback = (
		<PresetTaxonomyPresetFields
			item={itemForFields as unknown as VariableType}
			itemId={itemId}
			origin={origin}
			PresetFields={PresetFields}
			presetFieldsPropsResolver={presetFieldsPropsResolver}
		/>
	);

	const mainGroupControl = (
		<GroupControl
			mode={mode}
			design={design}
			toggleOpenBorder={true}
			isOpen={isOpen}
			onOpen={handlePopoverOpen}
			onClose={handlePopoverClose}
			disableAccordionOpenPrimaryBorder={'accordion' === mode}
			onClick={handleGroupClick}
			popoverTitle={popoverTitle}
			popoverClassName={repeaterCtx.popoverClassName}
			popoverProps={repeaterCtx.popoverProps}
			headerVariableSlug={headerVariableSlug}
			className={controlInnerClassNames('repeater-item-group', {
				'is-selected-item': selectableRow ? isSelected : false,
			})}
			header={headerNode}
			headerOpenButton={false}
		>
			{RepeaterItemChildren ? (
				<RepeaterItemChildren item={itemForFields} itemId={itemId} />
			) : (
				presetFieldsFallback
			)}
		</GroupControl>
	);

	const variationsGroupControl =
		RepeaterItemVariations && showVariationsBranch ? (
			<GroupControl
				mode="accordion"
				design={design}
				onClick={handleGroupClick}
				headerOpenButton={true}
				toggleOpenBorder={true}
				disableAccordionOpenPrimaryBorder={true}
				popoverProps={repeaterCtx.popoverProps}
				isOpen={variationsAccordionOpen}
				className={[
					controlInnerClassNames('repeater-item-group', {
						'is-selected-item': selectableRow ? isSelected : false,
						[controlInnerClassNames(
							'repeater-item-variations-group'
						)]: true,
					}),
					'blockera-preset-taxonomy-accordion',
				]
					.filter(Boolean)
					.join(' ')}
				onOpen={() => setVariationsAccordionOpen(true)}
				onClose={() => setVariationsAccordionOpen(false)}
				header={headerNode}
				headerVariableSlug={headerVariableSlug}
			>
				<RepeaterItemVariationsPane>
					<RepeaterItemVariations
						item={itemForFields}
						itemId={String(itemId)}
					/>
				</RepeaterItemVariationsPane>
			</GroupControl>
		) : null;

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
			{...(selectableRow && isSelected
				? { onClick: handleGroupClick }
				: {})}
		>
			{showVariationsBranch && variationsGroupControl
				? variationsGroupControl
				: mainGroupControl}
		</div>
	);
});
