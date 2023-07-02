/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';

/**
 * Publisher dependencies
 */
import { Button, MediaUploader } from '@publisher/components';
import {
	controlClassNames,
	controlInnerClassNames,
} from '@publisher/classnames';
import { useValue } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { default as DeleteIcon } from './icons/delete';

export default function MediaImageControl({
	defaultValue,
	value: initialValue,
	labelChoose,
	labelMediaLibrary,
	labelUploadImage,
	className,
	onChange,
}) {
	const { value, setValue } = useValue({
		defaultValue,
		initialValue,
		onChange,
	});

	return (
		<div
			className={controlClassNames(
				'media-image',
				value ? 'image-custom' : 'image-none',
				className
			)}
		>
			{value && (
				<Button
					className="btn-delete"
					noBorder={true}
					icon={<DeleteIcon />}
					onClick={() => {
						setValue('');
					}}
				/>
			)}

			{value && (
				<img
					alt={value}
					src={value}
					align="center"
					className={controlInnerClassNames('image-preview')}
				/>
			)}

			{!value && (
				<MediaUploader
					onSelect={(image) => {
						setValue(image.url);
					}}
					allowedTypes={['image']}
					mode="browse"
					render={({ open }) => (
						<Button className="btn-choose-image" onClick={open}>
							{labelChoose}
						</Button>
					)}
				/>
			)}

			{value && (
				<div className={controlInnerClassNames('action-btns')}>
					<MediaUploader
						onSelect={(image) => {
							setValue(image?.url);
						}}
						allowedTypes={['image']}
						mode="browse"
						render={({ open }) => (
							<Button
								className="btn-media-library"
								noBorder={true}
								onClick={open}
							>
								{labelMediaLibrary}
							</Button>
						)}
					/>

					<MediaUploader
						onSelect={(image) => {
							setValue(image?.url);
						}}
						allowedTypes={['image']}
						mode="upload"
						render={({ open }) => (
							<Button
								className="btn-upload"
								onClick={open}
								noBorder={true}
							>
								{labelUploadImage}
							</Button>
						)}
					/>
				</div>
			)}
		</div>
	);
}

MediaImageControl.propTypes = {
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render,
	 */
	defaultValue: PropTypes.string,
	/**
	 * The current value.
	 */
	value: PropTypes.string,
	/**
	 * Function that will be fired while the control value state changes.
	 */
	onChange: PropTypes.func,
	/**
	 * Label for choose button while the image control is empty
	 */
	labelChoose: PropTypes.string,
	/**
	 * The `Media Library` button label.
	 */
	labelMediaLibrary: PropTypes.string,
	/**
	 * The `Upload Image` button label.
	 */
	labelUploadImage: PropTypes.string,
};

MediaImageControl.defaultProps = {
	defaultValue: '',
	labelChoose: __('Choose Image…', 'publisher-core'),
	labelMediaLibrary: __('Media Library', 'publisher-core'),
	labelUploadImage: __('Upload Image', 'publisher-core'),
};
