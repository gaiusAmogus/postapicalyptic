<?php

/**
 * Define the internationalization functionality
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @link       https://voidnetrun.it
 * @since      1.0.0
 *
 * @package    postapicalyptic
 * @subpackage postapicalyptic/includes
 */

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @since      1.0.0
 * @package    postapicalyptic
 * @subpackage postapicalyptic/includes
 * @author     Dawid Jedynak <kontakt@voidnetrun.it>
 */
class postapicalyptic_i18n {


	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    1.0.0
	 */
	public function load_plugin_textdomain() {

		load_plugin_textdomain(
			'postapicalyptic',
			false,
			dirname( dirname( plugin_basename( __FILE__ ) ) ) . '/languages/'
		);

	}



}
