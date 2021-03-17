<?php
namespace Arkhe_Blocks;

defined( 'ABSPATH' ) || exit;


add_filter( 'render_block_arkhe-blocks/slider', function ( $block_content, $block ) {
	\Arkhe_Blocks::$use_swiper = true;
	return $block_content;
}, 10, 2 );
