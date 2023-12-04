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

export const FitPosition = ({
	setFitPositionVisible,
	fitPosition,
	handleOnChangeAttributes,
	block,
}: {
	setFitPositionVisible: (arg: boolean) => any,
	block: TBlockProps,
	fitPosition: Object,
	handleOnChangeAttributes: THandleOnChangeAttributes,
}): MixedElement => {
	return (
		<Popover
			title={__('Settings', 'publisher-core')}
			offset={121}
			placement="left"
			className={controlInnerClassNames('fit-position-popover')}
			onClose={() => {
				setFitPositionVisible(false);
			}}
		>
			<ControlContextProvider
				value={{
					name: generateExtensionId(block, 'fit-position'),
					value: {
						...fitPosition,
						coordinates:
							convertAlignmentMatrixCoordinates(fitPosition)
								?.compact,
					},
				}}
			>
				<AlignmentMatrixControl
					label={__('Position', 'publisher-core')}
					columns="columns-2"
					inputFields={true}
					onChange={({ top, left }) => {
						handleOnChangeAttributes('publisherFitPosition', {
							...fitPosition,
							top,
							left,
						});
					}}
				/>
			</ControlContextProvider>
		</Popover>
	);
};
