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
			{isVisible && (
				<Icon
					type="far"
					size={16}
					icon={faEye}
					onClick={() => setVisibility(!isVisible)}
				/>
			)}
			{!isVisible && (
				<Icon
					size={16}
					type="far"
					icon={faEyeSlash}
					onClick={() => setVisibility(!isVisible)}
				/>
			)}
		</span>
	);
}
