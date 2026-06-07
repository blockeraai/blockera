// @flow
/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { applyFilters } from '@wordpress/hooks';
import type { MixedElement, ComponentType } from 'react';
import { createRoot, useCallback } from '@wordpress/element';
import { dispatch, useSelect } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import {
	Flex,
	Button,
	BaseControl,
	IconControl,
	LinkControl,
	ColorControl,
	InputControl,
	PanelBodyControl,
	ToggleSelectControl,
	ControlContextProvider,
} from '@blockera/controls';
import {
	Icon,
	isStrokeIconLibrary,
	isStrokeSvgMarkup,
	prepareIconSvgForStorage,
	extractSvgMarkup,
} from '@blockera/icons';
import { extensionClassNames } from '@blockera/classnames';
import { isShowField } from '@blockera/editor/js/extensions/api/utils';
import { isEquals, addAngle, isEmpty, isUndefined } from '@blockera/utils';
import { generateExtensionId } from '@blockera/editor/js/extensions/libs/utils';
import { STORE_NAME as EXTENSIONS_CONFIG_STORE_NAME } from '@blockera/editor/js/extensions/libs/base/store/constants';
import { default as EditorFeatureWrapper } from '@blockera/editor/js/components/editor-feature-wrapper';

/**
 * Internal dependencies
 */
import type { TIconProps } from './types/icon-extension-props';
import {
	getIconColorAttributeId,
	getIconSizeAttributeId,
	isStandaloneIconBlock,
} from '../helpers';
import {
	decodeRenderedIcon,
	hasBlockeraIconValue,
} from '../icon-attribute-utils';

export const IconExtension: ComponentType<{
	...TIconProps,
	...TExtensionFillComponentProps,
}> = ({
	block,
	iconConfig: {
		blockeraIcon,
		blockeraIconGap,
		blockeraIconSize,
		blockeraIconLink,
		blockeraIconColor,
		blockeraIconPosition,
		blockeraIconRotate,
		blockeraIconFlipHorizontal,
		blockeraIconFlipVertical,
	},
	currentStateAttributes,
	handleOnChangeAttributes,
	extensionProps = {
		blockeraIcon: {},
		blockeraIconGap: {},
		blockeraIconSize: {},
		blockeraIconLink: {},
		blockeraIconColor: {},
		blockeraIconPosition: {},
		blockeraIconRotate: {},
		blockeraIconFlipHorizontal: {},
		blockeraIconFlipVertical: {},
	},
	attributes,
	useBlockSection,
	activeSearchMode = false,
}: TIconProps): MixedElement => {
	const { changeExtensionCurrentBlock: setCurrentBlock } =
		dispatch('blockera/extensions') || {};
	const { initialOpen, onToggle } = useBlockSection('iconConfig');
	const blockName = block.activeBlockVariation?.name || block?.blockName;
	const showInlineIconLayout = !isStandaloneIconBlock(blockName);
	const registeredIconConfig = useSelect(
		(select) => {
			const { getExtension } = select(EXTENSIONS_CONFIG_STORE_NAME) || {};

			return 'function' === typeof getExtension
				? getExtension('iconConfig', blockName)
				: null;
		},
		[blockName]
	);
	const resolvedIconSizeConfig =
		registeredIconConfig?.blockeraIconSize || blockeraIconSize;
	const resolvedIconColorConfig =
		registeredIconConfig?.blockeraIconColor || blockeraIconColor;
	const iconSizeAttributeId = getIconSizeAttributeId(resolvedIconSizeConfig);
	const iconColorAttributeId = getIconColorAttributeId(
		resolvedIconColorConfig
	);

	const {
		blockeraIcon: icon,
		blockeraIconGap: iconGap,
		blockeraIconLink: iconLink,
		blockeraIconPosition: iconPosition,
		blockeraIconRotate: iconRotate,
		blockeraIconFlipHorizontal: iconFlipHorizontal,
		blockeraIconFlipVertical: iconFlipVertical,
	} = currentStateAttributes;
	const iconSize =
		currentStateAttributes[iconSizeAttributeId] ??
		('blockeraIconSize' !== iconSizeAttributeId
			? currentStateAttributes.blockeraIconSize
			: undefined);
	const iconColor =
		currentStateAttributes[iconColorAttributeId] ??
		('blockeraIconColor' !== iconColorAttributeId
			? currentStateAttributes.blockeraIconColor
			: undefined);

	const encodeIcon = useCallback(
		(
			iconHTML: string,
			{
				library = '',
				hasInlineStyle = false,
				color,
				preserveSvg = false,
			} = {}
		) => {
			let normalizedHTML = preserveSvg
				? extractSvgMarkup(iconHTML) || iconHTML
				: prepareIconSvgForStorage(iconHTML, library);

			if (hasInlineStyle) {
				const iconDoc = new DOMParser().parseFromString(
					normalizedHTML,
					'text/html'
				);
				const svgElement = iconDoc.querySelector('svg');

				if (svgElement) {
					if (color) {
						svgElement.style.color = color;

						if (
							!preserveSvg &&
							!isStrokeIconLibrary(library) &&
							!isStrokeSvgMarkup(svgElement.outerHTML)
						) {
							svgElement.style.fill = color;
						} else if (
							preserveSvg &&
							!isStrokeSvgMarkup(svgElement.outerHTML)
						) {
							svgElement.style.fill = color;
						} else {
							svgElement.style.fill = 'none';
							svgElement.setAttribute('stroke', 'currentColor');
						}
					}

					normalizedHTML = preserveSvg
						? svgElement.outerHTML
						: prepareIconSvgForStorage(
								svgElement.outerHTML,
								library
							);
				}
			}

			return {
				encodedIcon: btoa(unescape(encodeURIComponent(normalizedHTML))),
				icon: encodeURIComponent(normalizedHTML),
			};
		},
		[]
	);

	const renderIcon = useCallback(
		async (newValue, effectiveItems = {}) => {
			const iconNode = document.createElement('span');
			document
				.querySelector('.blockera-temp-icon-wrapper')
				?.append(iconNode);
			const iconRoot = createRoot(iconNode);

			const color = !isUndefined(effectiveItems?.blockeraIconColor?.value)
				? effectiveItems?.blockeraIconColor?.value
				: iconColor?.value || iconColor;
			const isStrokeLibrary = isStrokeIconLibrary(newValue.library);

			iconRoot.render(
				<Icon
					style={{
						color,
						...(!isStrokeLibrary && color ? { fill: color } : {}),
						width: iconSize ? iconSize : '1em',
						height: iconSize ? iconSize : '1em',
						...(iconPosition === 'start' && {
							marginRight: iconGap,
						}),
						...(iconPosition === 'end' && {
							marginLeft: iconGap,
						}),
					}}
					xmlns="http://www.w3.org/2000/svg"
					icon={newValue.icon}
					library={newValue.library}
					uploadSVG={newValue.uploadSVG}
				/>
			);

			return new Promise((resolve) => {
				setTimeout(() => {
					const renderedIcon = encodeIcon(iconNode?.innerHTML || '', {
						library: newValue.library,
						color,
					});
					resolve(renderedIcon);
					iconRoot.unmount();
				}, 1);
			});
		},
		[iconColor, iconSize, iconGap, iconPosition, encodeIcon]
	);

	const handleOnChangeAttributesIcon = useCallback(
		async (newValue, ref, effectiveItems = {}) => {
			if (isEquals(icon, newValue) && isEmpty(effectiveItems)) {
				return;
			}

			if (newValue.icon) {
				const renderedIcon = await renderIcon(newValue, effectiveItems);

				// core/icon `icon` attribute sync is handled in blocks-core icon bootstrap.
				handleOnChangeAttributes(
					'blockeraIcon',
					{
						...newValue,
						renderedIcon: renderedIcon.encodedIcon,
					},
					{ ref, effectiveItems }
				);
			} else if (newValue.svgString || !isEmpty(effectiveItems)) {
				if (!newValue.hasOwnProperty('svgString')) {
					newValue.svgString = decodeRenderedIcon(icon.renderedIcon);
				}

				applyFilters(
					'blockera.featureIcon.extension.uploadSVG.onChangeHandler',
					{
						ref,
						newValue,
						blockName,
						encodeIcon,
						isIconBlock:
							isStandaloneIconBlock(blockName) ||
							String(attributes?.className || '').includes(
								'wp-block-icon-blockera'
							),
						effectiveItems: {
							...effectiveItems,
							blockeraIconColor: {
								value: !isUndefined(
									effectiveItems?.blockeraIconColor?.value
								)
									? effectiveItems?.blockeraIconColor?.value
									: iconColor,
							},
						},
						handleOnChangeAttributes,
					}
				);
			} else if (isStandaloneIconBlock(blockName)) {
				const emptyIcon = {
					icon: '',
					library: '',
					renderedIcon:
						'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiPgogIDxwYXRoIGQ9Ik01LjEyMzIxMjE2LDEzLjU0Njg3ODUgTDUuMDczNzAwNzgsMTMuNjMzNjI0OCBDNC44MzA3NzM4MywxNC4xMzIyMDY2IDUuMjE4OTIwMjcsMTQuNzM1MjE1NSA1Ljc5MTEzNjkyLDE0LjY4MjU4NzYgTDEwLjI2MjQ3MTUsMTQuMjcwNTQ5IEw5LjgyOTMzODY2LDIxLjcyMjc5MTkgQzkuNzg1OTcwMjEsMjIuNDY4Njc1OSAxMC43NDQ3ODYyLDIyLjc5Mzc2NjkgMTEuMTU0NDQ0OCwyMi4xNzIwNzUzIEwxOC44NzY3OTMyLDEwLjQ1Mjc1NTMgTDE4LjkyNjMwNDYsMTAuMzY2MDA1OSBDMTkuMTY5MjI5NSw5Ljg2NzQwNjc2IDE4Ljc4MTA0NDksOS4yNjQzOTE1IDE4LjIwODgxNTIsOS4zMTcwNTkxOCBMMTMuNzM2NTYzLDkuNzI4NDc0NDggTDE0LjE3MDY2MTEsMi4yNzcyMDgxNCBDMTQuMjE0MDI5MiwxLjUzMTMyOTYgMTMuMjU1MjI0OCwxLjIwNjIzNDg5IDEyLjg0NTU2MDYsMS44Mjc5MTYxNCBMNS4xMjMyMTIxNiwxMy41NDY4Nzg1IFogTTEyLjU2NzU5MjUsNC44ODk1MTk2MSBMMTIuMjQyNTcyNSwxMC40OTIxMTk2IEwxMi4yNDI5OTI1LDEwLjU4NjU4MjIgQzEyLjI3MDI1MjEsMTAuOTg5NDk2OCAxMi42MjE0MTk2LDExLjMwMjIzOTYgMTMuMDMwODg2MiwxMS4yNjQ1NTI1IEwxNi44MzEyOTQxLDEwLjkxNDA0MjggTDExLjQzMTQ0MiwxOS4xMDk1MDM4IEwxMS43NTc0MjcyLDEzLjUwNzg4MDQgTDExLjc1NzAwNzUsMTMuNDEzNDIxOCBDMTEuNzI5NzUxLDEzLjAxMDUyMzUgMTEuMzc4NjEyNCwxMi42OTc3ODUgMTAuOTY5MTYxMSwxMi43MzU0NDMxIEw3LjE2Nzc0MDMyLDEzLjA4NDk4MDYgTDEyLjU2NzU5MjUsNC44ODk1MTk2MSBaIj48L3BhdGg+Cjwvc3ZnPg==',
				};

				handleOnChangeAttributes('blockeraIcon', emptyIcon, {
					ref,
					effectiveItems: {
						...effectiveItems,
						blockeraIconColor: {
							value: '',
						},
					},
				});
			} else {
				const emptyIcon = {
					icon: '',
					library: '',
					renderedIcon: '',
				};

				handleOnChangeAttributes('blockeraIcon', emptyIcon, {
					ref,
				});
			}
		},
		[
			icon,
			blockName,
			renderIcon,
			encodeIcon,
			handleOnChangeAttributes,
			iconColor,
		]
	);

	// Icon is not available in inner blocks.
	if (block.currentBlock !== 'master') {
		return <></>;
	}

	const isShownIcon = isShowField(
		blockeraIcon,
		icon,
		attributes?.blockeraIcon?.default?.value
	);
	const isShownIconPosition = isShowField(
		blockeraIconPosition,
		iconPosition,
		attributes?.blockeraIconPosition?.default?.value
	);
	const isShownIconGap = isShowField(
		blockeraIconGap,
		iconGap,
		attributes?.blockeraIconGap?.default?.value
	);
	const isShownIconSize = isShowField(
		blockeraIconSize,
		iconSize,
		attributes?.[iconSizeAttributeId]?.default?.value
	);
	const isShownIconColor = isShowField(
		blockeraIconColor,
		iconColor,
		attributes?.[iconColorAttributeId]?.default?.value
	);
	const isShownIconLink = isShowField(
		blockeraIconLink,
		iconLink,
		attributes?.blockeraIconLink?.default?.value
	);
	const isShownIconRotate = isShowField(
		blockeraIconRotate,
		iconRotate,
		attributes?.blockeraIconRotate?.default?.value
	);
	const isShownIconFlipHorizontal = isShowField(
		blockeraIconFlipHorizontal,
		iconFlipHorizontal,
		attributes?.blockeraIconFlipHorizontal?.default?.value
	);
	const isShownIconFlipVertical = isShowField(
		blockeraIconFlipVertical,
		iconFlipVertical,
		attributes?.blockeraIconFlipVertical?.default?.value
	);

	// Extension is not available because all features are disabled.
	if (
		!isShownIcon &&
		!isShownIconPosition &&
		!isShownIconGap &&
		!isShownIconSize &&
		!isShownIconColor &&
		!isShownIconLink &&
		!isShownIconRotate &&
		!isShownIconFlipHorizontal &&
		!isShownIconFlipVertical
	) {
		return <></>;
	}

	return (
		<PanelBodyControl
			onToggle={onToggle}
			title={__('Icon', 'blockera')}
			initialOpen={initialOpen}
			noWrapper={activeSearchMode}
			icon={<Icon icon="extension-icon" />}
			className={extensionClassNames('icon')}
		>
			<EditorFeatureWrapper isActive={isShownIcon} config={blockeraIcon}>
				<ControlContextProvider
					value={{
						name: generateExtensionId(block, 'icon'),
						value: icon,
						attribute: 'blockeraIcon',
						blockName: block.blockName,
					}}
				>
					<IconControl
						columns="columns-1"
						suggestionsQuery={() => {
							return 'button';
						}}
						onChange={handleOnChangeAttributesIcon}
						defaultValue={attributes?.blockeraIcon?.default?.value}
						{...extensionProps.blockeraIcon}
					/>
				</ControlContextProvider>
			</EditorFeatureWrapper>

			{hasBlockeraIconValue(icon) && (
				<>
					<BaseControl
						label={__('Style', 'blockera')}
						columns="1fr 180px"
					>
						{showInlineIconLayout && (
							<EditorFeatureWrapper
								isActive={isShownIconPosition}
								config={blockeraIconPosition}
							>
								<ControlContextProvider
									value={{
										name: generateExtensionId(
											block,
											'icon-position'
										),
										value: iconPosition,
										attribute: 'blockeraIconPosition',
										blockName: block.blockName,
									}}
								>
									<ToggleSelectControl
										label={__('Position', 'blockera')}
										labelPopoverTitle={__(
											'Icon Position',
											'blockera'
										)}
										labelDescription={
											<>
												<p>
													{__(
														'Sets the placement of the icon within the block.',
														'blockera'
													)}
												</p>
												<p>
													{__(
														'You can choose to display the icon on the left or right side of the block content, allowing better alignment with your layout and design needs.',
														'blockera'
													)}
												</p>
											</>
										}
										columns="columns-2"
										options={[
											{
												label: __('Start', 'blockera'),
												value: 'start',
												icon: (
													<Icon
														icon="icon-position-left"
														iconSize="18"
													/>
												),
											},
											{
												label: __('End', 'blockera'),
												value: 'end',
												icon: (
													<Icon
														icon="icon-position-right"
														iconSize="18"
													/>
												),
											},
										]}
										isDeselectable={true}
										defaultValue={
											attributes?.blockeraIconPosition
												?.default?.value
										}
										onChange={(newValue, ref) => {
											handleOnChangeAttributes(
												'blockeraIconPosition',
												newValue,
												{ ref }
											);
										}}
										{...extensionProps.blockeraIconPosition}
									/>
								</ControlContextProvider>
							</EditorFeatureWrapper>
						)}

						{showInlineIconLayout && (
							<EditorFeatureWrapper
								isActive={isShownIconGap}
								config={blockeraIconGap}
							>
								<ControlContextProvider
									value={{
										name: generateExtensionId(
											block,
											'icon-gap'
										),
										value: iconGap,
										attribute: 'blockeraIconGap',
										blockName: block.blockName,
									}}
								>
									<InputControl
										label={__('Gap', 'blockera')}
										labelPopoverTitle={__(
											'Icon Gap',
											'blockera'
										)}
										labelDescription={
											<>
												<p>
													{__(
														'Controls the space between the icon and the block content.',
														'blockera'
													)}
												</p>
												<p>
													{__(
														'Adjust the gap to fine-tune spacing for better visual balance and readability.',
														'blockera'
													)}
												</p>
											</>
										}
										columns="columns-2"
										unitType="essential"
										defaultValue={
											attributes?.blockeraIconGap?.default
												?.value
										}
										min={0}
										onChange={(newValue, ref) => {
											handleOnChangeAttributes(
												'blockeraIconGap',
												newValue,
												{ ref }
											);
										}}
										{...extensionProps.blockeraIconGap}
									/>
								</ControlContextProvider>
							</EditorFeatureWrapper>
						)}

						<EditorFeatureWrapper
							isActive={isShownIconSize}
							config={blockeraIconSize}
						>
							<ControlContextProvider
								value={{
									name: generateExtensionId(
										block,
										'icon-size'
									),
									value: iconSize,
									attribute: iconSizeAttributeId,
									blockName: block.blockName,
								}}
							>
								<InputControl
									label={__('Size', 'blockera')}
									labelPopoverTitle={__(
										'Icon Size',
										'blockera'
									)}
									labelDescription={
										<>
											<p>
												{__(
													'Sets the size of the icon used in the block.',
													'blockera'
												)}
											</p>
											<p>
												{__(
													"By default, it inherits the block's font size, but you can customize it to be larger or smaller for better visual emphasis.",
													'blockera'
												)}
											</p>
										</>
									}
									columns="columns-2"
									unitType="essential"
									defaultValue={
										attributes?.[iconSizeAttributeId]
											?.default?.value
									}
									min={0}
									onChange={(newValue, ref) => {
										handleOnChangeAttributes(
											iconSizeAttributeId,
											newValue,
											{ ref }
										);
									}}
									{...extensionProps.blockeraIconSize}
								/>
							</ControlContextProvider>
						</EditorFeatureWrapper>

						<EditorFeatureWrapper
							isActive={isShownIconColor}
							config={blockeraIconColor}
						>
							<ControlContextProvider
								value={{
									name: generateExtensionId(
										block,
										'icon-color'
									),
									value: iconColor,
									attribute: iconColorAttributeId,
									blockName: block.blockName,
								}}
							>
								<ColorControl
									label={__('Color', 'blockera')}
									labelPopoverTitle={__(
										'Icon Color',
										'blockera'
									)}
									labelDescription={
										<>
											<p>
												{__(
													'Defines the color of the icon in the block.',
													'blockera'
												)}
											</p>
											<p>
												{__(
													"By default, it inherits the block's font color, but you can override it to match or contrast with your design.",
													'blockera'
												)}
											</p>
										</>
									}
									columns="columns-2"
									defaultValue={
										attributes?.[iconColorAttributeId]
											?.default?.value
									}
									onChange={(newValue, ref) => {
										handleOnChangeAttributes(
											iconColorAttributeId,
											newValue,
											{ ref }
										);
									}}
									{...extensionProps.blockeraIconColor}
								/>
							</ControlContextProvider>
						</EditorFeatureWrapper>
					</BaseControl>

					<EditorFeatureWrapper
						isActive={isShownIconLink}
						config={blockeraIconLink}
					>
						<ControlContextProvider
							value={{
								name: generateExtensionId(block, 'icon-link'),
								value: iconLink,
								attribute: 'blockeraIconLink',
								blockName: block.blockName,
							}}
						>
							<LinkControl
								columns="1fr 3fr"
								label={__('Link', 'blockera')}
								id={generateExtensionId(block, 'icon-link')}
								onChange={(newValue, ref) => {
									handleOnChangeAttributes(
										'blockeraIconLink',
										newValue,
										{ ref }
									);
								}}
								defaultValue={
									attributes?.blockeraIconLink?.default?.value
								}
								{...extensionProps.blockeraIconLink}
							/>
						</ControlContextProvider>
					</EditorFeatureWrapper>

					{(isShownIconRotate ||
						isShownIconFlipHorizontal ||
						isShownIconFlipVertical) && (
						<BaseControl
							columns="1-column"
							style={{
								'--blockera-field-gap': '8px',
							}}
						>
							<Flex
								direction="row"
								gap="12px"
								justifyContent="flex-end"
							>
								<Button
									showTooltip={true}
									tooltipPosition="top"
									label={
										iconRotate !== ''
											? sprintf(
													// translators: %s is the icon rotation degree.
													__(
														'Rotated %s°',
														'blockera'
													),
													iconRotate
												)
											: __('Rotate', 'blockera')
									}
									size="extra-small"
									style={{
										padding: '4px',
										width: 'var(--blockera-controls-input-height)',
										height: 'var(--blockera-controls-input-height)',
									}}
									onClick={() => {
										let newAngle =
											iconRotate !== ''
												? addAngle(
														iconRotate === ''
															? 0
															: iconRotate,
														90
													)
												: 90;

										if (
											newAngle === 0 ||
											newAngle === 360
										) {
											newAngle = '';
										}

										handleOnChangeAttributes(
											'blockeraIconRotate',
											newAngle
										);
									}}
									className={
										iconRotate !== ''
											? 'is-toggle-btn is-toggled'
											: 'is-toggle-btn'
									}
								>
									<Icon
										icon="rotate-right"
										library="wp"
										iconSize="24"
										style={{
											transform: `rotate(${
												iconRotate ? iconRotate : 0
											}deg)`,
										}}
									/>
								</Button>

								<Button
									showTooltip={true}
									tooltipPosition="top"
									label={__('Flip Horizontal', 'blockera')}
									size="extra-small"
									style={{
										padding: '4px',
										width: 'var(--blockera-controls-input-height)',
										height: 'var(--blockera-controls-input-height)',
									}}
									className={
										iconFlipHorizontal
											? 'is-toggle-btn is-toggled'
											: 'is-toggle-btn'
									}
									onClick={() => {
										handleOnChangeAttributes(
											'blockeraIconFlipHorizontal',
											iconFlipHorizontal ? '' : true
										);
									}}
								>
									<Icon
										icon="flip-horizontal"
										library="wp"
										iconSize="24"
									/>
								</Button>

								<Button
									showTooltip={true}
									tooltipPosition="top"
									label={__('Flip Vertical', 'blockera')}
									size="extra-small"
									style={{
										padding: '4px',
										width: 'var(--blockera-controls-input-height)',
										height: 'var(--blockera-controls-input-height)',
									}}
									className={
										iconFlipVertical
											? 'is-toggle-btn is-toggled'
											: 'is-toggle-btn'
									}
									onClick={() => {
										handleOnChangeAttributes(
											'blockeraIconFlipVertical',
											iconFlipVertical ? '' : true
										);
									}}
								>
									<Icon
										icon="flip-vertical"
										library="wp"
										iconSize="24"
									/>
								</Button>
							</Flex>

							{!isStandaloneIconBlock(blockName) && (
								<Button
									showTooltip={true}
									tooltipPosition="top"
									label={__(
										'Advanced Icon Settings',
										'blockera'
									)}
									size="extra-small"
									style={{
										padding: '4px 8px',
										width: 'auto',
										height: 'var(--blockera-controls-input-height)',
									}}
									onClick={() => {
										// open the icon inner block settings
										setCurrentBlock('elements/icon');
									}}
								>
									<Icon
										library="wp"
										icon="chevron-down"
										iconSize="20"
									/>

									{__('Advanced Settings', 'blockera')}
								</Button>
							)}
						</BaseControl>
					)}
				</>
			)}
		</PanelBodyControl>
	);
};
