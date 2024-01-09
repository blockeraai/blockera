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
	InputControl,
	SelectControl,
	useControlContext,
} from '@publisher/controls';

/**
 * Internal dependencies
 */
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';
import { Flex } from '@publisher/components';
import { aspectRatioToWPCompatible } from '../utils';
import { useBlockContext } from '../../../hooks';

export default function AspectRatio({
	block,
	ratio,
	handleOnChangeAttributes,
	defaultValue = {
		value: '',
		width: '',
		height: '',
	},
	...props
}: {
	block: TBlockProps,
	ratio: { value: string, width: string, height: string },
	defaultValue: { value: string, width: string, height: string },
	handleOnChangeAttributes: THandleOnChangeAttributes,
}): MixedElement {
	const { isNormalState } = useBlockContext();

	const { value, attribute, blockName, resetToDefault } = useControlContext({
		onChange: (newValue, ref) =>
			handleOnChangeAttributes('publisherRatio', newValue, {
				ref,
				addOrModifyRootItems: aspectRatioToWPCompatible({
					newValue,
					ref,
					isNormalState,
				}),
			}),
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
			columns="columns-2"
			controlName="toggle-select"
			label={__('Aspect Ratio', 'publisher-core')}
			labelDescription={
				<>
					<p>
						{__(
							'Aspect Ratio Control allows for maintaining a specific width-to-height ratio for blocks, ensuring consistent and responsive sizing across devices.',
							'publisher-core'
						)}
					</p>
					<p>
						{__(
							'Crucial for media blocks like images and videos, this feature preserves the original proportions, enhancing visual appeal and preventing distortion.',
							'publisher-core'
						)}
					</p>
					<p>
						{__(
							'The aspect ratio is calculated in this format:',
							'publisher-core'
						)}{' '}
						<>
							<code>width</code>
							{' / '}
							<code>height</code>
						</>
					</p>
				</>
			}
			{...labelProps}
		>
			<SelectControl
				id="value"
				aria-label={__('Ratio', 'publisher-core')}
				options={[
					{
						label: __('Original', 'publisher-core'),
						value: '',
					},
					{
						label: __('Square 1:1', 'publisher-core'),
						value: '1',
					},
					{
						label: __('Standard 4:3', 'publisher-core'),
						value: '4/3',
					},
					{
						label: __('Portrait 3:4', 'publisher-core'),
						value: '3/4',
					},
					{
						label: __('Landscape 3:2', 'publisher-core'),
						value: '3/2',
					},
					{
						label: __('Classic Portrait 2:3', 'publisher-core'),
						value: '2/3',
					},
					{
						label: __('Widescreen 16:9', 'publisher-core'),
						value: '16/9',
					},
					{
						label: __('Tall 9:16', 'publisher-core'),
						value: '9/16',
					},
					{
						label: __('Custom', 'publisher-core'),
						value: 'custom',
					},
				]}
				type="native"
				defaultValue={defaultValue.value}
				onChange={(newValue, ref) => {
					if (newValue === '') {
						handleOnChangeAttributes(
							'publisherRatio',
							{
								value: '',
								width: '',
								height: '',
							},
							{
								ref,
								addOrModifyRootItems: aspectRatioToWPCompatible(
									{
										newValue,
										ref,
										isNormalState,
									}
								),
							}
						);
					} else {
						handleOnChangeAttributes(
							'publisherRatio',
							{
								...ratio,
								value: newValue,
							},
							{
								ref,
								addOrModifyRootItems: aspectRatioToWPCompatible(
									{
										newValue,
										ref,
										isNormalState,
									}
								),
							}
						);
					}
				}}
				{...props}
			/>
			{ratio.value === 'custom' && (
				<Flex alignItems="flex-start">
					<InputControl
						id="width"
						columns="columns-1"
						className="control-first label-center small-gap"
						label={__('Width', 'publisher-core')}
						labelDescription={
							<>
								<p>
									{__(
										'Represents the width part of the ratio.',
										'publisher-core'
									)}
								</p>
								<p>
									{__(
										'In the "16 / 9" example, 16 is the width.',
										'publisher-core'
									)}
								</p>
							</>
						}
						style={{ margin: '0px' }}
						type="number"
						min={0}
						defaultValue={defaultValue.width}
						onChange={(newValue, ref) =>
							handleOnChangeAttributes(
								'publisherRatio',
								{
									...ratio,
									width: newValue,
								},
								{
									ref,
								}
							)
						}
					/>

					<p className="publisher-colon">/</p>

					<InputControl
						id="height"
						columns="columns-1"
						className="control-first label-center small-gap"
						label={__('Height', 'publisher-core')}
						labelDescription={
							<>
								<p>
									{__(
										'Represents the height part of the ratio.',
										'publisher-core'
									)}
								</p>
								<p>
									{__(
										'In the "16 / 9" example, 9 is the height.',
										'publisher-core'
									)}
								</p>
							</>
						}
						style={{ margin: '0px' }}
						min={0}
						type="number"
						defaultValue={defaultValue.height}
						onChange={(newValue, ref) =>
							handleOnChangeAttributes(
								'publisherRatio',
								{
									...ratio,
									height: newValue,
								},
								{ ref }
							)
						}
					/>
				</Flex>
			)}
		</BaseControl>
	);
}
