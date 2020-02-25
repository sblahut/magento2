/**
 * RocketWeb
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/osl-3.0.php
 *
 * @category  RocketWeb
 * @package   RocketWeb_CrossOrigin
 * @copyright Copyright (c) 2016-2017 RocketWeb (http://rocketweb.com)
 * @license   http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
 * @author    Rocket Web Inc.
 */
define([
    'jquery',
    'uiCollection',
    'Magento_Checkout/js/checkout-data',
    'uiRegistry'
], function ($, Component, checkoutData, registry) {
    'use strict';

    return Component.extend({
        defaults: {
            template: 'RocketWeb_CheckoutEnhancement/billing-address/google-search',
            // placeSearch: null,
            // autocomplete: null,
            componentForm: {
                street_number: {type:'long_name'},
                route: {type:'long_name', field: 'billingAddress\\.street\\.0'},
                locality: {type:'long_name', field: 'billingAddress\\.city'},
                administrative_area_level_1: {type:'long_name', field:'billingAddress\\.region'},
                country: {type:'long_name', field:'billingAddress\\.country_id'},
                postal_code: {type: 'short_name', field:'billingAddress\\.postcode'}
            }
        },
        additionalIndex:  0,
        autocomplete: 0,
        addressFormSelector: null,

        /**
         * @return {exports}
         */
        initialize: function () {
            this._super();
            // this.addressForm  = $(this.addressFormSelector);
            return this;
        },

        afterRender: function () {
            var self = this,
                str;
            for (var component in self.componentForm) {
                if(typeof self.componentForm[component].field !== "undefined") {
                    var str = self.componentForm[component].field.replace('billingAddress', self.containers[0].dataScopePrefix);
                    self.componentForm[component].field = str;
                }
            }
        },

        afterRenderSearchInput: function() {
            var self = this;
            // set googlesearch input
            self.googleSearchInputSelector = self.containers[0].dataScopePrefix+'-autocomplete-billing';

            var restrictCountry = [];
            if (window.checkoutConfig.rwCheckoutEnhancement &&
                window.checkoutConfig.rwCheckoutEnhancement.googleAddressCountry
            ) {
                restrictCountry = window.checkoutConfig.rwCheckoutEnhancement.googleAddressCountry;
            }

            // Create the autocomplete object, restricting the search to geographical
            // location types.
            this.autocomplete = new google.maps.places.Autocomplete(
                /** @type {!HTMLInputElement} */ (document.getElementById(self.googleSearchInputSelector)),
                {types: ['geocode'], componentRestrictions: {country: restrictCountry}});
            //
            // When the user selects an address from the dropdown, populate the address
            // fields in the form.
            this.autocomplete.addListener('place_changed', this.fillInAddress.bind(this));

            // need to stop prop of the touchend event
            $('.pac-container').on('touchend', function(e) {
                e.stopImmediatePropagation();
            });
        },
        afterRenderSearchForm: function() {
            var self=this;
            // set addressForm
            this.addressFormSelector = '#'+this.containers[0].dataScopePrefix+'-complete-form';
            this.addressForm = $(this.addressFormSelector);
            registry.async('checkoutProvider')(function (checkoutProvider) {
                var shippingAddressData = checkoutData.getBillingAddressFromData();
                shippingAddressData=_.map(shippingAddressData, function(num, key){
                    if(key!=='country_id') {
                        if (key == 'street') {
                            if(_.size(num)){
                                return num[0].length;
                            } else {
                                return false;
                            }
                        } else {
                            if(key == 'region_id' || key ==  'postcode' || key == 'telephone') {
                                if(typeof num !== "undefined") {
                                    return num.length;
                                } else {
                                    return false;
                                }
                            } else {
                                return false;
                            }
                        }
                    } else {
                        return false;
                    }
                });
                if (_.some(shippingAddressData))
                {
                    //show form
                    $(self.addressFormSelector).addClass('complete').show();
                }
            });
        },

        getNamesArea: function() {
            this.additionalIndex = this.getAdditionalIndex();
            return this.elems.slice(0,this.additionalIndex);
        },

        getAddressArea: function() {
            var length = this.elems().length;
            return this.elems.slice(this.additionalIndex,length);
        },

        getAdditionalIndex: function () {
            var array = this.elems();
            for (var i = 0, j = array.length; i < j; i++) {
                if (array[i].dataScope.match(/street|company|city/) !== null) {
                    return i;
                }
            }
            return -1;
        },

        fillInAddress: function () {
            var self = this;
            // Get the place details from the autocomplete object.
            var place = this.autocomplete.getPlace();
            for (var component in self.componentForm) {
                var el = $("div[name*='" + self.componentForm[component].field + "']").find('input,select');
                if(component == 'country'){
                    var option_select = $(el).find("option[data-title='']");
                    $(option_select).attr('selected', 'selected');
                }else {
                    $(el).val('').change();
                }
                $(el).prop("disabled", false);
                $(self.addressFormSelector).removeClass('complete');
            }

            // Get each component of the address from the place details
            // and fill the corresponding field on the form.
            var region = '', street_address = '', postcode = '';
            if (typeof place.address_components !== "undefined") {
                //we should change country_id first
                //then merge street_number and route
                for (var i = 0; i < place.address_components.length; i++) {
                    var addressType = place.address_components[i].types[0];
                    if (typeof self.componentForm[addressType] !== "undefined" && typeof  self.componentForm[addressType].type !== "undefined") {
                        var val = place.address_components[i][self.componentForm[addressType].type],
                            el;
                        if (addressType == 'street_number' || addressType == 'route') {
                            if (street_address.length == 0) {
                                street_address = val;
                            } else {
                                street_address = street_address + ' ' + val;
                            }
                        } else if (addressType == 'administrative_area_level_1') {
                            // we should save it and set after regionUpdater run
                            region = val;
                        } else if (addressType == 'country') {
                            //select
                            el = $("div[name*='" + self.componentForm[addressType].field + "'] select")[0];
                            var option_select = $(el).find("option:contains(" + val + ")");
                            $(option_select).attr('selected', 'selected');
                            $(el).val($(option_select).val()).change();
                        } else if (addressType == 'postal_code') {
                            postcode = val;
                        } else {
                            // input
                            el = $("div[name*='" + self.componentForm[addressType].field + "'] input");
                            $(el).val(val).change();
                        }
                    }
                }

                //fill region
                el = $('[name="' + self.componentForm["administrative_area_level_1"].field + '"]');
                if ($(el).is(":hidden")) {
                    //select
                    var el_select = $('[name="' + self.componentForm["administrative_area_level_1"].field + '_id"] select')[0],
                        option_select = $(el_select).find("option:contains(" + region + ")");
                    $(option_select).attr('selected', 'selected');
                    if ($(option_select).val() == undefined) {
                        el = $(el).find('input')[0];
                        $(el).val(region).change();
                    } else {
                        $(el_select).val($(option_select).val()).change();
                    }
                } else {
                    //input
                    el = $(el).find('input')[0];
                    $(el).val(region).change();
                }

                //fill street
                el = $('[name="' + self.componentForm["route"].field + '"] input')[0];
                $(el).val(street_address).change();

                //fill postcode
                el = $('[name="' + self.componentForm["postal_code"].field + '"] input')[0];
                $(el).val(postcode).change();

                //show form
                $(self.addressFormSelector).addClass('complete').show();
            }
        }
    });
});
