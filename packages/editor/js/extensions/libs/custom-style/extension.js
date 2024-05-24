// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import type { MixedElement, ComponentType } from 'react';

/**
 * Blockera dependencies
 */
import {
	PanelBodyControl,
	ControlContextProvider,
	CodeControl,
} from '@blockera/controls';
import { hasSameProps } from '@blockera/utils';
import { extensionClassNames } from '@blockera/classnames';
import { EditorFeatureWrapper } from '@blockera/editor';

/**
 * Internal dependencies
 */
import { isShowField } from '../../api/utils';
import { generateExtensionId } from '../utils';
import type { CustomStyleExtensionProps } from './types/props';
import { CustomStyleExtensionIcon } from './index';
import { useBlockContext } from '../../hooks';

export const CustomStyleExtension: ComponentType<CustomStyleExtensionProps> =
	memo(
		({
			block,
			extensionConfig,
			values,
			extensionProps,
			attributes,
			handleOnChangeAttributes,
		}: CustomStyleExtensionProps): MixedElement => {
			const { getCurrentState, getBreakpoint } = useBlockContext();

			const isShowCustomCSS = isShowField(
				extensionConfig.blockeraCustomCSS,
				values.blockeraCustomCSS,
				attributes.blockeraCustomCSS.default
			);

			if (!isShowCustomCSS) {
				return <></>;
			}

			const isEditable =
				getCurrentState() === 'normal' ||
				getBreakpoint()?.type === 'laptop';

			return (
				<PanelBodyControl
					title={__('Custom CSS', 'blockera')}
					initialOpen={false}
					icon={<CustomStyleExtensionIcon />}
					className={extensionClassNames('custom-style')}
					isEdited={
						values.blockeraCustomCSS !==
						attributes.blockeraCustomCSS.default
					}
				>
					<EditorFeatureWrapper
						isActive={isShowCustomCSS}
						config={extensionConfig.blockeraCustomCSS}
						showText="always"
					>
						<ControlContextProvider
							value={{
								name: generateExtensionId(block, 'custom-css'),
								value: values.blockeraCustomCSS,
								attribute: 'blockeraCustomCSS',
								blockName: block.blockName,
							}}
						>
							<CodeControl
								label={__('Custom CSS Code', 'blockera')}
								labelDescription={
									<>
										<p>
											{__(
												'With this feature, you have the capability to apply custom CSS codes directly to this block, enabling you to tailor its style effortlessly.',
												'blockera'
											)}
										</p>
										<p>
											{__(
												'Once you input your CSS, the customization is automatically applied to the block.',
												'blockera'
											)}
										</p>
										<p>
											{__(
												'Simply use ".block" to target this specific block, and it will seamlessly convert to the correct selector for precise styling.',
												'blockera'
											)}
										</p>
									</>
								}
								onChange={(newValue, ref) =>
									handleOnChangeAttributes(
										'blockeraCustomCSS',
										newValue,
										{ ref }
									)
								}
								editable={!isEditable}
								defaultValue={
									attributes.blockeraCustomCSS.default
								}
								{...extensionProps.blockeraCustomCSS}
							/>
						</ControlContextProvider>
					</EditorFeatureWrapper>
				</PanelBodyControl>
			);
		},
		hasSameProps
	);
