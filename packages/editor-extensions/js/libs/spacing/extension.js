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
import { FeatureWrapper } from '@blockera/editor';
import {
	BaseControl,
	PanelBodyControl,
	BoxSpacingControl,
	ControlContextProvider,
} from '@blockera/controls';
import { hasSameProps } from '@blockera/utils';
import { extensionClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { SpacingExtensionIcon } from './index';
import { isShowField } from '../../api/utils';
import { generateExtensionId } from '../utils';
import type { TSpacingProps } from './types/spacing-props';

export const SpacingExtension: ComponentType<TSpacingProps> = memo(
	({
		block,
		values,
		extensionConfig,
		handleOnChangeAttributes,
		extensionProps,
		attributes,
	}: TSpacingProps): MixedElement => {
		const isShowSpacing = isShowField(
			extensionConfig.blockeraSpacing,
			values.blockeraSpacing,
			attributes.blockeraSpacing.default
		);

		if (!isShowSpacing) {
			return <></>;
		}

		return (
			<PanelBodyControl
				title={__('Spacing', 'blockera')}
				initialOpen={true}
				icon={<SpacingExtensionIcon />}
				className={extensionClassNames('spacing')}
			>
				<FeatureWrapper
					isActive={isShowSpacing}
					config={extensionConfig.blockeraSpacing}
				>
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'spacing'),
							value: values.blockeraSpacing,
							attribute: 'blockeraSpacing',
							blockName: block.blockName,
						}}
					>
						<BaseControl controlName="box-spacing">
							<BoxSpacingControl
								onChange={(newValue, ref) => {
									handleOnChangeAttributes(
										'blockeraSpacing',
										newValue,
										{ ref }
									);
								}}
								defaultValue={
									attributes.blockeraSpacing.default
								}
								{...extensionProps.blockeraSpacing}
							/>
						</BaseControl>
					</ControlContextProvider>
				</FeatureWrapper>
			</PanelBodyControl>
		);
	},
	hasSameProps
);
