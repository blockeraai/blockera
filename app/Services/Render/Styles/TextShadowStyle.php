<?php

namespace Publisher\Framework\Services\Render\Styles;

class TextShadowStyle extends RepeaterStyle {

	protected function getId(): string {

		return 'publisherTextShadow';
	}

	protected function getCssProp(): string {

		return 'text-shadow';
	}

}

