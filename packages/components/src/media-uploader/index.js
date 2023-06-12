/**
 * WordPress dependencies
 */
import {
	MediaUpload as WPMediaUpload,
	MediaUploadCheck as WPMediaUploadCheck,
} from '@wordpress/block-editor';

/**
 * Publisher dependencies
 */
import { componentClassNames } from '@publisher/classnames';

export default function MediaUploader({
	className,
	allowedTypes,
	children,
	multiple,
	mode,
	...props
}) {
	return (
		<WPMediaUploadCheck>
			<WPMediaUpload
				className={componentClassNames('media-upload', className)}
				allowedTypes
				multiple
				mode
				{...props}
			/>
		</WPMediaUploadCheck>
	);
}
