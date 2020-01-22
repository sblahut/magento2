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

namespace RocketWeb\CheckoutEnhancement\Plugin\Block\Checkout;

/**
 * Class LayoutProcessor
 */
class LayoutProcessor
{
    /**
     * @var \RocketWeb\CheckoutEnhancement\Helper\Data
     */
    protected $enhancementHelper;

    /**
     * @param \RocketWeb\CheckoutEnhancement\Helper\Data $enhancementHelper
     */
    public function __construct(
        \RocketWeb\CheckoutEnhancement\Helper\Data $enhancementHelper
    ) {
        $this->enhancementHelper = $enhancementHelper;
    }

    /**
     * Revert changes on component shipping-address-fieldset
     *
     * @param \Magento\Checkout\Block\Checkout\LayoutProcessor $subject
     * @param array $jsLayout
     * @return array
     * @SuppressWarnings("PMD.UnusedFormalParameter")
     */
    public function beforeProcess(
        \Magento\Checkout\Block\Checkout\LayoutProcessor $subject,
        $jsLayout
    ) {
        if (!$this->enhancementHelper->isActiveGoogleAddress()) {
            if (isset($jsLayout['components']['checkout']['children']['steps']['children']['shipping-step']
                ['children']['shippingAddress']['children']['shipping-address-fieldset']
            )) {
                // Revert changes
                $jsLayout['components']['checkout']['children']['steps']['children']['shipping-step']
                ['children']['shippingAddress']['children']['shipping-address-fieldset']['component'] = 'uiComponent';
                unset($jsLayout['components']['checkout']['children']['steps']['children']['shipping-step']
                    ['children']['shippingAddress']['children']['shipping-address-fieldset']['config']['template']);
            }
        }
        return [$jsLayout];
    }

    public function afterProcess(
        \Magento\Checkout\Block\Checkout\LayoutProcessor $subject,
        $jsLayout
    ) {
        if ($this->enhancementHelper->isActiveGoogleAddress() && $this->enhancementHelper->isActiveBillingGoogleAddress()) {
            if (isset($jsLayout['components']['checkout']['children']['steps']['children']['billing-step']['children']
                ['payment']['children']['payments-list']['children']
            )) {
                foreach ($jsLayout['components']['checkout']['children']['steps']['children']['billing-step']['children']
                         ['payment']['children']['payments-list']['children'] as $key => $payment) {
                    if (isset($payment['children']['form-fields']['component'])) {
                        $jsLayout['components']['checkout']['children']['steps']['children']['billing-step']['children']
                        ['payment']['children']['payments-list']['children'][$key]['children']['form-fields']['component'] = 'RocketWeb_CheckoutEnhancement/js/view/billing/billing-address-fieldset';
                    }
                }
            }
        }
        return $jsLayout;
    }
}
