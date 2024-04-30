// @flow
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import { default as AttributeIcon } from './icons/attribute';
import { default as AttributeAriaIcon } from './icons/attribute-aria';
import { default as ARelIcon } from './icons/a-rel';
import { default as ATargetIcon } from './icons/a-target';
import { default as AHreflangIcon } from './icons/a-hreflang';
import { default as AReferrerpolicyIcon } from './icons/a-referrerpolicy';
import { default as ButtonTypeIcon } from './icons/button-type';
import { default as OlTypeIcon } from './icons/ol-type';
import { default as OlReversedIcon } from './icons/ol-reversed';
import { default as OlStartIcon } from './icons/ol-start';
import { default as AttributeDataIcon } from './icons/attribute-data';
import { default as AttributeRequiredIcon } from './icons/attribute-required';
import type {
	TAttributeFieldKeyOptions,
	TAttributeFieldValueOptions,
	TOptionsReturn,
} from './types';

export function getAttributeFieldKeyOptions({
	element = '',
}: TAttributeFieldKeyOptions): TOptionsReturn {
	switch (element) {
		case 'a':
			return [
				{
					label: __('None', 'blockera'),
					value: '',
				},
				{
					label: __('Custom Attribute', 'blockera'),
					value: 'custom',
				},
				{
					type: 'optgroup',
					label: __('Link Attributes', 'blockera'),
					options: [
						{
							label: 'rel',
							value: 'rel',
						},
						{
							label: 'target',
							value: 'target',
						},
						{
							label: 'hreflang',
							value: 'hreflang',
						},
						{
							label: 'referrerpolicy',
							value: 'referrerpolicy',
						},
					],
				},
			];

		case 'button':
			return [
				{
					label: __('None', 'blockera'),
					value: '',
				},
				{
					label: __('Custom Attribute', 'blockera'),
					value: 'custom',
				},
				{
					type: 'optgroup',
					label: __('Button Attributes', 'blockera'),
					options: [
						{
							label: 'type',
							value: 'type',
						},
					],
				},
			];

		case 'ol':
			return [
				{
					label: __('None', 'blockera'),
					value: '',
				},
				{
					label: __('Custom Attribute', 'blockera'),
					value: 'custom',
				},
				{
					type: 'optgroup',
					label: __('List Attributes', 'blockera'),
					options: [
						{
							label: 'reversed',
							value: 'reversed',
						},
						{
							label: 'start',
							value: 'start',
						},
						{
							label: 'type',
							value: 'type',
						},
					],
				},
			];
	}

	return [];
}

export function getAttributeFieldValueOptions({
	element = '',
	attribute = '',
}: TAttributeFieldValueOptions): TOptionsReturn {
	switch (element) {
		case 'a':
			switch (attribute) {
				case 'rel':
					return [
						{
							label: '',
							value: '',
						},
						{
							type: 'optgroup',
							label: __('Common Values', 'blockera'),
							options: [
								{
									label: 'nofollow',
									value: 'nofollow',
								},
								{
									label: 'sponsored',
									value: 'sponsored',
								},
								{
									label: 'noreferrer',
									value: 'noreferrer',
								},
								{
									label: 'noopener',
									value: 'noopener',
								},
								{
									label: 'next',
									value: 'next',
								},
								{
									label: 'prev',
									value: 'prev',
								},
							],
						},
						{
							type: 'optgroup',
							label: __('Other', 'blockera'),
							options: [
								{
									label: 'alternate',
									value: 'alternate',
								},
								{
									label: 'author',
									value: 'author',
								},
								{
									label: 'bookmark',
									value: 'bookmark',
								},
								{
									label: 'external',
									value: 'external',
								},
								{
									label: 'help',
									value: 'help',
								},
								{
									label: 'license',
									value: 'license',
								},

								{
									label: 'search',
									value: 'search',
								},
								{
									label: 'tag',
									value: 'tag',
								},
							],
						},
					];

				case 'target':
					return [
						{
							label: '',
							value: '',
						},
						{
							type: 'optgroup',
							label: __('Common Value', 'blockera'),
							options: [
								{
									label: '_blank',
									value: '_blank',
								},
							],
						},
						{
							type: 'optgroup',
							label: __('Other', 'blockera'),
							options: [
								{
									label: '_self',
									value: '_self',
								},
								{
									label: '_parent',
									value: '_parent',
								},
								{
									label: '_top',
									value: '_top',
								},
							],
						},
					];

				case 'referrerpolicy':
					return [
						{
							label: '',
							value: '',
						},
						{
							type: 'optgroup',
							label: __('Common Value', 'blockera'),
							options: [
								{
									label: 'no-referrer',
									value: 'no-referrer',
								},
							],
						},
						{
							type: 'optgroup',
							label: __('Other', 'blockera'),
							options: [
								{
									label: 'no-referrer-when-downgrade',
									value: 'no-referrer-when-downgrade',
								},
								{
									label: 'origin',
									value: 'origin',
								},
								{
									label: 'origin-when-cross-origin',
									value: 'origin-when-cross-origin',
								},
								{
									label: 'same-origin',
									value: 'same-origin',
								},
								{
									label: 'strict-origin-when-cross-origin',
									value: 'strict-origin-when-cross-origin',
								},
								{
									label: 'unsafe-url',
									value: 'unsafe-url',
								},
							],
						},
					];
			}
			break;

		case 'button':
			switch (attribute) {
				case 'type':
					return [
						{
							label: '',
							value: '',
						},
						{
							label: 'button',
							value: 'button',
						},
						{
							label: 'reset',
							value: 'reset',
						},
						{
							label: 'submit',
							value: 'submit',
						},
					];
			}
			break;

		case 'ol':
			switch (attribute) {
				case 'type':
					return [
						{
							label: '',
							value: '',
						},
						{
							label: '1',
							value: '1',
						},
						{
							label: 'A',
							value: 'A',
						},
						{
							label: 'a',
							value: 'a',
						},
						{
							label: 'i',
							value: 'i',
						},
					];
			}
			break;
	}

	return [];
}

export function getAttributeItemIcon({
	element,
	attribute,
}: TAttributeFieldValueOptions): MixedElement {
	switch (element) {
		case 'a':
			switch (attribute) {
				case 'rel':
					return <ARelIcon />;

				case 'target':
					return <ATargetIcon />;

				case 'hreflang':
					return <AHreflangIcon />;

				case 'referrerpolicy':
					return <AReferrerpolicyIcon />;
			}
			break;

		case 'button':
			switch (attribute) {
				case 'type':
					return <ButtonTypeIcon />;
			}
			break;

		case 'ol':
			switch (attribute) {
				case 'type':
					return <OlTypeIcon />;

				case 'reversed':
					return <OlReversedIcon />;

				case 'start':
					return <OlStartIcon />;
			}
			break;
	}

	if (attribute === 'lang') {
		return <AHreflangIcon />;
	}

	if (attribute === 'required') {
		return <AttributeRequiredIcon />;
	}

	if (attribute.startsWith('aria-')) {
		return <AttributeAriaIcon />;
	}

	if (attribute.startsWith('data-')) {
		return <AttributeDataIcon />;
	}

	return <AttributeIcon />;
}
