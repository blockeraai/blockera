// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import {
	ControlContextProvider,
	InputControl,
	extractNumberAndUnit,
} from '@publisher/controls';
import { isArray } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { generateExtensionId } from '../../utils';
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

export const LineHeight = ({
	block,
	value,
	onChange,
	parentProps,
	defaultValue,
}: {
	block: TBlockProps,
	parentProps: Object,
	value: string | void,
	defaultValue?: string,
	onChange: THandleOnChangeAttributes,
}): MixedElement => {
	return (
		<ControlContextProvider
			value={{
				name: generateExtensionId(block, 'line-height'),
				value,
				attribute: 'publisherLineHeight',
				blockName: block.blockName,
			}}
		>
			<InputControl
				controlName="input"
				label={__('Line Height', 'publisher-core')}
				columns="columns-2"
				controlAddonTypes={['variable']}
				variableTypes={['font-size']}
				{...parentProps}
				unitType="line-height"
				range={true}
				min={0}
				defaultValue={defaultValue || ''}
				onChange={(newValue, ref) => {
					const toWPCompatible = (newValue: Object): Object => {
						const extractedValue = extractNumberAndUnit(newValue);

						if (
							extractedValue.unit === '' ||
							(extractedValue.unit === 'func' &&
								extractedValue?.unitSimulated)
						) {
							return {
								style: {
									...(block.attributes?.style ?? {}),
									typography: {
										...(block.attributes?.style
											?.typography ?? {}),
										lineHeight: extractedValue.value,
									},
								},
							};
						}
						// remove old lineHeight
						if (block.attributes?.style?.typography?.lineHeight) {
							return ['style.typography.lineHeight'];
						}
					};

					const backwardCompatibilityValue = toWPCompatible();

					onChange('publisherLineHeight', newValue, {
						ref,
						addOrModifyRootItems: !isArray(
							backwardCompatibilityValue
						)
							? backwardCompatibilityValue
							: {},
						deleteItemsOnResetAction: isArray(
							backwardCompatibilityValue
						)
							? backwardCompatibilityValue
							: [],
					});
				}}
			/>
		</ControlContextProvider>
	);
};
