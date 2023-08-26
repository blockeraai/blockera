/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import {
	BaseControl,
	ControlContextProvider,
	InputControl,
	ToggleSelectControl,
} from '@publisher/controls';

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

export function FlexChildExtension({ block, config, ...props }) {
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
						name: generateExtensionId(block, 'sizing'),
						value: attributes.publisherFlexChildSizing,
					}}
				>
					<BaseControl
						columns="1fr 2.65fr"
						controlName="toggle-select"
						label={__('Sizing', 'publisher-core')}
						className={'items-flex-direction-' + flexDirection}
					>
						<ToggleSelectControl
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
							//
							defaultValue=""
							onChange={(newValue) =>
								setAttributes({
									...attributes,
									publisherFlexChildSizing: newValue,
								})
							}
						/>
						{attributes.publisherFlexChildSizing === 'custom' && (
							<>
								<ControlContextProvider
									value={{
										name: generateExtensionId(
											block,
											'grow'
										),
										value: attributes.publisherFlexChildGrow,
									}}
								>
									<BaseControl
										controlName="input"
										label={__('Grow', 'publisher-core')}
									>
										<InputControl
											{...{
												...props,
												min: 0,
												onChange: (newValue) =>
													setAttributes({
														...attributes,
														publisherFlexChildGrow:
															newValue,
													}),
											}}
										/>
									</BaseControl>
								</ControlContextProvider>
								<ControlContextProvider
									value={{
										name: generateExtensionId(
											block,
											'shrink'
										),
										value: attributes.publisherFlexChildShrink,
									}}
								>
									<BaseControl
										controlName="input"
										label={__('Shrink', 'publisher-core')}
									>
										<InputControl
											{...{
												...props,
												min: 0,
												onChange: (newValue) =>
													setAttributes({
														...attributes,
														publisherFlexChildShrink:
															newValue,
													}),
											}}
										/>
									</BaseControl>
								</ControlContextProvider>
								<ControlContextProvider
									value={{
										name: generateExtensionId(
											block,
											'basis'
										),
										value: attributes.publisherFlexChildBasis,
									}}
								>
									<BaseControl
										controlName="input"
										label={__('Basis', 'publisher-core')}
									>
										<InputControl
											{...{
												...props,
												unitType: 'essential',
												min: 0,
												defaultValue: 'auto',
												onChange: (newValue) =>
													setAttributes({
														...attributes,
														publisherFlexChildBasis:
															newValue,
													}),
											}}
										/>
									</BaseControl>
								</ControlContextProvider>
							</>
						)}
					</BaseControl>
				</ControlContextProvider>
			)}

			{isActiveField(publisherFlexChildAlign) && (
				<ControlContextProvider
					value={{
						name: generateExtensionId(block, 'align'),
						value: attributes.publisherFlexChildAlign,
					}}
				>
					<BaseControl
						columns="1fr 2.65fr"
						controlName="toggle-select"
						label={__('Align', 'publisher-core')}
						className={'items-flex-direction-' + flexDirection}
					>
						<ToggleSelectControl
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
							//
							defaultValue=""
							onChange={(newValue) =>
								setAttributes({
									...attributes,
									publisherFlexChildAlign: newValue,
								})
							}
						/>
					</BaseControl>
				</ControlContextProvider>
			)}

			{isActiveField(publisherFlexChildOrder) && (
				<ControlContextProvider
					value={{
						name: generateExtensionId(block, 'order'),
						value: attributes.publisherFlexChildOrder,
					}}
				>
					<BaseControl
						columns="1fr 2.65fr"
						controlName="toggle-select"
						label={__('Order', 'publisher-core')}
					>
						<ToggleSelectControl
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
							//
							defaultValue=""
							onChange={(newValue) =>
								setAttributes({
									...attributes,
									publisherFlexChildOrder: newValue,
								})
							}
						/>
						<>
							{attributes.publisherFlexChildOrder ===
								'custom' && (
								<ControlContextProvider
									value={{
										name: generateExtensionId(
											block,
											'order-custom'
										),
										value: attributes.publisherFlexChildOrderCustom,
									}}
								>
									<BaseControl
										controlName="input"
										label={__('Order', 'publisher-core')}
									>
										<InputControl
											{...{
												...props,
												min: -1,
												onChange: (newValue) =>
													setAttributes({
														...attributes,
														publisherFlexChildOrderCustom:
															newValue,
													}),
											}}
										/>
									</BaseControl>
								</ControlContextProvider>
							)}
						</>
					</BaseControl>
				</ControlContextProvider>
			)}
		</>
	);
}
