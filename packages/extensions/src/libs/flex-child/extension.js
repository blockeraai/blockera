/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { ControlContextProvider } from '@publisher/controls';
import { InputField, ToggleSelectField } from '@publisher/fields';

/**
 * Internal dependencies
 */
import { generateExtensionId } from '../utils';
import { BlockEditContext } from '../../hooks';
import { isActiveField } from '../../api/utils';
import { default as SizingShrinkIcon } from './icons/sizing-shrink';
import { default as SizingGrowIcon } from './icons/sizing-grow';
import { default as SizingNotIcon } from './icons/sizing-not';
import { default as GearIcon } from './icons/gear';
import { default as AlignFlexStartIcon } from './icons/align-flex-start';
import { default as AlignFlexCenterIcon } from './icons/align-flex-center';
import { default as AlignFlexEndIcon } from './icons/align-flex-end';
import { default as AlignStretchIcon } from './icons/align-stretch';
import { default as AlignBaselineIcon } from './icons/align-baseline';

export function FlexChildExtension({ config, ...props }) {
	const {
		flexChildConfig: {
			publisherFlexChildSizing,
			publisherFlexChildAlign,
			publisherFlexChildOrder,
		},
	} = config;

	const { attributes, setAttributes } = useContext(BlockEditContext);

	const flexDirection = attributes.publisherFlexDirection;

	return (
		<>
			{isActiveField(publisherFlexChildSizing) && (
				<ControlContextProvider
					value={{
						name: generateExtensionId(props.blockName, 'sizing'),
						value: attributes.publisherFlexChildSizing,
					}}
				>
					<ToggleSelectField
						label={__('Sizing', 'publisher-core')}
						options={[
							{
								label: __('Shrink', 'publisher-core'),
								value: 'shrink',
								icon: <SizingShrinkIcon />,
							},
							{
								label: __('Grow', 'publisher-core'),
								value: 'grow',
								icon: <SizingGrowIcon />,
							},
							{
								label: __(
									'No Grow or Shrink',
									'publisher-core'
								),
								value: 'no',
								icon: <SizingNotIcon />,
							},
							{
								label: __('Custom', 'publisher-core'),
								value: 'custom',
								icon: <GearIcon />,
							},
						]}
						isDeselectable={true}
						columns="1fr 2.65fr"
						className={'items-flex-direction-' + flexDirection}
						//
						defaultValue=""
						onChange={(newValue) =>
							setAttributes({
								...attributes,
								publisherFlexChildSizing: newValue,
							})
						}
					>
						{attributes.publisherFlexChildSizing === 'custom' && (
							<>
								<ControlContextProvider
									value={{
										name: generateExtensionId(
											props.blockName,
											'grow'
										),
										value: attributes.publisherFlexChildGrow,
									}}
								>
									<InputField
										label={__('Grow', 'publisher-core')}
										settings={{ type: 'number', min: 0 }}
										onChange={(newValue) =>
											setAttributes({
												...attributes,
												publisherFlexChildGrow:
													newValue,
											})
										}
									/>
								</ControlContextProvider>
								<ControlContextProvider
									value={{
										name: generateExtensionId(
											props.blockName,
											'shrink'
										),
										value: attributes.publisherFlexChildShrink,
									}}
								>
									<InputField
										label={__('Shrink', 'publisher-core')}
										settings={{ type: 'number', min: 0 }}
										onChange={(newValue) =>
											setAttributes({
												...attributes,
												publisherFlexChildShrink:
													newValue,
											})
										}
									/>
								</ControlContextProvider>
								<ControlContextProvider
									value={{
										name: generateExtensionId(
											props.blockName,
											'basis'
										),
										value: attributes.publisherFlexChildBasis,
									}}
								>
									<InputField
										label={__('Basis', 'publisher-core')}
										settings={{
											type: 'css',
											unitType: 'essential',
											min: 0,
										}}
										defaultValue="auto"
										value={
											attributes.publisherFlexChildBasis
										}
										onChange={(newValue) =>
											setAttributes({
												...attributes,
												publisherFlexChildBasis:
													newValue,
											})
										}
									/>
								</ControlContextProvider>
							</>
						)}
					</ToggleSelectField>
				</ControlContextProvider>
			)}

			{isActiveField(publisherFlexChildAlign) && (
				<ControlContextProvider
					value={{
						name: generateExtensionId(props.blockName, 'align'),
						value: attributes.publisherFlexChildAlign,
					}}
				>
					<ToggleSelectField
						label={__('Align', 'publisher-core')}
						options={[
							{
								label: __('Flex Start', 'publisher-core'),
								value: 'flex-start',
								icon: <AlignFlexStartIcon />,
							},
							{
								label: __('Center', 'publisher-core'),
								value: 'center',
								icon: <AlignFlexCenterIcon />,
							},
							{
								label: __('Flex End', 'publisher-core'),
								value: 'flex-end',
								icon: <AlignFlexEndIcon />,
							},
							{
								label: __('Stretch', 'publisher-core'),
								value: 'stretch',
								icon: <AlignStretchIcon />,
							},
							{
								label: __('Baseline', 'publisher-core'),
								value: 'baseline',
								icon: <AlignBaselineIcon />,
							},
						]}
						isDeselectable={true}
						columns="1fr 2.65fr"
						className={'items-flex-direction-' + flexDirection}
						//
						defaultValue=""
						onChange={(newValue) =>
							setAttributes({
								...attributes,
								publisherFlexChildAlign: newValue,
							})
						}
					/>
				</ControlContextProvider>
			)}

			{isActiveField(publisherFlexChildOrder) && (
				<ControlContextProvider
					value={{
						name: generateExtensionId(props.blockName, 'order'),
						value: attributes.publisherFlexChildOrder,
					}}
				>
					<ToggleSelectField
						label={__('Order', 'publisher-core')}
						options={[
							{
								label: __('First', 'publisher-core'),
								value: 'first',
							},
							{
								label: __('Last', 'publisher-core'),
								value: 'last',
							},
							{
								label: __('Custom Order', 'publisher-core'),
								value: 'custom',
								icon: <GearIcon />,
							},
						]}
						isDeselectable={true}
						columns="1fr 2.65fr"
						//
						defaultValue=""
						onChange={(newValue) =>
							setAttributes({
								...attributes,
								publisherFlexChildOrder: newValue,
							})
						}
					>
						<>
							{attributes.publisherFlexChildOrder ===
								'custom' && (
								<ControlContextProvider
									value={{
										name: generateExtensionId(
											props.blockName,
											'order-custom'
										),
										value: attributes.publisherFlexChildOrderCustom,
									}}
								>
									<InputField
										label={__('Order', 'publisher-core')}
										settings={{
											type: 'number',
											min: -1,
										}}
										defaultValue={1}
										onChange={(newValue) =>
											setAttributes({
												...attributes,
												publisherFlexChildOrderCustom:
													newValue,
											})
										}
									/>
								</ControlContextProvider>
							)}
						</>
					</ToggleSelectField>
				</ControlContextProvider>
			)}
		</>
	);
}
