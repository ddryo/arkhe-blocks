<?php
namespace Arkhe_Blocks\Render_Block;

defined( 'ABSPATH' ) || exit;

add_filter( 'render_block_arkhe-blocks/tab', __NAMESPACE__ . '\render_tab' );
function render_tab( $block_content ) {
	\Arkhe_Blocks::$use['tab'] = true;

	// memo: 古いデータを置換。いずれ消す
	$block_content = str_replace( ' data-onclick="tabControl"', '', $block_content );
	return $block_content;
}
