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
} from '@blockera/controls';
import { extensionClassNames } from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { isShowField, isActiveExtension } from '../../api/utils';
import { generateExtensionId } from '../utils';
import { ExtensionSettings } from '../settings';
import { EditorFeatureWrapper } from '../../../';
import { useBlockSection } from '../../components';
import { useFeatureSearch } from '../../components/feature-search-context';
import type { TGridChildProps } from './types/grid-child-props';

export const GridChildExtension: ComponentType<TGridChildProps> = ({
	block,
	extensionConfig,
	values,
	handleOnChangeAttributes,
	extensionProps,
	setSettings,
	attributes,
}: TGridChildProps): MixedElement => {
	const { initialOpen, onToggle } = useBlockSection('gridChildConfig');
	const { activeSearchMode } = useFeatureSearch();

	if (!isActiveExtension(extensionConfig)) {
		return <></>;
	}

	const isShowCol = isShowField(
		extensionConfig.blockeraGridChildColumnSpan,
		values?.blockeraGridChildColumnSpan,
		attributes.blockeraGridChildColumnSpan.default
	);
	const isShowRow = isShowField(
		extensionConfig.blockeraGridChildRowSpan,
		values?.blockeraGridChildRowSpan,
		attributes.blockeraGridChildRowSpan.default
	);

	if (!isShowCol && !isShowRow) {
		return <></>;
	}

	return (
		<PanelBodyControl
			onToggle={onToggle}
			title={__('Grid Child', 'blockera')}
			initialOpen={initialOpen}
			icon={<Icon icon="extension-grid-child" />}
			className={extensionClassNames('grid-child')}
		>
			{!activeSearchMode && (
				<ExtensionSettings
					features={extensionConfig}
					update={(newSettings) => {
						setSettings(newSettings, 'gridChildConfig');
					}}
				/>
			)}

			<EditorFeatureWrapper
				isActive={isShowCol}
				config={extensionConfig.blockeraGridChildColumnSpan}
			>
				<ControlContextProvider
					value={{
						name: generateExtensionId(block, 'grid-child-col-span'),
						value: values.blockeraGridChildColumnSpan,
						attribute: 'blockeraGridChildColumnSpan',
						blockName: block.blockName,
					}}
				>
					<InputControl
						data-test="grid-child-column-span"
						id="value"
						columns="2.5fr 2fr"
						label={__('Column Span', 'blockera')}
						labelDescription={
							<p>
								{__(
									'Stretch this block across multiple grid columns.',
									'blockera'
								)}
							</p>
						}
						type="number"
						range={false}
						drag={false}
						float={false}
						arrows={true}
						min={1}
						max={24}
						defaultValue={
							attributes.blockeraGridChildColumnSpan.default
						}
						onChange={(newValue, ref) =>
							handleOnChangeAttributes(
								'blockeraGridChildColumnSpan',
								newValue,
								{ ref }
							)
						}
						{...extensionProps.blockeraGridChildColumnSpan}
					/>
				</ControlContextProvider>
			</EditorFeatureWrapper>

			<EditorFeatureWrapper
				isActive={isShowRow}
				config={extensionConfig.blockeraGridChildRowSpan}
			>
				<ControlContextProvider
					value={{
						name: generateExtensionId(block, 'grid-child-row-span'),
						value: values.blockeraGridChildRowSpan,
						attribute: 'blockeraGridChildRowSpan',
						blockName: block.blockName,
					}}
				>
					<InputControl
						data-test="grid-child-row-span"
						id="value"
						columns="2.5fr 2fr"
						label={__('Row Span', 'blockera')}
						labelDescription={
							<p>
								{__(
									'Stretch this block across multiple grid rows.',
									'blockera'
								)}
							</p>
						}
						type="number"
						range={false}
						drag={false}
						float={false}
						arrows={true}
						min={1}
						max={24}
						defaultValue={
							attributes.blockeraGridChildRowSpan.default
						}
						onChange={(newValue, ref) =>
							handleOnChangeAttributes(
								'blockeraGridChildRowSpan',
								newValue,
								{ ref }
							)
						}
						{...extensionProps.blockeraGridChildRowSpan}
					/>
				</ControlContextProvider>
			</EditorFeatureWrapper>
		</PanelBodyControl>
	);
};
