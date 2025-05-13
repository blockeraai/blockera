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
	InputControl,
	BaseControl,
} from '@blockera/controls';
import { hasSameProps } from '@blockera/utils';
import { extensionClassNames } from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import type { TStatesProps } from './types';
import { isShowField } from '../../../api/utils';
import { generateExtensionId } from '../../utils';
import { useEditorStore } from '../../../../hooks';
import { EditorFeatureWrapper } from '../../../..';
import { ExtensionSettings } from '../../settings';
import { useBlockSection } from '../../../components';
import { isInnerBlock } from '../../../components/utils';

export const StateOptionsExtension: ComponentType<TStatesProps> = memo(
	({
		block,
		extensionConfig,
		handleOnChangeAttributes,
		values,
		attributes,
		// extensionProps,
		setSettings,
		currentState,
		currentBlock,
	}: TStatesProps): MixedElement => {
		const { initialOpen, onToggle } = useBlockSection('statesConfig');
		const isShowContent = isShowField(
			extensionConfig.contentField,
			(values[currentState] || {})?.content || '',
			(attributes.default[currentState] || {})?.content || ''
		);
		const { availableStates, availableInnerState } = useEditorStore();

		// Extension is not active
		if (!isShowContent) {
			return <></>;
		}

		if (
			isInnerBlock(currentBlock) &&
			availableInnerState.includes(currentState)
		) {
			return <></>;
		}

		if (availableStates.includes(currentState)) {
			return <></>;
		}

		return (
			<PanelBodyControl
				onToggle={onToggle}
				title={__('State Options', 'blockera')}
				initialOpen={initialOpen}
				icon={<Icon icon="extension-size" />}
				className={extensionClassNames('state-options')}
			>
				<ExtensionSettings
					buttonLabel={__('More State Options', 'blockera')}
					features={extensionConfig}
					update={(newSettings) => {
						setSettings(newSettings, 'statesConfig');
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
									'state-content'
								),
								value:
									(values[currentState] || {})?.content || '',
								attribute: 'blockeraBlockStates',
								blockName: block.blockName,
							}}
						>
							<InputControl
								label={__('Content', 'blockera')}
								labelDescription={
									<>
										<p>
											{__(
												'Allows you to define different content for block states (like after, before) - similar to CSS pseudo-classes. This helps create interactive and dynamic content variations.',
												'blockera'
											)}
										</p>
									</>
								}
								aria-label={__('Input Content', 'blockera')}
								columns="columns-2"
								placeholder="Auto"
								defaultValue={
									attributes.default[currentState]?.content ||
									''
								}
								onChange={(newValue, ref) => {
									values[currentState] = {
										...values[currentState],
										content: newValue,
									};

									handleOnChangeAttributes(
										'blockeraBlockStates',
										values,
										{ ref }
									);
								}}
							/>
						</ControlContextProvider>
					</EditorFeatureWrapper>
				</BaseControl>
			</PanelBodyControl>
		);
	},
	hasSameProps
);
