<?php
namespace Arkhe_Blocks;

trait Utility {


	/**
	 * WodPressのバージョンチェック
	 */
	public static function wpver_is_above( $version ) {
		global $wp_version;
		return ( version_compare( $wp_version, $version . '-beta' ) >= 0 );
	}


	/**
	 * $use の値を取得
	 */
	public static function is_use( $key ) {
		if ( ! isset( self::$use[ $key ] ) ) {
			return false;
		}
		return self::$use[ $key ];
	}


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
	// public static function get_position_class( $position = '', $default = '' ) {
	// 	if ( ! $position || $default === $position) return '';
	// 	$position_classes = [
	// 		'top left'       => 'top-left',
	// 		'top center'     => 'top-center',
	// 		'top right'      => 'top-right',
	// 		'center left'    => 'center-left',
	// 		'center center'  => 'center-center',
	// 		'center right'   => 'center-right',
	// 		'bottom left'    => 'bottom-left',
	// 		'bottom center'  => 'bottom-center',
	// 		'bottom right'   => 'bottom-right',
	// 	];
	// 	return $position_classes[ $position ];
	// }
}
