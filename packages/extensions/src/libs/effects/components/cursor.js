// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
/**
 * Publisher dependencies
 */
import { SelectControl, ControlContextProvider } from '@publisher/controls';

/**
 * Internal dependencies
 */
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';
import { generateExtensionId } from '../../utils';
import { cursorFieldOptions } from '../utils';

export const Cursor = ({
	cursor,
	props,
	block,
	handleOnChangeAttributes,
}: {
	cursor: string | void,
	props: Object,
	block: TBlockProps,
	handleOnChangeAttributes: THandleOnChangeAttributes,
}): MixedElement => {
	return (
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
				{...{
					...props,
					options: cursorFieldOptions(),
					type: 'custom',
					customMenuPosition: 'top',
					//
					defaultValue: 'default',
					onChange: (newValue) =>
						handleOnChangeAttributes('publisherCursor', newValue),
				}}
			/>
		</ControlContextProvider>
	);
};
