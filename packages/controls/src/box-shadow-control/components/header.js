/**
 * WordPress dependencies
 */
import { ColorIndicator } from '@wordpress/components';
import { memo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { controlInnerClassNames } from '@publisher/classnames';

const Header = ({
	item: { type, x, y, blur, spread, color = '#fff' },
	isOpen,
	setOpen,
	children,
	isOpenPopoverEvent,
}) => {
	const heading = () => {
		return `${x} ${y} ${blur} ${spread}`;
	};

	return (
		<div
			className={controlInnerClassNames('repeater-group-header')}
			onClick={(event) => isOpenPopoverEvent(event) && setOpen(!isOpen)}
		>
			<span className={controlInnerClassNames('header-icon')}>
				<ColorIndicator
					colorValue={color}
					className={controlInnerClassNames('color-indicator')}
				/>
			</span>

			<span className={controlInnerClassNames('header-label')}>
				{type === 'inner'
					? __('Inner', 'publisher-core')
					: __('Outer', 'publisher-core')}
			</span>

			<span className={controlInnerClassNames('header-values')}>
				{heading()}
			</span>

			{children}
		</div>
	);
};

export default memo(Header);
