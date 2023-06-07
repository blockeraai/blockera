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

			{isActiveField(publisherTransition) && (
				<TransitionField
					{...{
						...props,
						attribute: 'publisherTransition',
						label: __('Transitions', 'publisher-core'),
					}}
				/>
			)}

			{isActiveField(publisherFilter) && (
				<FilterField
					{...{
						...props,
						attribute: 'publisherFilter',
						label: __('Filters', 'publisher-core'),
					}}
				/>
			)}

			{isActiveField(publisherBackdropFilter) && (
				<FilterField
					{...{
						...props,
						attribute: 'publisherBackdropFilter',
						label: __('Backdrop Filters', 'publisher-core'),
					}}
				/>
			)}

			{isActiveField(publisherCursor) && (
				<SelectField
					{...{
						...props,
						label: __('Cursor', 'publisher-core'),
						options: cursorFieldOptions(),
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
