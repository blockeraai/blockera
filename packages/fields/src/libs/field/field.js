/**
 * Publisher dependencies
 */
import { LabelControl } from '@publisher/controls';
import { fieldsClassNames, fieldsInnerClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import './style.scss';

export function Field({
	label,
	children,
	columns,
	className,
	field = 'general',
}) {
	columns = columns ? columns : label !== '' ? 'columns-2' : 'columns-1';

	return (
		<div className={fieldsClassNames(field, columns, className)}>
			{label && (
				<div className={fieldsInnerClassNames('label')}>
					<LabelControl label={label} />
				</div>
			)}

			<div className={fieldsInnerClassNames('control')}>{children}</div>
		</div>
	);
}
