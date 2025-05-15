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
import { hasSameProps, mergeObject } from '@blockera/utils';
import { extensionClassNames } from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import type { TStatesProps } from './types';
import { isShowField } from '../../../api/utils';
import { generateExtensionId } from '../../utils';
import { EditorFeatureWrapper } from '../../../..';
import { ExtensionSettings } from '../../settings';
import { useEditorStore } from '../../../../hooks';
import { useBlockSection } from '../../../components';

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
		const { getState, getInnerState } = useEditorStore();
		const isShowContent = isShowField(
			extensionConfig.contentField,
			(values[currentState] || {})?.content || '',
			(attributes.blockeraBlockStates.default[currentState] || {})
				?.content || ''
		);
		const {
			settings: { hasContent },
		} = getState(currentState) ||
			getInnerState(currentState) || {
				settings: { hasContent: false },
			};

		// Extension is not active or has not content.
		if (!isShowContent || !hasContent) {
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
									'state-content' + currentBlock
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
									attributes.blockeraBlockStates.default[
										currentState
									]?.content || ''
								}
								onChange={(newValue, ref) => {
									if (
										newValue ===
											(attributes.blockeraBlockStates
												.default[currentState]
												?.content || '') &&
										!Object.keys(
											values[currentState]?.breakpoints ||
												{}
										).length
									) {
										return handleOnChangeAttributes(
											'blockeraBlockStates',
											mergeObject(
												values,
												{
													// $FlowFixMe
													[currentState]: undefined,
												},
												{
													forceUpdated: [
														currentState,
													],
													deletedProps: [
														currentState,
													],
												}
											),
											{ ref }
										);
									}

									handleOnChangeAttributes(
										'blockeraBlockStates',
										mergeObject(values, {
											// $FlowFixMe
											[currentState]: {
												...values[currentState],
												content: newValue,
												// $FlowFixMe
												...(!values[currentState]
													?.breakpoints
													? {
															breakpoints: {},
															isVisible: true,
													  }
													: {}),
											},
										}),
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
