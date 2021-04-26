<?php
namespace Arkhe_Blocks\Block\Section;

defined( 'ABSPATH' ) || exit;
// phpcs:disable WordPress.NamingConventions.ValidVariableName.InterpolatedVariableNotSnakeCase

/**
 * 旧データからの変換処理
 */
add_filter( 'render_block_data', function ( $block ) {
	// section ブロックのみ処理する
	if ( 'arkhe-blocks/section' !== $block['blockName'] ) return $block;

	$attrs = $block['attrs'];
	// var_dump( $attrs );

	// media関連
	if ( isset( $attrs['mediaUrl'] ) ) {
		$attrs['media'] = [
			'url'    => $attrs['mediaUrl'],
			'id'     => $attrs['mediaId'] ?? 0,
			'type'   => $attrs['mediaType'] ?? '',
			'width'  => $attrs['mediaWidth'] ?? 0,
			'height' => $attrs['mediaHeight'] ?? 0,
			// 'size' => 'full',
		];
		// unsetは別にいらないか...?
	}
	if ( isset( $attrs['mediaUrlSP'] ) ) {
		$attrs['mediaSP'] = [
			'url'    => $attrs['mediaUrlSP'],
			'id'     => $attrs['mediaIdSP'] ?? 0,
			'type'   => $attrs['mediaTypeSP'] ?? '',
			'width'  => $attrs['mediaWidthSP'] ?? 0,
			'height' => $attrs['mediaHeightSP'] ?? 0,
			// 'size' => 'full',
		];
	}

	// height関連
	if ( isset( $attrs['heightPC'] ) && is_numeric( $attrs['heightPC'] ) ) {
		$heightUnitPC      = $attrs['heightUnitPC'] ?? 'px';
		$attrs['heightPC'] = $attrs['heightPC'] . $heightUnitPC;
		$attrs['height']   = 'custom';
		unset( $attrs['heightUnitPC'] );
	}
	if ( isset( $attrs['heightSP'] ) && is_numeric( $attrs['heightSP'] ) ) {
		$heightUnitSP      = $attrs['heightUnitSP'] ?? 'px';
		$attrs['heightSP'] = $attrs['heightSP'] . $heightUnitSP;
		$attrs['height']   = 'custom';
		unset( $attrs['heightUnitSP'] );
	}

	// padding関連
	if ( isset( $attrs['padPC'] ) && is_numeric( $attrs['padPC'] ) ) {
		$padUnitPC          = $attrs['padUnitPC'] ?? 'rem';
		$attrs['paddingPC'] = [
			'top'    => $attrs['padPC'] . $padUnitPC,
			'left'   => '2rem',
			'right'  => '2rem',
			'bottom' => $attrs['padPC'] . $padUnitPC,
		];
		unset( $attrs['padPC'] );
		unset( $attrs['padUnitPC'] );
	}
	if ( isset( $attrs['padSP'] ) && is_numeric( $attrs['padSP'] ) ) {
		$padUnitSP          = $attrs['padUnitSP'] ?? 'rem';
		$attrs['paddingSP'] = [
			'top'    => $attrs['padSP'] . $padUnitSP,
			'left'   => '2rem',
			'right'  => '2rem',
			'bottom' => $attrs['padSP'] . $padUnitSP,
		];
		unset( $attrs['padSP'] );
		unset( $attrs['padUnitSP'] );
	}

	// svg関連
	if ( isset( $attrs['svgLevelTop'] ) ) {
		$attrs['svgTop'] = [
			'type'    => $attrs['svgTypeTop'] ?? 'line',
			'level'   => $attrs['svgLevelTop'],
			'color'   => $attrs['svgColorTop'] ?? '',
		];
		unset( $attrs['svgTypeTop'] );
		unset( $attrs['svgLevelTop'] );
		unset( $attrs['svgColorTop'] );
	}
	if ( isset( $attrs['svgLevelBottom'] ) ) {
		$attrs['svgBottom'] = [
			'type'    => $attrs['svgTypeBottom'] ?? 'line',
			'level'   => $attrs['svgLevelBottom'],
			'color'   => $attrs['svgColorBottom'] ?? '',
		];
		unset( $attrs['svgTypeBottom'] );
		unset( $attrs['svgLevelBottom'] );
		unset( $attrs['svgColorBottom'] );
	}

	$block['attrs'] = $attrs;
	return $block;
});


/**
 * 古いバージョンからのコンテンツ変換
 */
function migrate_content( $content ) {

	$content = mb_convert_encoding( $content, 'HTML-ENTITIES', 'auto' );

	$dom = new \DOMDocument( '1.0', 'UTF-8' );
	libxml_use_internal_errors( true );
	$dom->loadHTML( $content );
	libxml_clear_errors();
	$xpath = new \DOMXpath( $dom );

	$innerBlocks = $xpath->query( '//div[@class="ark-block-section__inner ark-keep-mt"]' )->item( 0 )->childNodes;

	$return = '';
	foreach ( $innerBlocks as $block ) {
		$return .= $dom->saveHTML( $block );
	}
	return $return;
}
