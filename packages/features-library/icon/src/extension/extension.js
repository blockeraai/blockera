// @flow
/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { applyFilters } from '@wordpress/hooks';
import type { MixedElement, ComponentType } from 'react';
import {
	memo,
	useState,
	useEffect,
	createRoot,
	useCallback,
} from '@wordpress/element';
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

		// Initialize state with current values
		const [iconState, setIconState] = useState({
			icon,
			iconGap,
			iconSize,
			iconLink,
			iconColor,
			iconRotate,
			iconPosition,
			iconFlipVertical,
			iconFlipHorizontal,
		});

		// Update state when props change
		useEffect(() => {
			setIconState({
				icon,
				iconGap,
				iconSize,
				iconLink,
				iconColor,
				iconRotate,
				iconPosition,
				iconFlipVertical,
				iconFlipHorizontal,
			});
		}, [
			icon,
			iconGap,
			iconSize,
			iconLink,
			iconColor,
			iconPosition,
			iconRotate,
			iconFlipHorizontal,
			iconFlipVertical,
		]);

		const encodeIcon = useCallback((iconHTML: string) => {
			return {
				encodedIcon: btoa(unescape(encodeURIComponent(iconHTML))),
				icon: encodeURIComponent(iconHTML),
			};
		}, []);

		const renderIcon = useCallback(
			async (newValue, effectiveItems = {}) => {
				const iconWrapper = document.createElement('div');
				iconWrapper.style.display = 'none';
				iconWrapper.classList.add('blockera-temp-icon-wrapper');

				const foundedWrapper = document.querySelector(
					'.blockera-temp-icon-wrapper'
				);

				if (!foundedWrapper) {
					document.body?.append(iconWrapper);
				} else {
					foundedWrapper.innerHTML = '';
				}

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
								: iconState.iconColor?.value ||
								  iconState.iconColor,
							fill: effectiveItems?.blockeraIconColor?.value
								? effectiveItems?.blockeraIconColor?.value
								: iconState.iconColor?.value ||
								  iconState.iconColor,
							width: iconState.iconSize
								? iconState.iconSize
								: '1em',
							height: iconState.iconSize
								? iconState.iconSize
								: '1em',
							...(iconState.iconPosition === 'start' && {
								marginRight: iconState.iconGap,
							}),
							...(iconState.iconPosition === 'end' && {
								marginLeft: iconState.iconGap,
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
						iconWrapper.remove();
					}, 1);
				});
			},
			[iconState, encodeIcon]
		);

		const handleOnChangeAttributesIcon = useCallback(
			async (newValue, ref, effectiveItems = {}) => {
				if (
					isEquals(iconState.icon, newValue) &&
					isEmpty(effectiveItems)
				) {
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

					setIconState((prev) => ({
						...prev,
						icon: {
							renderedIcon: renderedIcon.encodedIcon,
							icon: newValue.icon,
							library: newValue.library,
							uploadSVG: newValue.uploadSVG,
						},
					}));
				} else if (newValue.uploadSVG && newValue.svgString) {
					applyFilters(
						'blockera.featureIcon.extension.uploadSVG.onChangeHandler',
						{
							ref,
							newValue,
							encodeIcon,
							setIconState,
							handleOnChangeAttributes,
							effectiveItems,
						}
					);
				} else {
					const emptyIcon = {
						icon: '',
						library: '',
						uploadSVG: '',
						renderedIcon: '',
					};

					setIconState((prev) => ({
						...prev,
						icon: emptyIcon,
					}));

					handleOnChangeAttributes('blockeraIcon', emptyIcon, {
						ref,
						effectiveItems,
					});
				}
			},
			[
				blockName,
				iconState,
				renderIcon,
				encodeIcon,
				handleOnChangeAttributes,
			]
		);

		// Icon is not available in inner blocks.
		if (block.currentBlock !== 'master') {
			return <></>;
		}

		const isShownIcon = isShowField(
			blockeraIcon,
			iconState.icon,
			attributes?.blockeraIcon?.default?.value
		);
		const isShownIconPosition = isShowField(
			blockeraIconPosition,
			iconState.iconPosition,
			attributes?.blockeraIconPosition?.default?.value
		);
		const isShownIconGap = isShowField(
			blockeraIconGap,
			iconState.iconGap,
			attributes?.blockeraIconGap?.default?.value
		);
		const isShownIconSize = isShowField(
			blockeraIconSize,
			iconState.iconSize,
			attributes?.blockeraIconSize?.default?.value
		);
		const isShownIconColor = isShowField(
			blockeraIconColor,
			iconState.iconColor,
			attributes?.blockeraIconColor?.default?.value
		);
		const isShownIconLink = isShowField(
			blockeraIconLink,
			iconState.iconLink,
			attributes?.blockeraIconLink?.default?.value
		);
		const isShownIconRotate = isShowField(
			blockeraIconRotate,
			iconState.iconRotate,
			attributes?.blockeraIconRotate?.default?.value
		);
		const isShownIconFlipHorizontal = isShowField(
			blockeraIconFlipHorizontal,
			iconState.iconFlipHorizontal,
			attributes?.blockeraIconFlipHorizontal?.default?.value
		);
		const isShownIconFlipVertical = isShowField(
			blockeraIconFlipVertical,
			iconState.iconFlipVertical,
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
							value: iconState.icon,
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

				{(iconState?.icon?.icon || iconState?.icon?.uploadSVG) && (
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
										value: iconState.iconPosition,
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

											setIconState((prev) => ({
												...prev,
												iconPosition: newValue,
											}));
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
										value: iconState.iconGap,
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
											setIconState((prev) => ({
												...prev,
												iconGap: newValue,
											}));
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
										value: iconState.iconSize,
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

											setIconState((prev) => ({
												...prev,
												iconSize: newValue,
											}));
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
										value: iconState.iconColor,
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
											setIconState((prev) => ({
												...prev,
												iconColor: newValue,
											}));

											if (blockName === 'blockera/icon') {
												handleOnChangeAttributesIcon(
													iconState.icon,
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
									value: iconState.iconLink,
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
										setIconState((prev) => ({
											...prev,
											iconLink: newValue,
										}));
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
											iconState.iconRotate !== ''
												? sprintf(
														// translators: %s is the icon rotation degree.
														__(
															'Rotated %s°',
															'blockera'
														),
														iconState.iconRotate
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
												iconState.iconRotate !== ''
													? addAngle(
															iconState.iconRotate ===
																''
																? 0
																: iconState.iconRotate,
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
											setIconState((prev) => ({
												...prev,
												iconRotate: newAngle,
											}));
										}}
										className={
											iconState.iconRotate !== ''
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
													iconState.iconRotate
														? iconState.iconRotate
														: 0
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
											iconState.iconFlipHorizontal
												? 'is-toggle-btn is-toggled'
												: 'is-toggle-btn'
										}
										onClick={() => {
											handleOnChangeAttributes(
												'blockeraIconFlipHorizontal',
												iconState.iconFlipHorizontal
													? ''
													: true
											);
											setIconState((prev) => ({
												...prev,
												iconFlipHorizontal:
													iconState.iconFlipHorizontal
														? ''
														: true,
											}));
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
											iconState.iconFlipVertical
												? 'is-toggle-btn is-toggled'
												: 'is-toggle-btn'
										}
										onClick={() => {
											handleOnChangeAttributes(
												'blockeraIconFlipVertical',
												iconState.iconFlipVertical
													? ''
													: true
											);
											setIconState((prev) => ({
												...prev,
												iconFlipVertical:
													iconState.iconFlipVertical
														? ''
														: true,
											}));
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
