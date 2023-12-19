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
		cursor,
		userSelect,
		pointerEvents,
		config,
		children,
		handleOnChangeAttributes,
		...props
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
							controlName="select"
							label={__('Cursor', 'publisher-core')}
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
							{...props}
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
							controlName="select"
							label={__('User Select', 'publisher-core')}
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
							{...props}
						/>
					</ControlContextProvider>
				)}

				{isActiveField(publisherPointerEvents) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'pointer-events'),
							value: userSelect,
							attribute: 'publisherPointerEvents',
							blockName: block.blockName,
						}}
					>
						<SelectControl
							controlName="select"
							label={__('Pointer Events', 'publisher-core')}
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
							{...props}
						/>
					</ControlContextProvider>
				)}
			</>
		);
	},
	hasSameProps
);
