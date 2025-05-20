// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useRef, useEffect } from '@wordpress/element';
import { useViewportMatch } from '@wordpress/compose';
import {
	__experimentalTruncate as Truncate,
	Popover as WPPopover,
} from '@wordpress/components';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import {
	Button,
	SearchControl,
	Flex,
	ControlContextProvider,
	Popover,
} from '@blockera/controls';
import {
	classNames,
	componentClassNames,
	componentInnerClassNames,
	controlInnerClassNames,
} from '@blockera/classnames';
import { Icon } from '@blockera/icons';
import { isBlockTheme } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { default as BlockStylesPreviewPanel } from './preview-panel';
import { useBlockContext } from '../../../../hooks';

// Block Styles component for the Settings Sidebar.
function BlockStyles({
	styles,
	onHoverClassName = () => {},
}: {
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
	const [filteredStyles, setFilteredStyles] = useState(styles.stylesToRender);
	const [hoveredStyle, setHoveredStyle] = useState(null);
	const [showPreview, setShowPreview] = useState(false);
	const hoveredStyleRef = useRef(null);
	const hasShownPreviewRef = useRef(false);
	const isMobileViewport = useViewportMatch('medium', '<');

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
			setTimeout(
				() => {
					if (hoveredStyleRef.current?.name === item?.name) {
						setShowPreview(true);
					}
				},
				hasShownPreviewRef.current ? 0 : 1500
			);
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
			setFilteredStyles(stylesToRender);
			return;
		}

		const filtered = stylesToRender.filter((style) => {
			const label =
				style.label || style.name || __('Default', 'blockera');
			return label.toLowerCase().includes(newValue.toLowerCase());
		});

		setFilteredStyles(filtered);
	};

	return (
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

				{filteredStyles.length === 0 ? (
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
							<h2
								className={classNames(
									'blockera-block-styles-category'
								)}
							>
								{isBlockTheme()
									? __('Theme Block Styles', 'blockera')
									: __('Block Styles', 'blockera')}
							</h2>

							<div
								className={componentInnerClassNames(
									'block-styles__variants'
								)}
							>
								{filteredStyles.map((style) => {
									const buttonText =
										style.label ||
										style.name ||
										__('Default', 'blockera');

									return (
										<Button
											className={classNames(
												'block-editor-block-styles__item',
												{
													'is-active':
														activeStyle.name ===
														style.name,
												}
											)}
											key={style.name}
											variant="secondary"
											label={
												style?.isDefault &&
												style?.name !== 'default'
													? buttonText +
													  ` (${__(
															'Default',
															'blockera'
													  )})`
													: ''
											}
											onMouseEnter={() =>
												styleItemHandler(style)
											}
											onFocus={() =>
												styleItemHandler(style)
											}
											onMouseLeave={() =>
												styleItemHandler(null)
											}
											onBlur={() => {
												setCurrentPreviewStyle(null);
												styleItemHandler(null);
											}}
											onClick={() =>
												onSelectStylePreview(style)
											}
											aria-current={
												activeStyle.name === style.name
											}
											size="input"
											data-test={`style-${style.name}`}
										>
											<Truncate
												numberOfLines={1}
												className="block-editor-block-styles__item-text"
											>
												{buttonText}
											</Truncate>
										</Button>
									);
								})}

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
													activeStyle={activeStyle}
													className={previewClassName}
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
								{__('Custom Styles', 'blockera')}

								<Button
									size="extra-small"
									className={controlInnerClassNames(
										'btn-add',
										'blockera-control-is-not-active'
									)}
									onClick={() => {}}
									style={{
										width: '24px',
										height: '24px',
										padding: 0,
										marginLeft: 'auto',
									}}
								>
									<Icon icon="plus" iconSize="20" />
								</Button>
							</h2>

							<p
								style={{
									color: '#949494',
									margin: 0,
									fontSize: '12px',
									fontWeight: '400',
								}}
							>
								<a
									className="blockera-component-block-styles__coming-soon"
									href="https://community.blockera.ai/feature-request-1rsjg2ck/post/style-variations-manager---create-and-update-style-variation-from-blocks-GmNoPXkNdoWkSl4?utm_source=blockera-editor&utm_medium=block-card&utm_campaign=style-variations-manager"
									target="_blank"
									rel="noopener noreferrer"
								>
									{__('Coming soon…', 'blockera')}
								</a>
							</p>
						</Flex>
					</>
				)}
			</Flex>
		</Popover>
	);
}

export default BlockStyles;
