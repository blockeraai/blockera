/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { ReactNode } from 'react';
import { useMemo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { noop } from '@blockera/utils';
import { controlInnerClassNames } from '@blockera/classnames';
import { RepeaterContextProvider, useControlContext } from '@blockera/controls';

export type TaxonomyRepeaterBridgeInnerProps = {
	controlId: string;
	defaultRepeaterItemValue: Record<string, unknown>;
	valueCleanup: (raw: unknown) => Record<string, unknown>;
	handleRepeaterRootChange: (payload: unknown) => void;
	children: ReactNode;
};

export function TaxonomyRepeaterBridgeInner({
	controlId,
	defaultRepeaterItemValue,
	valueCleanup,
	handleRepeaterRootChange,
	children,
}: TaxonomyRepeaterBridgeInnerProps) {
	const repeaterHook = useControlContext({
		defaultValue: {},
		sideEffect: true,
		repeater: {
			defaultRepeaterItemValue,
			repeaterId: undefined,
		},
		onChange: handleRepeaterRootChange,
		valueCleanup,
		mergeInitialAndDefault: true,
	});

	const { getControlPath } = useControlContext();

	const repeaterContextValue = useMemo(
		() => ({
			design: 'minimal',
			mode: 'popover',
			count: 0,
			setCount: noop,
			disableAddNewItem: false,
			setDisableAddNewItem: noop,
			popoverTitle: __('Edit Variable', 'blockera'),
			popoverOffset: 35,
			actionButtonsType: 'inline',
			actionMenuButtonLabel: null,
			popoverClassName: controlInnerClassNames('popover-variables'),
			maxItems: -1,
			minItems: 0,
			selectable: false,
			onSelectableItemActivate: undefined,
			shouldRenderRepeaterItem: undefined,
			showItemEditButton: false,
			actionButtonAdd: false,
			actionButtonVisibility: false,
			actionButtonDelete: false,
			actionButtonClone: false,
			actionButtonReset: false,
			disableRegenerateId: true,
			shouldConfirmDeleteModal: false,
			confirmDeleteModalProps: undefined,
			onChange: handleRepeaterRootChange,
			onDelete: noop,
			onReset: noop,
			controlId: repeaterHook.controlInfo?.name ?? controlId,
			repeaterId: undefined,
			overrideItem: undefined,
			valueCleanup,
			getControlPath,
			PromoComponent: undefined,
			itemIdGenerator: undefined,
			repeaterItemOpener: undefined,
			repeaterItemHeader: undefined,
			repeaterItemChildren: undefined,
			repeaterItemVariations: undefined,
			defaultRepeaterItemValue,
			enableCreatingStep: false,
			repeaterItems: repeaterHook.value,
			customProps: {},
			enablePromoCountOnRepeaterItemHeader: false,
			popoverProps: undefined,
			popoverTitleButtonsRight: undefined,
			labelPopoverTitle: undefined,
			labelDescription: undefined,
		}),
		[
			controlId,
			defaultRepeaterItemValue,
			getControlPath,
			handleRepeaterRootChange,
			repeaterHook.controlInfo?.name,
			repeaterHook.value,
			valueCleanup,
		]
	);

	return (
		<RepeaterContextProvider {...repeaterContextValue}>
			{children}
		</RepeaterContextProvider>
	);
}
