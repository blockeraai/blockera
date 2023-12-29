// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import { LabelControl } from '@publisher/controls';
import { fieldsClassNames, fieldsInnerClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import type { BaseControlProps } from './types';

export default function BaseControl({
	label = '',
	children,
	columns = '',
	className,
	controlName = 'general',
	style = {},
	...props
}: BaseControlProps): MixedElement {
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
					style={{ ...style, gridTemplateColumns: cssColumns || '' }}
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
			style={{ ...style, gridTemplateColumns: cssColumns || '' }}
			data-cy="base-control"
		>
			{label !== '' && (
				<div className={fieldsClassNames('label')}>
					<LabelControl label={label} {...props} />
				</div>
			)}

			<div className={fieldsClassNames('control')}>{children}</div>
		</div>
	);
}
