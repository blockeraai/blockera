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
	PanelBodyControl,
	ControlContextProvider,
	InputControl,
	BaseControl,
} from '@blockera/controls';
import { Icon } from '@blockera/icons';
import { extensionClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { isShowField } from '../../../api/utils';
import { generateExtensionId } from '../../utils';
import { EditorFeatureWrapper } from '../../../..';
import { ExtensionSettings } from '../../settings';
import { useBlockSection } from '../../../components';
import type { TInnerBlockOptionsExtensionProps } from './types';

export const InnerBlockOptionsExtension: ComponentType<
	TInnerBlockOptionsExtensionProps
> = ({
	block,
	extensionConfig,
	handleOnChangeAttributes,
	values,
	attributes,
	// extensionProps,
	setSettings,
	currentBlock,
	innerBlocks,
}: TInnerBlockOptionsExtensionProps): MixedElement => {
	const { initialOpen, onToggle } = useBlockSection('contentConfig');
	const isShowContent = isShowField(
		extensionConfig.contentField,
		(values[currentBlock]?.attributes || {})
			?.blockeraContentPseudoElement || '',
		(
			attributes.blockeraInnerBlocks.default?.[currentBlock]
				?.attributes || {}
		)?.blockeraContentPseudoElement || ''
	);
	const {
		settings: { hasContent },
	} = innerBlocks?.[currentBlock] || { settings: { hasContent: false } };

	// Extension is not active or has not content.
	if (!isShowContent || !hasContent) {
		return <></>;
	}

	return (
		<PanelBodyControl
			onToggle={onToggle}
			title={__('Inner Block Options', 'blockera')}
			initialOpen={initialOpen}
			icon={<Icon icon="extension-size" />}
			className={extensionClassNames('state-options')}
		>
			<ExtensionSettings
				buttonLabel={__('More Inner Block Options', 'blockera')}
				features={extensionConfig}
				update={(newSettings) => {
					setSettings(newSettings, 'contentConfig');
				}}
			/>

			<BaseControl columns="columns-1">
				<EditorFeatureWrapper
					isActive={isShowContent}
					config={extensionConfig.contentField}
				>
					<ControlContextProvider
						value={{
							name: generateExtensionId(
								block,
								'pseudo-element-' + currentBlock + '-content'
							),
							value:
								(values[currentBlock]?.attributes || {})
									?.blockeraContentPseudoElement || '',
							attribute: 'blockeraInnerBlocks',
							blockName: block.blockName,
						}}
					>
						<InputControl
							label={__('Content', 'blockera')}
							labelDescription={
								<>
									<p>
										{__(
											'Allows you to define different content for block elements (like after, before) - similar to CSS pseudo-elements. This helps create interactive and dynamic content variations.',
											'blockera'
										)}
									</p>
								</>
							}
							aria-label={__('Input Content', 'blockera')}
							columns="columns-2"
							placeholder="Auto"
							defaultValue={
								attributes.blockeraInnerBlocks.default?.[
									currentBlock
								]?.attributes?.blockeraContentPseudoElement ||
								''
							}
							onChange={(newValue, ref) =>
								handleOnChangeAttributes(
									'blockeraContentPseudoElement',
									newValue,
									{
										ref,
									}
								)
							}
						/>
					</ControlContextProvider>
				</EditorFeatureWrapper>
			</BaseControl>
		</PanelBodyControl>
	);
};
