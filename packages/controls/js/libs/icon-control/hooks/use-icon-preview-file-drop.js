// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { dispatch } from '@wordpress/data';
import { useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { readSvgFromDroppedFiles, sanitizeRawSVGString } from '../utils';

type CommitSvgAction = {
	type: 'UPDATE_SVG',
	svgString: string,
	uploadSVG: string,
};

type UseIconPreviewFileDropOptions = {
	onCommitSvg: (action: CommitSvgAction) => void,
};

type UseIconPreviewFileDropReturn = {
	handlePreviewFilesDrop: (files: FileList | File[]) => void,
};

/**
 * Shared drop-to-upload handler for icon previews (sidebar control + core/icon canvas).
 */
export function useIconPreviewFileDrop({
	onCommitSvg,
}: UseIconPreviewFileDropOptions): UseIconPreviewFileDropReturn {
	const { createNotice } = dispatch('core/notices');

	const handlePreviewFilesDrop = useCallback(
		(files) => {
			if (!files?.length) {
				return;
			}

			readSvgFromDroppedFiles(files, (rawSvg) => {
				const svgString = sanitizeRawSVGString(rawSvg);

				if (!svgString) {
					createNotice(
						'error',
						__('Please upload a valid SVG file!', 'blockera'),
						{
							isDismissible: true,
						}
					);
					return;
				}

				onCommitSvg({
					type: 'UPDATE_SVG',
					svgString,
					uploadSVG: '',
				});
			});
		},
		[onCommitSvg, createNotice]
	);

	return {
		handlePreviewFilesDrop,
	};
}
