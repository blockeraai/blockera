// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { Tooltip, ConditionalWrapper } from '@blockera/controls';
import { controlInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { getTarget } from '../helpers';
import { PostPreviewButton } from './post-preview-button';

export const Preview = (): MixedElement => {
	const {
		postId,
		permalink,
		isViewable,
		isPublished,
		previewLink,
		isSavablePost,
		currentPostLink,
		previewDropdown,
	} = useSelect((select) => {
		const {
			getPermalink,
			getCurrentPostId,
			getCurrentPostType,
			isEditedPostSaveable,
			isCurrentPostPublished,
			getCurrentPostAttribute,
			getEditedPostPreviewLink,
		} = select('core/editor') || {};
		const { getPostType } = select('core');

		const postType = getPostType(getCurrentPostType('type'));

		const { getEntity } = select('blockera/data') || {};
		const { version } = getEntity('wp');

		const { previewDropdown } = getTarget(version);

		return {
			previewDropdown,
			permalink: getPermalink(),
			postId: getCurrentPostId(),
			isPublished: isCurrentPostPublished(),
			isSavablePost: isEditedPostSaveable(),
			previewLink: getEditedPostPreviewLink(),
			isViewable: postType?.viewable ?? false,
			currentPostLink: getCurrentPostAttribute('link'),
		};
	}, []);
	// Link to the `?preview=true` URL if we have it, since this lets us see
	// changes that were autosaved since the post was last published. Otherwise,
	// just link to the post's URL.
	const href =
		!isPublished || !permalink
			? previewLink || currentPostLink
			: currentPostLink;

	// To hidden WordPress original post-preview-button.
	useEffect(() => {
		const originPreviews = document.querySelectorAll(previewDropdown);

		if (originPreviews.length) {
			originPreviews.forEach((preview) => {
				preview.style.display = 'none';
			});
		}
		// eslint-disable-next-line
	}, [href]);

	const previewButton = (
		<PostPreviewButton
			isPublished={isPublished}
			permalink={permalink}
			href={href}
			postId={postId}
			isSaveable={isSavablePost}
			isViewable={isViewable}
			textContent={
				<Icon
					className={'blockera-canvas-preview-link'}
					library={'wp'}
					icon={'external'}
					iconSize={22}
				/>
			}
		/>
	);

	if (!previewButton) {
		return <></>;
	}

	return (
		<ConditionalWrapper
			wrapper={(children) => (
				<Tooltip
					text={__('Preview in new tab', 'blockera')}
					placement="bottom"
				>
					{children}
				</Tooltip>
			)}
			condition={isSavablePost}
		>
			<div
				className={controlInnerClassNames(
					'canvas-editor-preview-link',
					{
						'is-disabled-preview-button': !isSavablePost,
					}
				)}
			>
				{previewButton}
			</div>
		</ConditionalWrapper>
	);
};
