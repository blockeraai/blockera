/**
 * Publisher dependencies
 */
import { LabelControl } from '@publisher/controls';
import { fieldsClassNames, fieldsInnerClassNames } from '@publisher/classnames';

export function Field({
	label = '',
	children,
	columns = '',
	className,
	field = 'general',
}) {
	columns = columns || (label !== '' ? 'columns-2' : 'columns-1');

	let cssColumns = '';

	if (columns !== 'columns-1' && columns !== 'columns-2') {
		cssColumns = columns;
		columns = 'columns-custom';
	}

	if (label === '') {
		if (field === 'empty') {
			return (
				<div
					className={fieldsClassNames(field, columns, className)}
					style={{ gridTemplateColumns: cssColumns || '' }}
				>
					<div className={fieldsInnerClassNames('control')}>
						{children}
					</div>
				</div>
			);
		}

		return <>{children}</>;
	}

	return (
		<div
			className={fieldsClassNames(field, columns, className)}
			style={{ gridTemplateColumns: cssColumns || '' }}
		>
			<div className={fieldsInnerClassNames('label')}>
				<LabelControl label={label} />
			</div>

			<div className={fieldsInnerClassNames('control')}>{children}</div>
		</div>
	);
}
