<?php
namespace Arkhe_Blocks;

defined( 'ABSPATH' ) || exit;

add_filter( 'admin_bar_menu', function ( $wp_admin_bar ) {

	if ( ! class_exists( 'Arkhe' ) ) return;

	// プロライセンス購入ページへの導線
	if ( ! \Arkhe::get_plugin_data( 'added_toolbar_to_pro' ) && ! \Arkhe::$has_pro_licence ) {
		\Arkhe::set_plugin_data( 'added_toolbar_to_pro', 1 );

		$licence_shop_url = \Arkhe::$is_ja ? '/ja/product/arkhe-licence/' : '/product/arkhe-licence/';

		// 親メニュー
		$wp_admin_bar->add_menu(
			[
				'id'    => 'arkhe_to_pro',
				'title' => '<span class="ab-icon "></span><span class="ab-label">' . __( 'Get license', 'arkhe-blocks' ) . '</span>',
				'href'  => 'https://arkhe-theme.com' . $licence_shop_url,
				'meta'  => [
					'class'  => 'arkhe-menu',
					'target' => '_blank',
					'rel'    => 'noopener',
				],
			]
		);
		$wp_admin_bar->add_menu(
			[
				'parent' => 'arkhe_to_pro',
				'id'     => 'arkhe_to_pro_menu',
				'meta'   => [],
				'title'  => __( 'License key registration', 'arkhe-blocks' ),
				'href'   => admin_url( 'themes.php?page=arkhe&tab=licence' ),
			]
		);
	}
}, 100 );
