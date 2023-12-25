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
import { isEmpty } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { generateExtensionId } from '../../utils';
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';
import { useBlockContext } from '../../../hooks';

export const LineHeight = ({
	block,
	value,
	onChange,
	defaultValue,
}: {
	block: TBlockProps,
	parentProps: Object,
	value: string | void,
	onChange: THandleOnChangeAttributes,
}): MixedElement => {
	const { isNormalState, getAttributes } = useBlockContext();

	const toWPCompatible = (newValue: Object): Object => {
		if (!isNormalState() || isEmpty(newValue)) {
			return {};
		}

		const blockAttributes = getAttributes();

		const extractedValue = extractNumberAndUnit(newValue);

		if (extractedValue.unit === '') {
			return {
				style: {
					...(blockAttributes?.style ?? {}),
					typography: {
						...(blockAttributes?.style?.typography ?? {}),
						lineHeight: extractedValue.value,
					},
				},
			};
		}

		return {};
	};

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
				label={__('Line Height', 'publisher-core')}
				columns="columns-2"
				unitType="line-height"
				range={true}
				min={0}
				defaultValue={defaultValue || ''}
				onChange={(newValue, ref) => {
					onChange('publisherLineHeight', newValue, {
						ref,
						addOrModifyRootItems: toWPCompatible(newValue),
						deleteItemsOnResetAction: [
							'style.typography.lineHeight',
						],
					});
				}}
				controlAddonTypes={['variable']}
				variableTypes={['font-size']}
			/>
		</ControlContextProvider>
	);
};
