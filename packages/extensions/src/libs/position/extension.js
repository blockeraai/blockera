// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import type { MixedElement, ComponentType } from 'react';

/**
 * Publisher dependencies
 */
import {
	BaseControl,
	PanelBodyControl,
	BoxPositionControl,
	ControlContextProvider,
	InputControl,
} from '@publisher/controls';
import { componentClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { PositionExtensionIcon } from './index';
import { isActiveField } from '../../api/utils';
import { useBlockContext } from '../../hooks';
import { positionToWPCompatible } from './utils';
import { generateExtensionId, hasSameProps } from '../utils';
import type { TPositionExtensionProps } from './types/position-extension-props';

export const PositionExtension: ComponentType<TPositionExtensionProps> = memo(
	({
		block,
		positionConfig: { publisherPosition, publisherZIndex },
		values,
		inheritValues,
		handleOnChangeAttributes,
		extensionProps,
	}: TPositionExtensionProps): MixedElement => {
		const { isNormalState, getAttributes } = useBlockContext();

		return (
			<PanelBodyControl
				title={__('Position', 'publisher-core')}
				initialOpen={true}
				icon={<PositionExtensionIcon />}
				className={componentClassNames(
					'extension',
					'extension-position'
				)}
			>
				{isActiveField(publisherPosition) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'position'),
							value: (() => {
								if (isNormalState()) {
									return values.position?.type
										? values.position
										: inheritValues.position;
								}

								return values.position;
							})(),
							attribute: 'publisherPosition',
							blockName: block.blockName,
						}}
					>
						<BaseControl
							controlName="box-position"
							columns="columns-1"
							label=""
						>
							<BoxPositionControl
								onChange={(
									newValue: Object,
									ref?: Object
								): void =>
									handleOnChangeAttributes(
										'publisherPosition',
										newValue,
										{
											ref,
											addOrModifyRootItems:
												positionToWPCompatible({
													newValue,
													ref,
													isNormalState,
													getAttributes,
												}),
										}
									)
								}
								{...extensionProps.publisherPosition}
							/>
						</BaseControl>
					</ControlContextProvider>
				)}

				{isActiveField(publisherZIndex) &&
					values.position?.type !== '' &&
					values.position?.type !== undefined &&
					values.position?.type !== 'static' && (
						<ControlContextProvider
							value={{
								name: generateExtensionId(block, 'z-index'),
								value: values.zIndex,
								attribute: 'publisherZIndex',
								blockName: block.blockName,
							}}
						>
							<InputControl
								controlName="input"
								columns="columns-2"
								label={__('z-index', 'publisher-core')}
								labelDescription={
									<>
										<p>
											{__(
												'Control the stacking order of blocks with z-index, a CSS property that manages the layering and overlap of components on your website.',
												'publisher-core'
											)}
										</p>
										<p>
											{__(
												'z-index is crucial for creating visually appealing layouts, especially in complex designs, allowing you to prioritize content visibility and interaction.',
												'publisher-core'
											)}
										</p>
									</>
								}
								type="number"
								unitType="z-index"
								arrows={true}
								defaultValue=""
								onChange={(newValue, ref) =>
									handleOnChangeAttributes(
										'publisherZIndex',
										newValue,
										{
											ref,
										}
									)
								}
								{...extensionProps.publisherZIndex}
							/>
						</ControlContextProvider>
					)}
			</PanelBodyControl>
		);
	},
	hasSameProps
);
