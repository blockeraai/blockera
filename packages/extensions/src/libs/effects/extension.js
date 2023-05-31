/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	InputField,
	SelectField,
	TransitionField,
	AnglePickerField,
} from '@publisher/fields';
import { isActiveField } from '../../api/utils';
import { cursorFieldOptions } from './utils';

export function EffectsExtension({ children, config, ...props }) {
	const {
		effectsConfig: {
			publisherCursor,
			publisherOpacity,
			publisherTransition,
			publisherAnglePicker,
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

			{isActiveField(publisherAnglePicker) && (
				<AnglePickerField
					{...{
						...props,
						attribute: 'publisherAnglePicker',
						label: __('Angle', 'publisher-core'),
					}}
				/>
			)}
		</>
	);
}
