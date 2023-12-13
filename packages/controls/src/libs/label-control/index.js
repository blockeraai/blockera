/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import { useState } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { isEmpty, isFunction, isNull, isUndefined } from '@publisher/utils';
import { Button, Popover } from '@publisher/components';
import { controlClassNames } from '@publisher/classnames';

const AdvancedLabelControl = ({
	path,
	label,
	className,
	ariaLabel,
	description,
	resetToDefault,
	...props
}) => {
	const [isOpenModal, setOpenModal] = useState(false);

	return (
		<>
			{label && (
				<span
					{...props}
					onClick={() => setOpenModal(true)}
					className={controlClassNames('label', className)}
					aria-label={ariaLabel || label}
					data-cy="label-control"
					style={{
						cursor: 'pointer',
					}}
				>
					{label}
				</span>
			)}
			{isOpenModal && (
				<Popover
					offset={35}
					title={label}
					onClose={() => setOpenModal(!isOpenModal)}
					placement={'left-start'}
				>
					{description && description()}

					<Button
						variant={'primary'}
						text={'Reset To Default'}
						label={'Reset To Default'}
						onClick={() => {
							if (
								!resetToDefault ||
								!isFunction(resetToDefault)
							) {
								return;
							}

							setOpenModal(!isOpenModal);

							if (
								isNull(path) ||
								isEmpty(path) ||
								isUndefined(path)
							) {
								return resetToDefault();
							}

							resetToDefault({ path });
						}}
					/>
				</Popover>
			)}
		</>
	);
};

const LabelControl = ({
	mode,
	label,
	className,
	ariaLabel,
	description,
	resetToDefault,
	...props
}) => {
	if ('advanced' === mode || isFunction(resetToDefault)) {
		return (
			<AdvancedLabelControl
				{...{
					label,
					className,
					ariaLabel,
					description,
					resetToDefault,
					...props,
				}}
			/>
		);
	}

	return (
		<>
			{label && (
				<span
					{...props}
					className={controlClassNames('label', className)}
					aria-label={ariaLabel || label}
					data-cy="label-control"
				>
					{label}
				</span>
			)}
		</>
	);
};

LabelControl.propTypes = {
	/**
	 * Label text
	 */
	label: PropTypes.string,
	/**
	 * Custom css classes
	 */
	className: PropTypes.string,
	/**
	 * Custom aria label for adding to label tag
	 */
	ariaLabel: PropTypes.string,
	/**
	 * The mode of label control
	 */
	mode: PropTypes.oneOf(['simple', 'advanced']),
};

LabelControl.defaultProps = {
	label: '',
	ariaLabel: '',
	mode: 'simple',
};

export default LabelControl;
