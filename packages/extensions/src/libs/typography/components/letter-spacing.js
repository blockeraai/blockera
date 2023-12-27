// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import { ControlContextProvider, InputControl } from '@publisher/controls';
import { isEmpty } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { useBlockContext } from '../../../hooks';
import { generateExtensionId } from '../../utils';
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

export const LetterSpacing = ({
	block,
	value,
	onChange,
	parentProps,
	defaultValue = '',
}: {
	block: TBlockProps,
	parentProps: Object,
	value: string | void,
	defaultValue?: string,
	onChange: THandleOnChangeAttributes,
}): MixedElement => {
	const { isNormalState, getAttributes } = useBlockContext();

	const toWPCompatible = (newValue: Object): Object => {
		if (!isNormalState() || isEmpty(newValue)) {
			return {};
		}

		const blockAttributes = getAttributes();

		return {
			style: {
				...(blockAttributes?.style ?? {}),
				typography: {
					...(blockAttributes?.style?.typography ?? {}),
					letterSpacing: newValue,
				},
			},
		};
	};

	return (
		<ControlContextProvider
			value={{
				name: generateExtensionId(block, 'letter-spacing'),
				value,
				attribute: 'publisherLetterSpacing',
				blockName: block.blockName,
			}}
		>
			<InputControl
				controlName="input"
				columns="2fr 2.6fr"
				label={__('Letters', 'publisher-core')}
				labelPopoverTitle={__('Letters Spacing', 'publisher-core')}
				labelDescription={
					<>
						<p>
							{__(
								'It adjusts the space between characters in text, enhancing readability and visual appeal, especially useful in headings, logos, and graphic text.',
								'publisher-core'
							)}
						</p>
						<p>
							{__(
								'It is vital for typographic refinement, allowing control over text density and improving legibility, particularly in creative and web design contexts.',
								'publisher-core'
							)}
						</p>
					</>
				}
				{...{
					...parentProps,
					defaultValue,
					arrows: true,
					unitType: 'letter-spacing',
					onChange: (newValue: Object, ref?: Object): void => {
						onChange('publisherLetterSpacing', newValue, {
							ref,
							addOrModifyRootItems: toWPCompatible(newValue),
							deleteItemsOnResetAction: [
								'style.typography.letterSpacing',
							],
						});
					},
				}}
			/>
		</ControlContextProvider>
	);
};
