/**
 * Internal dependencies
 */
import { Icon } from '@publisher/components';

/**
 * External dependencies
 */
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';

export default function VisibleElement({ isVisible, setVisibility }) {
	return (
		<span className="status">
			<Icon
				type="far"
				size={16}
				icon={isVisible ? faEye : faEyeSlash}
				onClick={(e) => {
					setVisibility(!isVisible);
					e.preventDefault();
				}}
			/>
		</span>
	);
}
