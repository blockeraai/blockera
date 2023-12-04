<?php

namespace Publisher\Framework\Illuminate\StyleEngine\StyleDefinitions;

class Size extends BaseStyleDefinition {

	public function getProperties(): array {

		if ( empty( $this->settings['type'] ) ) {

			return $this->properties;
		};

		$cssProperty   = $this->settings['type'];
		$propertyValue = $this->settings[ $cssProperty ];

		if('aspect-ratio' === $cssProperty ){
          $props=[];
		
          switch($propertyValue['value']){
			case 'none':
				break;
				case 'custom':
			       $props['aspect-ratio']=$propertyValue['width'] . ( !empty($propertyValue['width']) && !empty($propertyValue['height']) ?' / ': '' ). $propertyValue['height'] . $this->getImportant();
			    break;
				default:  $props[$cssProperty]=$propertyValue['value'] . $this->getImportant();
		}

		    $this->setProperties($props);

	        return $this->properties;
	    }

		if('object-position' === $cssProperty){
			$this->setProperties(
	    	   [
		         $cssProperty => $propertyValue['top'] . ' ' . $propertyValue['left']  . $this->getImportant(),
			   ]
		);
		return $this->properties;
		}
	 
	    $this->setProperties(
	    	[
		      $cssProperty => $propertyValue . $this->getImportant(),
			]
		);
		return $this->properties;
	}

}