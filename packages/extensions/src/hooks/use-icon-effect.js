/**
 * External dependencies
 */
import { createRoot, useEffect, useRef } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { Icon } from '@publisher/components';
import { isEmpty, isUndefined } from '@publisher/utils';

const IconComponent = ({ el, iconNode, position }) => {
	const refId = useRef(null);

	useEffect(() => {
		const contentEditable = refId.current.querySelector(
			'*[contentEditable="true"]'
		);

		if (contentEditable) {
			if ('right' === position) {
				contentEditable.innerHTML += `<span class="publisher-icon">${iconNode.innerHTML}</span>`;
			} else {
				contentEditable.innerHTML = `<span class="publisher-icon">${iconNode.innerHTML}</span>${contentEditable.innerHTML}`;
			}

			const iconElement =
				contentEditable.querySelector('.publisher-icon');

			const handleKeyDownEvent = (e) => {
				if (e.keyCode === 8 || e.keyCode === 46) {
					// delete and del keys
					const length = iconElement.children.length;

					if (length === 1) {
						// last inner element
						const text = iconElement.children[0].innerText;

						if (text < 1) {
							// last element is empty
							e.preventDefault();
						}
					}
				}
			};

			/* eslint-disable no-unused-expressions */
			iconElement &&
				iconElement.addEventListener('keydown', handleKeyDownEvent);

			return;
		}

		/* eslint-disable no-unused-expressions */
		refId.current.innerHTML =
			'right' === position
				? /* eslint-disable no-unused-expressions */
				  `${refId.current.innerHTML}${iconNode.innerHTML}`
				: /* eslint-disable no-unused-expressions */
				  `${iconNode.innerHTML}${refId.current.innerHTML}`;
		// eslint-disable-next-line
	}, []);

	return (
		<span
			className={'publisher-icon-element'}
			dangerouslySetInnerHTML={{
				__html: el.innerHTML
					.replace(/<span\sclass="publisher-icon-element".*?>/is, '')
					.replace(/<span\sclass="publisher-icon".*?>/is, '')
					//FIXME: to switch safe replace with any condition needed to check!
					.replace(/<\/span>/gis, '')
					.replace(/<svg.*?>.*?<\/svg>/is, ''),
			}}
			ref={refId}
		/>
	);
};

const allowedBlocks = ['core/button', 'core/site-title'];

export const useIconEffect = ({
	name,
	clientId,
	blockRefId,
	publisherIcon,
	publisherIconGap = '5px',
	publisherIconSize = 25,
	publisherIconColor = '',
	publisherIconPosition = 'left',
}) => {
	if (!allowedBlocks.includes(name)) {
		return;
	}

	const blockElement = blockRefId.current;
	const el = blockElement.parentElement.querySelector(`#block-${clientId}`);

	if (isUndefined(publisherIcon) || isEmpty(publisherIcon) || !el) {
		return;
	}

	const root = createRoot(el);
	const iconNode = document.createElement('span');
	const icon = createRoot(iconNode);
	const iconSize = publisherIconSize.replace(/[a-z]+/g, '');

	icon.render(
		<Icon
			style={{
				fill: publisherIconColor,
				color: publisherIconColor,
				marginLeft: publisherIconGap,
				marginRight: publisherIconGap,
			}}
			{...(publisherIcon ?? {})}
			size={iconSize}
		/>
	);

	root.render(
		<IconComponent
			el={el}
			iconNode={iconNode}
			position={publisherIconPosition}
		/>
	);
};
