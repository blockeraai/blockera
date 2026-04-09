/**
 * External dependencies
 */
import React from 'react';
import { __, sprintf } from '@wordpress/i18n';
import { useCallback, useMemo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	BaseControl,
	RepeaterControl,
	UpgradePrompt,
	ControlContextProvider,
	getRepeaterActiveItemsCount,
} from '@blockera/controls';
import { noop } from '@blockera/utils';
import { controlClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import type { VariablesType, VariableType } from './types.ts';
import { PresetStateContainer } from './preset-state-container';
import { getPresetDeleteConfirmWarningText } from './preset-origin-utils';

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
	presetFieldsPropsResolver?: PresetFieldsPropsResolver;
	/**
	 * When true, new presets get `creatingStep` until the repeater row is closed once.
	 *
	 * @default true
	 */
	enableCreatingStep?: boolean;
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
	presetFieldsPropsResolver?: PresetFieldsPropsResolver;
	enableCreatingStep?: boolean;
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
		<PresetStateContainer activeColor="#1ca120">
			<PresetFields {..._props} />
		</PresetStateContainer>
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
	presetFieldsPropsResolver,
	enableCreatingStep = true,
	repeaterItemHeader: RepeaterItemHeader,
	...props
}: PresetsProps) => {
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

	const deleteConfirmWarningText = useMemo(
		() => getPresetDeleteConfirmWarningText(origin, title),
		[origin, title]
	);

	return (
		<RepeaterControl
			label={label}
			id={controlName}
			onChange={onChange}
			popoverTitle={popoverTitle}
			PromoComponent={renderPromo}
			canAddNewItem={canAddNewItem}
			addNewButtonLabel={sprintf(
				/* translators: %s: Preset group title (e.g. Font Sizes, Spacing) */
				__('Add New %s', 'blockera'),
				title
			)}
			shouldConfirmDeleteModal={true}
			deleteConfirmWarningText={deleteConfirmWarningText}
			repeaterItemChildren={FieldsComponent}
			repeaterItemHeader={RepeaterItemHeader}
			defaultRepeaterItemValue={defaultPresetValue}
			enableCreatingStep={enableCreatingStep}
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
	presetFieldsPropsResolver,
	enableCreatingStep = true,
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
			needUpdate: () => false,
		}),
		[origin, title, variables]
	);

	return (
		<PresetStateContainer activeColor="#1ca120">
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
						presetFieldsPropsResolver={presetFieldsPropsResolver}
						enableCreatingStep={enableCreatingStep}
					/>
				</BaseControl>
			</ControlContextProvider>
		</PresetStateContainer>
	);
};
