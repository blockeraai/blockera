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

export const ChildOrigin = ({
	setIsChildOriginVisible,
	transformChildOrigin,
	block,
	handleOnChangeAttributes,
}: {
	setIsChildOriginVisible: (arg: boolean) => any,
	block: TBlockProps,
	transformChildOrigin: Object,
	handleOnChangeAttributes: THandleOnChangeAttributes,
}): MixedElement => {
	return (
		<Popover
			title={__('Perspective Position', 'publisher-core')}
			offset={40}
			placement="left"
			className={controlInnerClassNames('origin-child-popover')}
			onClose={() => {
				setIsChildOriginVisible(false);
			}}
		>
			<ControlContextProvider
				value={{
					name: generateExtensionId(block, 'child-origin'),
					value: {
						top: transformChildOrigin?.top,
						left: transformChildOrigin?.left,
						coordinates:
							convertAlignmentMatrixCoordinates(
								transformChildOrigin
							)?.compact,
					},
				}}
			>
				<AlignmentMatrixControl
					label={__('Child Origin', 'publisher-core')}
					columns="columns-2"
					inputFields={true}
					onChange={({ top, left }) => {
						if (
							top !== '50%' ||
							left !== '50%' ||
							transformChildOrigin.top !== '50%' ||
							transformChildOrigin.left !== '50%'
						) {
							transformChildOrigin.color =
								'var(--publisher-controls-border-color-focus)';
						}

						handleOnChangeAttributes(
							'publisherTransformChildOrigin',
							{
								...transformChildOrigin,
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
