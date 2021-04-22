<?php
/**
 * Copyright 2020 Ryo Yamasaki.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Requires PHP: 7.0
 * Github: https://github.com/ddryo/Get_OGP_InWP
 */
class Get_OGP_InWP {

	/**
	 * Default value of the argument passed to wp_remote_get()
	 */
	public static $default_fetch_args = [
		'timeout'     => 15,
		'redirection' => 3,
		'sslverify'   => false,
		// 'user-agent'  => 'WordPress/' . $wp_version . '; ' . get_bloginfo( 'url' ),
	];


	/**
	 * Default value of the array that specifies the information you want to get
	 *    Note: Specify the value of name of meta tag as 'meta' in an array
	 */
	public static $default_targets = [
		'title'    => true,
		'icon'     => true,
		'og'       => true,
		'fb'       => true,
		'twitter'  => true,
		'meta'     => [
			'description',
			'thumbnail',
		],
	];


	/**
	 * Get OGP and metadata information from external sites
	 *
	 * @param string $url    URL of the target page
	 * @param array  $fetch_args    Arguments to pass to wp_remote_get()
	 * @param array  $targets    Array data that specifies the OGP and metadata you want to acquire
	 * @return array Obtained OGP and metadata information
	 */
	public static function get( $url, $fetch_args = null, $targets = null ) {

		if ( false === strpos( $url, '//' ) ) {
			$url = 'https://' . $url;
		}

		$fetch_args = $fetch_args ?: self::$default_fetch_args;
		$targets    = $targets ?: self::$default_targets;

		$response = self::fetch( $url, $fetch_args );
		if ( false === $response ) return [];

		return self::parse( $response, $targets );
	}


	/**
	 * Get information about the target site
	 *
	 * @param string $url    URL of the target page
	 * @param array  $args    Arguments to pass to wp_remote_get()
	 * @return string Fetch result
	 */
	public static function fetch( $url, $args ) {

		$response = wp_remote_get( $url, $args );

		if ( is_wp_error( $response ) ) {
			return false;
		}
		return $response['body'];
	}


	/**
	 * Analyze the DOM and get the data you need
	 *
	 * @param string $response_body    Fetch result
	 * @param array  $targets    Array data that specifies the OGP and metadata you want to acquire
	 * @return array Result data
	 */
	public static function parse( $response_body, $targets ) {

		// Data to be finally returned
		$ogp_data = [];

		// Avoid getting a loadHTML () parsing error
		$old_libxml_error = libxml_use_internal_errors( true );

		// Load HTML
		$doc = new DOMDocument();
		$doc->loadHTML( $response_body );

		libxml_use_internal_errors( $old_libxml_error );

		// Get title tag
		if ( $targets['title'] ) {
			$title = $doc->getElementsByTagName( 'title' );
			if ( 0 !== $title->length ) {
				// $ogp_data['title'] = $title->item( 0 )->textContent;
				$ogp_data['title'] = $title[0]->textContent;
			}
		}

		// Get meta tag
		$metas = $doc->getElementsByTagName( 'meta' );
		foreach ( $metas as $meta ) {

			$name     = $meta->getAttribute( 'name' );
			$property = $meta->getAttribute( 'property' );
			$content  = $meta->getAttribute( 'content' );

			if ( in_array( $name, $targets['meta'], true ) ) {
				$ogp_data[ $name ] = $content;
			}

			$is_og = ( $targets['og'] && 0 === strpos( $property, 'og:' ) );
			$is_fb = ( $targets['fb'] && 0 === strpos( $property, 'fb:' ) );
			$is_tw = ( $targets['twitter'] && 0 === strpos( $name, 'twitter:' ) );

			if ( $is_og || $is_fb ) {
				$ogp_data[ $property ] = $content;
			} elseif ( $is_tw ) {
				$ogp_data[ $name ] = $content;
			}
		}

		// Get favicon
		if ( $targets['icon'] ) {
			$icons = [];
			$links = $doc->getElementsByTagName( 'link' );
			foreach ( $links as $link ) {

				$rel  = $link->getAttribute( 'rel' );
				$href = $link->getAttribute( 'href' );
				$type = $link->getAttribute( 'type' );

				// Whether it is a png icon
				$is_pngicon = ( 0 === strpos( $rel, 'icon' ) && false !== strpos( $href, '.png' ) );

				if ( $is_pngicon ) {
					$icons[] = $href;
				} elseif ( 0 === strpos( $rel, 'apple-touch-icon' ) ) {
					$ogp_data['apple-touch-icon'] = $href;
				}
			}
			$ogp_data['icon'] = $icons;
		}

		return $ogp_data;
	}


	/**
	 * Extract the information required for the blog card from the acquired OGP data
	 *
	 * @param array $ogps    Result of get() method
	 * @return array Extracted data
	 */
	public static function extract_card_data( $ogps ) {

		$site_name = $ogps['og:site_name'] ?? '';

		// Page title
		$title = $ogps['og:title'] ?? '';
		if ( '' === $title ) {
			$title = $ogps['title'] ?? '';
		}

		// Page description
		$description = $ogps['og:description'] ?? '';
		if ( '' === $description ) {
			$description = $ogps['description'] ?? '';
		}

		// Thumbnail
		$thumbnail = $ogps['og:image'] ?? '';
		if ( '' === $thumbnail ) {
			$thumbnail = $ogps['thumbnail'] ?? '';
		}

		// delete http
		if ( false !== strpos( $thumbnail, 'http://' ) ) {
			$thumbnail = str_replace( 'http://', '//', $thumbnail );
		}

		// favicon image
		$icon = $ogps['icon'] ?? '';
		if ( empty( $icon ) ) {
			$icon = $icon['apple-touch-icon'] ?? '';
		} elseif ( is_array( $icon ) ) {
			$icon = $icon[0];
		}

		return [
			'site_name'   => $site_name,
			'title'       => $title,
			'description' => $description,
			'thumbnail'   => $thumbnail,
			'icon'        => $icon,
		];
	}
}
