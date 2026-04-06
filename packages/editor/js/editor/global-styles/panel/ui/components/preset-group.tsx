/**
 * External dependencies
 */
import React, { ElementType } from 'react';
import { __, sprintf } from '@wordpress/i18n';
import { useState, useCallback, useMemo, useContext } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	BaseControl,
	RepeaterControl,
	RepeaterContext,
	UpgradePrompt,
	ControlContextProvider,
	getRepeaterActiveItemsCount,
} from '@blockera/controls';
import { noop } from '@blockera/utils';
import { controlClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { AddVariableModal, getAllVariableSlugs } from '.';
import type {
	VariablesType,
	VariableType,
	AddVariableModalConfig,
} from './types.ts';
import { buildPresetAddModalConfig } from './preset-add-modal-config';
import { Container } from '../../../../../extensions/components';

export type { AddVariableModalConfig } from './types';

export type PresetFieldsPropsResolver = (
	item: VariableType | any,
	itemId: string | number,
	origin: string | string[]
) => Record<string, any>;

export type PresetGroupPropsType = {
	label: string;
	title: string;
	controlName: string;
	variables: VariablesType;
	origin: string | string[];
	PresetFields: React.ElementType;
	repeaterItemHeader: React.ComponentType<{
		itemId: string;
		isOpen: boolean;
		item: VariableType | any;
		children?: React.ReactNode;
		setOpen: (isOpen: boolean) => boolean;
		isOpenPopoverEvent: (event: React.MouseEvent) => boolean;
	}>;
	onChange: (newValue: Object) => void;
	defaultPresetValue: VariableType | any;
	addVariableModalConfig?: AddVariableModalConfig;
	presetFieldsPropsResolver?: PresetFieldsPropsResolver;
};

type PresetsProps = {
	label: string;
	title: string;
	controlName: string;
	onClose: () => void;
	canAddNewItem: boolean;
	defaultPresetValue: VariableType | any;
	variables: VariablesType;
	origin: string | string[];
	PresetFields: React.ElementType;
	repeaterItemHeader: PresetGroupPropsType['repeaterItemHeader'];
	onChange: (variables: VariablesType) => void;
	popoverTitle: string | ((itemId: string, item: VariableType) => string);
	addVariableModalConfig?: AddVariableModalConfig;
	presetFieldsPropsResolver?: PresetFieldsPropsResolver;
};

type InserterComponentProps = {
	maxItems: number;
	callback: () => void;
	PlusButton: ElementType;
	variables: VariablesType;
	insertArgs: {
		repeaterItems: object;
	};
	defaultPresetValue: VariableType | any;
	addVariableModalConfig?: AddVariableModalConfig;
};

const DEFAULT_ADD_VARIABLE_MODAL_CONFIG: AddVariableModalConfig =
	buildPresetAddModalConfig({
		headerTitle: __('Add Font Size', 'blockera'),
		newPresetTypeLabel: __('font size', 'blockera'),
		controlNamePrefix: 'add-font-size',
	});

const InserterComponent = ({
	callback,
	maxItems,
	insertArgs,
	PlusButton,
	defaultPresetValue,
	addVariableModalConfig = DEFAULT_ADD_VARIABLE_MODAL_CONFIG,
}: InserterComponentProps) => {
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const { repeaterItems } = useContext(RepeaterContext) as {
		repeaterItems: Record<string | number, any>;
	};

	const existingSlugs = getAllVariableSlugs(repeaterItems);

	const config = {
		...DEFAULT_ADD_VARIABLE_MODAL_CONFIG,
		...addVariableModalConfig,
	};

	return (
		<div>
			<PlusButton
				onClick={() => {
					if (
						Object.keys(insertArgs?.repeaterItems).length >=
						maxItems
					) {
						return;
					}

					setIsAddModalOpen(!isAddModalOpen);
				}}
				disabled={
					Object.keys(insertArgs?.repeaterItems).length >= maxItems
				}
				isFocus={isAddModalOpen}
			/>

			{isAddModalOpen && (
				<AddVariableModal
					headerTitle={config.headerTitle}
					description={config.description}
					defaultName={defaultPresetValue.name}
					defaultSlug={defaultPresetValue.slug}
					existingSlugs={existingSlugs}
					onSave={callback}
					onClose={() => setIsAddModalOpen(false)}
					duplicateSlugMessage={config.duplicateSlugMessage}
					controlNamePrefix={config.controlNamePrefix}
				/>
			)}
		</div>
	);
};

const PresetFieldsComponent = ({
	item,
	itemId,
	origin,
	PresetFields,
	presetFieldsPropsResolver,
}: {
	item: VariableType;
	itemId: string | number;
	origin: string | string[];
	PresetFields: React.ElementType;
	presetFieldsPropsResolver?: PresetFieldsPropsResolver;
}) => {
	const _props = useMemo(
		() => presetFieldsPropsResolver?.(item, itemId, origin) || {},
		[item, itemId, origin, presetFieldsPropsResolver]
	);

	return (
		<Container activeColor="#1ca120">
			<PresetFields {..._props} />
		</Container>
	);
};

const Presets = ({
	label,
	title,
	origin,
	onClose,
	onChange,
	variables,
	controlName,
	popoverTitle,
	PresetFields,
	canAddNewItem,
	defaultPresetValue,
	addVariableModalConfig,
	presetFieldsPropsResolver,
	repeaterItemHeader: RepeaterItemHeader,
	...props
}: PresetsProps) => {
	// Must list variables + defaultPresetValue so the add modal gets fresh name/slug when presets change.
	const renderInserter = useCallback(
		(_props: InserterComponentProps) => (
			<InserterComponent
				{..._props}
				variables={variables}
				defaultPresetValue={defaultPresetValue}
				addVariableModalConfig={addVariableModalConfig}
			/>
		),
		[addVariableModalConfig, variables, defaultPresetValue]
	);

	const renderPromo = useCallback(
		({
			items,
			isOpen = false,
			onClose: _onClose = noop,
		}: {
			isOpen: boolean;
			items: VariablesType;
			onClose: (isClose: boolean) => void;
		}): React.ReactNode | null => {
			if (getRepeaterActiveItemsCount(items) < 1) {
				return null;
			}

			return (
				<UpgradePrompt
					heading={sprintf(
						/* translators: %s: Preset group title (e.g. Font Sizes, Spacing) */
						__('Multiple %s', 'blockera'),
						title
					)}
					featuresList={[
						sprintf(
							/* translators: %s: Preset group title (e.g. Font Sizes, Spacing) */
							__('Multiple %s', 'blockera'),
							title
						),
						sprintf(
							/* translators: %s: Preset group title (e.g. Font Sizes, Spacing) */
							__('Advanced %s Settings', 'blockera'),
							title
						),
						sprintf(
							/* translators: %s: Preset group title (e.g. Font Sizes, Spacing) */
							__('Rename ID of %s Variable', 'blockera'),
							title
						),
						__('Premium Features', 'blockera'),
					]}
					isOpen={isOpen}
					onClose={_onClose ? _onClose : noop}
				/>
			);
		},
		[title]
	);

	const FieldsComponent = useCallback(
		({ item, itemId }: { item: VariableType; itemId: string | number }) => (
			<PresetFieldsComponent
				item={item}
				itemId={itemId}
				origin={origin}
				PresetFields={PresetFields}
				presetFieldsPropsResolver={presetFieldsPropsResolver}
			/>
		),
		[origin, PresetFields, presetFieldsPropsResolver]
	);

	return (
		<RepeaterControl
			label={label}
			id={controlName}
			onChange={onChange}
			isSupportInserter={true}
			popoverTitle={popoverTitle}
			PromoComponent={renderPromo}
			canAddNewItem={canAddNewItem}
			addNewButtonLabel={sprintf(
				/* translators: %s: Preset group title (e.g. Font Sizes, Spacing) */
				__('Add New %s', 'blockera'),
				title
			)}
			shouldConfirmDeleteDialog={true}
			InserterComponent={renderInserter}
			repeaterItemChildren={FieldsComponent}
			repeaterItemHeader={RepeaterItemHeader}
			defaultRepeaterItemValue={defaultPresetValue}
			className={controlClassNames('preset-group', controlName)}
			{...props}
		/>
	);
};

export const PresetGroup = ({
	label,
	title,
	origin,
	onChange,
	variables,
	controlName,
	PresetFields,
	repeaterItemHeader,
	defaultPresetValue,
	addVariableModalConfig,
	presetFieldsPropsResolver,
}: PresetGroupPropsType) => {
	const getPopoverTitle = useCallback(
		(itemId: string, item: VariableType): string => {
			return sprintf(
				/* translators: %s: Preset item name */
				__('Edit %s Preset', 'blockera'),
				item.name
			);
		},
		[]
	);

	const repeaterContextValue = useMemo(
		() => ({
			name: `${origin}-${title.replace(/\s/g, '-').toLowerCase()}`,
			value: variables,
		}),
		[origin, title, variables]
	);

	return (
		<Container activeColor="#1ca120">
			<ControlContextProvider
				value={repeaterContextValue}
				storeName={'blockera/controls/repeater'}
			>
				<BaseControl controlName={controlName} columns="columns-1">
					<Presets
						title={title}
						label={label}
						onClose={noop}
						origin={origin}
						onChange={onChange}
						variables={variables}
						controlName={controlName}
						PresetFields={PresetFields}
						popoverTitle={getPopoverTitle}
						canAddNewItem={'custom' === origin}
						repeaterItemHeader={repeaterItemHeader}
						defaultPresetValue={defaultPresetValue}
						addVariableModalConfig={addVariableModalConfig}
						presetFieldsPropsResolver={presetFieldsPropsResolver}
					/>
				</BaseControl>
			</ControlContextProvider>
		</Container>
	);
};
