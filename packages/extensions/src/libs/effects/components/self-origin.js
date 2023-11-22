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
	convertAlignmentMatrixCoordinates,
	AlignmentMatrixControl,
} from '@publisher/controls';
import { Popover } from '@publisher/components';
import { controlInnerClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';
import { generateExtensionId } from '../../utils';

export const SelfOrigin = ({
	transformSelfOrigin,
	handleOnChangeAttributes,
	setIsSelfOriginVisible,
	block,
}: {
	setIsSelfOriginVisible: (arg: boolean) => any,
	block: TBlockProps,
	transformSelfOrigin: Object,
	handleOnChangeAttributes: THandleOnChangeAttributes,
}): MixedElement => {
	return (
		<Popover
			title={__('Perspective Position', 'publisher-core')}
			offset={130}
			placement="left"
			className={controlInnerClassNames('origin-self-popover')}
			onClose={() => {
				setIsSelfOriginVisible(false);
			}}
		>
			<ControlContextProvider
				value={{
					name: generateExtensionId(block, 'self-origin'),
					value: {
						...transformSelfOrigin,
						coordinates:
							convertAlignmentMatrixCoordinates(
								transformSelfOrigin
							)?.compact,
					},
				}}
			>
				<AlignmentMatrixControl
					label={__('Self Origin', 'publisher-core')}
					columns="columns-2"
					inputFields={true}
					onChange={({ top, left }) => {
						handleOnChangeAttributes(
							'publisherTransformSelfOrigin',
							{
								...transformSelfOrigin,
								top,
								left,
							}
						);
					}}
				/>
			</ControlContextProvider>
		</Popover>
	);
};
