/**
 * Publisher dependencies
 */
import { TransitionControl } from '@publisher/controls';
import { fieldsClassNames, fieldsInnerClassNames } from '@publisher/classnames';

export function TransitionField({ config, attribute, label, ...props }) {
	return (
		<div className={fieldsClassNames('transition', 'columns-1')}>
			<div className={fieldsInnerClassNames('control')}>
				<TransitionControl
					{...{
						config,
						...props,
						attribute,
					}}
					isPopover={true}
					label={label}
				/>
			</div>
		</div>
	);
}
