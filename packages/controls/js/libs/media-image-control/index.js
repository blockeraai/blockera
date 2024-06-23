// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { useControlContext } from '../../context';
import type { MediaImageControlProps } from './types';
import { Button, MediaUploader, BaseControl } from '../index';

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
						icon={
							<Icon library="close" icon="close" iconSize="16" />
						}
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
