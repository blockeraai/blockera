// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { Button, MediaUploader } from '@blockera/components';
import {
	controlClassNames,
	controlInnerClassNames,
} from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { BaseControl } from '../index';
import { useControlContext } from '../../context';
import { default as DeleteIcon } from './icons/delete';
import type { MediaImageControlProps } from './types';

export default function MediaImageControl({
	labelChoose = __('Choose Image…', 'blockera'),
	labelMediaLibrary = __('Media Library', 'blockera'),
	labelUploadImage = __('Upload Image', 'blockera'),
	//
	id,
	label = '',
	labelPopoverTitle,
	labelDescription,
	repeaterItem,
	singularId,
	columns,
	defaultValue = '',
	onChange,
	field = 'media-image',
	//
	className,
}: MediaImageControlProps): MixedElement {
	const {
		value,
		setValue,
		attribute,
		blockName,
		resetToDefault,
		getControlPath,
	} = useControlContext({
		id,
		onChange,
		defaultValue,
	});

	const labelProps = {
		value,
		singularId,
		attribute,
		blockName,
		label,
		labelPopoverTitle,
		labelDescription,
		repeaterItem,
		defaultValue,
		resetToDefault,
		mode: 'advanced',
		path: getControlPath(attribute, id),
	};

	return (
		<BaseControl
			columns={columns}
			controlName={field}
			className={className}
			{...labelProps}
		>
			<div
				className={controlClassNames(
					'media-image',
					value ? 'image-custom' : 'image-none',
					className
				)}
			>
				{value && (
					<Button
						data-cy="delete-bg-img"
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
		</BaseControl>
	);
}

MediaImageControl.propTypes = {
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
	/**
	 * Label for field. If you pass empty value the field will not be added and simple control will be rendered
	 *
	 * @default ""
	 */
	label: PropTypes.string,
	/**
	 * Field id for passing into child Field component
	 *
	 * @default "toggle-select"
	 */
	field: PropTypes.string,
	/**
	 * Columns setting for Field grid.
	 *
	 * @default "columns-2"
	 */
	columns: PropTypes.string,
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render,
	 */
	defaultValue: PropTypes.string,
	/**
	 * Function that will be fired while the control value state changes.
	 */
	onChange: PropTypes.func,
};