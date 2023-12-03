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
import { blendModeFieldOptions } from '../utils';

export const Blending = ({
	blendMode,
	block,
	props,
	handleOnChangeAttributes,
}: {
	blendMode: string | void,
	block: TBlockProps,
	props: Object,
	handleOnChangeAttributes: THandleOnChangeAttributes,
}): MixedElement => {
	return (
		<ControlContextProvider
			value={{
				name: generateExtensionId(block, 'blend-mode'),
				value: blendMode,
			}}
		>
			<SelectControl
				controlName="select"
				label={__('Blending', 'publisher-core')}
				columns="columns-2"
				{...{
					...props,
					options: blendModeFieldOptions(),
					type: 'custom',
					customMenuPosition: 'top',
					//
					defaultValue: 'normal',
					value: blendMode,
					onChange: (newValue) =>
						handleOnChangeAttributes(
							'publisherBlendMode',
							newValue
						),
				}}
			/>
		</ControlContextProvider>
	);
};
