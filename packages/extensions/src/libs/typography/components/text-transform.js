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
	BaseControl,
	ControlContextProvider,
	ToggleSelectControl,
} from '@publisher/controls';

/**
 * Internal dependencies
 */
import NoneIcon from '../icons/none';
import { generateExtensionId } from '../../utils';
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';
import TextTransformLowercaseIcon from '../icons/text-transform-lowercase';
import TextTransformUppercaseIcon from '../icons/text-transform-uppercase';
import TextTransformCapitalizeIcon from '../icons/text-transform-capitalize';

export const TextTransform = ({
	block,
	value,
	onChange,
}: {
	block: TBlockProps,
	value: string | void,
	onChange: THandleOnChangeAttributes,
}): MixedElement => {
	return (
		<ControlContextProvider
			value={{
				name: generateExtensionId(block, 'text-transform'),
				value,
				attribute: 'publisherTextTransform',
				blockName: block.blockName,
			}}
		>
			<BaseControl
				label={__('Capitalize', 'publisher-core')}
				columns="columns-1"
				className="control-first label-center small-gap"
			>
				<ToggleSelectControl
					options={[
						{
							label: __('Capitalize', 'publisher-core'),
							value: 'capitalize',
							icon: <TextTransformCapitalizeIcon />,
						},
						{
							label: __('Lowercase', 'publisher-core'),
							value: 'lowercase',
							icon: <TextTransformLowercaseIcon />,
						},
						{
							label: __('Uppercase', 'publisher-core'),
							value: 'uppercase',
							icon: <TextTransformUppercaseIcon />,
						},
						{
							label: __('None', 'publisher-core'),
							value: 'initial',
							icon: <NoneIcon />,
						},
					]}
					isDeselectable={true}
					//
					defaultValue="initial"
					onChange={(newValue) =>
						onChange('publisherTextTransform', newValue, {
							addOrModifyRootItems: {
								style: {
									...(block.attributes?.style ?? {}),
									typography: {
										...(block.attributes?.style
											?.typography ?? {}),
										textTransform:
											'initial' === newValue
												? 'none'
												: newValue,
									},
								},
							},
						})
					}
				/>
			</BaseControl>
		</ControlContextProvider>
	);
};
