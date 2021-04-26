<?php
namespace Arkhe_Blocks\Block\Section;

defined( 'ABSPATH' ) || exit;
// phpcs:disable WordPress.NamingConventions.ValidVariableName.InterpolatedVariableNotSnakeCase

function get_block_style( $attrs ) {

	$height   = $attrs['height'];
	$heightPC = $attrs['heightPC'];
	$heightSP = $attrs['heightSP'];
	$padPC    = $attrs['paddingPC'];
	$padSP    = $attrs['paddingSP'];
	$mediaUrl = $attrs['media']['url'] ?? '';

	// style
	$style = [
		'--arkb-section-padding'     => "{$padPC['top']} {$padPC['right']} {$padPC['bottom']} {$padPC['left']}",
		'--arkb-section-padding--sp' => "{$padSP['top']} {$padSP['right']} {$padSP['bottom']} {$padSP['left']}",
	];

	// 内部minheight
	if ( 'custom' === $height ) {
		if ( $heightPC ) $style['--arkb-section-minH']     = $heightPC;
		if ( $heightSP ) $style['--arkb-section-minH--sp'] = $heightSP;
	}

	if ( $attrs['textColor'] ) {
		$style['color'] = $attrs['textColor'];
	}

	// リピート背景画像
	if ( $attrs['isRepeat'] && $mediaUrl ) {
		$style['background-image']  = 'url(' . $mediaUrl . ')';
		$style['background-repeat'] = 'repeat';

		if ( $attrs['bgSize'] ) {
			$style['background-size'] = $attrs['bgSize'];
		}
	}

	return $style;
}


function get_svg_data( $svgData ) {
	$svgLevel = $svgData['level'];

	if ( 0 === $svgLevel ) {
		$svgData['isReverse'] = false;
		$svgData['height']    = 0;
	} else {
		$svgData['isReverse'] = 0 > $svgLevel;
		$svgData['height']    = abs( $svgLevel * 0.1 );
	}

	return $svgData;
};
