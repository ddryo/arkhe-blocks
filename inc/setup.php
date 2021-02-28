<?php
namespace Arkhe_Blocks;

defined( 'ABSPATH' ) || exit;

add_action( 'init', function() {
	if ( ! class_exists( 'Arkhe' ) ) return;
	\Arkhe::set_plugin_data( 'use_arkhe_blocks', true );
} );
