/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
/**
 * Publisher dependencies
 */
import { Button, MediaUploader } from '@publisher/components';
import {
	controlClassNames,
	controlInnerClassNames,
} from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { default as DeleteIcon } from './icons/delete';

const MediaImageControl = ({
	initValue = '',
	value: _value,
	labelChoose = __('Choose Image…', 'publisher-core'),
	labelMediaLibrary = __('Media Library', 'publisher-core'),
	labelUploadImage = __('Upload Image', 'publisher-core'),
	//
	className,
	onChange = (newValue) => {
		return newValue;
	},
	onValueChange = (newValue) => {
		return newValue;
	},
}) => {
	const [value, setValue] = useState(_value || initValue);

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
					className="btn-delete no-border"
					icon={<DeleteIcon />}
					align="center"
					onClick={() => {
						setValue('');
						const newValue = onChange('');
						onValueChange(newValue);
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
						const newValue = onChange(image.url);
						setValue(newValue);
						onValueChange(newValue);
					}}
					allowedTypes={['image']}
					mode="browse"
					render={({ open }) => (
						<Button
							className="btn-choose-image"
							align="center"
							onClick={open}
						>
							{labelChoose}
						</Button>
					)}
				/>
			)}

			{value && (
				<div className={controlInnerClassNames('action-btns')}>
					<MediaUploader
						onSelect={(image) => {
							const newValue = onChange(image.url);
							setValue(newValue);
							onValueChange(newValue);
						}}
						allowedTypes={['image']}
						mode="browse"
						render={({ open }) => (
							<Button
								className="btn-media-library no-border"
								align="center"
								onClick={open}
							>
								{labelMediaLibrary}
							</Button>
						)}
					/>

					<MediaUploader
						onSelect={(image) => {
							const newValue = onChange(image.url);
							setValue(newValue);
							onValueChange(newValue);
						}}
						allowedTypes={['image']}
						mode="upload"
						render={({ open }) => (
							<Button
								className="btn-upload no-border"
								align="center"
								onClick={open}
							>
								{labelUploadImage}
							</Button>
						)}
					/>
				</div>
			)}
		</div>
	);
};

export default MediaImageControl;
