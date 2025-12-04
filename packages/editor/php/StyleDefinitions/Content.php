<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\Contracts\StandardDefinition;

class Content extends BaseStyleDefinition implements StandardDefinition {

    public function getCssProperty(): string {

        return 'content';
    }

	/**
	 * Generate the css for the content setting.
	 * 
	 * @param array $setting The setting to generate css for.
	 * 
	 * @return array The css for the content setting.
	 */
	protected function css( array $setting): array {

        $declaration = [];
        $cssProperty = $setting['type'];

		// Validate the setting before generating css if the method validate exists.
		if (! $this->validate($setting)) {
			
			return $declaration;
		}

        if (empty($cssProperty) || empty($setting[ $cssProperty ]) || $this->getCssProperty() !== $cssProperty) {

            return $declaration;
        }

		$value = blockera_get_value_addon_real_value($setting[ $cssProperty ]);

        // Check if the value contains CSS functions: attr(), counter(), counters(), url().
        $hasCssFunction = strpos($value, 'attr(') !== false || 
                        strpos($value, 'counter(') !== false || 
                        strpos($value, 'counters(') !== false || 
                        strpos($value, 'url(') !== false;

        if ($hasCssFunction) {

            // Check if the value is exactly one CSS function (possibly nested), e.g. 'counter(attr(data-id))'.
            // This regex matches the outermost function and allows nested parentheses.
            if (preg_match('/^[\'"]?(attr|counter|counters|url)\((?:[^()]+|\([^()]*\))*\)[\'"]?$/', $value, $matches)) {
                // Remove quotes around value.
                $value = preg_replace('/^[\'"]?(.+?)[\'"]?$/', '$1', $value);
            } else {
                // Add quotes around each CSS function that isn't already quoted.
                // This regex handles nested functions by matching balanced parentheses.
                $value = preg_replace_callback(
                    '/(attr|counter|counters|url)\((?:[^()]+|\([^()]*\))*\)/',
                    function( $m) {
                        // If already in double quotes, skip.
                        if (preg_match('/^".*"$/', $m[0])) {
                            return $m[0];
                        }
                        return '"' . $m[0] . '"';
                    },
                    $value
                );
            }
        }

        $this->setDeclaration($cssProperty, $value);

        $this->setCss($this->declarations);

        return $this->css;
    }

    /**
     * Validate the setting before generating css.
	 * 
	 * @param array $setting The setting to validate.
     *
     * @return boolean true on success, false on failure.
     */
    protected function validate( array $setting): bool {

		$existing_state = in_array($this->pseudo_state, $this->getSupports(false)['blockeraContentPseudoElement']['hasDefaultValueInStates'], true);

		if (! empty($setting['content'])) {

			// If the content is equals to double quotes, it means that the content is empty.
			if ( '""' === $setting['content']) {

				return $existing_state;
			}

			return true;
		}

        return $existing_state;
    }
}
