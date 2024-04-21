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
	SelectControl,
	PanelBodyControl,
	ControlContextProvider,
} from '@blockera/controls';
import { hasSameProps } from '@blockera/utils';
import { extensionClassNames } from '@blockera/classnames';
import { FeatureWrapper } from '@blockera/components';

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
			mouseConfig.blockeraCursor,
			values?.cursor,
			attributes.blockeraCursor.default
		);
		const isShowUserSelect = isShowField(
			mouseConfig.blockeraUserSelect,
			values?.userSelect,
			attributes.blockeraUserSelect.default
		);
		const isShowPointerEvents = isShowField(
			mouseConfig.blockeraPointerEvents,
			values?.pointerEvents,
			attributes.blockeraPointerEvents.default
		);

		// If none of the fields are shown, then don't render extension
		if (!isShowCursor && !isShowUserSelect && !isShowPointerEvents) {
			return <></>;
		}

		return (
			<PanelBodyControl
				title={__('Mouse', 'blockera-core')}
				initialOpen={true}
				icon={<MouseExtensionIcon />}
				className={extensionClassNames('mouse')}
			>
				<ExtensionSettings
					buttonLabel={__('More Mouse Settings', 'blockera-core')}
					features={mouseConfig}
					update={(newSettings) => {
						setSettings(newSettings, 'mouseConfig');
					}}
				/>

				<FeatureWrapper
					isActive={isShowCursor}
					config={mouseConfig.blockeraCursor}
				>
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'cursor'),
							value: values.cursor,
							attribute: 'blockeraCursor',
							blockName: block.blockName,
						}}
					>
						<SelectControl
							label={__('Cursor', 'blockera-core')}
							labelDescription={
								<>
									<p>
										{__(
											"It allows to change the mouse cursor when it's over block.",
											'blockera-core'
										)}
									</p>
									<p>
										{__(
											"It provides visual feedback to the user about the nature of the block they're interacting with – whether it's clickable, text-selectable, disabled, or used for resizing.",
											'blockera-core'
										)}
									</p>
								</>
							}
							columns="columns-2"
							options={cursorFieldOptions()}
							type="custom"
							customMenuPosition="top"
							defaultValue={attributes.blockeraCursor.default}
							onChange={(newValue, ref) =>
								handleOnChangeAttributes(
									'blockeraCursor',
									newValue,
									{ ref }
								)
							}
							{...extensionProps.blockeraCursor}
						/>
					</ControlContextProvider>
				</FeatureWrapper>

				<FeatureWrapper
					isActive={isShowUserSelect}
					config={mouseConfig.blockeraUserSelect}
				>
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'user-select'),
							value: values.userSelect,
							attribute: 'blockeraUserSelect',
							blockName: block.blockName,
						}}
					>
						<SelectControl
							label={__('User Select', 'blockera-core')}
							labelDescription={
								<>
									<p>
										{__(
											'It controls how text can be selected by the user.',
											'blockera-core'
										)}
									</p>
									<p>
										{__(
											"It's useful for improving user experience.",
											'blockera-core'
										)}
									</p>
									<p>
										{__(
											'For instance, disabling text selection on buttons or icons can prevent confusion, while enabling it on textual content improves usability.',
											'blockera-core'
										)}
									</p>
								</>
							}
							columns="columns-2"
							options={userSelectOptions()}
							type="native"
							defaultValue={attributes.blockeraUserSelect.default}
							onChange={(newValue, ref) =>
								handleOnChangeAttributes(
									'blockeraUserSelect',
									newValue,
									{ ref }
								)
							}
							{...extensionProps.blockeraUserSelect}
						/>
					</ControlContextProvider>
				</FeatureWrapper>

				<FeatureWrapper
					isActive={isShowPointerEvents}
					config={mouseConfig.blockeraPointerEvents}
				>
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'pointer-events'),
							value: values.pointerEvents,
							attribute: 'blockeraPointerEvents',
							blockName: block.blockName,
						}}
					>
						<SelectControl
							label={__('Pointer Events', 'blockera-core')}
							labelDescription={
								<>
									<p>
										{__(
											'It specifies how a block reacts to pointer interactions, such as mouse clicks or touch.',
											'blockera-core'
										)}
									</p>
									<p>
										{__(
											'It allows you to create blocks that are either interactive or completely non-interactive with pointer actions.',
											'blockera-core'
										)}
									</p>
									<p>
										{__(
											'For example, disabling pointer events on an overlay of block can allow users to interact with underlying block.',
											'blockera-core'
										)}
									</p>
								</>
							}
							columns="columns-2"
							options={pointerEventsOptions()}
							type="native"
							defaultValue={
								attributes.blockeraPointerEvents.default
							}
							onChange={(newValue, ref) =>
								handleOnChangeAttributes(
									'blockeraPointerEvents',
									newValue,
									{ ref }
								)
							}
							{...extensionProps.blockeraPointerEvents}
						/>
					</ControlContextProvider>
				</FeatureWrapper>
			</PanelBodyControl>
		);
	},
	hasSameProps
);
