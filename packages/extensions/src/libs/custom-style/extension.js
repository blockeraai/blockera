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
	PanelBodyControl,
	ControlContextProvider,
	CodeControl,
} from '@publisher/controls';
import { componentClassNames } from '@publisher/classnames';
import { FeatureWrapper } from '@publisher/components';

/**
 * Internal dependencies
 */
import { isShowField } from '../../api/utils';
import { hasSameProps, generateExtensionId } from '../utils';
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
				extensionConfig.publisherCustomCSS,
				values.publisherCustomCSS,
				attributes.publisherCustomCSS.default
			);

			if (!isShowCustomCSS) {
				return <></>;
			}

			const isActiveOnStates =
				extensionConfig.publisherCustomCSS.isActiveOnStates;
			const isActiveOnBreakpoints =
				extensionConfig.publisherCustomCSS.isActiveOnBreakpoints;

			const isEditable =
				(isActiveOnStates !== 'all' &&
					!isActiveOnStates.includes(getCurrentState())) ||
				(isActiveOnBreakpoints !== 'all' &&
					!isActiveOnBreakpoints.includes(getBreakpoint()?.type));

			return (
				<PanelBodyControl
					title={__('Custom CSS', 'publisher-core')}
					initialOpen={false}
					icon={<CustomStyleExtensionIcon />}
					className={componentClassNames(
						'extension',
						'extension-custom-style'
					)}
					isEdited={
						values.publisherCustomCSS !==
						attributes.publisherCustomCSS.default
					}
				>
					<FeatureWrapper
						isActive={isShowCustomCSS}
						isActiveOnStates={isActiveOnStates}
						isActiveOnBreakpoints={isActiveOnBreakpoints}
					>
						<ControlContextProvider
							value={{
								name: generateExtensionId(block, 'custom-css'),
								value: values.publisherCustomCSS,
								attribute: 'publisherCustomCSS',
								blockName: block.blockName,
							}}
						>
							<CodeControl
								label={__('Custom CSS Code', 'publisher-core')}
								labelDescription={
									<>
										<p>
											{__(
												'With this feature, you have the capability to apply custom CSS codes directly to this block, enabling you to tailor its style effortlessly.',
												'publisher-core'
											)}
										</p>
										<p>
											{__(
												'Once you input your CSS, the customization is automatically applied to the block.',
												'publisher-core'
											)}
										</p>
										<p>
											{__(
												'Simply use ".block" to target this specific block, and it will seamlessly convert to the correct selector for precise styling.',
												'publisher-core'
											)}
										</p>
									</>
								}
								onChange={(newValue, ref) =>
									handleOnChangeAttributes(
										'publisherCustomCSS',
										newValue,
										{ ref }
									)
								}
								editable={!isEditable}
								defaultValue={
									attributes.publisherCustomCSS.default
								}
								{...extensionProps.publisherCustomCSS}
							/>
						</ControlContextProvider>
					</FeatureWrapper>
				</PanelBodyControl>
			);
		},
		hasSameProps
	);
