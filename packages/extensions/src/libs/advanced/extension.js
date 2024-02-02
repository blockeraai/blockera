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
import type { TAdvancedProps } from './types/advanced-props';
import { AdvancedExtensionIcon } from './index';

export const AdvancedExtension: ComponentType<TAdvancedProps> = memo(
	({
		block,
		advancedConfig,
		values,
		extensionProps,
		attributes,
		handleOnChangeAttributes,
	}: TAdvancedProps): MixedElement => {
		const isShowCustomCSS = isShowField(
			advancedConfig.publisherCustomCSS,
			values.publisherCustomCSS,
			attributes.publisherCustomCSS.default
		);

		if (!isShowCustomCSS) {
			return <></>;
		}

		return (
			<PanelBodyControl
				title={__('Custom CSS', 'publisher-core')}
				initialOpen={false}
				icon={<AdvancedExtensionIcon />}
				className={componentClassNames(
					'extension',
					'extension-advanced'
				)}
			>
				<FeatureWrapper
					isActive={isShowCustomCSS}
					isActiveOnStates={
						advancedConfig.publisherCustomCSS.isActiveOnStates
					}
					isActiveOnBreakpoints={
						advancedConfig.publisherCustomCSS.isActiveOnBreakpoints
					}
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
							onChange={(newValue, ref) =>
								handleOnChangeAttributes(
									'publisherCustomCSS',
									newValue,
									{ ref }
								)
							}
							defaultValue={attributes.publisherCustomCSS.default}
							{...extensionProps.publisherCustomCSS}
						/>
					</ControlContextProvider>
				</FeatureWrapper>
			</PanelBodyControl>
		);
	},
	hasSameProps
);
