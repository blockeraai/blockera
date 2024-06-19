// @flow
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { Icon } from '@blockera/icons';

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
		case 'button':
			switch (attribute) {
				case 'type':
					return <Icon icon="block-button" iconSize="20" />;
			}
			break;

		case 'ol':
			switch (attribute) {
				case 'type':
					return <Icon icon="ol" iconSize="24" />;

				case 'reversed':
					return <Icon icon="ol-order-descending" iconSize="24" />;

				case 'start':
					return <Icon icon="number-circle-1" iconSize="24" />;
			}
			break;
	}

	switch (attribute) {
		case 'rel':
			return <Icon library="wp" icon="replace" iconSize="20" />;

		case 'lang':
			return <Icon icon="hreflang" iconSize="24" />;

		case 'target':
			return <Icon icon="target-blank" iconSize="24" />;

		case 'required':
			return <Icon icon="asterisk" iconSize="24" />;

		case 'referrerpolicy':
			return <Icon icon="shield-checked" iconSize="24" />;
	}

	if (attribute && attribute.startsWith('aria-')) {
		return <Icon icon="aria-label" iconSize="24" />;
	}

	if (attribute && attribute.startsWith('data-')) {
		return <Icon icon="data-attribute" iconSize="24" />;
	}

	return <Icon icon="html-tag-attribute" iconSize="24" />;
}
