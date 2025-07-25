// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement, ComponentType } from 'react';
import { memo, createRoot, useCallback, useState } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
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
import { isEquals, hasSameProps } from '@blockera/utils';
import { extensionClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import type { TIconProps } from './types/icon-extension-props';
import { isActiveField } from '@blockera/editor/js/extensions/api/utils';
import { generateExtensionId } from '@blockera/editor/js/extensions/libs/utils';
import { useBlockSection } from '@blockera/editor/js/extensions/components/block-app';

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
			blockeraIconOptions,
			blockeraIconPosition,
		},
		currentStateAttributes: {
			blockeraIcon: icon,
			blockeraIconGap: iconGap,
			blockeraIconSize: iconSize,
			blockeraIconLink: iconLink,
			blockeraIconColor: iconColor,
			blockeraIconPosition: iconPosition,
		},
		handleOnChangeAttributes,
		extensionProps = {
			blockeraIcon: {},
			blockeraIconGap: {},
			blockeraIconSize: {},
			blockeraIconLink: {},
			blockeraIconColor: {},
			blockeraIconPosition: {},
		},
		attributes,
	}: TIconProps): MixedElement => {
		const { initialOpen, onToggle } = useBlockSection('iconConfig');
		const initialIconState = {
			icon,
			iconGap,
			iconSize,
			iconLink,
			iconColor,
			iconPosition,
		};
		const [iconState, setIconState] = useState(initialIconState);

		const handleOnChangeAttributesIcon = useCallback(
			(newValue, ref) => {
				if (isEquals(iconState, newValue)) {
					return;
				}

				// Prepare rendered icon before setting state.
				if (newValue.icon) {
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
								color: iconState.iconColor,
								fill: iconState.iconColor,
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
							icon={newValue.icon}
							library={newValue.library}
							uploadSVG={newValue.uploadSVG}
						/>
					);

					setTimeout(() => {
						const renderedIcon = btoa(
							unescape(
								encodeURIComponent(iconNode?.innerHTML || '')
							)
						);

						handleOnChangeAttributes(
							'blockeraIcon',
							{
								...newValue,
								renderedIcon,
							},
							{ ref }
						);

						setIconState({
							...initialIconState,
							icon: {
								renderedIcon,
								icon: newValue.icon,
								library: newValue.library,
								uploadSVG: newValue.uploadSVG,
							},
						});
					}, 1);
				} else {
					setIconState({
						...iconState,
						icon: {
							icon: '',
							library: '',
							uploadSVG: '',
						},
					});
					handleOnChangeAttributes(
						'blockeraIcon',
						{
							icon: '',
							library: '',
							uploadSVG: '',
						},
						{ ref }
					);
				}
			},
			// eslint-disable-next-line react-hooks/exhaustive-deps
			[initialIconState, iconState]
		);

		// Icon is not available in inner blocks.
		if (block.currentBlock !== 'master') {
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
				{isActiveField(blockeraIcon) && (
					<>
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

						{(iconState?.icon?.icon ||
							iconState?.icon?.uploadSVG) && (
							<>
								{isActiveField(blockeraIconOptions) && (
									<>
										<BaseControl
											label={__('Style', 'blockera')}
											columns="1fr 3fr"
										>
											{isActiveField(
												blockeraIconPosition
											) && (
												<ControlContextProvider
													value={{
														name: generateExtensionId(
															block,
															'icon-position'
														),
														value: iconState.iconPosition,
														attribute:
															'blockeraIconPosition',
														blockName:
															block.blockName,
													}}
												>
													<ToggleSelectControl
														label={__(
															'Position',
															'blockera'
														)}
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
																label: __(
																	'Start',
																	'blockera'
																),
																value: 'start',
																icon: (
																	<Icon
																		icon="icon-position-left"
																		iconSize="18"
																	/>
																),
															},
															{
																label: __(
																	'End',
																	'blockera'
																),
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
														//
														defaultValue={
															attributes
																?.blockeraIconPosition
																?.default?.value
														}
														onChange={(
															newValue,
															ref
														) => {
															handleOnChangeAttributes(
																'blockeraIconPosition',
																newValue,
																{ ref }
															);

															setIconState({
																...iconState,
																iconPosition:
																	newValue,
															});
														}}
														{...extensionProps.blockeraIconPosition}
													/>
												</ControlContextProvider>
											)}

											{isActiveField(blockeraIconGap) && (
												<ControlContextProvider
													value={{
														name: generateExtensionId(
															block,
															'icon-gap'
														),
														value: iconState.iconGap,
														attribute:
															'blockeraIconGap',
														blockName:
															block.blockName,
													}}
												>
													<InputControl
														label={__(
															'Gap',
															'blockera'
														)}
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
															attributes
																?.blockeraIconGap
																?.default?.value
														}
														min={0}
														onChange={(
															newValue,
															ref
														) => {
															handleOnChangeAttributes(
																'blockeraIconGap',
																newValue,
																{ ref }
															);
															setIconState({
																...iconState,
																iconGap:
																	newValue,
															});
														}}
														{...extensionProps.blockeraIconGap}
													/>
												</ControlContextProvider>
											)}

											{isActiveField(
												blockeraIconSize
											) && (
												<ControlContextProvider
													value={{
														name: generateExtensionId(
															block,
															'icon-size'
														),
														value: iconState.iconSize,
														attribute:
															'blockeraIconSize',
														blockName:
															block.blockName,
													}}
												>
													<InputControl
														label={__(
															'Size',
															'blockera'
														)}
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
															attributes
																?.blockeraIconSize
																?.default?.value
														}
														min={0}
														onChange={(
															newValue,
															ref
														) => {
															handleOnChangeAttributes(
																'blockeraIconSize',
																newValue,
																{ ref }
															);
															setIconState({
																...iconState,
																iconSize:
																	newValue,
															});
														}}
														{...extensionProps.blockeraIconSize}
													/>
												</ControlContextProvider>
											)}

											{isActiveField(
												blockeraIconColor
											) && (
												<ControlContextProvider
													value={{
														name: generateExtensionId(
															block,
															'icon-color'
														),
														value: iconState.iconColor,
														attribute:
															'blockeraIconColor',
														blockName:
															block.blockName,
													}}
												>
													<ColorControl
														label={__(
															'Color',
															'blockera'
														)}
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
														//
														defaultValue={
															attributes
																?.blockeraIconColor
																?.default?.value
														}
														onChange={(
															newValue,
															ref
														) => {
															handleOnChangeAttributes(
																'blockeraIconColor',
																newValue,
																{ ref }
															);
															setIconState({
																...iconState,
																iconColor:
																	newValue,
															});
														}}
														{...extensionProps.blockeraIconColor}
													/>
												</ControlContextProvider>
											)}
										</BaseControl>

										{isActiveField(blockeraIconLink) && (
											<ControlContextProvider
												value={{
													name: generateExtensionId(
														block,
														'icon-link'
													),
													value: iconState.iconLink,
													attribute:
														'blockeraIconLink',
													blockName: block.blockName,
												}}
											>
												<LinkControl
													columns="1fr 3fr"
													label={__(
														'Link',
														'blockera'
													)}
													id={generateExtensionId(
														block,
														'icon-link'
													)}
													//
													onChange={(
														newValue,
														ref
													) => {
														handleOnChangeAttributes(
															'blockeraIconLink',
															newValue,
															{ ref }
														);
														setIconState({
															...iconState,
															iconLink: newValue,
														});
													}}
													defaultValue={
														attributes
															?.blockeraIconLink
															?.default?.value
													}
													{...extensionProps.blockeraIconLink}
												/>
											</ControlContextProvider>
										)}
									</>
								)}
							</>
						)}
					</>
				)}
			</PanelBodyControl>
		);
	},
	hasSameProps
);
