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
	SelectControl,
	PanelBodyControl,
	ControlContextProvider,
} from '@publisher/controls';
import { hasSameProps } from '@publisher/utils';
import { componentClassNames } from '@publisher/classnames';
import { FeatureWrapper } from '@publisher/components';

/**
 * Internal dependencies
 */
import { isShowField } from '../../api/utils';
import { generateExtensionId } from '../utils';
import {
	cursorFieldOptions,
	userSelectOptions,
	pointerEventsOptions,
} from './utils';
import type { TMouseProps } from './types/mouse-props';
import { MouseExtensionIcon } from './index';
import { ExtensionSettings } from '../settings';

export const MouseExtension: ComponentType<TMouseProps> = memo(
	({
		block,
		values,
		mouseConfig,
		attributes,
		handleOnChangeAttributes,
		extensionProps,
		setSettings,
	}: TMouseProps): MixedElement => {
		const isShowCursor = isShowField(
			mouseConfig.publisherCursor,
			values?.cursor,
			attributes.publisherCursor.default
		);
		const isShowUserSelect = isShowField(
			mouseConfig.publisherUserSelect,
			values?.userSelect,
			attributes.publisherUserSelect.default
		);
		const isShowPointerEvents = isShowField(
			mouseConfig.publisherPointerEvents,
			values?.pointerEvents,
			attributes.publisherPointerEvents.default
		);

		// If none of the fields are shown, then don't render extension
		if (!isShowCursor && !isShowUserSelect && !isShowPointerEvents) {
			return <></>;
		}

		return (
			<PanelBodyControl
				title={__('Mouse', 'publisher-core')}
				initialOpen={true}
				icon={<MouseExtensionIcon />}
				className={componentClassNames('extension', 'extension-mouse')}
			>
				<ExtensionSettings
					features={mouseConfig}
					update={(newSettings) => {
						setSettings(newSettings, 'mouseConfig');
					}}
				/>

				<FeatureWrapper
					isActive={isShowCursor}
					config={mouseConfig.publisherCursor}
				>
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'cursor'),
							value: values.cursor,
							attribute: 'publisherCursor',
							blockName: block.blockName,
						}}
					>
						<SelectControl
							label={__('Cursor', 'publisher-core')}
							labelDescription={
								<>
									<p>
										{__(
											"It allows to change the mouse cursor when it's over block.",
											'publisher-core'
										)}
									</p>
									<p>
										{__(
											"It provides visual feedback to the user about the nature of the block they're interacting with – whether it's clickable, text-selectable, disabled, or used for resizing.",
											'publisher-core'
										)}
									</p>
								</>
							}
							columns="columns-2"
							options={cursorFieldOptions()}
							type="custom"
							customMenuPosition="top"
							defaultValue={attributes.publisherCursor.default}
							onChange={(newValue, ref) =>
								handleOnChangeAttributes(
									'publisherCursor',
									newValue,
									{ ref }
								)
							}
							{...extensionProps.publisherCursor}
						/>
					</ControlContextProvider>
				</FeatureWrapper>

				<FeatureWrapper
					isActive={isShowUserSelect}
					config={mouseConfig.publisherUserSelect}
				>
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'user-select'),
							value: values.userSelect,
							attribute: 'publisherUserSelect',
							blockName: block.blockName,
						}}
					>
						<SelectControl
							label={__('User Select', 'publisher-core')}
							labelDescription={
								<>
									<p>
										{__(
											'It controls how text can be selected by the user.',
											'publisher-core'
										)}
									</p>
									<p>
										{__(
											"It's useful for improving user experience.",
											'publisher-core'
										)}
									</p>
									<p>
										{__(
											'For instance, disabling text selection on buttons or icons can prevent confusion, while enabling it on textual content improves usability.',
											'publisher-core'
										)}
									</p>
								</>
							}
							columns="columns-2"
							options={userSelectOptions()}
							type="native"
							defaultValue={
								attributes.publisherUserSelect.default
							}
							onChange={(newValue, ref) =>
								handleOnChangeAttributes(
									'publisherUserSelect',
									newValue,
									{ ref }
								)
							}
							{...extensionProps.publisherUserSelect}
						/>
					</ControlContextProvider>
				</FeatureWrapper>

				<FeatureWrapper
					isActive={isShowPointerEvents}
					config={mouseConfig.publisherPointerEvents}
				>
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'pointer-events'),
							value: values.pointerEvents,
							attribute: 'publisherPointerEvents',
							blockName: block.blockName,
						}}
					>
						<SelectControl
							label={__('Pointer Events', 'publisher-core')}
							labelDescription={
								<>
									<p>
										{__(
											'It specifies how a block reacts to pointer interactions, such as mouse clicks or touch.',
											'publisher-core'
										)}
									</p>
									<p>
										{__(
											'It allows you to create blocks that are either interactive or completely non-interactive with pointer actions.',
											'publisher-core'
										)}
									</p>
									<p>
										{__(
											'For example, disabling pointer events on an overlay of block can allow users to interact with underlying block.',
											'publisher-core'
										)}
									</p>
								</>
							}
							columns="columns-2"
							options={pointerEventsOptions()}
							type="native"
							defaultValue={
								attributes.publisherPointerEvents.default
							}
							onChange={(newValue, ref) =>
								handleOnChangeAttributes(
									'publisherPointerEvents',
									newValue,
									{ ref }
								)
							}
							{...extensionProps.publisherPointerEvents}
						/>
					</ControlContextProvider>
				</FeatureWrapper>
			</PanelBodyControl>
		);
	},
	hasSameProps
);
