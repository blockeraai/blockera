export const settings = {
	normal: {
		/**
		 * When count of "normal" state bigger than one item, other item of this state type is not visible!
		 */
		max: 1,
		/**
		 * When count of "normal" state equal with one item, this state should not deletable!
		 */
		min: 1,
		color: '#147EB8',
	},
	hover: {
		/**
		 * When count of "normal" state bigger than one item, other item of this state type is not visible!
		 */
		max: 1,
		/**
		 * This state must be usually deletable!
		 */
		min: 0,
		cssSelector: '@SELECTOR:hover',
		color: '#D47C14',
	},
	active: {
		/**
		 * When count of "normal" state bigger than one item, other item of this state type is not visible!
		 */
		max: 1,
		/**
		 * This state must be usually deletable!
		 */
		min: 0,
		//delete => enable
		cssSelector: '@SELECTOR:active',
		color: '#D47C14',
	},
	focus: {
		/**
		 * When count of "normal" state bigger than one item, other item of this state type is not visible!
		 */
		max: 1,
		/**
		 * This state must be usually deletable!
		 */
		min: 0,
		cssSelector: '@SELECTOR:focus',
		color: '#D47C14',
	},
	visited: {
		/**
		 * When count of "normal" state bigger than one item, other item of this state type is not visible!
		 */
		max: 1,
		/**
		 * This state must be usually deletable!
		 */
		min: 0,
		cssSelector: '@SELECTOR:visited',
		color: '#D47C14',
	},
	before: {
		/**
		 * When count of "normal" state bigger than one item, other item of this state type is not visible!
		 */
		max: 1,
		/**
		 * This state must be usually deletable!
		 */
		min: 0,
		cssSelector: '@SELECTOR:before',
		color: '#D47C14',
	},
	after: {
		/**
		 * When count of "normal" state bigger than one item, other item of this state type is not visible!
		 */
		max: 1,
		/**
		 * This state must be usually deletable!
		 */
		min: 0,
		cssSelector: '@SELECTOR:after',
		color: '#D47C14',
	},
	'custom-class': {
		/**
		 * This state must be usually cloneable, visible and addable!
		 */
		max: -1,
		/**
		 * This state must be usually deletable!
		 */
		min: 0,
		cssSelector: '@SELECTOR.className',
		color: '#D47C14',
	},
	'parent-class': {
		/**
		 * This state must be usually cloneable, visible and addable!
		 */
		max: -1,
		/**
		 * This state must be usually deletable!
		 */
		min: 0,
		cssSelector: '#parentClientId @SELECTOR',
		color: '#D47C14',
	},
	'parent-hover': {
		/**
		 * This state must be usually cloneable, visible and addable!
		 */
		max: -1,
		/**
		 * This state must be usually deletable!
		 */
		min: 0,
		cssSelector: '#parentClientId:hover @SELECTOR',
		color: '#D47C14',
	},
};
