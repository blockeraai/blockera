import { deletePropertyByPath, include } from '../index';

describe('Testing Object utilities', function () {
	const attributes = {
		publisherIcon: {},
		publisherIconPosition: '',
		publisherIconGap: '',
		publisherIconSize: '',
		publisherIconColor: '',
		publisherIconLink: {},
	};

	it('should include keys without "publisher" prefix', function () {
		expect(include(attributes, ['publisherIcon'], 'publisher')).toEqual({
			icon: {},
		});
	});

	describe('deletePropertByPath', () => {
		it('should delete property of object with passed path', () => {
			const object = {
				x: {
					b: [
						{
							g: 3,
						},
					],
				},
			};

			deletePropertyByPath(object, 'x.b.0');

			expect(object).toEqual({
				x: {
					b: [],
				},
			});
		});
		it('should delete property of object with passed complex path', () => {
			const object = {
				x: {
					b: [
						{
							g: 3,
						},
						{
							m: [
								{
									bb: 5,
								},
							],
						},
					],
				},
			};

			deletePropertyByPath(object, 'x.b.1.m.0.bb');

			expect(object).toEqual({
				x: {
					b: [
						{
							g: 3,
						},
						{
							m: [{}],
						},
					],
				},
			});
		});

		it('should delete property of object with passed complex path', () => {
			const object = {
				content: '',
				dropCap: false,
				publisherFontColor: '',
				publisherFontSize: '',
				publisherLineHeight: '',
				publisherTextAlign: '',
				publisherTextDecoration: '',
				publisherFontStyle: '',
				publisherTextTransform: '',
				publisherDirection: '',
				publisherTextShadow: [],
				publisherLetterSpacing: '',
				publisherWordSpacing: '',
				publisherTextIndent: '',
				publisherTextOrientation: {
					'writing-mode': '',
					'text-orientation': '',
				},
				publisherTextColumns: {
					columns: '',
					gap: '',
					divider: {
						width: '',
						color: '',
						style: 'solid',
					},
				},
				publisherTextStroke: {
					color: '',
					width: '',
				},
				publisherWordBreak: 'normal',
				publisherBackground: [],
				publisherBackgroundColor: '',
				publisherBackgroundClip: 'none',
				publisherBoxShadow: [
					{
						isOpen: false,
						display: true,
						cloneable: true,
						isVisible: true,
						deletable: true,
						selectable: false,
						visibilitySupport: true,
						type: 'inner',
						x: '10px',
						y: '10px',
						blur: '10px',
						spread: '0px',
						color: '#000000ab',
					},
				],
				publisherOutline: [],
				publisherBorder: {},
				publisherBorderRadius: {},
				publisherOpacity: '100%',
				publisherTransform: [],
				publisherTransformSelfPerspective: '',
				publisherTransformSelfOrigin: {
					top: '',
					left: '',
				},
				publisherBackfaceVisibility: '',
				publisherTransformChildPerspective: '',
				publisherTransformChildOrigin: {
					top: '',
					left: '',
				},
				publisherTransition: [],
				publisherFilter: [],
				publisherBackdropFilter: [],
				publisherCursor: 'default',
				publisherBlendMode: 'normal',
				publisherSpacing: {
					margin: {
						top: '',
						right: '',
						bottom: '',
						left: '',
					},
					padding: {
						top: '',
						right: '',
						bottom: '',
						left: '',
					},
				},
				publisherPosition: {},
				publisherZIndex: '',
				publisherWidth: '',
				publisherHeight: '',
				publisherMinWidth: '',
				publisherMinHeight: '',
				publisherMaxWidth: '',
				publisherMaxHeight: '',
				publisherOverflow: '',
				publisherRatio: {
					value: '',
					width: '',
					height: '',
				},
				publisherFit: '',
				publisherFitPosition: {
					top: '',
					left: '',
				},
				publisherDisplay: '',
				publisherFlexDirection: {
					value: 'row',
					reverse: false,
				},
				publisherAlignItems: '',
				publisherJustifyContent: '',
				publisherGap: {
					lock: true,
					gap: '',
					columns: '',
					rows: '',
				},
				publisherFlexWrap: {
					value: 'nowrap',
					reverse: false,
				},
				publisherAlignContent: '',
				publisherFlexChildSizing: '',
				publisherFlexChildGrow: '',
				publisherFlexChildShrink: '',
				publisherFlexChildBasis: '',
				publisherFlexChildAlign: '',
				publisherFlexChildOrder: '',
				publisherFlexChildOrderCustom: '',
				publisherIcon: {
					icon: '',
					library: '',
					uploadSVG: '',
				},
				publisherIconPosition: '',
				publisherIconGap: '',
				publisherIconSize: '',
				publisherIconColor: '',
				publisherIconLink: {},
				publisherAttributes: [],
				publisherCSSProperties: [],
				publisherBlockStates: [
					{
						isOpen: true,
						display: true,
						cloneable: true,
						isVisible: true,
						deletable: false,
						selectable: true,
						visibilitySupport: false,
						type: 'normal',
						label: 'Normal',
						breakpoints: [
							{
								type: 'desktop',
								label: 'Desktop',
							},
							{
								type: 'tablet',
								label: 'Tablet',
								attributes: {},
							},
							{
								type: 'mobile',
								label: 'Mobile',
								attributes: {},
							},
						],
						isSelected: false,
					},
					{
						isOpen: true,
						display: true,
						cloneable: true,
						isVisible: true,
						deletable: true,
						selectable: true,
						visibilitySupport: true,
						type: 'hover',
						label: 'Hover',
						breakpoints: [
							{
								type: 'desktop',
								label: 'Desktop',
								attributes: {
									publisherOutline: [],
									publisherBoxShadow: [
										{
											isOpen: false,
											display: true,
											cloneable: true,
											isVisible: true,
											deletable: true,
											selectable: false,
											visibilitySupport: true,
											type: 'outer',
											x: '10px',
											y: '10px',
											blur: '10px',
											spread: '0px',
											color: '#000000ab',
										},
									],
								},
							},
							{
								type: 'tablet',
								label: 'Tablet',
								attributes: {},
							},
							{
								type: 'mobile',
								label: 'Mobile',
								attributes: {},
							},
						],
						isSelected: true,
					},
				],
				publisherCurrentState: 'hover',
				publisherPropsId: '111921473052',
			};

			const expected = { ...object };

			delete expected.publisherBlockStates[1].breakpoints[0].attributes
				.publisherBoxShadow;

			const actual = deletePropertyByPath(
				object,
				'publisherBlockStates.1.breakpoints.0.attributes.publisherBoxShadow'
			);

			expect(actual).toEqual(expected);
		});
	});
});
