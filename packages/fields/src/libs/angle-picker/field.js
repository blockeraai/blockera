/**
 * Internal dependencies
 */
import { AnglePickerControl, LabelControl } from '@publisher/controls';
import { fieldsClassNames, fieldsInnerClassNames } from '@publisher/classnames';

export function AnglePickerField({ label, attribute, ...props }) {
	return (
		<div
			className={fieldsClassNames(
				'angle-picker',
				label !== '' ? 'columns-2' : 'columns-1'
			)}
		>
			{label && (
				<div className={fieldsInnerClassNames('label')}>
					<LabelControl label={label} />
				</div>
			)}

			<div className={fieldsClassNames('control')}>
				<AnglePickerControl
					{...{
						...props,
						attribute,
					}}
				/>
			</div>
		</div>
	);
}
