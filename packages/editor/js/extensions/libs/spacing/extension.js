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
	BaseControl,
	PanelBodyControl,
	BoxSpacingControl,
	ControlContextProvider,
} from '@blockera/controls';
import { hasSameProps } from '@blockera/utils';
import { extensionClassNames } from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { isShowField } from '../../api/utils';
import { generateExtensionId } from '../utils';
import { EditorFeatureWrapper } from '../../../';
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
				icon={<Icon icon={'extension-spacing'} />}
				className={extensionClassNames('spacing')}
			>
				<EditorFeatureWrapper
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
								marginLock={'none'}
								paddingLock={'none'}
								{...extensionProps.blockeraSpacing}
							/>
						</BaseControl>
					</ControlContextProvider>
				</EditorFeatureWrapper>
			</PanelBodyControl>
		);
	},
	hasSameProps
);
