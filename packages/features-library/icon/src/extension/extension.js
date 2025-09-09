// @flow
/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { applyFilters } from '@wordpress/hooks';
import type { MixedElement, ComponentType } from 'react';
import { memo, createRoot, useCallback } from '@wordpress/element';
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
import { isEquals, hasSameProps, addAngle, isEmpty } from '@blockera/utils';
import { isShowField } from '@blockera/editor/js/extensions/api/utils';
import { generateExtensionId } from '@blockera/editor/js/extensions/libs/utils';
import { default as EditorFeatureWrapper } from '@blockera/editor/js/components/editor-feature-wrapper';

/**
 * Internal dependencies
 */
import type { TIconProps } from './types/icon-extension-props';

export const IconExtension: ComponentType<{
	...TIconProps,
	...TExtensionFillComponentProps,
}> = memo(
	({
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
			(iconHTML: string, hasInlineStyle = false) => {
				if (hasInlineStyle) {
					// Apply inline styles based on iconState
					const iconDoc = new DOMParser().parseFromString(
						iconHTML,
						'text/html'
					);
					const svgElement = iconDoc.querySelector('svg');

					if (svgElement) {
						// Apply color
						if (iconColor) {
							const color = iconColor.value || iconColor;
							svgElement.style.color = color;
							svgElement.style.fill = color;
						} else {
							svgElement.style.removeProperty('color');
							svgElement.style.removeProperty('fill');
						}

						iconHTML = svgElement.outerHTML;
					}
				}

				return {
					encodedIcon: btoa(unescape(encodeURIComponent(iconHTML))),
					icon: encodeURIComponent(iconHTML),
				};
			},
			[iconColor]
		);

		const renderIcon = useCallback(
			async (newValue, effectiveItems = {}) => {
				const iconNode = document.createElement('span');
				document
					.querySelector('.blockera-temp-icon-wrapper')
					?.append(iconNode);
				const iconRoot = createRoot(iconNode);

				iconRoot.render(
					<Icon
						style={{
							color: effectiveItems?.blockeraIconColor?.value
								? effectiveItems?.blockeraIconColor?.value
								: iconColor?.value || iconColor,
							fill: effectiveItems?.blockeraIconColor?.value
								? effectiveItems?.blockeraIconColor?.value
								: iconColor?.value || iconColor,
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
						const renderedIcon = encodeIcon(
							iconNode?.innerHTML || ''
						);
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
					const renderedIcon = await renderIcon(
						newValue,
						effectiveItems
					);

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
										newValue.icon
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
							encodeIcon,
							effectiveItems,
							handleOnChangeAttributes,
						}
					);
				} else if (blockName === 'blockera/icon') {
					const emptyIcon = {
						icon: 'star-empty',
						library: 'wp',
						renderedIcon:
							'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBhcmlhLWhpZGRlbj0idHJ1ZSIgZm9jdXNhYmxlPSJmYWxzZSIgc3R5bGU9IndpZHRoOiA1MHB4OyBoZWlnaHQ6IDUwcHg7IG1hcmdpbi1yaWdodDogNXB4OyI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNOS43MDYgOC42NDZhLjI1LjI1IDAgMDEtLjE4OC4xMzdsLTQuNjI2LjY3MmEuMjUuMjUgMCAwMC0uMTM5LjQyN2wzLjM0OCAzLjI2MmEuMjUuMjUgMCAwMS4wNzIuMjIybC0uNzkgNC42MDdhLjI1LjI1IDAgMDAuMzYyLjI2NGw0LjEzOC0yLjE3NmEuMjUuMjUgMCAwMS4yMzMgMGw0LjEzNyAyLjE3NWEuMjUuMjUgMCAwMC4zNjMtLjI2M2wtLjc5LTQuNjA3YS4yNS4yNSAwIDAxLjA3Mi0uMjIybDMuMzQ3LTMuMjYyYS4yNS4yNSAwIDAwLS4xMzktLjQyN2wtNC42MjYtLjY3MmEuMjUuMjUgMCAwMS0uMTg4LS4xMzdsLTIuMDY5LTQuMTkyYS4yNS4yNSAwIDAwLS40NDggMEw5LjcwNiA4LjY0NnpNMTIgNy4zOWwtLjk0OCAxLjkyMWExLjc1IDEuNzUgMCAwMS0xLjMxNy45NTdsLTIuMTIuMzA4IDEuNTM0IDEuNDk1Yy40MTIuNDAyLjYuOTgyLjUwMyAxLjU1bC0uMzYyIDIuMTEgMS44OTYtLjk5N2ExLjc1IDEuNzUgMCAwMTEuNjI5IDBsMS44OTUuOTk3LS4zNjItMi4xMWExLjc1IDEuNzUgMCAwMS41MDQtMS41NWwxLjUzMy0xLjQ5NS0yLjEyLS4zMDhhMS43NSAxLjc1IDAgMDEtMS4zMTctLjk1N0wxMiA3LjM5eiIgY2xpcC1ydWxlPSJldmVub2RkIj48L3BhdGg+PC9zdmc+',
					};

					handleOnChangeAttributes('blockeraIcon', emptyIcon, {
						ref,
						effectiveItems: {
							...effectiveItems,
							url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><path fill-rule="evenodd" d="M9.706 8.646a.25.25 0 01-.188.137l-4.626.672a.25.25 0 00-.139.427l3.348 3.262a.25.25 0 01.072.222l-.79 4.607a.25.25 0 00.362.264l4.138-2.176a.25.25 0 01.233 0l4.137 2.175a.25.25 0 00.363-.263l-.79-4.607a.25.25 0 01.072-.222l3.347-3.262a.25.25 0 00-.139-.427l-4.626-.672a.25.25 0 01-.188-.137l-2.069-4.192a.25.25 0 00-.448 0L9.706 8.646zM12 7.39l-.948 1.921a1.75 1.75 0 01-1.317.957l-2.12.308 1.534 1.495c.412.402.6.982.503 1.55l-.362 2.11 1.896-.997a1.75 1.75 0 011.629 0l1.895.997-.362-2.11a1.75 1.75 0 01.504-1.55l1.533-1.495-2.12-.308a1.75 1.75 0 01-1.317-.957L12 7.39z" clip-rule="evenodd"/></svg>',
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
				<EditorFeatureWrapper
					isActive={isShownIcon}
					config={blockeraIcon}
				>
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
							defaultValue={
								attributes?.blockeraIcon?.default?.value
							}
							{...extensionProps.blockeraIcon}
						/>
					</ControlContextProvider>
				</EditorFeatureWrapper>

				{icon?.renderedIcon && (
					<>
						<BaseControl
							label={__('Style', 'blockera')}
							columns="1fr 3fr"
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
											attributes?.blockeraIconSize
												?.default?.value
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
											attributes?.blockeraIconColor
												?.default?.value
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
									name: generateExtensionId(
										block,
										'icon-link'
									),
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
										attributes?.blockeraIconLink?.default
											?.value
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
										label={__(
											'Flip Horizontal',
											'blockera'
										)}
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
	},
	hasSameProps
);
