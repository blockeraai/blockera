// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useRef, useEffect } from '@wordpress/element';
import { useViewportMatch } from '@wordpress/compose';
import {
	Slot,
	SlotFillProvider,
	Popover as WPPopover,
} from '@wordpress/components';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import {
	Flex,
	Popover,
	SearchControl,
	ControlContextProvider,
} from '@blockera/controls';
import {
	classNames,
	componentClassNames,
	componentInnerClassNames,
} from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { StyleItem } from './style-item';
import { useBlockContext } from '../../../../hooks';
import { AddNewStyleButton } from './add-new-style-button';
import { default as BlockStylesPreviewPanel } from './preview-panel';
import { useGlobalStylesPanelContext } from '../../../../../canvas-editor/components/block-global-styles-panel-screen/context';

// Block Styles component for the Settings Sidebar.
function BlockStyles({
	styles,
	blockName,
	isNotActive,
	onHoverClassName = () => {},
	context = 'inspector-controls',
}: {
	blockName: string,
	isNotActive: boolean,
	context?: 'global-styles-panel' | 'inspector-controls',
	styles: {
		onSelect: (style: string) => void,
		stylesToRender: Array<Object>,
		activeStyle: Object,
		genericPreviewBlock: Object,
		setCurrentActiveStyle: (style: Object) => void,
		setCurrentPreviewStyle: (style: Object) => void,
		previewClassName: string,
		popoverAnchor: Object,
		setIsOpen: (isOpen: boolean) => void,
	},
	onHoverClassName?: (style?: string | null) => void,
}): MixedElement | null {
	const { isNormalState } = useBlockContext();
	const [searchTerm, setSearchTerm] = useState('');
	const [blockStyles, setBlockStyles] = useState(styles.stylesToRender);
	const [hoveredStyle, setHoveredStyle] = useState(null);
	const [showPreview, setShowPreview] = useState(false);
	const hoveredStyleRef = useRef(null);
	const hasShownPreviewRef = useRef(false);
	const isMobileViewport = useViewportMatch('medium', '<');
	const {
		styles: editorStyles,
		setStyles,
		currentBlockStyleVariation,
		setCurrentBlockStyleVariation,
	} = useGlobalStylesPanelContext() || {
		currentBlockStyleVariation: undefined,
		setCurrentBlockStyleVariation: () => {},
	};

	const {
		onSelect,
		stylesToRender,
		activeStyle,
		genericPreviewBlock,
		setCurrentActiveStyle,
		setCurrentPreviewStyle,
		previewClassName,
		popoverAnchor,
		setIsOpen,
	} = styles;

	useEffect(() => {
		if (
			currentBlockStyleVariation?.name &&
			activeStyle?.name !== currentBlockStyleVariation?.name
		) {
			const foundedStyle = blockStyles.find(
				(style) => style.name === activeStyle?.name
			);
			const index = blockStyles.indexOf(foundedStyle);

			setBlockStyles([
				...blockStyles.slice(0, index),
				currentBlockStyleVariation,
				...blockStyles.slice(index + 1),
			]);
		}
	}, [currentBlockStyleVariation, activeStyle, blockStyles]);

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

	if (!stylesToRender || stylesToRender.length === 0) {
		return null;
	}

	const onSelectStylePreview = (style: string) => {
		// It should not work for other states
		if (!isNormalState()) {
			return;
		}

		setCurrentActiveStyle(style);
		onSelect(style);
		setIsOpen(false);
		onHoverClassName(null);
		setHoveredStyle(null);
	};

	const styleItemHandler = (item: Object) => {
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

		onHoverClassName(item?.name ?? null);
	};

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
			<div
				className={isNotActive ? 'blockera-control-is-not-active' : ''}
			>
				<Flex
					className={componentClassNames('block-styles')}
					direction="column"
					gap="20px"
				>
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
									styles={editorStyles}
									setStyles={setStyles}
									blockName={blockName}
									label={__('Style Variations', 'blockera')}
									blockStyles={blockStyles}
									setCurrentBlockStyleVariation={
										setCurrentBlockStyleVariation
									}
									setCurrentActiveStyle={
										setCurrentActiveStyle
									}
									setBlockStyles={setBlockStyles}
								/>

								<div
									className={componentInnerClassNames(
										'block-styles__variants'
									)}
								>
									{blockStyles.map((style) => (
										<StyleItem
											key={style.name}
											style={style}
											blockName={blockName}
											blockStyles={blockStyles}
											setBlockStyles={setBlockStyles}
											activeStyle={activeStyle}
											setCurrentActiveStyle={
												setCurrentActiveStyle
											}
											inGlobalStylesPanel={true}
											onSelectStylePreview={
												onSelectStylePreview
											}
											setCurrentPreviewStyle={
												setCurrentPreviewStyle
											}
											styleItemHandler={styleItemHandler}
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
														styleItemHandler(null)
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
						</>
					)}
				</Flex>
			</div>
		);
	}

	return (
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
									blockName={blockName}
									label={__('Style Variations', 'blockera')}
									blockStyles={blockStyles}
									setBlockStyles={setBlockStyles}
									setCurrentBlockStyleVariation={
										setCurrentBlockStyleVariation
									}
									setCurrentActiveStyle={
										setCurrentActiveStyle
									}
								/>

								<div
									className={componentInnerClassNames(
										'block-styles__variants'
									)}
								>
									{blockStyles.map((style) => (
										<StyleItem
											key={style.name}
											style={style}
											activeStyle={activeStyle}
											setCurrentActiveStyle={
												setCurrentActiveStyle
											}
											inGlobalStylesPanel={false}
											onSelectStylePreview={
												onSelectStylePreview
											}
											setCurrentPreviewStyle={
												setCurrentPreviewStyle
											}
											styleItemHandler={styleItemHandler}
											blockName={blockName}
											blockStyles={blockStyles}
											setBlockStyles={setBlockStyles}
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
														styleItemHandler(null)
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
						</>
					)}
				</Flex>
			</Popover>
		</SlotFillProvider>
	);
}

export default BlockStyles;
