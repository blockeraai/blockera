/**
 * Internal dependencies
 */
import { TransitionControl } from '@publisher/controls';
import { fieldsClassNames, fieldsInnerClassNames } from '@publisher/classnames';

export function TransitionField({ attribute, label, ...props }) {
	return (
		<div className={fieldsClassNames('transition', 'columns-1')}>
			<div className={fieldsInnerClassNames('control')}>
				<TransitionControl
					{...{ ...props, attribute }}
					isPopover={true}
					label={label}
				/>
			</div>
		</div>
	);
}
