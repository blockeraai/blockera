/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { InputField, SelectField, TransitionField } from '@publisher/fields';
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
							type: 'range',
							min: 0,
							max: 100,
							initialPosition: 100,
						},
						attribute: 'publisherOpacity',
					}}
				/>
			)}

			{isActiveField(publisherTransition) && (
				<TransitionField
					{...{
						...props,
						attribute: 'publisherTransition',
						label: __('Transition', 'publisher-core'),
					}}
				/>
			)}

			{isActiveField(publisherCursor) && (
				<SelectField
					{...{
						...props,
						attribute: 'publisherCursor',
						label: __('Cursor', 'publisher-core'),
						options: cursorFieldOptions(),
						initValue: 'default',
					}}
				/>
			)}

			{isActiveField(publisherBlendMode) && (
				<SelectField
					{...{
						...props,
						attribute: 'publisherBlendMode',
						label: __('Blending', 'publisher-core'),
						options: blendModeFieldOptions(),
						initValue: 'normal',
					}}
				/>
			)}
		</>
	);
}
