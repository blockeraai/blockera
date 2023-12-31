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
				attribute: 'publisherBlendMode',
				blockName: block.blockName,
			}}
		>
			<SelectControl
				controlName="select"
				label={__('Blending', 'publisher-core')}
				labelPopoverTitle={__('Mix Blending Mode', 'publisher-core')}
				labelDescription={
					<>
						<p>
							{__(
								'It allows for the blending of an element with its background.',
								'publisher-core'
							)}
						</p>
					</>
				}
				{...props}
				columns="columns-2"
				options={blendModeFieldOptions()}
				onChange={(newValue) =>
					handleOnChangeAttributes('publisherBlendMode', newValue)
				}
				value={blendMode}
				type="custom"
				customMenuPosition="top"
				defaultValue="normal"
			/>
		</ControlContextProvider>
	);
};
