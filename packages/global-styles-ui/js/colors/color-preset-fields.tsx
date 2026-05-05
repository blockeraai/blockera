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
import type { CSSProperties } from 'react';
import type { Color } from '@wordpress/global-styles-engine';

/**
 * Blockera dependencies
 */
import {
	Button,
	CheckboxControl,
	ColorControl,
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

const GLOBAL_STYLES_COLOR_CONTEXT = {
	attribute: 'blockeraColor',
	blockName: 'global-styles',
} as const;

const FIELD_LABEL_CAPTION_STYLE: CSSProperties = {
	flex: '0 0 auto',
	minWidth: 72,
	fontSize: 11,
	fontWeight: 500,
	textTransform: 'uppercase',
	color: 'var(--blockera-controls-label-color, #1e1e1e)',
};

const SHADE_STEP_COLUMN_STYLE: CSSProperties = {
	minWidth: 0,
	textAlign: 'center',
};

const SHADE_STEP_LABEL_STYLE: CSSProperties = {
	flex: '0 0 auto',
	minWidth: 40,
	fontSize: 11,
	fontWeight: 500,
	color: 'var(--blockera-controls-label-color, #1e1e1e)',
};

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
	fullPalette: Color[],
	baseSlug: string
): Color | undefined {
	return fullPalette.find(
		(c) =>
			!isShadePaletteColor(c as Color & Record<string, unknown>) &&
			String(c.slug ?? '') === baseSlug
	);
}

function filterOutShadeVariationsForBase(
	fullPalette: Color[],
	baseSlug: string
): Color[] {
	return fullPalette.filter((c) => {
		const p = parsePaletteShadeSlug(String(c.slug ?? ''));
		return !p || p.baseSlug !== baseSlug;
	});
}

function resolvePresetBaseHex(
	displayRampMain: { color?: string },
	colorItem: { color?: string }
): string {
	return displayRampMain.color || colorItem.color || '#000000';
}

function GlobalStylesShadeStepColumn({
	name,
	hex,
	stepLabel,
	colorControlProps,
}: {
	name: string;
	hex: string;
	stepLabel: string;
	colorControlProps: {
		size?: 'small' | 'normal' | 'input' | 'extra-small';
		disabled?: boolean;
		onChange: (value: string | undefined) => void;
	};
}) {
	return (
		<Flex
			direction="column"
			alignItems="anchor-center"
			gap={0}
			style={SHADE_STEP_COLUMN_STYLE}
		>
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
				/>
			</ControlContextProvider>
			<span style={SHADE_STEP_LABEL_STYLE}>{stepLabel}</span>
		</Flex>
	);
}

const noopGlobalStylesColor: (value?: string | undefined) => void = () => {};

function GlobalStylesChromelessShadeRampRow({
	baseSlug,
	hexLookup,
	mode,
	disabledByLock,
	onStepChange,
}: {
	baseSlug: string;
	hexLookup: Record<string, string>;
	mode: 'preview' | 'edit';
	disabledByLock?: boolean;
	onStepChange?: (step: number, value: string | undefined) => void;
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
				return (
					<GlobalStylesShadeStepColumn
						key={`${mode}-shade-ramp-${baseSlug}-${stepStr}`}
						name={controlName}
						hex={hex}
						stepLabel={stepStr}
						colorControlProps={colorControlProps}
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

function GlobalStylesMainColorControl({
	controlName,
	value,
	disabled,
	onChange,
}: {
	controlName: string;
	value?: string;
	disabled?: boolean;
	onChange: (next: string | undefined) => void;
}) {
	return (
		<ControlContextProvider
			value={{
				name: controlName,
				value,
				...GLOBAL_STYLES_COLOR_CONTEXT,
			}}
		>
			<ColorControl onChange={onChange} disabled={disabled} />
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
			findMainColorPresetByBaseSlug(fullPalette, effectiveBaseSlug) ??
			null
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
		const main = findMainColorPresetByBaseSlug(
			fullPalette,
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
		const base = resolvePresetBaseHex(displayRampMain, colorItem);
		return generateColorShades(base);
	}, [shadesSaved, isShadeRow, colorItem, displayRampMain]);

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
			const withoutBaseShades = filterOutShadeVariationsForBase(
				fullPalette,
				effectiveBaseSlug
			);
			if (enabled) {
				const base = resolvePresetBaseHex(displayRampMain, colorItem);
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
			colorItem,
			displayRampMain,
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
				const mainRow = findMainColorPresetByBaseSlug(
					fullPalette,
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

			const mainMeta = findMainColorPresetByBaseSlug(
				fullPalette,
				effectiveBaseSlug
			);
			const presetName = String(mainMeta?.name ?? colorItem.name);

			const rebuilt = rebuildVariationsFromMainColor(
				{ slug: effectiveBaseSlug, name: presetName },
				newValue
			);
			const withoutShades = filterOutShadeVariationsForBase(
				fullPalette,
				effectiveBaseSlug
			);
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
					<span style={FIELD_LABEL_CAPTION_STYLE}>
						{__('Color', 'blockera')}
					</span>
					<Flex
						direction="row"
						alignItems="center"
						gap={8}
						style={{ flex: 1, minWidth: 0 }}
					>
						<GlobalStylesMainColorControl
							controlName={`color-value-${isAnchorShadeRow ? sharedPresetSlug : slug}`}
							value={
								isAnchorShadeRow
									? (displayRampMain.color ?? colorItem.color)
									: colorItem.color
							}
							onChange={handleValueChange}
							disabled={presetLocked}
						/>
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
										showPreviewStack && previewShadesMap ? (
											<VariableVariationsFieldsEditorSlot
												style={{ opacity: 0.5 }}
											>
												<GlobalStylesChromelessShadeRampRow
													baseSlug={effectiveBaseSlug}
													hexLookup={previewShadesMap}
													mode="preview"
												/>
											</VariableVariationsFieldsEditorSlot>
										) : (
											<>
												{showEditableShadeSteps ? (
													<VariableVariationsFieldsEditorSlot>
														<GlobalStylesChromelessShadeRampRow
															baseSlug={
																effectiveBaseSlug
															}
															hexLookup={stackMap}
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
														/>
													</VariableVariationsFieldsEditorSlot>
												) : null}
											</>
										)
									}
								/>
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
