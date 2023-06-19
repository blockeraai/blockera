/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import {
	InputField,
	SelectField,
	TransitionField,
	FilterField,
	TransformField,
} from '@publisher/fields';

/**
 * Internal dependencies
 */
import { BlockEditContext } from '../../hooks';
import { isActiveField } from '../../api/utils';
import { cursorFieldOptions, blendModeFieldOptions } from './utils';

export function EffectsExtension({ children, config, ...props }) {
	const {
		effectsConfig: {
			publisherOpacity,
			publisherTransform,
			publisherTransition,
			publisherFilter,
			publisherCursor,
			publisherBlendMode,
			publisherBackdropFilter,
		},
	} = config;

	const { attributes, setAttributes } = useContext(BlockEditContext);

	return (
		<>
			{isActiveField(publisherOpacity) && (
				<InputField
					{...{
						...props,
						label: __('Opacity', 'publisher-core'),
						settings: {
							type: 'css',
							unitType: 'percent',
							range: true,
							min: 0,
							max: 100,
							initialPosition: 100,
							initValue: '100%',
						},
						//
						value: attributes.publisherOpacity,
						onValueChange: (newValue) =>
							setAttributes({
								...attributes,
								publisherOpacity: newValue,
							}),
					}}
				/>
			)}

			{isActiveField(publisherTransform) && (
				<TransformField
					label={__('2D & 3D Transforms', 'publisher-core')}
					value={attributes.publisherTransform}
					onValueChange={(newValue) =>
						setAttributes({
							...attributes,
							publisherTransform: newValue,
						})
					}
					{...props}
				/>
			)}

			{isActiveField(publisherTransition) && (
				<TransitionField
					label={__('Transitions', 'publisher-core')}
					value={attributes.publisherTransition}
					onValueChange={(newValue) =>
						setAttributes({
							...attributes,
							publisherTransition: newValue,
						})
					}
					{...props}
				/>
			)}

			{isActiveField(publisherFilter) && (
				<FilterField
					label={__('Filters', 'publisher-core')}
					value={attributes.publisherFilter}
					onValueChange={(newValue) =>
						setAttributes({
							...attributes,
							publisherFilter: newValue,
						})
					}
					{...props}
				/>
			)}

			{isActiveField(publisherBackdropFilter) && (
				<FilterField
					label={__('Backdrop Filters', 'publisher-core')}
					popoverLabel={__('Backdrop Filter', 'publisher-core')}
					value={attributes.publisherBackdropFilter}
					onValueChange={(newValue) =>
						setAttributes({
							...attributes,
							publisherBackdropFilter: newValue,
						})
					}
					{...props}
				/>
			)}

			{isActiveField(publisherCursor) && (
				<SelectField
					{...{
						...props,
						label: __('Cursor', 'publisher-core'),
						options: cursorFieldOptions(),
						type: 'custom',
						customMenuPosition: 'top',
						//
						initValue: 'default',
						value: attributes.publisherCursor,
						onValueChange: (newValue) =>
							setAttributes({
								...attributes,
								publisherCursor: newValue,
							}),
					}}
				/>
			)}

			{isActiveField(publisherBlendMode) && (
				<SelectField
					{...{
						...props,
						label: __('Blending', 'publisher-core'),
						options: blendModeFieldOptions(),
						type: 'custom',
						customMenuPosition: 'top',
						//
						initValue: 'normal',
						value: attributes.publisherBlendMode,
						onValueChange: (newValue) =>
							setAttributes({
								...attributes,
								publisherBlendMode: newValue,
							}),
					}}
				/>
			)}
		</>
	);
}
