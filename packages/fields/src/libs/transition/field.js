/**
 * Internal dependencies
 */
import { TransitionControl, LabelControl } from '@publisher/controls';
import { fieldsClassNames, fieldsInnerClassNames } from '@publisher/classnames';

export function TransitionField({ attribute, label, ...props }) {
	return (
		<div className={fieldsClassNames('transition', 'columns-1')}>
			{label && (
				<div className={fieldsInnerClassNames('label')}>
					<LabelControl label={label} />
				</div>
			)}

			<div className={fieldsInnerClassNames('control')}>
				<TransitionControl
					{...{ ...props, attribute }}
					isPopover={false}
				/>
			</div>
		</div>
	);
}
