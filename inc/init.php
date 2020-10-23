<?php
namespace Arkhe_Blocks;

add_action( 'init', function() {
	\Arkhe::set_plugin_data( 'use_arkhe_blocks', true );
} );
