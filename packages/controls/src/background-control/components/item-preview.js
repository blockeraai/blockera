/**
 * Publisher dependencies
 */
import { controlInnerClassNames } from '@publisher/classnames';

/**
 * Inner dependencies
 */
import { getBackgroundItemBGProperty } from '../utils';

export default function ItemPreview(item) {
	const cssProperty = getBackgroundItemBGProperty(item);

	return (
		<>
			{cssProperty && (
				<span
					className={controlInnerClassNames(
						'item-preview',
						'item-' + item.type
					)}
					style={{
						'background-image': cssProperty,
					}}
				/>
			)}
		</>
	);
}
