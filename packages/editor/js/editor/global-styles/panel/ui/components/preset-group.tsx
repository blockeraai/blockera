/**
 * External dependencies
 */
import React, { ElementType } from 'react';
import { __, sprintf } from '@wordpress/i18n';
import { useState, useCallback } from '@wordpress/element';

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
import { controlClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { AddVariableModal } from '.';
import type { VariablesType, VariableType } from './types.ts';
import { Container } from '../../../../../extensions/components';

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
};

const InserterComponent = ({
	callback,
	maxItems,
	variables,
	insertArgs,
	PlusButton,
	defaultPresetValue,
}: InserterComponentProps) => {
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);

	const existingSlugs = variables.map((s) => s.slug).filter(Boolean);

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
					headerTitle={__('Add Font Size', 'blockera')}
					description={__(
						'Name your new font size preset. The ID will be generated from the name and used in your styles.',
						'blockera'
					)}
					defaultName={defaultPresetValue.name}
					defaultSlug={defaultPresetValue.slug}
					existingSlugs={existingSlugs}
					onSave={callback}
					onClose={() => setIsAddModalOpen(false)}
					duplicateSlugMessage={__(
						'This ID is already used by another font size preset.',
						'blockera'
					)}
					controlNamePrefix="add-font-size"
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
	repeaterItemHeader: RepeaterItemHeader,
	...props
}: PresetsProps) => {
	const repeaterItemChildren = useCallback(
		({ item, itemId }: { item: VariableType; itemId: string | number }) => (
			<Container activeColor="#1ca120">
				<PresetFields
					sizes={variables}
					fontSize={item}
					origin={origin}
					presetId={itemId}
				/>
			</Container>
		),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[PresetFields, origin]
	);

	return (
		<RepeaterControl
			label={label}
			id={controlName}
			onChange={onChange}
			isSupportInserter={true}
			popoverTitle={popoverTitle}
			canAddNewItem={canAddNewItem}
			shouldConfirmDeleteDialog={true}
			repeaterItemHeader={RepeaterItemHeader}
			repeaterItemChildren={repeaterItemChildren}
			defaultRepeaterItemValue={defaultPresetValue}
			InserterComponent={(_props: InserterComponentProps) => (
				<InserterComponent
					{..._props}
					variables={variables}
					defaultPresetValue={defaultPresetValue}
				/>
			)}
			PromoComponent={({
				items,
				isOpen = false,
				onClose: _onClose = () => {},
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
						onClose={_onClose ? _onClose : () => {}}
					/>
				);
			}}
			className={controlClassNames('preset-group', controlName)}
			addNewButtonLabel={sprintf(
				/* translators: %s: Preset group title (e.g. Font Sizes, Spacing) */
				__('Add New %s', 'blockera'),
				title
			)}
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

	return (
		<Container activeColor="#1ca120">
			<ControlContextProvider
				value={{
					name: `${origin}-${title.replace(/\s/g, '-').toLowerCase()}`,
					value: variables,
				}}
				storeName={'blockera/controls/repeater'}
			>
				<BaseControl controlName={controlName} columns="columns-1">
					<Presets
						title={title}
						label={label}
						origin={origin}
						onClose={() => {}}
						onChange={onChange}
						variables={variables}
						controlName={controlName}
						PresetFields={PresetFields}
						popoverTitle={getPopoverTitle}
						canAddNewItem={'custom' === origin}
						repeaterItemHeader={repeaterItemHeader}
						defaultPresetValue={defaultPresetValue}
					/>
				</BaseControl>
			</ControlContextProvider>
		</Container>
	);
};
