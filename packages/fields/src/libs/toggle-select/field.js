/**
 * Publisher dependencies
 */
import { ToggleSelectControl, LabelControl } from '@publisher/controls';
import { fieldsClassNames, fieldsInnerClassNames } from '@publisher/classnames';

export function ToggleSelectField({ name, label, options, ...props }) {
	return (
		<div
			className={fieldsClassNames(
				'toggle-select',
				label !== '' ? 'columns-2' : 'columns-1'
			)}
		>
			{label && (
				<div className={fieldsInnerClassNames('label')}>
					<LabelControl label={label} />
				</div>
			)}

			<div className={fieldsInnerClassNames('control')}>
				<ToggleSelectControl
					{...{
						...props,
						options,
					}}
				/>
			</div>
		</div>
	);
}
