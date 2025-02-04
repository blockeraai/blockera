<?php

namespace Blockera\WordPress\RenderBlock\V2;

use Blockera\Bootstrap\Application;

class Parser {

    /**
     * Hold the Application class instance.
     *
     * @var Application $app
     */
    protected Application $app;

    /**
     * The Parser class constructor.
     *
     * @param Application $app The application container object.
     */
    public function __construct( Application $app) {
        $this->app = $app;
    }

    /**
     * Prepare inline styles for current block.
     *
     * @return array The inline styles as array.
     */
    public function cleanupInlineStyles( \WP_HTML_Tag_Processor $processor): array {
        // Store inline styles with class name keys.
        $inline_styles = [];

        // Extract inline styles from each element with style attribute.
        while ($processor->next_tag()) {
            $style = $processor->get_attribute('style');
            $class = $processor->get_attribute('class');

            if (! empty($style)) {
                // FIXME: refactor with foreach loop to get better performance.
                // Use class name as key if exists, otherwise generate unique key.
                $key                   = ! empty($class) ? str_replace(' ', '.', $class) : 'element-' . count($inline_styles);
                $inline_styles[ $key ] = blockera_array_flat(
                    array_filter(
                        array_map(
                            function ( $item) {
                                if (empty($item)) {
                                    return [];
                                }

                                $value = explode(':', $item);

                                return [ $value[0] => $value[1] ];
                            },
                            explode(';', $style)
                        ),
                        'blockera_get_filter_empty_array_item'
                    )
                );

                $processor->remove_attribute('style');
            }
        }

        return $inline_styles;
    }

    /**
     * Update classname for current tag.
     *
     * @param \WP_HTML_Tag_Processor $processor The HTML tag processor object.
     * @param string                 $classname The classname to update.
     *
     * @return void
     */
    public function updateClassname( \WP_HTML_Tag_Processor $processor, string $classname): void {
        // Regular Expression to detect blockera unique classname.
        $regexp = blockera_get_unique_class_name_regex();

        // Get tag previous classname value.
        $previous_class = $processor->get_attribute('class');

        if (! empty($previous_class)) {
            // Backward compatibility.
            if (preg_match($regexp, $classname, $matches) && preg_match($regexp, $previous_class)) {

                $final_classname = preg_replace($regexp, $matches[0], $previous_class);
            } else {
                $final_classname = $classname . ' ' . $previous_class;
            }
        }

        $processor->set_attribute('class', $final_classname ?? $classname);
    }
}
