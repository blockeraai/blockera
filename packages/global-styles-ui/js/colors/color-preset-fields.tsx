/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useCallback,
	memo,
	useContext,
	useMemo,
	useState,
} from '@wordpress/element';
import type { Color } from '@wordpress/global-styles-engine';

/**
 * Blockera dependencies
 */
import {
	componentClassNames,
	componentInnerClassNames,
} from '@blockera/classnames';
import {
	Button,
	CheckboxControl,
	ColorControl,
	ControlContextProvider,
	Flex,
	NoticeControl,
	useControlContext,
	RepeaterContext,
	BaseControl,
	useVarPickerPresetContext,
} from '@blockera/controls';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import {
	SharedPresetControls,
	VariableVariationsFieldsConsentSlot,
	VariableVariationsFieldsEditorSlot,
	VariableVariationsFieldsSection,
	VariableVariationsFieldsSlotProvider,
	VariableVariationsFieldsToggleSlot,
	getAllVariableSlugs as getAllColorSlugs,
} from '../components';
import { useCanEditGlobalStyles } from '../components/use-global-styles-preset-edit';
import {
	buildVariationPresetsForBase,
	filterVariationsByBase,
	getDisplayShadeRampWithStackMap,
	rebuildVariationsFromMainColor,
	shadeVariationSlug,
} from './color-palette-variations-utils';
import {
	COLOR_SHADE_ANCHOR_STEP,
	COLOR_SHADE_STEPS,
	type ColorShadesMap,
	generateColorShades,
} from './color-shades-generator';
import { usePresetVariationsStorage } from '../context/preset-variations-context';
import { resolvePresetTaxonomyEditName } from '../components/preset-taxonomy/taxonomy-meta';
import { isNameBasedTaxonomyPreset } from '../components/preset-taxonomy/parse-preset-name-taxonomy';
import type { VariableType } from '../components/types';
import {
	isShadePaletteColor,
	parsePaletteShadeSlug,
	findRepeaterItemIdBySlug,
	shadeHexDiffersFromBaseline,
	normalizeRepeaterPaletteColorValue,
} from './utils';
import { resolveStoredColorForGenerateColorShades } from './resolve-color-for-shade-generator';
import './style.scss';

const GLOBAL_STYLES_COLOR_CONTEXT = {
	attribute: 'blockeraColor',
	blockName: 'global-styles',
} as const;

const chromelessColorFieldProps = {
	label: '',
	columns: '',
	noBorder: true,
	field: 'color',
	showButtonLabel: false,
	type: 'minimal' as const,
	contentAlign: 'left' as const,
};

function findMainColorPresetByBaseSlug(
	allColors: Color[],
	baseSlug: string
): Color | undefined {
	return allColors.find(
		(c) =>
			!isShadePaletteColor(c as Color & Record<string, unknown>) &&
			String(c.slug ?? '') === baseSlug
	);
}

function filterOutShadeVariationsForBase(
	allColors: Color[],
	baseSlug: string
): Color[] {
	return allColors.filter((c) => {
		const p = parsePaletteShadeSlug(String(c.slug ?? ''));
		return !p || p.baseSlug !== baseSlug;
	});
}

function resolvePresetBaseHex(
	displayRampMain: { color?: string },
	colorItem: { color?: string; type?: string },
	presetSlug: string
): string {
	const stored = displayRampMain.color || colorItem.color;
	return resolveStoredColorForGenerateColorShades(stored, presetSlug, {
		variablePickerType:
			typeof colorItem.type === 'string' ? colorItem.type : undefined,
	});
}

function GlobalStylesShadeStepColumn({
	name,
	step,
	hex,
	colorControlProps,
	baselineHexByStep,
}: {
	name: string;
	step: number;
	hex: string;
	colorControlProps: {
		size?: 'small' | 'normal' | 'input' | 'extra-small';
		disabled?: boolean;
		onChange: (value: string | undefined) => void;
	};
	baselineHexByStep?: Record<string, string>;
}) {
	const stepStr = String(step);
	const isBaseAnchorStep = step === COLOR_SHADE_ANCHOR_STEP;
	const baselineHex =
		baselineHexByStep !== undefined
			? baselineHexByStep[stepStr]
			: undefined;
	const showEditedMarker =
		baselineHexByStep !== undefined &&
		shadeHexDiffersFromBaseline(hex, baselineHex);

	return (
		<ControlContextProvider
			value={{
				name,
				value: hex,
				...GLOBAL_STYLES_COLOR_CONTEXT,
			}}
		>
			<ColorControl
				{...chromelessColorFieldProps}
				{...colorControlProps}
				className={componentClassNames(
					'global-styles-color-shade-swatch'
				)}
				colorIndicatorSize={18}
			>
				{isBaseAnchorStep ? (
					<Icon
						icon="asterisk"
						iconSize="14"
						className={componentInnerClassNames(
							'base-breakpoint-icon'
						)}
						aria-hidden
					/>
				) : null}

				{showEditedMarker ? (
					<span
						className={componentInnerClassNames(
							'color-shade-edited-indicator'
						)}
						aria-hidden
					/>
				) : null}
			</ColorControl>
		</ControlContextProvider>
	);
}

const noopGlobalStylesColor: (value?: string | undefined) => void = () => {};

function GlobalStylesChromelessShadeRampRow({
	baseSlug,
	hexLookup,
	mode,
	disabledByLock,
	onStepChange,
	baselineHexLookup,
}: {
	baseSlug: string;
	hexLookup: Record<string, string>;
	mode: 'preview' | 'edit';
	disabledByLock?: boolean;
	onStepChange?: (step: number, value: string | undefined) => void;
	/** Ramp from {@link generateColorShades}; when set (edit mode), custom shades show an edited marker. */
	baselineHexLookup?: Record<string, string>;
}) {
	return (
		<>
			{COLOR_SHADE_STEPS.map((step) => {
				const stepStr = String(step);
				const hex = hexLookup[stepStr] ?? '';
				const controlName =
					mode === 'preview'
						? `preview-shade-${baseSlug}-${stepStr}`
						: `shade-color-${baseSlug}-${stepStr}`;
				const colorControlProps =
					mode === 'preview'
						? {
								size: 'small' as const,
								disabled: true,
								onChange: noopGlobalStylesColor,
							}
						: {
								onChange: (v: string | undefined) =>
									onStepChange?.(step, v),
								disabled: Boolean(disabledByLock),
							};
				const baselineHexByStep =
					mode === 'edit' ? baselineHexLookup : undefined;

				return (
					<GlobalStylesShadeStepColumn
						key={`${mode}-shade-ramp-${baseSlug}-${stepStr}`}
						name={controlName}
						step={step}
						hex={hex}
						colorControlProps={colorControlProps}
						baselineHexByStep={baselineHexByStep}
					/>
				);
			})}
		</>
	);
}

function resolveRepeaterItemIdForColorUpdates(
	colorItem: VariableType & { color?: string },
	presetId: string | number,
	colorsRepeater: Record<string, { slug?: string }> | undefined,
	allColors: Color[] | undefined
): string | number {
	const slug = String(colorItem.slug ?? '');
	const parsedShade = parsePaletteShadeSlug(slug);
	if (
		parsedShade &&
		String(parsedShade.shadeStep) === String(COLOR_SHADE_ANCHOR_STEP)
	) {
		const mainId = findRepeaterItemIdBySlug(
			colorsRepeater,
			parsedShade.baseSlug
		);
		return mainId ?? presetId;
	}
	const bySlug = findRepeaterItemIdBySlug(colorsRepeater, slug);
	if (!isShadePaletteColor(colorItem as Color & Record<string, unknown>)) {
		return bySlug ?? presetId;
	}
	const inFull = allColors?.some((c) => String(c.slug ?? '') === slug);
	if (!inFull) {
		return presetId;
	}
	return bySlug ?? presetId;
}

function GlobalStylesMainColorControl({
	controlName,
	value,
	disabled,
	onChange,
}: {
	controlName: string;
	value?: string;
	disabled?: boolean;
	onChange: (next: unknown) => void;
}) {
	const pickerCtx = useVarPickerPresetContext();

	return (
		<ControlContextProvider
			value={{
				name: controlName,
				value,
				...GLOBAL_STYLES_COLOR_CONTEXT,
			}}
		>
			<ColorControl
				onChange={onChange}
				disabled={disabled}
				variableTypes={pickerCtx.active ? [] : ['color']}
				controlAddonTypes={pickerCtx.active ? [] : ['variable']}
			/>
		</ControlContextProvider>
	);
}

interface ColorPresetFieldsProps {
	origin: string | string[];
	presetId: string | number;
	colorItem: VariableType & { color?: string; baseSlug?: string };
}

function ColorPresetFieldsComponent({
	origin,
	presetId,
	colorItem,
}: ColorPresetFieldsProps) {
	const { slug, baseSlug } = colorItem;
	const effectiveBaseSlug = baseSlug || slug;
	const shadeSlugParsed = parsePaletteShadeSlug(String(slug ?? ''));
	const isAnchorShadeRow =
		Boolean(shadeSlugParsed) &&
		String(shadeSlugParsed?.shadeStep ?? '') ===
			String(COLOR_SHADE_ANCHOR_STEP);
	const isShadePalette = isShadePaletteColor(
		colorItem as Color & Record<string, unknown>
	);
	/** Anchor 500 is stored on the main preset; treat like main for UI (shades toggle, stack). */
	const isShadeRow = isShadePalette && !isAnchorShadeRow;
	const presetLocked = !useCanEditGlobalStyles();
	const { fullItems, setFullItems, taxonomyNameSource } =
		usePresetVariationsStorage<Color>();

	const storedShadesForBase = useMemo(
		() => filterVariationsByBase(fullItems, effectiveBaseSlug),
		[fullItems, effectiveBaseSlug]
	);
	const shadesSaved = storedShadesForBase.length > 0;

	const mainPresetRow = useMemo(() => {
		if (!isAnchorShadeRow) {
			return null;
		}
		return (
			findMainColorPresetByBaseSlug(fullItems, effectiveBaseSlug) ?? null
		);
	}, [isAnchorShadeRow, fullItems, effectiveBaseSlug]);

	const displayRampMain = useMemo(() => {
		if (!isShadeRow) {
			if (isAnchorShadeRow) {
				const main = mainPresetRow;
				return {
					slug: effectiveBaseSlug,
					name: main ? String(main.name ?? '') : colorItem.name,
					color: main?.color ?? colorItem.color,
				};
			}
			return {
				slug: effectiveBaseSlug,
				name: colorItem.name,
				color: colorItem.color,
			};
		}
		const main = findMainColorPresetByBaseSlug(
			fullItems,
			effectiveBaseSlug
		);
		return {
			slug: effectiveBaseSlug,
			name: main ? String(main.name ?? '') : colorItem.name,
			color: main?.color ?? colorItem.color,
		};
	}, [
		isShadeRow,
		isAnchorShadeRow,
		fullItems,
		effectiveBaseSlug,
		mainPresetRow,
		colorItem.name,
		colorItem.color,
	]);

	const taxonomyEditName = useMemo(() => {
		const record = colorItem as Record<string, unknown>;
		if (!isNameBasedTaxonomyPreset(record, taxonomyNameSource)) {
			return undefined;
		}
		const fullName = resolvePresetTaxonomyEditName(
			record,
			taxonomyNameSource
		);
		return fullName !== '' ? fullName : undefined;
	}, [colorItem, taxonomyNameSource]);

	const sharedPresetName = isAnchorShadeRow
		? String(
				mainPresetRow?.name ??
					displayRampMain.name ??
					colorItem.name ??
					''
			)
		: (taxonomyEditName ?? String(colorItem.name ?? ''));
	const sharedPresetSlug = isAnchorShadeRow
		? String(mainPresetRow?.slug ?? effectiveBaseSlug)
		: String(colorItem.slug ?? '');
	const sharedPresetVariable = useMemo(() => {
		if (!isAnchorShadeRow) {
			return colorItem;
		}
		if (mainPresetRow) {
			return {
				...colorItem,
				...(mainPresetRow as VariableType & { color?: string }),
				slug: String(mainPresetRow.slug ?? effectiveBaseSlug),
				name: String(mainPresetRow.name ?? sharedPresetName),
			};
		}
		return {
			...colorItem,
			slug: effectiveBaseSlug,
			name: sharedPresetName,
		};
	}, [
		isAnchorShadeRow,
		colorItem,
		mainPresetRow,
		effectiveBaseSlug,
		sharedPresetName,
	]);

	const { stackMap } = useMemo(() => {
		if (!shadesSaved) {
			return {
				stackMap: {} as ColorShadesMap,
			};
		}
		return getDisplayShadeRampWithStackMap(
			fullItems,
			effectiveBaseSlug,
			displayRampMain
		);
	}, [shadesSaved, fullItems, effectiveBaseSlug, displayRampMain]);

	const {
		controlInfo: { name: controlId },
		dispatch: { changeRepeaterItem },
	} = useControlContext();
	const {
		onChange,
		repeaterId,
		valueCleanup,
		repeaterItems: colors,
	} = useContext(RepeaterContext) as {
		repeaterItems: Record<string, Record<string, unknown>> | undefined;
		onChange: (newValue: any) => void;
		valueCleanup: (value: any) => any;
		repeaterId: string | null | undefined;
		getControlId?: (itemId: string | number, key: string) => string;
	};

	const repeaterItemIdForUpdates = useMemo(
		() =>
			resolveRepeaterItemIdForColorUpdates(
				colorItem,
				presetId,
				colors as Record<string, { slug?: string }> | undefined,
				fullItems
			),
		[colorItem, presetId, colors, fullItems]
	);

	const [shadeConsentOpen, setShadeConsentOpen] = useState(false);
	const [shadeToggleConfirmed, setShadeToggleConfirmed] = useState(false);

	const applyShadeToggle = useCallback(
		(enabled: boolean) => {
			const withoutBaseShades = filterOutShadeVariationsForBase(
				fullItems,
				effectiveBaseSlug
			);
			if (enabled) {
				const base = resolvePresetBaseHex(
					displayRampMain,
					colorItem,
					effectiveBaseSlug
				);
				const shades = generateColorShades(base);
				const rows = buildVariationPresetsForBase(
					{
						slug: effectiveBaseSlug,
						name: String(
							displayRampMain.name ?? colorItem.name ?? ''
						),
					},
					shades
				);
				setFullItems([...withoutBaseShades, ...rows.map(valueCleanup)]);
			} else {
				setFullItems(withoutBaseShades);
			}
		},
		[
			fullItems,
			setFullItems,
			effectiveBaseSlug,
			colorItem,
			displayRampMain,
			valueCleanup,
		]
	);

	const handleToggleChange = (checked: boolean) => {
		if (presetLocked) {
			return;
		}
		if (shadeConsentOpen) {
			if (checked) {
				handleDiscardShadeToggle();
			}
			return;
		}
		if (checked === shadesSaved) {
			return;
		}
		if (checked) {
			applyShadeToggle(true);
			return;
		}
		setShadeConsentOpen(true);
		setShadeToggleConfirmed(false);
	};

	const handleDiscardShadeToggle = () => {
		setShadeConsentOpen(false);
		setShadeToggleConfirmed(false);
	};

	const handleSaveShadeToggle = () => {
		if (!shadeToggleConfirmed) {
			return;
		}
		applyShadeToggle(false);
		setShadeConsentOpen(false);
		setShadeToggleConfirmed(false);
	};

	const handleConfirmCheckbox = (checked: boolean) => {
		setShadeToggleConfirmed(checked);
	};

	const updateColorViaRepeater = useCallback(
		(updates: Record<string, any>) => {
			const { baseSlug: _omitBaseSlug, ...persistItem } = colorItem;
			const itemSlug = String(persistItem.slug ?? '');
			const anchorParsed = parsePaletteShadeSlug(itemSlug);

			const existingKey = String(repeaterItemIdForUpdates);
			const existingRow =
				colors &&
				Object.prototype.hasOwnProperty.call(colors, existingKey)
					? { ...(colors[existingKey] as Record<string, unknown>) }
					: ({} as Record<string, unknown>);

			let valueToPersist: Record<string, unknown> = {
				...existingRow,
				...persistItem,
				...updates,
			};

			if (
				anchorParsed &&
				String(anchorParsed.shadeStep) ===
					String(COLOR_SHADE_ANCHOR_STEP)
			) {
				const mainRow = findMainColorPresetByBaseSlug(
					fullItems,
					anchorParsed.baseSlug
				);
				if (mainRow) {
					valueToPersist = {
						...existingRow,
						...(mainRow as unknown as Record<string, unknown>),
						...updates,
					};
				}
			}

			changeRepeaterItem({
				onChange,
				valueCleanup,
				controlId,
				repeaterId,
				itemId: repeaterItemIdForUpdates,
				value: valueToPersist,
			});
		},
		[
			changeRepeaterItem,
			onChange,
			valueCleanup,
			controlId,
			repeaterId,
			repeaterItemIdForUpdates,
			colorItem,
			colors,
			fullItems,
		]
	);

	const handleValueChange = useCallback(
		(newValue: unknown) => {
			const emptyPayload =
				newValue === undefined ||
				newValue === null ||
				newValue === '' ||
				(typeof newValue === 'string' && newValue.trim() === '');

			if (emptyPayload) {
				updateColorViaRepeater({ color: newValue });
				return;
			}

			if (isShadeRow) {
				const pickerType = String(
					(colorItem as { type?: string }).type ?? 'color'
				);
				const normalized = normalizeRepeaterPaletteColorValue(
					newValue,
					pickerType
				);
				updateColorViaRepeater({
					color: normalized !== '' ? normalized : newValue,
				});
				return;
			}

			const mainMeta = findMainColorPresetByBaseSlug(
				fullItems,
				effectiveBaseSlug
			);
			const variablePickerType = String(
				(mainMeta as Color & { type?: string })?.type ??
					(colorItem as { type?: string }).type ??
					'color'
			);

			const normalizedMainColor = normalizeRepeaterPaletteColorValue(
				newValue,
				variablePickerType
			);
			let colorForPersist = '';
			if (normalizedMainColor !== '') {
				colorForPersist = normalizedMainColor;
			} else if (typeof newValue === 'string') {
				colorForPersist = newValue.trim();
			}

			if (!colorForPersist) {
				updateColorViaRepeater({ color: newValue });
				return;
			}

			if (storedShadesForBase.length === 0) {
				updateColorViaRepeater({ color: colorForPersist });
				return;
			}

			const presetName = String(mainMeta?.name ?? colorItem.name);
			const mainHex = resolvePresetBaseHex(
				{ ...displayRampMain, color: colorForPersist },
				{
					...(colorItem as {
						color?: string;
						type?: string;
					}),
					type: variablePickerType,
				},
				effectiveBaseSlug
			);

			const rebuilt = rebuildVariationsFromMainColor(
				{ slug: effectiveBaseSlug, name: presetName },
				mainHex,
				{
					variablePickerType,
				}
			);
			const withoutShades = filterOutShadeVariationsForBase(
				fullItems,
				effectiveBaseSlug
			);
			const withUpdatedMain = withoutShades.map((c) =>
				String(c.slug ?? '') === effectiveBaseSlug
					? ({ ...c, color: colorForPersist } as Color)
					: c
			);
			setFullItems([...withUpdatedMain, ...rebuilt]);
		},
		[
			updateColorViaRepeater,
			isShadeRow,
			storedShadesForBase.length,
			effectiveBaseSlug,
			colorItem,
			displayRampMain,
			fullItems,
			setFullItems,
		]
	);

	const updateShadeStepColor = useCallback(
		(step: number, newValue: string | undefined) => {
			if (newValue === undefined || presetLocked || !shadesSaved) {
				return;
			}
			if (step === COLOR_SHADE_ANCHOR_STEP) {
				handleValueChange(newValue);
				return;
			}
			const shadeRowSlug = shadeVariationSlug(effectiveBaseSlug, step);
			const shadePaletteRow = fullItems.find(
				(c) => String(c.slug ?? '') === shadeRowSlug
			);
			const pickerType = String(
				(shadePaletteRow as Color & { type?: string })?.type ??
					(colorItem as { type?: string }).type ??
					'color'
			);
			const persisted =
				normalizeRepeaterPaletteColorValue(newValue, pickerType) ||
				newValue;
			const nextPalette = fullItems.map((c) =>
				String(c.slug ?? '') === shadeRowSlug
					? ({ ...c, color: persisted } as Color)
					: c
			);
			setFullItems(nextPalette);
			const sid = findRepeaterItemIdBySlug(
				colors as Record<string, { slug?: string }> | undefined,
				shadeRowSlug
			);
			if (sid !== null && colors?.[String(sid)]) {
				const existingRow = colors[String(sid)] as Record<
					string,
					unknown
				>;
				changeRepeaterItem({
					onChange,
					valueCleanup,
					controlId,
					repeaterId,
					itemId: sid,
					value: {
						...existingRow,
						color: persisted,
					},
				});
			}
		},
		[
			presetLocked,
			shadesSaved,
			effectiveBaseSlug,
			fullItems,
			setFullItems,
			colors,
			changeRepeaterItem,
			onChange,
			valueCleanup,
			controlId,
			repeaterId,
			handleValueChange,
			colorItem,
		]
	);

	const shadeEditedBaselineLookup = useMemo(():
		Record<string, string> | undefined => {
		if (!origin || !slug || isShadeRow || !shadesSaved) {
			return undefined;
		}
		return generateColorShades(
			resolvePresetBaseHex(
				{
					...displayRampMain,
					color:
						typeof colorItem.color === 'string'
							? colorItem.color
							: normalizeRepeaterPaletteColorValue(
									colorItem.color,
									String(
										(colorItem as { type?: string }).type ??
											'color'
									)
								),
				},
				colorItem,
				effectiveBaseSlug
			)
		);
	}, [
		origin,
		slug,
		isShadeRow,
		shadesSaved,
		displayRampMain,
		colorItem,
		effectiveBaseSlug,
	]);

	if (!origin || !slug) {
		return null;
	}

	const displayToggleChecked = shadeConsentOpen ? false : shadesSaved;

	return (
		<SharedPresetControls
			itemId={repeaterItemIdForUpdates}
			variable={sharedPresetVariable}
			name={sharedPresetName}
			slug={sharedPresetSlug}
			allSlugs={getAllColorSlugs(
				// Repeater value is id → item object; getAllVariableSlugs accepts that at runtime.
				colors as unknown as Parameters<typeof getAllColorSlugs>[0]
			)}
		>
			<Flex direction="column" gap={16}>
				<Flex
					direction="row"
					alignItems="center"
					gap={12}
					style={{ width: '100%' }}
				>
					<Flex
						direction="row"
						alignItems="center"
						gap={8}
						style={{ flex: 1, minWidth: 0 }}
					>
						<BaseControl
							columns="1.2fr 3fr"
							label={__('Color', 'blockera')}
							controlName={`color-value-${isAnchorShadeRow ? sharedPresetSlug : slug}`}
						>
							<GlobalStylesMainColorControl
								controlName={`color-value-${isAnchorShadeRow ? sharedPresetSlug : slug}`}
								value={
									isAnchorShadeRow
										? (displayRampMain.color ??
											colorItem.color)
										: colorItem.color
								}
								onChange={handleValueChange}
								disabled={presetLocked}
							/>

							<VariableVariationsFieldsSection>
								{!isShadeRow ? (
									<>
										<VariableVariationsFieldsSlotProvider>
											<VariableVariationsFieldsToggleSlot
												label={__(
													'Enable Color Shades',
													'blockera'
												)}
												checked={displayToggleChecked}
												disabled={presetLocked}
												onChange={handleToggleChange}
												trailing={
													<>
														{displayToggleChecked ? (
															<VariableVariationsFieldsEditorSlot>
																<GlobalStylesChromelessShadeRampRow
																	baseSlug={
																		effectiveBaseSlug
																	}
																	hexLookup={
																		stackMap
																	}
																	mode="edit"
																	disabledByLock={
																		presetLocked
																	}
																	onStepChange={(
																		step,
																		v
																	) =>
																		updateShadeStepColor(
																			step,
																			v
																		)
																	}
																	baselineHexLookup={
																		shadeEditedBaselineLookup
																	}
																/>
															</VariableVariationsFieldsEditorSlot>
														) : null}
													</>
												}
											/>
										</VariableVariationsFieldsSlotProvider>
									</>
								) : null}
							</VariableVariationsFieldsSection>
						</BaseControl>
					</Flex>
				</Flex>

				<VariableVariationsFieldsSection>
					{!isShadeRow ? (
						<>
							{shadeConsentOpen ? (
								<VariableVariationsFieldsConsentSlot>
									<NoticeControl type="warning">
										<p style={{ fontWeight: 500 }}>
											{__(
												'Shade variables will be removed',
												'blockera'
											)}
										</p>
										<p>
											{__(
												'The 11 generated shades (neutral-50 through neutral-950) will no longer exist. Any blocks using them will lose their color styling and need to be updated manually.',
												'blockera'
											)}
										</p>
									</NoticeControl>

									<ControlContextProvider
										value={{
											name: `confirm-color-shades-toggle-${effectiveBaseSlug}`,
											value: shadeToggleConfirmed,
										}}
									>
										<CheckboxControl
											checkboxLabel={__(
												'I understand the shade variables will be removed and may affect existing blocks.',
												'blockera'
											)}
											onChange={handleConfirmCheckbox}
											isBold={true}
										/>
									</ControlContextProvider>

									<Flex justifyContent="flex-end" gap={8}>
										<Button
											size="small"
											variant="tertiary"
											onClick={handleDiscardShadeToggle}
											className="blockera-preset-save-actions__discard"
										>
											{__('Discard', 'blockera')}
										</Button>
										<Button
											size="small"
											variant="primary"
											onClick={handleSaveShadeToggle}
											disabled={!shadeToggleConfirmed}
											className="blockera-preset-save-actions__save"
											icon={
												<Icon
													icon="save"
													iconSize="16"
													library="wp"
												/>
											}
										>
											{__('Save', 'blockera')}
										</Button>
									</Flex>
								</VariableVariationsFieldsConsentSlot>
							) : null}
						</>
					) : null}
				</VariableVariationsFieldsSection>
			</Flex>
		</SharedPresetControls>
	);
}

export const ColorPresetFields = memo(ColorPresetFieldsComponent);
