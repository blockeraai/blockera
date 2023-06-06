/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { controlInnerClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { default as TypeImageIcon } from '../icons/type-image';
import { default as TypeLinearGradientIcon } from '../icons/type-linear-gradient';
import { default as TypeRadialGradientIcon } from '../icons/type-radial-gradient';

const Header = ({ item, isOpen, setOpen, children }) => {
	let label, icon, value;

	switch (item.type) {
		case 'image':
			label = __('Image', 'publisher-core');
			value = 'test.png';
			icon = <TypeImageIcon />;
			break;

		case 'linear-gradient':
			label = __('Linear Gradient', 'publisher-core');
			value = '';
			icon = <TypeLinearGradientIcon />;
			break;

		case 'radial-gradient':
			label = __('Radial Gradient', 'publisher-core');
			value = '';
			icon = <TypeRadialGradientIcon />;
			break;
	}

	return (
		<div
			className={controlInnerClassNames('repeater-group-header')}
			onClick={() => setOpen(!isOpen)}
		>
			<span className={controlInnerClassNames('header-icon')}>
				{icon}
			</span>

			<span className={controlInnerClassNames('header-label')}>
				{label}
			</span>

			<span className={controlInnerClassNames('header-values')}>
				{value}
			</span>

			{children}
		</div>
	);
};

export default memo(Header);
