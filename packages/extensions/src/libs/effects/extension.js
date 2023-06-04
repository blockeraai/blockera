/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { InputField, SelectField, TransitionField } from '@publisher/fields';

/**
 * Internal dependencies
 */
import { isActiveField } from '../../api/utils';
import { cursorFieldOptions, blendModeFieldOptions } from './utils';

export function EffectsExtension({ children, config, ...props }) {
	const {
		effectsConfig: {
			publisherOpacity,
			publisherTransition,
			publisherCursor,
			publisherBlendMode,
		},
	} = config;

	return (
		<>
			{isActiveField(publisherOpacity) && (
				<InputField
					{...{
						...props,
						label: __('Opacity', 'publisher-core'),
						settings: {
							type: 'css',
							range: true,
							min: 0,
							max: 100,
							initialPosition: 100,
							units: [{ value: '%', label: '%', default: 0 }],
						},
						//
						attribute: 'publisherOpacity',
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

			{isActiveField(publisherCursor) && (
				<SelectField
					{...{
						...props,
						label: __('Cursor', 'publisher-core'),
						options: cursorFieldOptions(),
						//
						initValue: 'default',
						attribute: 'publisherCursor',
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
						attribute: 'publisherBlendMode',
					}}
				/>
			)}
		</>
	);
}
