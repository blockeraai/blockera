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
	PositionButtonControl,
	SelectControl,
	useControlContext,
} from '@publisher/controls';

/**
 * Internal dependencies
 */
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';
import FitNormalIcon from '../icons/fit-normal';
import FitFillIcon from '../icons/fit-fill';
import FitContainIcon from '../icons/fit-contain';
import FitCoverIcon from '../icons/fit-cover';
import FitScaleDownIcon from '../icons/fit-scale-down';
import { generateExtensionId } from '../../utils';
import FitNoneIcon from '../icons/fit-none';

export default function ObjectFit({
	block,
	fitPosition,
	handleOnChangeAttributes,
	defaultValue,
	fitPositionDefaultValue,
	fitPositionProps,
	...props
}: {
	block: TBlockProps,
	defaultValue: string,
	fitPosition: { top: string, left: string },
	fitPositionDefaultValue: { top: string, left: string },
	fitPositionProps: Object,
	handleOnChangeAttributes: THandleOnChangeAttributes,
}): MixedElement {
	const { value, attribute, blockName, resetToDefault } = useControlContext({
		onChange: (newValue, ref) =>
			handleOnChangeAttributes('publisherFit', newValue, { ref }),
		defaultValue,
	});

	const labelProps = {
		value,
		attribute: 'publisherRatio',
		blockName,
		defaultValue,
		resetToDefault,
		mode: 'advanced',
		path: attribute,
	};

	return (
		<BaseControl
			label={__('Media Fit', 'publisher-core')}
			labelDescription={
				<>
					<p>
						{__(
							'Media Fit (object-Fit) controls how an image or video fits into its container for ensuring optimal media display.',
							'publisher-core'
						)}
					</p>
					<p>
						{__(
							'It is essential for responsive design, ensuring media maintain their aspect ratio while adapting to different container sizes, enhancing visual appeal without distortion.',
							'publisher-core'
						)}
					</p>
					<h3>
						<FitFillIcon />
						{__('Fill', 'publisher-core')}
					</h3>
					<p>
						{__(
							'The image or video is stretched to fill the container, which may lead to distortion.',
							'publisher-core'
						)}
					</p>
					<h3>
						<FitContainIcon />
						{__('Contain', 'publisher-core')}
					</h3>
					<p>
						{__(
							'The entire image or video is scaled to fit inside the container, maintaining its aspect ratio but might leave empty space.',
							'publisher-core'
						)}
					</p>
					<h3>
						<FitCoverIcon />
						{__('Cover', 'publisher-core')}
					</h3>
					<p>
						{__(
							'The content is resized to cover the entire container, maintaining its aspect ratio and may be clipped.',
							'publisher-core'
						)}
					</p>
					<h3>
						<FitNoneIcon />
						{__('None', 'publisher-core')}
					</h3>
					<p>
						{__(
							'The image or video is displayed at its true size, ignoring the container size.',
							'publisher-core'
						)}
					</p>
					<h3>
						<FitScaleDownIcon />
						{__('Scale Down', 'publisher-core')}
					</h3>
					<p>
						{__(
							'Behaves like "none" or "contain", whichever results in a smaller image or video.',
							'publisher-core'
						)}
					</p>
				</>
			}
			columns="columns-2"
			className={'publisher-object-fit'}
			{...labelProps}
		>
			<SelectControl
				controlName="select"
				columns="columns-1"
				options={[
					{
						label: __('Default', 'publisher-core'),
						value: '',
						icon: <FitNormalIcon />,
					},
					{
						label: __('Fill', 'publisher-core'),
						value: 'fill',
						icon: <FitFillIcon />,
					},
					{
						label: __('Contain', 'publisher-core'),
						value: 'contain',
						icon: <FitContainIcon />,
					},
					{
						label: __('Cover', 'publisher-core'),
						value: 'cover',
						icon: <FitCoverIcon />,
					},
					{
						label: __('None', 'publisher-core'),
						value: 'none',
						icon: <FitNormalIcon />,
					},
					{
						label: __('Scale Down', 'publisher-core'),
						value: 'scale-down',
						icon: <FitScaleDownIcon />,
					},
				]}
				type="custom"
				defaultValue={defaultValue}
				onChange={(newValue, ref) =>
					handleOnChangeAttributes('publisherFit', newValue, { ref })
				}
				{...props}
			/>

			<ControlContextProvider
				value={{
					name: generateExtensionId(block, 'fit-position'),
					value: fitPosition,
					attribute: 'publisherFitPosition',
					blockName: block.blockName,
				}}
			>
				<PositionButtonControl
					buttonLabel={__('Fit Position', 'publisher-core')}
					alignmentMatrixLabel={__('Position', 'publisher-core')}
					size="small"
					defaultValue={fitPositionDefaultValue}
					onChange={({ top, left }, ref) => {
						handleOnChangeAttributes(
							'publisherFitPosition',
							{
								...fitPosition,
								top,
								left,
							},
							{ ref }
						);
					}}
					{...fitPositionProps}
				/>
			</ControlContextProvider>
		</BaseControl>
	);
}
