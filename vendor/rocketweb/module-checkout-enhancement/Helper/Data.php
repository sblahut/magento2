<?php
/**
 * Rocket Web
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/osl-3.0.php
 *
 * @category  RocketWeb
 * @package   RocketWeb_CheckoutEnhacement
 * @copyright Copyright (c) 2016-2017 RocketWeb (http://rocketweb.com)
 * @license   http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
 * @author    Rocket Web Inc.
 */

namespace RocketWeb\CheckoutEnhancement\Helper;

/**
 * Checkout Enhancement helper
 *
 * @SuppressWarnings(PHPMD.LongVariable)
 */
class Data extends \Magento\Framework\App\Helper\AbstractHelper
{
    const XML_PAYMENT_DEFAULT_ACTIVE_DEFAULT_PAYMENT = 'rocketweb_checkout_enhancement/payment/active_default_payment';
    const XML_PAYMENT_DEFAULT_METHOD = 'rocketweb_checkout_enhancement/payment/default_method';

    const XML_GOOGLE_MAP_API_KEY = 'rocketweb_checkout_enhancement/google_map/api_key';
    const XML_GOOGLE_MAP_ADDRESS_ACTIVE_GOOGLE_ADDRESS = 'rocketweb_checkout_enhancement/google_map_address/active_google_address';
    const XML_GOOGLE_MAP_ADDRESS_LIBRARIES = 'rocketweb_checkout_enhancement/google_map_address/libraries';
    const XML_GOOGLE_MAP_ADDRESS_COUNTRY = 'rocketweb_checkout_enhancement/google_map_address/country';
    const XML_GOOGLE_MAP_ADDRESS_LANGUAGE = 'rocketweb_checkout_enhancement/google_map_address/language';
    const XML_GOOGLE_MAP_ADDRESS_ACTIVE_GOOGLE_ADDRESS_ACCOUNT = 'rocketweb_checkout_enhancement/google_map_address/active_google_address_account';
    const XML_GOOGLE_MAP_ADDRESS_ACTIVE_GOOGLE_ADDRESS_BILLING = 'rocketweb_checkout_enhancement/google_map_address/active_google_address_billing';

    /**
     * Is active default payment
     *
     * @return boolean
     * @codeCoverageIgnore
     */
    public function isActiveDefaultPayment()
    {
        return $this->scopeConfig->isSetFlag(
            self::XML_PAYMENT_DEFAULT_ACTIVE_DEFAULT_PAYMENT,
            \Magento\Store\Model\ScopeInterface::SCOPE_STORE
        );
    }

    /**
     * Get default payment method
     *
     * @return array
     * @codeCoverageIgnore
     */
    public function getDefaultMethod()
    {
        return $this->scopeConfig->getValue(
            self::XML_PAYMENT_DEFAULT_METHOD,
            \Magento\Store\Model\ScopeInterface::SCOPE_STORE
        );
    }

    /**
     * Is active Google Maps Address Search
     *
     * @return boolean
     * @codeCoverageIgnore
     */
    public function isActiveGoogleAddress()
    {
        $flag = $this->scopeConfig->isSetFlag(
            self::XML_GOOGLE_MAP_ADDRESS_ACTIVE_GOOGLE_ADDRESS,
            \Magento\Store\Model\ScopeInterface::SCOPE_STORE
        );
        return $flag && $this->getGoogleMapApiKey();
    }

    /**
     * Is active Google Maps Address Search for billing address in Checkout
     *
     * @return boolean
     * @codeCoverageIgnore
     */
    public function isActiveBillingGoogleAddress()
    {
        $flag = $this->scopeConfig->isSetFlag(
            self::XML_GOOGLE_MAP_ADDRESS_ACTIVE_GOOGLE_ADDRESS_BILLING,
            \Magento\Store\Model\ScopeInterface::SCOPE_STORE
        );
        return $flag && $this->getGoogleMapApiKey();
    }


    /**
     * Get Google Maps API key
     *
     * @return array
     * @codeCoverageIgnore
     */
    public function getGoogleMapApiKey()
    {
        $str = $this->scopeConfig->getValue(
            self::XML_GOOGLE_MAP_API_KEY,
            \Magento\Store\Model\ScopeInterface::SCOPE_STORE
        );
        $str = trim($str);
        return $str;
    }

    /**
     * Get Google Maps API libraries
     *
     * @return array
     * @codeCoverageIgnore
     */
    public function getGoogleMapAddressLibraries()
    {
        return $this->scopeConfig->getValue(
            self::XML_GOOGLE_MAP_ADDRESS_LIBRARIES,
            \Magento\Store\Model\ScopeInterface::SCOPE_STORE
        );
    }

    /**
     * Get Google Maps API countries
     *
     * @return array
     */
    public function getGoogleMapAddressCountries()
    {
        return explode(
            ',',
            (string) $this->scopeConfig->getValue(
                self::XML_GOOGLE_MAP_ADDRESS_COUNTRY,
                \Magento\Store\Model\ScopeInterface::SCOPE_STORE
            )
        );
    }

    /**
     * Get Google Maps API languages
     *
     * @return array
     * @codeCoverageIgnore
     */
    public function getGoogleMapAddressLanguage()
    {
        return $this->scopeConfig->getValue(
            self::XML_GOOGLE_MAP_ADDRESS_LANGUAGE,
            \Magento\Store\Model\ScopeInterface::SCOPE_STORE
        );
    }

    public function getTemplate() {
        if ($this->scopeConfig->isSetFlag(
            self::XML_GOOGLE_MAP_ADDRESS_ACTIVE_GOOGLE_ADDRESS_ACCOUNT,
            \Magento\Store\Model\ScopeInterface::SCOPE_STORE)) {
            $template =  'RocketWeb_CheckoutEnhancement::customer/address/edit.phtml';
        } else {
            $template = 'Magento_Customer::address/edit.phtml';
        }

        return $template;
    }
}
