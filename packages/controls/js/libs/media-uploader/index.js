/**
 * WordPress dependencies
 */
import {
	MediaUpload as WPMediaUpload,
	MediaUploadCheck as WPMediaUploadCheck,
} from '@wordpress/block-editor';

/**
 * Blockera dependencies
 */
import { componentClassNames } from '@blockera/classnames';

export default function MediaUploader({
	className,
	allowedTypes,
	children,
	multiple = false,
	mode,
	...props
}) {
	return (
		<WPMediaUploadCheck>
			<WPMediaUpload
				className={componentClassNames('media-upload', className)}
				allowedTypes={allowedTypes}
				multiple={multiple}
				mode={mode}
				{...props}
			/>
		</WPMediaUploadCheck>
	);
}
