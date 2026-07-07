// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement, ComponentType } from 'react';

/**
 * Blockera dependencies
 */
import { PanelBodyControl } from '@blockera/controls';
import { extensionClassNames } from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { isShowField, isActiveExtension } from '../../api/utils';
import { ExtensionSettings } from '../settings';
import { EditorFeatureWrapper } from '../../../';
import { useBlockSection } from '../../components';
import { useFeatureSearch } from '../../components/feature-search-context';
import type { TFlexChildProps } from './types/flex-child-props';
import {
	FlexChildSelfAlign,
	FlexChildSelfOrder,
	FlexChildSelfSize,
} from './components';

export const FlexChildExtension: ComponentType<TFlexChildProps> = ({
	block,
	extensionConfig,
	values,
	handleOnChangeAttributes,
	extensionProps,
	setSettings,
	attributes,
}: TFlexChildProps): MixedElement => {
	const { initialOpen, onToggle } = useBlockSection('flexChildConfig');
	const { activeSearchMode } = useFeatureSearch();

	if (!isActiveExtension(extensionConfig)) {
		return <></>;
	}

	const isShowFlexChildSizing = isShowField(
		extensionConfig.blockeraFlexChildSizing,
		values?.blockeraFlexChildSizing,
		attributes.blockeraFlexChildSizing.default
	);
	const isShowFlexChildAlign = isShowField(
		extensionConfig.blockeraFlexChildAlign,
		values?.blockeraFlexChildAlign,
		attributes.blockeraFlexChildAlign.default
	);
	const isShowFlexChildOrder = isShowField(
		extensionConfig.blockeraFlexChildOrder,
		values?.blockeraFlexChildOrder,
		attributes.blockeraFlexChildOrder.default
	);

	if (
		!isShowFlexChildSizing &&
		!isShowFlexChildAlign &&
		!isShowFlexChildOrder
	) {
		return <></>;
	}

	return (
		<PanelBodyControl
			onToggle={onToggle}
			title={__('Flex Child', 'blockera')}
			initialOpen={initialOpen}
			icon={<Icon icon="extension-flex-child" />}
			className={extensionClassNames('flex-child')}
		>
			{!activeSearchMode && (
				<ExtensionSettings
					features={extensionConfig}
					update={(newSettings) => {
						setSettings(newSettings, 'flexChildConfig');
					}}
				/>
			)}

			<EditorFeatureWrapper
				isActive={isShowFlexChildSizing}
				config={extensionConfig.blockeraFlexChildSizing}
			>
				<FlexChildSelfSize
					block={block}
					flexDirection={values.blockeraFlexDirection}
					sizingValue={values.blockeraFlexChildSizing}
					growValue={values.blockeraFlexChildGrow}
					shrinkValue={values.blockeraFlexChildShrink}
					basisValue={values.blockeraFlexChildBasis}
					onChange={handleOnChangeAttributes}
					attributes={attributes}
					extensionProps={extensionProps}
					{...extensionProps.blockeraFlexChildSizing}
				/>
			</EditorFeatureWrapper>

			<EditorFeatureWrapper
				isActive={isShowFlexChildAlign}
				config={extensionConfig.blockeraFlexChildAlign}
			>
				<FlexChildSelfAlign
					block={block}
					flexDirection={values.blockeraFlexDirection}
					value={values.blockeraFlexChildAlign}
					onChange={handleOnChangeAttributes}
					defaultValue={attributes.blockeraFlexChildAlign.default}
					{...extensionProps.blockeraFlexChildAlign}
				/>
			</EditorFeatureWrapper>

			<EditorFeatureWrapper
				isActive={isShowFlexChildOrder}
				config={extensionConfig.blockeraFlexChildOrder}
			>
				<FlexChildSelfOrder
					block={block}
					flexDirection={values.blockeraFlexDirection}
					value={values.blockeraFlexChildOrder}
					orderCustomValue={values.blockeraFlexChildOrderCustom}
					onChange={handleOnChangeAttributes}
					defaultValue={attributes.blockeraFlexChildOrder.default}
					attributes={attributes}
					extensionProps={extensionProps}
					{...extensionProps.blockeraFlexChildOrder}
				/>
			</EditorFeatureWrapper>
		</PanelBodyControl>
	);
};
