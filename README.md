# Brooklyn Brewery


<b>Synopsis</b>

This is a migration project to move https://brooklynbrewery.com/ from Magento 1 to Magento 2 done by Command C.


<b>Installation</b>

Magento 2 installation instructions can be found here: https://devdocs.magento.com/guides/v2.3/install-gde/bk-install-guide.html

<b>Registration</b>

All modules have a registration.php in their root directory under app > code with contents similar to the following:

```php
<?php
/**
 * Copyright © 2016 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */

\Magento\Framework\Component\ComponentRegistrar::register(
    \Magento\Framework\Component\ComponentRegistrar::MODULE,
    'CommandC_Module',
    __DIR__
);
```
They must also include a xml file within app > code > <module name> -> etc <module name>.xml. Here is a sample template that will adjust accordinly to the type of module or change:

```
<?xml version="1.0"?>
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:Module/etc/module.xsd">
    <module name="CommandC_Module" setup_version="1.2.0">
    </module>
</config>
```

<b>Contributors</b>

Command C

<b>License</b>
