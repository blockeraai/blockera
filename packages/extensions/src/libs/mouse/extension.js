// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import { ControlContextProvider, SelectControl } from '@publisher/controls';

/**
 * Internal dependencies
 */
import { isActiveField } from '../../api/utils';
import { generateExtensionId, hasSameProps } from '../utils';
import {
	cursorFieldOptions,
	userSelectOptions,
	pointerEventsOptions,
} from './utils';
import type { TMouseProps } from './types/mouse-props';

export const MouseExtension: MixedElement = memo<TMouseProps>(
	({
		block,
		values: { cursor, userSelect, pointerEvents },
		config,
		handleOnChangeAttributes,
		extensionProps,
	}: TMouseProps): MixedElement => {
		const {
			mouseConfig: {
				publisherCursor,
				publisherUserSelect,
				publisherPointerEvents,
			},
		} = config;

		return (
			<>
				{isActiveField(publisherCursor) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'cursor'),
							value: cursor,
							attribute: 'publisherCursor',
							blockName: block.blockName,
						}}
					>
						<SelectControl
							label={__('Cursor', 'publisher-core')}
							labelPopoverTitle={__('Cursor', 'publisher-core')}
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
							defaultValue="default"
							onChange={(newValue) =>
								handleOnChangeAttributes(
									'publisherCursor',
									newValue
								)
							}
							{...extensionProps.publisherCursor}
						/>
					</ControlContextProvider>
				)}

				{isActiveField(publisherUserSelect) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'user-select'),
							value: userSelect,
							attribute: 'publisherUserSelect',
							blockName: block.blockName,
						}}
					>
						<SelectControl
							label={__('User Select', 'publisher-core')}
							labelPopoverTitle={__(
								'User Select',
								'publisher-core'
							)}
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
							defaultValue="auto"
							onChange={(newValue) =>
								handleOnChangeAttributes(
									'publisherUserSelect',
									newValue
								)
							}
							{...extensionProps.publisherUserSelect}
						/>
					</ControlContextProvider>
				)}

				{isActiveField(publisherPointerEvents) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'pointer-events'),
							value: pointerEvents,
							attribute: 'publisherPointerEvents',
							blockName: block.blockName,
						}}
					>
						<SelectControl
							label={__('Pointer Events', 'publisher-core')}
							labelPopoverTitle={__(
								'User Select',
								'publisher-core'
							)}
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
							defaultValue="auto"
							onChange={(newValue) =>
								handleOnChangeAttributes(
									'publisherPointerEvents',
									newValue
								)
							}
							{...extensionProps.publisherPointerEvents}
						/>
					</ControlContextProvider>
				)}
			</>
		);
	},
	hasSameProps
);
