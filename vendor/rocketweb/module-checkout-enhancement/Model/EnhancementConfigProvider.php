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
namespace RocketWeb\CheckoutEnhancement\Model;

use Magento\Checkout\Model\ConfigProviderInterface;
use Magento\Store\Model\ScopeInterface;

/**
 * Configuration provider for CheckoutEnhancement.
 */
class EnhancementConfigProvider implements ConfigProviderInterface
{
    /**
     * @var \Magento\Framework\App\Config\ScopeConfigInterface
     */
    protected $scopeConfiguration;

    /**
     * @var \RocketWeb\CheckoutEnhancement\Helper\Data
     */
    protected $enhancementHelper;

    /**
     * @param \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfiguration
     * @param \RocketWeb\CheckoutEnhancement\Helper\Data $enhancementHelper
     * @codeCoverageIgnore
     */
    public function __construct(
        \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfiguration,
        \RocketWeb\CheckoutEnhancement\Helper\Data $enhancementHelper
    ) {
        $this->scopeConfiguration = $scopeConfiguration;
        $this->enhancementHelper = $enhancementHelper;
    }

    /**
     * {@inheritdoc}
     */
    public function getConfig()
    {
        $config = [];
        $config['rwCheckoutEnhancement'] = $this->getDefaultPaymentConfig();
        $config['rwCheckoutEnhancement'] = array_merge(
            $this->getGoogleAddressConfig(),
            $config['rwCheckoutEnhancement']
        );
        return $config;
    }

    /**
     * Returns default payment config
     *
     * @return array
     */
    public function getDefaultPaymentConfig()
    {
        $configuration = [];

        $isActive = $this->enhancementHelper->isActiveDefaultPayment();
        $configuration['isActiveDefaultPayment'] = $isActive;
        if ($isActive) {
            $configuration['defaultMethod'] = $this->enhancementHelper->getDefaultMethod();
        }

        return $configuration;
    }

    /**
     * Returns Google Maps Search Address config
     *
     * @return array
     */
    public function getGoogleAddressConfig()
    {
        $configuration = [];

        $isActive = $this->enhancementHelper->isActiveGoogleAddress();
        $configuration['isActiveGoogleAddress'] = $isActive;
        if ($isActive) {
            $configuration['googleAddressCountry'] = $this->enhancementHelper->getGoogleMapAddressCountries();
        }

        return $configuration;
    }
}
