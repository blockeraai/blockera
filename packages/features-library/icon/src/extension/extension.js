// @flow
/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { applyFilters } from '@wordpress/hooks';
import type { MixedElement, ComponentType } from 'react';
import { createRoot, useCallback } from '@wordpress/element';
import { dispatch } from '@wordpress/data';

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
import { Icon } from '@blockera/icons';
import { extensionClassNames } from '@blockera/classnames';
import { isShowField } from '@blockera/editor/js/extensions/api/utils';
import { isEquals, addAngle, isEmpty, isUndefined } from '@blockera/utils';
import { generateExtensionId } from '@blockera/editor/js/extensions/libs/utils';
import { default as EditorFeatureWrapper } from '@blockera/editor/js/components/editor-feature-wrapper';

/**
 * Internal dependencies
 */
import type { TIconProps } from './types/icon-extension-props';

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
	currentStateAttributes: {
		blockeraIcon: icon,
		blockeraIconGap: iconGap,
		blockeraIconSize: iconSize,
		blockeraIconLink: iconLink,
		blockeraIconColor: iconColor,
		blockeraIconPosition: iconPosition,
		blockeraIconRotate: iconRotate,
		blockeraIconFlipHorizontal: iconFlipHorizontal,
		blockeraIconFlipVertical: iconFlipVertical,
	},
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
}: TIconProps): MixedElement => {
	const { changeExtensionCurrentBlock: setCurrentBlock } =
		dispatch('blockera/extensions') || {};
	const { initialOpen, onToggle } = useBlockSection('iconConfig');
	const blockName = block.activeBlockVariation?.name || block?.blockName;

	const encodeIcon = useCallback(
		(iconHTML: string, { hasInlineStyle = false, color } = {}) => {
			if (hasInlineStyle) {
				// Apply inline styles based on iconState
				const iconDoc = new DOMParser().parseFromString(
					iconHTML,
					'text/html'
				);
				const svgElement = iconDoc.querySelector('svg');

				if (svgElement) {
					// Apply color
					if (color) {
						svgElement.style.color = color;
						svgElement.style.fill = color;
					}

					iconHTML = svgElement.outerHTML;
				}
			}

			return {
				encodedIcon: btoa(unescape(encodeURIComponent(iconHTML))),
				icon: encodeURIComponent(iconHTML),
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
			iconRoot.render(
				<Icon
					style={{
						color,
						fill: color,
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
					const renderedIcon = encodeIcon(iconNode?.innerHTML || '');
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

				if (blockName === 'blockera/icon') {
					handleOnChangeAttributes(
						'blockeraIcon',
						{
							...newValue,
							renderedIcon: renderedIcon.encodedIcon,
						},
						{
							ref,
							effectiveItems: {
								...effectiveItems,
								url:
									'data:image/svg+xml;utf8,' +
									renderedIcon.icon,
								alt: sprintf(
									// translators: %s is the icon name.
									__('%s Icon', 'blockera'),
									newValue.icon.replaceAll('-', ' ')
								),
							},
						}
					);
				} else {
					handleOnChangeAttributes(
						'blockeraIcon',
						{
							...newValue,
							renderedIcon: renderedIcon.encodedIcon,
						},
						{ ref, effectiveItems }
					);
				}
			} else if (
				(newValue.uploadSVG && newValue.svgString) ||
				!isEmpty(effectiveItems)
			) {
				if (!newValue.hasOwnProperty('svgString')) {
					newValue.svgString = atob(icon.renderedIcon);
				}

				applyFilters(
					'blockera.featureIcon.extension.uploadSVG.onChangeHandler',
					{
						ref,
						newValue,
						blockName,
						encodeIcon,
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
			} else if (blockName === 'blockera/icon') {
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
						url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-hidden="true"><path d="M5.12321216,13.5468785 L5.07370078,13.6336248 C4.83077383,14.1322066 5.21892027,14.7352155 5.79113692,14.6825876 L10.2624715,14.270549 L9.82933866,21.7227919 C9.78597021,22.4686759 10.7447862,22.7937669 11.1544448,22.1720753 L18.8767932,10.4527553 L18.9263046,10.3660059 C19.1692295,9.86740676 18.7810449,9.2643915 18.2088152,9.31705918 L13.736563,9.72847448 L14.1706611,2.27720814 C14.2140292,1.5313296 13.2552248,1.20623489 12.8455606,1.82791614 L5.12321216,13.5468785 Z M12.5675925,4.88951961 L12.2425725,10.4921196 L12.2429925,10.5865822 C12.2702521,10.9894968 12.6214196,11.3022396 13.0308862,11.2645525 L16.8312941,10.9140428 L11.431442,19.1095038 L11.7574272,13.5078804 L11.7570075,13.4134218 C11.729751,13.0105235 11.3786124,12.697785 10.9691611,12.7354431 L7.16774032,13.0849806 L12.5675925,4.88951961 Z"></path></svg>',
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
		[icon, blockName, renderIcon, encodeIcon, handleOnChangeAttributes]
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
		attributes?.blockeraIconSize?.default?.value
	);
	const isShownIconColor = isShowField(
		blockeraIconColor,
		iconColor,
		attributes?.blockeraIconColor?.default?.value
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

			{icon?.renderedIcon && (
				<>
					<BaseControl
						label={__('Style', 'blockera')}
						columns="1fr 180px"
					>
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
									attribute: 'blockeraIconSize',
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
										attributes?.blockeraIconSize?.default
											?.value
									}
									min={0}
									onChange={(newValue, ref) => {
										handleOnChangeAttributes(
											'blockeraIconSize',
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
									attribute: 'blockeraIconColor',
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
										attributes?.blockeraIconColor?.default
											?.value
									}
									onChange={(newValue, ref) => {
										if (blockName === 'blockera/icon') {
											handleOnChangeAttributesIcon(
												icon,
												ref,
												{
													blockeraIconColor: {
														value: newValue,
													},
												}
											);
										} else {
											handleOnChangeAttributes(
												'blockeraIconColor',
												newValue,
												{ ref }
											);
										}
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

							{blockName !== 'blockera/icon' && (
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
