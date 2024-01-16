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
	OutlineControl,
	PanelBodyControl,
	BoxShadowControl,
	ControlContextProvider,
} from '@publisher/controls';
import { componentClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { isActiveField } from '../../api/utils';
import { Border, BorderRadius } from './components';
import { BorderAndShadowExtensionIcon } from './index';
import { generateExtensionId, hasSameProps } from '../utils';
import type { TBorderAndShadowProps } from './types/border-and-shadow-props';

export const BorderAndShadowExtension: ComponentType<TBorderAndShadowProps> =
	memo(
		({
			block,
			borderAndShadowConfig: {
				publisherBoxShadow,
				publisherOutline,
				publisherBorder,
				publisherBorderRadius,
			},
			defaultValue,
			handleOnChangeAttributes,
			values: { border, outline, boxShadow, borderRadius },
			extensionProps,
		}: TBorderAndShadowProps): MixedElement => {
			return (
				<PanelBodyControl
					title={__('Border And Shadow', 'publisher-core')}
					initialOpen={true}
					icon={<BorderAndShadowExtensionIcon />}
					className={componentClassNames(
						'extension',
						'extension-border-and-shadow'
					)}
				>
					{isActiveField(publisherBorder) && (
						<Border
							block={block}
							border={border}
							defaultValue={defaultValue}
							onChange={handleOnChangeAttributes}
							{...extensionProps.publisherBorder}
						/>
					)}

					{isActiveField(publisherBorderRadius) && (
						<BorderRadius
							block={block}
							borderRadius={borderRadius}
							defaultValue={defaultValue}
							onChange={handleOnChangeAttributes}
							{...extensionProps.publisherBorderRadius}
						/>
					)}

					{isActiveField(publisherBoxShadow) && (
						<ControlContextProvider
							value={{
								name: generateExtensionId(block, 'box-shadow'),
								value: boxShadow,
								attribute: 'publisherBoxShadow',
								blockName: block.blockName,
							}}
							storeName={'publisher-core/controls/repeater'}
						>
							<BaseControl
								controlName="box-shadow"
								columns="columns-1"
							>
								<BoxShadowControl
									label={__('Box Shadows', 'publisher-core')}
									labelDescription={
										<>
											<p>
												{__(
													'Creates a shadow effect around block for depth and focus.',
													'publisher-core'
												)}
											</p>
											<p>
												{__(
													'Soft shadows create a subtle effect, while bold shadows make the block more noticeable.',
													'publisher-core'
												)}
											</p>
										</>
									}
									onChange={(
										newValue: Array<Object>,
										ref?: Object
									): void =>
										handleOnChangeAttributes(
											'publisherBoxShadow',
											newValue,
											{ ref }
										)
									}
									{...extensionProps.publisherBoxShadow}
								/>
							</BaseControl>
						</ControlContextProvider>
					)}

					{isActiveField(publisherOutline) && (
						<ControlContextProvider
							value={{
								name: generateExtensionId(block, 'outline'),
								value: outline,
								attribute: 'publisherOutline',
								blockName: block.blockName,
							}}
							storeName={'publisher-core/controls/repeater'}
						>
							<BaseControl
								controlName="outline"
								columns="columns-1"
							>
								<OutlineControl
									label={__('Outline', 'publisher-core')}
									labelDescription={
										<>
											<p>
												{__(
													'Add distinct borders to blocks without affecting layout, enhancing visual hierarchy and focus.',
													'publisher-core'
												)}
											</p>
											<p>
												{__(
													'Useful for highlighting blocks without space adjustments, unlike borders. Perfect for focus states and accessibility.',
													'publisher-core'
												)}
											</p>
										</>
									}
									onChange={(newValue, ref) =>
										handleOnChangeAttributes(
											'publisherOutline',
											newValue,
											{ ref }
										)
									}
									{...extensionProps.publisherOutline}
								/>
							</BaseControl>
						</ControlContextProvider>
					)}
				</PanelBodyControl>
			);
		},
		hasSameProps
	);
