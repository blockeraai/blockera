/**
 * External dependencies
 */
import React, { ElementType } from 'react';
import { __, sprintf } from '@wordpress/i18n';
import { useState, useCallback, useMemo, useRef } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	BaseControl,
	RepeaterControl,
	PromotionPopover,
	ControlContextProvider,
	getRepeaterActiveItemsCount,
} from '@blockera/controls';
import { noop } from '@blockera/utils';
import { controlClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { AddVariableModal } from '.';
import type { VariablesType, VariableType } from './types.ts';
import { Container } from '../../../../../extensions/components';

export type AddVariableModalConfig = {
	headerTitle: string;
	description?: string;
	duplicateSlugMessage?: string;
	controlNamePrefix?: string;
};

export type PresetFieldsPropsResolver = (
	item: VariableType | any,
	itemId: string | number,
	origin: string | string[],
	variables: VariablesType
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

const defaultPresetFieldsPropsResolver: PresetFieldsPropsResolver = (
	item,
	itemId,
	origin,
	variables
) => ({
	sizes: variables,
	fontSize: item,
	origin,
	presetId: itemId,
});

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

const DEFAULT_ADD_VARIABLE_MODAL_CONFIG: AddVariableModalConfig = {
	headerTitle: __('Add Font Size', 'blockera'),
	description: __(
		'Name your new font size preset. The ID will be generated from the name and used in your styles.',
		'blockera'
	),
	duplicateSlugMessage: __(
		'This ID is already used by another font size preset.',
		'blockera'
	),
	controlNamePrefix: 'add-font-size',
};

const InserterComponent = ({
	callback,
	maxItems,
	variables,
	insertArgs,
	PlusButton,
	defaultPresetValue,
	addVariableModalConfig = DEFAULT_ADD_VARIABLE_MODAL_CONFIG,
}: InserterComponentProps) => {
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);

	const existingSlugs = variables.map((s) => s.slug).filter(Boolean);
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
	repeaterItemHeader: RepeaterItemHeader,
	presetFieldsPropsResolver,
	...props
}: PresetsProps) => {
	// `variables` updates on every field edit; listing it in useCallback deps forces a new
	// repeaterItemChildren / renderInserter each time and can remount repeater rows (focus loss).
	// Refs keep callback identities stable while always reading the latest values when invoked.
	const variablesRef = useRef(variables);
	variablesRef.current = variables;

	const originRef = useRef(origin);
	originRef.current = origin;

	const defaultPresetValueRef = useRef(defaultPresetValue);
	defaultPresetValueRef.current = defaultPresetValue;

	const addVariableModalConfigRef = useRef(addVariableModalConfig);
	addVariableModalConfigRef.current = addVariableModalConfig;

	const presetFieldsPropsResolverRef = useRef<PresetFieldsPropsResolver>(
		presetFieldsPropsResolver ?? defaultPresetFieldsPropsResolver
	);
	presetFieldsPropsResolverRef.current =
		presetFieldsPropsResolver ?? defaultPresetFieldsPropsResolver;

	const repeaterItemChildren = useCallback(
		({ item, itemId }: { item: VariableType; itemId: string | number }) => (
			<Container activeColor="#1ca120">
				<PresetFields
					{...presetFieldsPropsResolverRef.current(
						item,
						itemId,
						originRef.current,
						variablesRef.current
					)}
				/>
			</Container>
		),
		[PresetFields]
	);

	const renderInserter = useCallback(
		(_props: InserterComponentProps) => (
			<InserterComponent
				{..._props}
				variables={variablesRef.current}
				defaultPresetValue={defaultPresetValueRef.current}
				addVariableModalConfig={addVariableModalConfigRef.current}
			/>
		),
		[]
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
				<PromotionPopover
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
			repeaterItemHeader={RepeaterItemHeader}
			repeaterItemChildren={repeaterItemChildren}
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
