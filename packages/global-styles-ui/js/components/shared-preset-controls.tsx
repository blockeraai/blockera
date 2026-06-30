/**
 * External dependencies
 */
import type { KeyboardEvent, ReactNode } from 'react';
import { __, sprintf } from '@wordpress/i18n';
import {
	memo,
	useState,
	useEffect,
	useLayoutEffect,
	useContext,
	useCallback,
	useMemo,
	useRef,
} from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { classNames, componentInnerClassNames } from '@blockera/classnames';
import {
	Flex,
	Button,
	InputControl,
	NoticeControl,
	CheckboxControl,
	DynamicHtmlFormatter,
	RepeaterContext,
	useControlContext,
	ControlContextProvider,
	Tooltip,
	TextAreaControl,
	useVarPickerPresetContext,
} from '@blockera/controls';

/**
 * Internal dependencies
 */
import { isSlugValid, normalizeVariablePresetSlug } from './utils';
import type { VariableType } from './types';
import {
	buildPresetWithDescriptionUpdate,
	getPresetDescription,
} from './preset-meta-utils';
import {
	useCanEditGlobalStyles,
	useCanEditCustomPresetFieldsInVariablePicker,
} from './use-global-styles-preset-edit';
import { usePresetVariationsStorageOptional } from '../context/preset-variations-context';
import { isNameBasedTaxonomyPreset } from './preset-taxonomy/parse-preset-name-taxonomy';
import { resolvePresetTaxonomyEditName } from './preset-taxonomy/taxonomy-meta';
import { usePresetTaxonomyEditSessionOptional } from './preset-taxonomy/preset-taxonomy-edit-session-context';

export interface SharedPresetControlsProps<
	T extends VariableType = VariableType,
> {
	name: string;
	slug: string;
	itemId: string | number;
	variable: T;
	allSlugs: Array<string>;
	children?: ReactNode;
}

function SharedPresetControlsComponent<T extends VariableType>({
	name,
	slug,
	itemId,
	variable,
	allSlugs,
	children,
}: SharedPresetControlsProps<T>) {
	const canEditGlobalStyles = useCanEditGlobalStyles();
	const canEditCustomPresetFieldsInPicker =
		useCanEditCustomPresetFieldsInVariablePicker();
	const pickerCtx = useVarPickerPresetContext();
	const isVariablePicker =
		pickerCtx.active === true && typeof pickerCtx.variableType === 'string';
	const canEditPresetFields =
		canEditGlobalStyles ||
		(isVariablePicker && canEditCustomPresetFieldsInPicker);
	const presetLocked = !canEditPresetFields;
	const editSession = usePresetTaxonomyEditSessionOptional();
	const storage = usePresetVariationsStorageOptional();
	const taxonomyNameSource = storage?.taxonomyNameSource;

	const committedTaxonomyName = useMemo(() => {
		if (
			!isNameBasedTaxonomyPreset(
				variable as Record<string, unknown>,
				taxonomyNameSource
			)
		) {
			return undefined;
		}
		const fullName = resolvePresetTaxonomyEditName(
			variable as Record<string, unknown>,
			taxonomyNameSource
		);
		return fullName !== '' ? fullName : undefined;
	}, [variable, taxonomyNameSource]);

	const persistedName = committedTaxonomyName ?? name;
	const slugKey = String(slug);
	const itemIdKey = String(itemId);
	const isCreating = variable.creatingStep === true;
	// Local drafts during creatingStep keep inputs stable; repeater rows still sync via changeRepeaterItem.
	const deferFieldEdits = Boolean(editSession) && !isCreating;
	const deferNameEdits = deferFieldEdits;
	// Description stays in a local draft during create to avoid textarea/store sync fights in the picker.
	const deferDescriptionEdits = deferFieldEdits || isCreating;

	const persistedDescription = useMemo(
		() => getPresetDescription(variable),
		[variable]
	);

	const [draftName, setDraftName] = useState(persistedName);
	const draftNameRef = useRef(persistedName);
	draftNameRef.current = draftName;

	const [draftDescription, setDraftDescription] =
		useState(persistedDescription);
	const draftDescriptionRef = useRef(persistedDescription);
	draftDescriptionRef.current = draftDescription;

	// ID field: locked while creating or until user clicks/focuses ID (then editable buffer).
	const [variableSlug, setVariableSlug] = useState(slug);
	const [isIdEditable, setIsIdEditable] = useState(false);
	const [isConfirmedSlugChange, setIsConfirmedSlugChange] = useState(false);
	const [hasUserEditedSinceUnlock, setHasUserEditedSinceUnlock] =
		useState(false);
	const presetIdFieldContainerRef = useRef<HTMLDivElement>(null);
	const focusIdInputAfterUnlockRef = useRef(false);

	// After explicit unlock only: move focus into the ID input (e.g. Edit button keeps focus on the button).
	useLayoutEffect(() => {
		if (!focusIdInputAfterUnlockRef.current || !isIdEditable) {
			return;
		}
		focusIdInputAfterUnlockRef.current = false;
		const input = presetIdFieldContainerRef.current?.querySelector(
			'input'
		) as HTMLInputElement | null | undefined;
		input?.focus();
	}, [isIdEditable]);

	// Sync when preset changes (e.g. navigation) or after first close (creatingStep → false).
	useEffect(() => {
		if (!deferNameEdits && !isCreating) {
			setDraftName(persistedName);
		}
	}, [persistedName, deferNameEdits, isCreating]);

	useEffect(() => {
		if (!deferDescriptionEdits) {
			setDraftDescription(persistedDescription);
		}
	}, [persistedDescription, deferDescriptionEdits]);

	useEffect(() => {
		setVariableSlug(slug);
		setIsIdEditable(false);
		setHasUserEditedSinceUnlock(false);
		setIsConfirmedSlugChange(false);
	}, [name, slug, variable.creatingStep]);

	const prevIsCreatingForDraftInitRef = useRef(isCreating);

	// Seed drafts only when creatingStep begins — not on each live name persist.
	useLayoutEffect(() => {
		const enteredCreating =
			!prevIsCreatingForDraftInitRef.current && isCreating;
		prevIsCreatingForDraftInitRef.current = isCreating;

		if (!enteredCreating) {
			return;
		}

		setDraftName(persistedName);
		setDraftDescription(persistedDescription);
	}, [isCreating, persistedName, persistedDescription]);

	// Auto-lock when user edits ID back to saved slug.
	useEffect(() => {
		if (isIdEditable && hasUserEditedSinceUnlock && variableSlug === slug) {
			setIsIdEditable(false);
			setHasUserEditedSinceUnlock(false);
		}
	}, [isIdEditable, hasUserEditedSinceUnlock, variableSlug, slug]);

	// ID display: while creating, preview slug from the current name without persisting it yet.
	const nameForSlugPreview =
		deferNameEdits || isCreating ? draftName : persistedName;
	let displayedSlug = slug;
	if (isCreating) {
		displayedSlug = normalizeVariablePresetSlug(nameForSlugPreview) || slug;
	} else if (isIdEditable) {
		displayedSlug = variableSlug;
	}

	const {
		controlInfo: { name: controlId },
		dispatch: { changeRepeaterItem, modifyControlValue },
	} = useControlContext();

	const { onChange, repeaterId, valueCleanup, repeaterItems } = useContext(
		RepeaterContext
	) as {
		repeaterId: string;
		onChange: (newValue: any) => void;
		valueCleanup: (value: any) => any;
		repeaterItems: Record<string, unknown>;
	};

	const creatingNamePersistTimeoutRef = useRef<ReturnType<
		typeof setTimeout
	> | null>(null);
	const CREATING_NAME_PERSIST_MS = 200;

	const clearCreatingNamePersistTimeout = useCallback(() => {
		if (creatingNamePersistTimeoutRef.current) {
			clearTimeout(creatingNamePersistTimeoutRef.current);
			creatingNamePersistTimeoutRef.current = null;
		}
	}, []);

	useEffect(
		() => clearCreatingNamePersistTimeout,
		[clearCreatingNamePersistTimeout]
	);

	const applyDeferredDescriptionToRow = useCallback(
		(row: Record<string, unknown>): Record<string, unknown> => {
			if (!deferDescriptionEdits) {
				return row;
			}

			return buildPresetWithDescriptionUpdate(
				row as T,
				draftDescriptionRef.current
			) as Record<string, unknown>;
		},
		[deferDescriptionEdits]
	);

	const buildPresetNameUpdateValue = useCallback(
		(
			nextName: string,
			{ syncCreatingSlug = false }: { syncCreatingSlug?: boolean } = {}
		): Record<string, unknown> => {
			const value: Record<string, unknown> = {
				...(variable as Record<string, unknown>),
				name: nextName,
			};

			if (syncCreatingSlug && variable.creatingStep === true) {
				const derivedSlug = normalizeVariablePresetSlug(nextName);
				if (derivedSlug) {
					value.slug = derivedSlug;
				}
			}

			return applyDeferredDescriptionToRow(value);
		},
		[variable, applyDeferredDescriptionToRow]
	);

	const persistCreatingNameToTheme = useCallback(
		(nextName: string) => {
			changeRepeaterItem({
				onChange,
				valueCleanup,
				controlId,
				repeaterId,
				itemId,
				value: buildPresetNameUpdateValue(nextName, {
					syncCreatingSlug: true,
				}),
			});
		},
		[
			buildPresetNameUpdateValue,
			changeRepeaterItem,
			controlId,
			itemId,
			onChange,
			repeaterId,
			valueCleanup,
		]
	);

	const syncCreatingNameToRepeaterStore = useCallback(
		(nextName: string) => {
			const updatedRow = buildPresetNameUpdateValue(nextName, {
				syncCreatingSlug: true,
			});

			modifyControlValue({
				controlId,
				value: {
					...repeaterItems,
					[itemId]: updatedRow,
				},
			});
		},
		[
			buildPresetNameUpdateValue,
			controlId,
			itemId,
			modifyControlValue,
			repeaterItems,
		]
	);

	const finalizeCreatingStepPersist = useCallback(() => {
		const nextName = String(draftNameRef.current ?? variable.name ?? '');
		const nextDescription = draftDescriptionRef.current;
		const derivedSlug = normalizeVariablePresetSlug(nextName);
		const descriptionChanged = nextDescription !== persistedDescription;
		const slugChanged =
			derivedSlug &&
			String((variable as Record<string, unknown>).slug ?? '') !==
				derivedSlug;

		if (!descriptionChanged && !slugChanged) {
			return;
		}

		const updatedItem = buildPresetWithDescriptionUpdate(
			buildPresetNameUpdateValue(nextName, {
				syncCreatingSlug: true,
			}) as T,
			nextDescription
		);

		changeRepeaterItem({
			onChange,
			valueCleanup,
			controlId,
			repeaterId,
			itemId,
			value: updatedItem,
		});
	}, [
		buildPresetNameUpdateValue,
		changeRepeaterItem,
		controlId,
		itemId,
		onChange,
		persistedDescription,
		repeaterId,
		valueCleanup,
		variable,
	]);

	const prevIsCreatingRef = useRef(isCreating);

	useLayoutEffect(() => {
		const wasCreating = prevIsCreatingRef.current;
		prevIsCreatingRef.current = isCreating;

		if (wasCreating && !isCreating) {
			clearCreatingNamePersistTimeout();
			finalizeCreatingStepPersist();
		}
	}, [
		isCreating,
		clearCreatingNamePersistTimeout,
		finalizeCreatingStepPersist,
	]);

	const flushPendingFieldEdits = useCallback(() => {
		const nextName = draftNameRef.current;
		const nextDescription = draftDescriptionRef.current;
		const nameChanged = nextName !== persistedName;
		const descriptionChanged = nextDescription !== persistedDescription;

		if (!nameChanged && !descriptionChanged) {
			return;
		}

		let value: Record<string, unknown>;

		if (nameChanged) {
			value = buildPresetNameUpdateValue(nextName, {
				syncCreatingSlug: true,
			});
		} else {
			value = { ...(variable as Record<string, unknown>) };
		}

		if (descriptionChanged) {
			value = buildPresetWithDescriptionUpdate(
				value as T,
				nextDescription
			) as Record<string, unknown>;
		} else {
			value = applyDeferredDescriptionToRow(value);
		}

		changeRepeaterItem({
			onChange,
			valueCleanup,
			controlId,
			repeaterId,
			itemId,
			value,
		});
	}, [
		applyDeferredDescriptionToRow,
		buildPresetNameUpdateValue,
		changeRepeaterItem,
		controlId,
		itemId,
		onChange,
		persistedDescription,
		persistedName,
		repeaterId,
		valueCleanup,
		variable,
	]);

	useEffect(() => {
		if (!editSession) {
			return;
		}
		editSession.registerFlush(slugKey, flushPendingFieldEdits);
		return () => {
			editSession.unregisterFlush(slugKey);
		};
	}, [editSession, flushPendingFieldEdits, slugKey]);

	// Flat repeater popovers mount these fields only while open; defer name persist + tree regroup until close.
	useLayoutEffect(() => {
		if (!editSession) {
			return;
		}
		editSession.beginEditSession(slugKey);
		return () => {
			editSession.flushSession(slugKey);
			editSession.endEditSession(slugKey);
		};
	}, [editSession, slugKey]);

	const displayedName =
		deferNameEdits || isCreating ? draftName : persistedName;
	const displayedDescription = deferDescriptionEdits
		? draftDescription
		: persistedDescription;

	const slugChanged = !isCreating && isIdEditable && variableSlug !== slug;
	const slugIsValid = isSlugValid(displayedSlug, allSlugs, slug);
	const showUndo = isIdEditable && variableSlug !== slug;
	const idFieldLocked = !isIdEditable;
	const showMutedIdStyle = idFieldLocked;
	// After creatingStep: locked ID uses read-only (not disabled) so click/focus can unlock; while creating, disabled blocks edits.
	const idClickToEdit = !isIdEditable;
	const allowIdUnlock = !presetLocked;
	const slugError =
		displayedSlug && !slugIsValid
			? (() => {
					const normalized =
						normalizeVariablePresetSlug(displayedSlug);
					const otherSlugs = allSlugs.filter((s) => s !== slug);
					return otherSlugs.some(
						(s) => normalizeVariablePresetSlug(s) === normalized
					)
						? __(
								'This ID is already used by another font size preset.',
								'blockera'
							)
						: __(
								'Invalid ID format. Use only a–z, 0–9, and hyphens.',
								'blockera'
							);
				})()
			: null;
	const canSaveNameSlug = slugChanged && isConfirmedSlugChange && slugIsValid;

	const unlockIdField = useCallback(() => {
		if (presetLocked) {
			return;
		}
		focusIdInputAfterUnlockRef.current = true;
		setVariableSlug(slug);
		setHasUserEditedSinceUnlock(false);
		setIsIdEditable(true);
	}, [slug, presetLocked]);

	const handleLockedIdKeyDown = useCallback(
		(event: KeyboardEvent<HTMLInputElement>) => {
			if (!allowIdUnlock) {
				return;
			}
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				unlockIdField();
			}
		},
		[unlockIdField, allowIdUnlock]
	);

	const handleIdUndoClick = () => setVariableSlug(slug);

	const handleDiscardChanges = () => {
		setVariableSlug(slug);
		setIsConfirmedSlugChange(false);
		setIsIdEditable(false);
		setHasUserEditedSinceUnlock(false);
	};

	const handleSaveNameAndSlug = () => {
		if (!canSaveNameSlug) {
			return;
		}

		const newSlug = normalizeVariablePresetSlug(displayedSlug);
		if (!newSlug) {
			return;
		}

		let updatedItem: T = {
			...variable,
			slug: newSlug,
		} as T;

		const nextName = draftNameRef.current;
		if (nextName !== persistedName) {
			updatedItem = { ...updatedItem, name: nextName };
		}

		const nextDescription = draftDescriptionRef.current;
		if (nextDescription !== persistedDescription) {
			updatedItem = buildPresetWithDescriptionUpdate(
				updatedItem,
				nextDescription
			);
		}

		changeRepeaterItem({
			onChange,
			valueCleanup,
			controlId,
			repeaterId,
			itemId,
			value: updatedItem,
		});

		setIsConfirmedSlugChange(false);
		setIsIdEditable(false);
		setHasUserEditedSinceUnlock(false);
	};

	const handleNameChange = useCallback(
		(newValue: string) => {
			if (presetLocked) {
				return;
			}

			if (deferNameEdits) {
				setDraftName(newValue);
				return;
			}

			if (isCreating) {
				setDraftName(newValue);
				const derivedSlug = normalizeVariablePresetSlug(newValue);
				if (derivedSlug) {
					setVariableSlug(derivedSlug);
				}

				syncCreatingNameToRepeaterStore(newValue);
				clearCreatingNamePersistTimeout();
				creatingNamePersistTimeoutRef.current = setTimeout(() => {
					persistCreatingNameToTheme(draftNameRef.current);
				}, CREATING_NAME_PERSIST_MS);

				return;
			}

			changeRepeaterItem({
				onChange,
				valueCleanup,
				controlId,
				repeaterId,
				itemId,
				value: buildPresetNameUpdateValue(newValue),
			});
		},
		[
			presetLocked,
			deferNameEdits,
			isCreating,
			clearCreatingNamePersistTimeout,
			persistCreatingNameToTheme,
			syncCreatingNameToRepeaterStore,
			changeRepeaterItem,
			onChange,
			valueCleanup,
			controlId,
			repeaterId,
			itemId,
			buildPresetNameUpdateValue,
		]
	);

	const handleIdChange = useCallback((newValue: string) => {
		setVariableSlug(normalizeVariablePresetSlug(newValue));
		setHasUserEditedSinceUnlock(true);
	}, []);

	const handleDescriptionChange = useCallback(
		(newValue: string) => {
			if (presetLocked) {
				return;
			}
			if (deferDescriptionEdits) {
				setDraftDescription(newValue);
				return;
			}
			changeRepeaterItem({
				onChange,
				valueCleanup,
				controlId,
				repeaterId,
				itemId,
				value: buildPresetWithDescriptionUpdate(variable, newValue),
			});
		},
		[
			presetLocked,
			deferDescriptionEdits,
			changeRepeaterItem,
			onChange,
			valueCleanup,
			controlId,
			repeaterId,
			itemId,
			variable,
		]
	);

	const handleConfirmSlugChange = useCallback((newValue: boolean) => {
		setIsConfirmedSlugChange(newValue);
	}, []);

	let idFieldHint = __('Use a–z, 0–9, and hyphens only.', 'blockera');
	if (isCreating) {
		idFieldHint = __(
			'The ID matches the name until you close this preset.',
			'blockera'
		);
	} else if (idClickToEdit) {
		idFieldHint = __(
			'Click the ID to edit. Use a–z, 0–9, and hyphens only.',
			'blockera'
		);
	}

	return (
		<Flex direction="column" gap={20}>
			<Flex direction="column" gap={20}>
				<ControlContextProvider
					value={{
						name: `font-size-name-${itemIdKey}`,
						value: displayedName,
					}}
				>
					<InputControl
						controlAddonTypes={[]}
						label={__('Name', 'blockera')}
						readOnly={presetLocked}
						onChange={handleNameChange}
						columns="1.2fr 3fr"
						data-test="global-styles-preset-name-field"
					>
						<ControlContextProvider
							value={{
								name: `font-size-slug-${itemIdKey}`,
								value: displayedSlug,
							}}
						>
							<div
								ref={presetIdFieldContainerRef}
								className={classNames(
									'blockera-preset-id-field',
									{
										'is-id-readonly-muted':
											showMutedIdStyle,
									}
								)}
							>
								<InputControl
									label={
										<>
											{__('ID', 'blockera')}

											<Tooltip
												text={idFieldHint}
												delay={0}
											>
												<span
													style={{
														cursor: 'pointer',
														display: 'flex',
														alignItems: 'center',
														marginLeft: '2px',
													}}
												>
													<Icon
														icon="information"
														iconSize="16"
														style={{
															fill: 'var(--blockera-controls-border-color-soft)',
															border: 'none',
														}}
													/>
												</span>
											</Tooltip>
										</>
									}
									controlAddonTypes={[]}
									readOnly={idClickToEdit}
									onClick={
										idClickToEdit && allowIdUnlock
											? unlockIdField
											: undefined
									}
									onFocus={
										idClickToEdit && allowIdUnlock
											? unlockIdField
											: undefined
									}
									onKeyDown={
										idClickToEdit && allowIdUnlock
											? handleLockedIdKeyDown
											: undefined
									}
									onChange={
										isIdEditable ? handleIdChange : () => {}
									}
									columns="1fr 4fr"
									style={{
										position: 'relative',
									}}
								>
									{showUndo && (
										<Button
											onClick={handleIdUndoClick}
											variant="tertiary"
											icon={
												<Icon
													icon="undo"
													iconSize="16"
												/>
											}
											size="input"
											style={{
												position: 'absolute',
												right: '4px',
												top: '4px',
												padding: '2px',
												'--blockera-controls-input-height':
													'22px',
												gap: '2px',
												fontSize: '11px',
												textTransform: 'uppercase',
												fontWeight: '500',
												minWidth: '24px',
											}}
											tooltip={__('Undo', 'blockera')}
											showTooltip={true}
										></Button>
									)}

									{idClickToEdit && allowIdUnlock && (
										<Button
											onClick={unlockIdField}
											variant="tertiary"
											icon={
												<Icon
													icon="pen"
													iconSize="16"
												/>
											}
											size="input"
											style={{
												position: 'absolute',
												right: '4px',
												top: '4px',
												padding: '2px',
												'--blockera-controls-input-height':
													'22px',
												gap: '2px',
												fontSize: '11px',
												textTransform: 'uppercase',
												fontWeight: '500',
												backgroundColor: '#ffffff',
												minWidth: '24px',
											}}
										></Button>
									)}
								</InputControl>
							</div>
						</ControlContextProvider>
					</InputControl>
				</ControlContextProvider>
			</Flex>

			<ControlContextProvider
				value={{
					name: `preset-description-${itemIdKey}`,
					value: displayedDescription,
				}}
			>
				<TextAreaControl
					label={__('Description', 'blockera')}
					disabled={presetLocked}
					onChange={handleDescriptionChange}
					columns="1.2fr 3fr"
					data-test="global-styles-preset-description-field"
				/>
			</ControlContextProvider>

			{children ? (
				<Flex direction="column" gap={16}>
					{children}
				</Flex>
			) : null}

			{slugChanged && (
				<Flex
					gap={15}
					className={componentInnerClassNames('consent-wrapper')}
					direction="column"
				>
					{slugError && (
						<NoticeControl type="error">{slugError}</NoticeControl>
					)}

					<NoticeControl type="warning">
						<p style={{ fontWeight: '500' }}>
							{__('ID changed', 'blockera')}
						</p>

						<p>
							<DynamicHtmlFormatter
								text={sprintf(
									/* translators: %1$s: Old preset reference snippet. %2$s: New preset reference snippet. */
									__(
										'Blocks currently use %1$s. After saving, update them to use %2$s manually.',
										'blockera'
									),
									'{old}',
									'{new}'
								)}
								replacements={{
									old: <code>{slug}</code>,
									new: <code>{displayedSlug}</code>,
								}}
							/>
						</p>
					</NoticeControl>

					<ControlContextProvider
						value={{
							name: `confirm-change-preset-slug-${itemIdKey}`,
							value: isConfirmedSlugChange,
						}}
					>
						<CheckboxControl
							checkboxLabel={__(
								'I understand that blocks using the old ID will lose their variables.',
								'blockera'
							)}
							onChange={handleConfirmSlugChange}
							isBold={true}
						/>
					</ControlContextProvider>
				</Flex>
			)}

			{slugChanged && (
				<Flex
					className="blockera-preset-naming-save-actions"
					justifyContent="flex-end"
				>
					<Button
						size="small"
						variant="tertiary"
						onClick={handleDiscardChanges}
						className="blockera-preset-save-actions__discard"
					>
						{__('Discard', 'blockera')}
					</Button>
					<Button
						size="small"
						variant="primary"
						onClick={handleSaveNameAndSlug}
						disabled={!canSaveNameSlug}
						className="blockera-preset-save-actions__save"
						icon={<Icon icon="save" iconSize="16" library="wp" />}
					>
						{__('Save', 'blockera')}
					</Button>
				</Flex>
			)}
		</Flex>
	);
}

export const SharedPresetControls = memo(SharedPresetControlsComponent);
