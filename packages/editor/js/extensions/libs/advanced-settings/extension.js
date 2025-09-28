// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement, ComponentType } from 'react';

/**
 * Blockera dependencies
 */
import {
	AttributesControl,
	BaseControl,
	PanelBodyControl,
	ControlContextProvider,
} from '@blockera/controls';
import { extensionClassNames } from '@blockera/classnames';
import { EditorFeatureWrapper } from '../../../';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { isShowField } from '../../api/utils';
import { generateExtensionId } from '../utils';
import { ExtensionSettings } from '../settings';
import { useBlockSection } from '../../components';
import type { TAdvancedSettingsProps } from './types/advanced-props';

export const AdvancedSettingsExtension: ComponentType<
	TAdvancedSettingsProps
> = ({
	block,
	extensionConfig,
	values,
	attributes,
	handleOnChangeAttributes,
	extensionProps,
	setSettings,
}: TAdvancedSettingsProps): MixedElement => {
	const { initialOpen, onToggle } = useBlockSection('advancedSettingsConfig');
	const isShowAttributes = isShowField(
		extensionConfig.blockeraAttributes,
		values?.blockeraAttributes,
		attributes.blockeraAttributes.default
	);

	if (!isShowAttributes) {
		return <></>;
	}

	return (
		<PanelBodyControl
			onToggle={onToggle}
			title={__('Advanced', 'blockera')}
			initialOpen={initialOpen}
			icon={<Icon icon="extension-advanced" />}
			className={extensionClassNames('advanced-settings')}
		>
			<ExtensionSettings
				buttonLabel={__('More Advanced Settings', 'blockera')}
				features={extensionConfig}
				update={(newSettings) => {
					setSettings(newSettings, 'advancedSettingsConfig');
				}}
			/>

			<EditorFeatureWrapper
				isActive={isShowAttributes}
				config={extensionConfig.blockeraAttributes}
			>
				<ControlContextProvider
					value={{
						name: generateExtensionId(block, 'attributes'),
						value: values.blockeraAttributes,
						attribute: 'blockeraAttributes',
						blockName: block.blockName,
					}}
					storeName={'blockera/controls/repeater'}
				>
					<BaseControl controlName="attributes" columns="columns-1">
						<AttributesControl
							label={__('Custom HTML Attributes', 'blockera')}
							onChange={(newValue, ref) =>
								handleOnChangeAttributes(
									'blockeraAttributes',
									newValue,
									{ ref }
								)
							}
							defaultValue={attributes.blockeraAttributes.default}
							{...extensionProps.blockeraAttributes}
						/>
					</BaseControl>
				</ControlContextProvider>
			</EditorFeatureWrapper>
		</PanelBodyControl>
	);
};
