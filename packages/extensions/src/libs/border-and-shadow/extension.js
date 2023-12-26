// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import {
	BaseControl,
	OutlineControl,
	BoxShadowControl,
	ControlContextProvider,
} from '@publisher/controls';

/**
 * Internal dependencies
 */
import { isActiveField } from '../../api/utils';
import { generateExtensionId, hasSameProps } from '../utils';
import type { TBorderAndShadowProps } from './types/border-and-shadow-props';
import { Border, BorderRadius } from './components';

export const BorderAndShadowExtension: TBorderAndShadowProps =
	memo<TBorderAndShadowProps>(
		({
			block,
			config,
			children,
			defaultValue,
			handleOnChangeAttributes,
			values: { border, outline, boxShadow, borderRadius },
			...props
		}: TBorderAndShadowProps): MixedElement => {
			const {
				borderAndShadowConfig: {
					publisherBoxShadow,
					publisherOutline,
					publisherBorder,
					publisherBorderRadius,
				},
			} = config;

			return (
				<>
					{isActiveField(publisherBorder) && (
						<Border
							block={block}
							border={border}
							defaultValue={defaultValue}
							onChange={handleOnChangeAttributes}
						/>
					)}

					{isActiveField(publisherBorderRadius) && (
						<BorderRadius
							block={block}
							borderRadius={borderRadius}
							defaultValue={defaultValue}
							onChange={handleOnChangeAttributes}
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
											<code>
												box-shadow: 2px 2px 5px #eee;
											</code>
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
									{...props}
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
													'Add distinct borders to elements without affecting layout, enhancing visual hierarchy and focus.',
													'publisher-core'
												)}
											</p>
											<p>
												{__(
													'Useful for highlighting elements without space adjustments, unlike borders. Perfect for focus states and accessibility.',
													'publisher-core'
												)}
											</p>

											<code>
												{'outline: 2px solid #eee;'}
											</code>
										</>
									}
									onChange={(newValue, ref) =>
										handleOnChangeAttributes(
											'publisherOutline',
											newValue,
											{ ref }
										)
									}
									{...props}
								/>
							</BaseControl>
						</ControlContextProvider>
					)}

					<div>{children}</div>
				</>
			);
		},
		hasSameProps
	);
