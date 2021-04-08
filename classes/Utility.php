<?php
namespace Arkhe_Blocks;

trait Utility {


	/**
	 * style属性用のテキストに変換
	 */
	public static function convert_style_props( $styles ) {
		$style = '';
		foreach ( $styles as $key => $value ) {
			if ( '' === $value ) {
				continue;
			}
			$style .= "${key}:${value};";
		}

		return $style;
	}


	/**
	 * getPositionClassName() のPHP版
	 */
	public static function get_position_class( $position = '', $default = '' ) {
		if ( ! $position || $default === $position) return '';
		$position_classes = [
			'top left'       => 'is-position-top-left',
			'top center'     => 'is-position-top-center',
			'top right'      => 'is-position-top-right',
			'center left'    => 'is-position-center-left',
			'center center'  => 'is-position-center-center',
			'center right'   => 'is-position-center-right',
			'bottom left'    => 'is-position-bottom-left',
			'bottom center'  => 'is-position-bottom-center',
			'bottom right'   => 'is-position-bottom-right',
		];
		return $position_classes[ $position ];
	}
}
