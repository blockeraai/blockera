// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { debounce, useViewportMatch } from '@wordpress/compose';
import {
	__experimentalTruncate as Truncate,
	Popover,
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
} from '@blockera/controls';
import {
	classNames,
	componentClassNames,
	componentInnerClassNames,
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
	clientId,
}: {
	styles: {
		onSelect: (style: string) => void,
		stylesToRender: Array<Object>,
		activeStyle: Object,
		genericPreviewBlock: Object,
		previewClassName: string,
	},
	onHoverClassName?: (style?: string | null) => void,
	clientId: string,
}): MixedElement | null {
	const { isNormalState } = useBlockContext();
	const [searchTerm, setSearchTerm] = useState('');
	const [filteredStyles, setFilteredStyles] = useState(styles.stylesToRender);

	const {
		onSelect,
		stylesToRender,
		activeStyle,
		genericPreviewBlock,
		previewClassName,
	} = styles;

	const [hoveredStyle, setHoveredStyle] = useState(null);
	const isMobileViewport = useViewportMatch('medium', '<');

	if (!stylesToRender || stylesToRender.length === 0) {
		return null;
	}

	const debouncedSetHoveredStyle = debounce(setHoveredStyle, 250);

	const onSelectStylePreview = (style: string) => {
		// It should not work for other states
		if (!isNormalState()) {
			return;
		}

		onSelect(style);
		onHoverClassName(null);
		setHoveredStyle(null);
		debouncedSetHoveredStyle.cancel();
	};

	const styleItemHandler = (item: Object, type: string = '') => {
		// It should not work for other states
		if (!isNormalState()) {
			return;
		}

		// do not show on focus if item is default
		if (type === 'focus' && item.name === 'default') {
			return;
		}

		if (hoveredStyle === item) {
			debouncedSetHoveredStyle.cancel();
			return;
		}
		debouncedSetHoveredStyle(item);
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
		<div className={componentClassNames('block-styles')}>
			<Flex direction="column" gap="15px">
				<ControlContextProvider
					value={{
						name: 'search-styles-' + clientId,
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
											styleItemHandler(
												style,
												'mouseEnter'
											)
										}
										onFocus={() =>
											styleItemHandler(style, 'focus')
										}
										onMouseLeave={() =>
											styleItemHandler(null, 'mouseLeave')
										}
										onBlur={() =>
											styleItemHandler(null, 'blur')
										}
										onClick={() =>
											onSelectStylePreview(style)
										}
										aria-current={
											activeStyle.name === style.name
										}
										size="input"
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

							{hoveredStyle && !isMobileViewport && (
								<Popover
									placement="left-start"
									offset={40}
									focusOnMount={false}
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
								</Popover>
							)}
						</div>
					</Flex>
				)}
			</Flex>
		</div>
	);
}

export default BlockStyles;
