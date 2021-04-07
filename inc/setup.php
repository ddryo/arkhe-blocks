<?php
namespace Arkhe_Blocks;

defined( 'ABSPATH' ) || exit;

add_action( 'init', function() {
	if ( ! class_exists( 'Arkhe' ) ) return;
	\Arkhe::set_plugin_data( 'use_arkhe_blocks', true );
} );


add_action( 'after_setup_theme', function() {
	add_theme_support( 'custom-units', 'px', 'rem', 'em', '%', 'vw', 'vh' );
}, 11 );
