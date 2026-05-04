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
	Button,
	CheckboxControl,
	ColorControl,
	ColorIndicatorStack,
	ControlContextProvider,
	Flex,
	NoticeControl,
	useControlContext,
	RepeaterContext,
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
	getDisplayShadeRamp,
	rebuildVariationsFromMainColor,
	shadeVariationSlug,
	stackValueFromShades,
	variationsToStackMap,
} from './color-palette-variations-utils';
import {
	COLOR_SHADE_ANCHOR_STEP,
	COLOR_SHADE_STEPS,
	generateColorShades,
} from './color-shades-generator';
import { useColorPaletteVariationsStorage } from './color-palette-variations-context';
import type { VariableType } from '../components/types';
import {
	isShadePaletteColor,
	parsePaletteShadeSlug,
	findRepeaterItemIdBySlug,
} from './utils';

function resolveRepeaterItemIdForColorUpdates(
	colorItem: VariableType & { color?: string },
	presetId: string | number,
	colorsRepeater: Record<string, { slug?: string }> | undefined,
	fullPalette: Color[] | undefined
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
	const inFull = fullPalette?.some((c) => String(c.slug ?? '') === slug);
	if (!inFull) {
		return presetId;
	}
	return bySlug ?? presetId;
}

interface ColorPresetFieldsProps {
	origin: string | string[];
	presetId: string | number;
	colorItem: VariableType & { color?: string; baseSlug?: string };
}

const chromelessColorFieldProps = {
	label: '',
	columns: '',
	noBorder: true,
	field: 'color',
	showButtonLabel: false,
	type: 'minimal' as const,
	contentAlign: 'left' as const,
};

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
	const { fullPalette, setFullPalette } = useColorPaletteVariationsStorage();

	const storedShadesForBase = useMemo(
		() => filterVariationsByBase(fullPalette, effectiveBaseSlug),
		[fullPalette, effectiveBaseSlug]
	);
	const shadesSaved = storedShadesForBase.length > 0;

	const mainPresetRow = useMemo(() => {
		if (!isAnchorShadeRow) {
			return null;
		}
		return (
			fullPalette.find(
				(c) =>
					!isShadePaletteColor(
						c as Color & Record<string, unknown>
					) && String(c.slug ?? '') === effectiveBaseSlug
			) ?? null
		);
	}, [isAnchorShadeRow, fullPalette, effectiveBaseSlug]);

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
		const main = fullPalette.find(
			(c) =>
				!isShadePaletteColor(c as Color & Record<string, unknown>) &&
				String(c.slug ?? '') === effectiveBaseSlug
		);
		return {
			slug: effectiveBaseSlug,
			name: main ? String(main.name ?? '') : colorItem.name,
			color: main?.color ?? colorItem.color,
		};
	}, [
		isShadeRow,
		isAnchorShadeRow,
		fullPalette,
		effectiveBaseSlug,
		mainPresetRow,
		colorItem.name,
		colorItem.color,
	]);

	const sharedPresetName = isAnchorShadeRow
		? String(
				mainPresetRow?.name ??
					displayRampMain.name ??
					colorItem.name ??
					''
			)
		: String(colorItem.name ?? '');
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

	const forBase = useMemo(
		() =>
			shadesSaved
				? getDisplayShadeRamp(
						fullPalette,
						effectiveBaseSlug,
						displayRampMain
					)
				: [],
		[shadesSaved, fullPalette, effectiveBaseSlug, displayRampMain]
	);

	/** Generated preview only — not persisted until “Enable Color Shades” is on. */
	const previewShadesMap = useMemo(() => {
		if (shadesSaved || isShadeRow) {
			return null;
		}
		const base = displayRampMain.color || colorItem.color || '#000000';
		return generateColorShades(base);
	}, [shadesSaved, isShadeRow, displayRampMain.color, colorItem.color]);

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
				fullPalette
			),
		[colorItem, presetId, colors, fullPalette]
	);

	const [shadeConsentOpen, setShadeConsentOpen] = useState(false);
	const [shadeToggleConfirmed, setShadeToggleConfirmed] = useState(false);

	const applyShadeToggle = useCallback(
		(enabled: boolean) => {
			const withoutBaseShades = fullPalette.filter((c) => {
				const p = parsePaletteShadeSlug(String(c.slug ?? ''));
				return !p || p.baseSlug !== effectiveBaseSlug;
			});
			if (enabled) {
				const base =
					displayRampMain.color || colorItem.color || '#000000';
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
				setFullPalette([
					...withoutBaseShades,
					...rows.map(valueCleanup),
				]);
			} else {
				setFullPalette(withoutBaseShades);
			}
		},
		[
			fullPalette,
			setFullPalette,
			effectiveBaseSlug,
			colorItem.color,
			colorItem.name,
			displayRampMain.color,
			displayRampMain.name,
			valueCleanup,
		]
	);

	const handleToggleChange = (checked: boolean) => {
		if (presetLocked || shadeConsentOpen) {
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
				const mainRow = fullPalette.find(
					(c) =>
						!isShadePaletteColor(
							c as Color & Record<string, unknown>
						) && String(c.slug ?? '') === anchorParsed.baseSlug
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
			fullPalette,
		]
	);

	const handleValueChange = useCallback(
		(newValue: string | undefined) => {
			updateColorViaRepeater({ color: newValue });
			if (!newValue || storedShadesForBase.length === 0) {
				return;
			}
			if (isShadeRow) {
				return;
			}

			const mainMeta = fullPalette.find(
				(c) =>
					!isShadePaletteColor(
						c as Color & Record<string, unknown>
					) && String(c.slug ?? '') === effectiveBaseSlug
			);
			const presetName = String(mainMeta?.name ?? colorItem.name);

			const rebuilt = rebuildVariationsFromMainColor(
				{ slug: effectiveBaseSlug, name: presetName },
				newValue
			);
			const withoutShades = fullPalette.filter((c) => {
				const p = parsePaletteShadeSlug(String(c.slug ?? ''));
				return !p || p.baseSlug !== effectiveBaseSlug;
			});
			const withUpdatedMain = withoutShades.map((c) =>
				String(c.slug ?? '') === effectiveBaseSlug
					? ({ ...c, color: newValue } as Color)
					: c
			);
			setFullPalette([...withUpdatedMain, ...rebuilt]);
		},
		[
			updateColorViaRepeater,
			isShadeRow,
			storedShadesForBase.length,
			effectiveBaseSlug,
			colorItem.name,
			fullPalette,
			setFullPalette,
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
			const nextPalette = fullPalette.map((c) =>
				String(c.slug ?? '') === shadeRowSlug
					? ({ ...c, color: newValue } as Color)
					: c
			);
			setFullPalette(nextPalette);
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
						color: newValue,
					},
				});
			}
		},
		[
			presetLocked,
			shadesSaved,
			effectiveBaseSlug,
			fullPalette,
			setFullPalette,
			colors,
			changeRepeaterItem,
			onChange,
			valueCleanup,
			controlId,
			repeaterId,
			handleValueChange,
		]
	);

	if (!origin || !slug) {
		return null;
	}

	const stackMap = variationsToStackMap(forBase);
	const displayToggleChecked = shadeConsentOpen ? false : shadesSaved;
	const showPreviewStack =
		!isShadeRow && !shadesSaved && previewShadesMap !== null;
	const showEditableShadeSteps = !isShadeRow && shadesSaved;

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
					<span
						style={{
							flex: '0 0 auto',
							minWidth: 72,
							fontSize: 11,
							fontWeight: 500,
							textTransform: 'uppercase',
							color: 'var(--blockera-controls-label-color, #1e1e1e)',
						}}
					>
						{__('Color', 'blockera')}
					</span>
					<Flex
						direction="row"
						alignItems="center"
						gap={8}
						style={{ flex: 1, minWidth: 0 }}
					>
						<ControlContextProvider
							value={{
								name: `color-value-${isAnchorShadeRow ? sharedPresetSlug : slug}`,
								value: isAnchorShadeRow
									? (displayRampMain.color ?? colorItem.color)
									: colorItem.color,
								attribute: 'blockeraColor',
								blockName: 'global-styles',
							}}
						>
							<ColorControl
								onChange={handleValueChange}
								disabled={presetLocked}
							/>
						</ControlContextProvider>
					</Flex>
				</Flex>

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
									disabled={presetLocked || shadeConsentOpen}
									onChange={handleToggleChange}
									trailing={
										showPreviewStack ? (
											<ColorIndicatorStack
												value={stackValueFromShades(
													previewShadesMap
												)}
												size={18}
												maxItems={
													COLOR_SHADE_STEPS.length
												}
											/>
										) : null
									}
								/>

								{showEditableShadeSteps ? (
									<VariableVariationsFieldsEditorSlot>
										{COLOR_SHADE_STEPS.map((step) => {
											const stepStr = String(step);
											const hex = stackMap[stepStr] ?? '';
											return (
												<Flex
													key={`shade-editor-${effectiveBaseSlug}-${stepStr}`}
													direction="column"
													alignItems="anchor-center"
													gap={0}
													style={{
														minWidth: 0,
														textAlign: 'center',
													}}
												>
													<ControlContextProvider
														value={{
															name: `shade-color-${effectiveBaseSlug}-${stepStr}`,
															value: hex,
															attribute:
																'blockeraColor',
															blockName:
																'global-styles',
														}}
													>
														<ColorControl
															{...chromelessColorFieldProps}
															onChange={(v) =>
																updateShadeStepColor(
																	step,
																	v
																)
															}
															disabled={
																presetLocked
															}
														/>
													</ControlContextProvider>
													<span
														style={{
															flex: '0 0 auto',
															minWidth: 40,
															fontSize: 11,
															fontWeight: 500,
															color: 'var(--blockera-controls-label-color, #1e1e1e)',
														}}
													>
														{stepStr}
													</span>
												</Flex>
											);
										})}
									</VariableVariationsFieldsEditorSlot>
								) : null}
							</VariableVariationsFieldsSlotProvider>

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
