<?php
namespace Arkhe_Blocks;

defined( 'ABSPATH' ) || exit;

add_action( 'init', function() {
	if ( ! class_exists( 'Arkhe' ) ) return;
	\Arkhe::set_plugin_data( 'use_arkhe_blocks', true );
} );

add_action( 'after_setup_theme', function() {
	if ( \Arkhe_Blocks::get_data( 'general', 'use_custom_space' ) ) {
		add_theme_support( 'custom-spacing' );
	}
	if ( \Arkhe_Blocks::get_data( 'general', 'use_fse_blocks' ) ) {
		add_filter( 'arkhe_use_fse_blocks', '__return_true' );
	}
	if ( \Arkhe_Blocks::get_data( 'general', 'use_core_patterns' ) ) {
		add_theme_support( 'core-block-patterns' );
	}
}, 20 );
