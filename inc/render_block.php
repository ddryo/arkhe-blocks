<?php
namespace Arkhe_Blocks\Render_Block;

defined( 'ABSPATH' ) || exit;

add_filter( 'render_block_arkhe-blocks/tab', __NAMESPACE__ . '\render_tab' );
function render_tab( $block_content ) {
	\Arkhe_Blocks::$use['tab'] = true;

	// memo: 古いデータを置換。いずれ消す
	$block_content = str_replace( ' data-onclick="tabControl"', '', $block_content );

	// remove_filter( 'render_block_arkhe-blocks/tab', __NAMESPACE__ . '\render_tab' );
	return $block_content;
}

add_filter( 'render_block_arkhe-blocks/accordion', __NAMESPACE__ . '\render_accordion' );
function render_accordion( $block_content ) {
	\Arkhe_Blocks::$use['accordion'] = true;
	remove_filter( 'render_block_arkhe-blocks/accordion', __NAMESPACE__ . '\render_accordion' );
	return $block_content;
}


add_filter( 'render_block_core/list', __NAMESPACE__ . '\render_core_list', 10, 2 );
function render_core_list( $block_content, $block ) {
	if ( isset( $block['attrs']['start'] ) ) {
		\Arkhe_Blocks::$use['ol_start'] = true;
		remove_filter( 'render_block_core/list', __NAMESPACE__ . '\render_core_list', 10 );
	}
	return $block_content;
}
