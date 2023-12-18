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
								description: () => (
									<div
										className={
											'publisher-label-control-popover'
										}
									>
										{__(
											'Sets the border and box-shadow css properties for block.',
											'publisher-core'
										)}
									</div>
								),
							}}
							storeName={'publisher-core/controls/repeater'}
						>
							<BaseControl
								controlName="box-shadow"
								columns="columns-1"
							>
								<BoxShadowControl
									label={__('Box Shadows', 'publisher-core')}
									onChange={(newValue) =>
										handleOnChangeAttributes(
											'publisherBoxShadow',
											newValue
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
									onChange={(newValue) =>
										handleOnChangeAttributes(
											'publisherOutline',
											newValue
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
