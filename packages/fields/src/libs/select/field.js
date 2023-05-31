/**
 * Internal dependencies
 */
import { SelectControl, LabelControl } from '@publisher/controls';
import { fieldsClassNames, fieldsInnerClassNames } from '@publisher/classnames';

export function SelectField({ name, attribute, label, options, ...props }) {
	return (
		<div
			className={fieldsClassNames(
				'select',
				label !== '' ? 'columns-2' : 'columns-1'
			)}
		>
			{label && (
				<div className={fieldsInnerClassNames('label')}>
					<LabelControl label={label} />
				</div>
			)}

			<div className={fieldsInnerClassNames('control')}>
				<SelectControl
					{...{
						...props,
						options,
						attribute,
					}}
				/>
			</div>
		</div>
	);
}
