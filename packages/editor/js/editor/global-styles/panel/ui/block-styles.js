// @flow
/**
 * External dependencies
 */
import {
	Slot,
	SlotFillProvider,
	Popover as WPPopover,
} from '@wordpress/components';
import type { MixedElement } from 'react';
import { __, sprintf } from '@wordpress/i18n';
import { applyFilters } from '@wordpress/hooks';
import { useViewportMatch } from '@wordpress/compose';
import {
	useState,
	useRef,
	useEffect,
	useCallback,
	useMemo,
} from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	Flex,
	Popover,
	SearchControl,
	ControlContextProvider,
	NoticeControl,
	DynamicHtmlFormatter,
} from '@blockera/controls';
import {
	classNames,
	componentClassNames,
	componentInnerClassNames,
} from '@blockera/classnames';
import { Icon } from '@blockera/icons';
import { isString } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { StyleItem } from './style-item';
import { type T_BLOCK_STYLES_PROPS } from './types';
import {
	useGlobalStylesPanelContext,
	BlockStylesPickerContextProvider,
} from '../context';
import { AddNewStyleButton } from './add-new-style-button';
import { useBlockStylesCounter } from './use-block-styles-counter';
import { useBlockContext } from '../../../../extensions/components';
import { StyleVariationsManager } from './style-variations-manager';
import { default as BlockStylesPreviewPanel } from './preview-panel';
import { PromoteGlobalStylesPremiumFeature } from './promote-global-styles-premium-feature';
import {
	VARIATION_SURFACE_SIZE,
	VARIATION_SURFACE_STYLE,
} from '../variation-surfaces';

// Mapped block dynamic style variations counter for limitation reasons.
const blockDynamicStylesCount: Object = {};

// Block Styles component for the Settings Sidebar.
function BlockStyles({
	styles,
	blockName,
	isNotActive,
	hasChangesets,
	setChangesets,
	originDefaultAttributes,
	context = 'inspector-controls',
	pickerVariationSurface,
}: T_BLOCK_STYLES_PROPS): MixedElement | null {
	const [isPromotionPopoverOpen, setIsPromotionPopoverOpen] = useState(false);

	const {
		userConfig,
		baseConfig,
		style: editorStyles,
		setStyle: setStyles,
		setCurrentBlockStyleVariation,
		currentBlockStyleVariation,
		variationSurface: panelVariationSurface = VARIATION_SURFACE_STYLE,
	} = useGlobalStylesPanelContext();
	const variationSurface =
		pickerVariationSurface !== undefined && pickerVariationSurface !== ''
			? pickerVariationSurface
			: panelVariationSurface;
	const { isNormalState } = useBlockContext();
	const [searchTerm, setSearchTerm] = useState('');
	const [counter, setCounter] = useBlockStylesCounter({
		blockName,
		baseConfig,
		userConfig,
		blockDynamicStylesCount,
	});
	const [blockStyles, setBlockStyles] = useState(styles.stylesToRender);
	const [hoveredStyle, setHoveredStyle] = useState(null);
	const [showPreview, setShowPreview] = useState(false);
	const hoveredStyleRef = useRef(null);
	const hasShownPreviewRef = useRef(false);
	const isMobileViewport = useViewportMatch('medium', '<');

	const MAX_ITEMS_FOR_PROMOTION = applyFilters(
		'blockera.block.style.variations.globalStylesMaxItems',
		2
	);

	const handlePromotionPopover = useCallback((): boolean => {
		let canDoAction = true;

		// Validate limitation for adding new style variation.
		if (
			-1 !== MAX_ITEMS_FOR_PROMOTION &&
			counter >= MAX_ITEMS_FOR_PROMOTION
		) {
			canDoAction = false;

			setIsPromotionPopoverOpen(!canDoAction);

			return canDoAction;
		}

		return canDoAction;
	}, [counter, MAX_ITEMS_FOR_PROMOTION, setIsPromotionPopoverOpen]);

	const {
		onSelect,
		setIsOpen,
		activeStyle: stylesActiveStyle,
		popoverAnchor,
		isDeletedStyle,
		stylesToRender,
		previewClassName,
		genericPreviewBlock,
		setCurrentActiveStyle: stylesSetCurrentActiveStyle,
		setCurrentPreviewStyle,
	} = styles;

	// In global-styles-panel, use context values when styles prop doesn't provide them
	const activeStyle =
		'global-styles-panel' === context
			? (currentBlockStyleVariation ?? stylesActiveStyle)
			: stylesActiveStyle;
	const fallbackSetCurrentActiveStyle =
		stylesSetCurrentActiveStyle ?? (() => {});
	const setCurrentActiveStyle =
		'global-styles-panel' === context
			? setCurrentBlockStyleVariation
			: fallbackSetCurrentActiveStyle;

	// Update ref whenever hoveredStyle changes
	useEffect(() => {
		hoveredStyleRef.current = hoveredStyle;
	}, [hoveredStyle]);

	// Update hasShownPreviewRef when showPreview changes
	useEffect(() => {
		if (showPreview) {
			hasShownPreviewRef.current = true;
		}
	}, [showPreview]);

	const onSelectStylePreview = useCallback(
		(style: string) => {
			// It should not work for other states
			if (!isNormalState()) {
				return;
			}

			setCurrentActiveStyle(style);
			onSelect(style);
			setIsOpen(false);
			setHoveredStyle(null);
		},
		[
			isNormalState,
			setCurrentActiveStyle,
			onSelect,
			setIsOpen,
			setHoveredStyle,
		]
	);

	const styleItemHandler = useCallback(
		(item: Object) => {
			// It should not work for other states
			if (!isNormalState()) {
				return;
			}

			if (hoveredStyle === item || activeStyle?.name === item?.name) {
				setHoveredStyle(null);
				setCurrentPreviewStyle(item);
				return;
			}

			// Set preview style when hovering/focusing
			if (item) {
				setHoveredStyle(item);
				setCurrentPreviewStyle(item);
				onSelect(item);
				// Add timeout to show preview with dynamic delay
				setTimeout(() => {
					if (hoveredStyleRef.current?.name === item?.name) {
						setShowPreview(true);
					}
				}, 1200);
			} else {
				// Clear preview style when mouse leaves or blur
				setCurrentPreviewStyle(null);
				setShowPreview(false);
				setHoveredStyle(null);
			}
		},
		[
			onSelect,
			hoveredStyle,
			isNormalState,
			setShowPreview,
			setHoveredStyle,
			hoveredStyleRef,
			activeStyle?.name,
			setCurrentPreviewStyle,
		]
	);

	const blockStylesPickerValue = useMemo(
		() => ({
			blockName,
			counter,
			counterMap: blockDynamicStylesCount,
			setCounter,
			blockStyles,
			setBlockStyles,
			activeStyle,
			setCurrentActiveStyle,
			setCurrentBlockStyleVariation,
			handlePromotionPopover,
			onSelectStylePreview,
			setCurrentPreviewStyle,
			styleItemHandler,
			editorStyles: 'global-styles-panel' === context ? editorStyles : {},
			setStyles: 'global-styles-panel' === context ? setStyles : () => {},
			originDefaultAttributes: originDefaultAttributes ?? {},
			hasChangesets: hasChangesets ?? false,
			setChangesets: setChangesets ?? (() => {}),
			isNotActive: isNotActive ?? false,
			variationSurface,
		}),
		[
			blockName,
			counter,
			blockStyles,
			activeStyle,
			setCounter,
			setBlockStyles,
			setCurrentActiveStyle,
			setCurrentBlockStyleVariation,
			handlePromotionPopover,
			onSelectStylePreview,
			setCurrentPreviewStyle,
			styleItemHandler,
			context,
			editorStyles,
			setStyles,
			originDefaultAttributes,
			hasChangesets,
			setChangesets,
			isNotActive,
			variationSurface,
		]
	);

	if (
		!stylesToRender ||
		(stylesToRender.length === 0 &&
			variationSurface !== VARIATION_SURFACE_SIZE)
	) {
		return null;
	}

	// Handle search
	const handleSearch = (newValue: string) => {
		setSearchTerm(newValue);

		if (!newValue) {
			setBlockStyles(stylesToRender);
			return;
		}

		const filtered = stylesToRender.filter((style) => {
			const label =
				style.label || style.name || __('Default', 'blockera');
			return label.toLowerCase().includes(newValue.toLowerCase());
		});

		setBlockStyles(filtered);
	};

	if ('global-styles-panel' === context) {
		return (
			<BlockStylesPickerContextProvider value={blockStylesPickerValue}>
				<StyleVariationsManager />
				{isPromotionPopoverOpen && (
					<PromoteGlobalStylesPremiumFeature
						items={blockStyles}
						onClose={() => setIsPromotionPopoverOpen(false)}
						isOpen={isPromotionPopoverOpen}
					/>
				)}
			</BlockStylesPickerContextProvider>
		);
	}

	return (
		<BlockStylesPickerContextProvider value={blockStylesPickerValue}>
			<SlotFillProvider>
				<Popover
					title={''}
					offset={10}
					placement="bottom-start"
					className="variations-picker-popover"
					onClose={() => {
						setIsOpen(false);
						setCurrentPreviewStyle(null);
					}}
					anchor={popoverAnchor}
				>
					<Flex
						className={componentClassNames('block-styles')}
						direction="column"
						gap="20px"
					>
						<ControlContextProvider
							value={{
								name: 'search-styles',
								value: searchTerm,
							}}
						>
							<SearchControl
								onChange={handleSearch}
								placeholder={__('Search styles…', 'blockera')}
							/>
						</ControlContextProvider>

						{blockStyles.length === 0 ? (
							<Flex
								alignItems="center"
								direction="column"
								justifyContent="space-between"
								gap="0"
								style={{ padding: '40px 0' }}
							>
								<Icon
									icon="block-default"
									library="wp"
									style={{ fill: '#949494' }}
								/>
								<p>{__('No styles found.', 'blockera')}</p>
							</Flex>
						) : (
							<>
								<Flex direction="column" gap="10px">
									<AddNewStyleButton
										label={
											variationSurface !==
											VARIATION_SURFACE_SIZE
												? __(
														'Style Variations',
														'blockera'
													)
												: __(
														'Size Variations',
														'blockera'
													)
										}
									/>
									{isPromotionPopoverOpen && (
										<PromoteGlobalStylesPremiumFeature
											items={blockStyles}
											onClose={() =>
												setIsPromotionPopoverOpen(false)
											}
											isOpen={isPromotionPopoverOpen}
										/>
									)}

									<div
										className={componentInnerClassNames(
											'block-styles__variants'
										)}
									>
										{blockStyles.map((style) => (
											<StyleItem
												key={style.name}
												style={style}
												inGlobalStylesPanel={false}
											/>
										))}

										{hoveredStyle &&
											!isMobileViewport &&
											showPreview && (
												<WPPopover
													placement="left-start"
													offset={40}
													focusOnMount={false}
													animate={false}
												>
													<div
														className="block-editor-block-styles__preview-panel"
														onMouseLeave={() =>
															styleItemHandler(
																null
															)
														}
													>
														<BlockStylesPreviewPanel
															activeStyle={
																activeStyle
															}
															className={
																previewClassName
															}
															genericPreviewBlock={
																genericPreviewBlock
															}
															style={hoveredStyle}
														/>
													</div>
												</WPPopover>
											)}
									</div>
								</Flex>

								{activeStyle?.name && (
									<Flex direction="column" gap="8px">
										<h2
											className={classNames(
												'blockera-block-styles-category'
											)}
										>
											{__('Actions', 'blockera')}
										</h2>

										<Slot name="block-inspector-style-actions" />
									</Flex>
								)}
							</>
						)}

						{isString(isDeletedStyle) && (
							<NoticeControl type="error">
								<p>
									<DynamicHtmlFormatter
										text={sprintf(
											/* translators: %s: The name of the missing style variation */
											__(
												'The “%s” style variation is missing. It might have been deleted or belong to a theme or plugin that’s currently inactive.',
												'blockera'
											),
											'{style}'
										)}
										replacements={{
											style: (
												<strong>
													{isDeletedStyle}
												</strong>
											),
										}}
									/>
								</p>

								<p>
									<DynamicHtmlFormatter
										text={sprintf(
											/* translators: %s: The name of the currently active style */
											__(
												'This block is currently using the “%s” style instead.',
												'blockera'
											),
											'{style}'
										)}
										replacements={{
											style: (
												<strong>
													{activeStyle?.name ||
														__(
															'Default',
															'blockera'
														)}
												</strong>
											),
										}}
									/>
								</p>
							</NoticeControl>
						)}
					</Flex>
				</Popover>
			</SlotFillProvider>
		</BlockStylesPickerContextProvider>
	);
}

export default BlockStyles;
