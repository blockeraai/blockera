/**
 * External dependencies
 */
import PropTypes from 'prop-types';

/**
 * Publisher dependencies
 */
import { LabelControl } from '@publisher/controls';
import { fieldsClassNames, fieldsInnerClassNames } from '@publisher/classnames';

export default function BaseControl({
	label,
	children,
	columns,
	className,
	controlName,
}) {
	let cssColumns = '';

	if (columns !== '' && columns !== 'columns-1' && columns !== 'columns-2') {
		cssColumns = columns;
		columns = 'columns-custom';
	}

	if (label === '' && columns === '') {
		if (controlName === 'empty') {
			return (
				<div
					className={fieldsClassNames(
						controlName,
						columns,
						className
					)}
					style={{ gridTemplateColumns: cssColumns || '' }}
					data-cy="base-control"
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
			className={fieldsClassNames(controlName, columns, className)}
			style={{ gridTemplateColumns: cssColumns || '' }}
			data-cy="base-control"
		>
			{label !== '' && (
				<div className={fieldsClassNames('label')}>
					<LabelControl label={label} />
				</div>
			)}

			<div className={fieldsClassNames('control')}>{children}</div>
		</div>
	);
}

BaseControl.propTypes = {
	/**
	 * The label for child control.
	 */
	label: PropTypes.string,
	/**
	 * The child control.
	 */
	children: PropTypes.node,
	/**
	 * The classname for number of columns in wrapper(BaseControl).
	 */
	columns: PropTypes.string,
	/**
	 * The custom classname.
	 */
	className: PropTypes.string,
	/**
	 * The name of control to choose render with label or not!
	 */
	controlName: PropTypes.oneOfType(['empty', 'general']),
};

BaseControl.defaultProps = {
	label: '',
	columns: '',
	controlName: 'general',
};
