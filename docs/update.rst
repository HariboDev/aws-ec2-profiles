**********
✏️ Update
**********

Description
===========

This command checks if your public IP has changed and updates
the relevant AWS security group ingress rules that explicitly
contained your old IP address.

The update command follows the following format:

.. code:: console

  $ aep update [OPTIONS]

Options
=======

* ``--force | -f``

  * Type: ``string string``
  * Description: Force change of a rule from one IP to another.
    This doesn't have to be your IP.
  * Default: ``null``
  * Example: ``$ aep update --force 123.456.789.123 987.654.321.987``

* ``--region | -r``

  * Type: ``string[]``
  * Description: Only update security groups in a specific region(s)
  * Default: ``all``
  * Options:
    * ``us-east-1``
    * ``us-east-2``
    * ``us-west-1``
    * ``us-west-2``
    * ``ap-south-1``
    * ``ap-northeast-1``
    * ``ap-northeast-2``
    * ``ap-southeast-1``
    * ``ap-southeast-2``
    * ``ca-central-1``
    * ``eu-central-1``
    * ``eu-west-1``
    * ``eu-west-2``
    * ``eu-west-3``
    * ``eu-north-1``
    * ``sa-east-1``
  * Example: ``$ aep update --region eu-west-1 eu-west-2``

Examples
========

* This example shows the CLI tool being used to update all security
  group rules in all regions.

  .. code:: console

    $ aep update
    [INFO] IP change detected
    [INFO] Old IP: 123.456.789
    [INFO] Current IP: 987.654.321
    [INFO] Checking account: Personal
    [INFO] Checking region: us-east-1
    [INFO] Successfully added new security group ingress rule
    [INFO] Successfully deleted old security group ingress rule
    [INFO] Checking region: us-east-2
    [INFO] No relevant ingress rules to change
    [INFO] Checking region: us-west-1
    [INFO] No relevant ingress rules to change
    [INFO] Checking region: us-west-2
    [INFO] No relevant ingress rules to change
    [INFO] Checking region: ap-south-1
    [INFO] No relevant ingress rules to change
    [INFO] Checking region: ap-northeast-1
    [INFO] No relevant ingress rules to change
    [INFO] Checking region: ap-northeast-2
    [INFO] No relevant ingress rules to change
    [INFO] Checking region: ap-southeast-1
    [INFO] No relevant ingress rules to change
    [INFO] Checking region: ap-southeast-2
    [INFO] No relevant ingress rules to change
    [INFO] Checking region: ca-central-1
    [INFO] No relevant ingress rules to change
    [INFO] Checking region: eu-central-1
    [INFO] No relevant ingress rules to change
    [INFO] Checking region: eu-west-1
    [INFO] Successfully added new security group ingress rule
    [INFO] Successfully deleted old security group ingress rule
    [INFO] Checking region: eu-west-2
    [INFO] No relevant ingress rules to change
    [INFO] Checking region: eu-west-3
    [INFO] No relevant ingress rules to change
    [INFO] Checking region: eu-north-1
    [INFO] Successfully added new security group ingress rule
    [INFO] Successfully deleted old security group ingress rule
    [INFO] Checking region: sa-east-1
    [INFO] No relevant ingress rules to change

* This example shows the CLI tool being used to update all security
  group rules in the regions: ``eu-west-1`` and ``eu-west-2``.

  .. code:: console

    $ aep update --region eu-west-1 eu-west-2
    [INFO] IP change detected
    [INFO] Old IP: 123.456.789
    [INFO] Current IP: 987.654.321
    [INFO] Checking account: Personal
    [INFO] Checking region: eu-west-1
    [INFO] Successfully added new security group ingress rule
    [INFO] Successfully deleted old security group ingress rule
    [INFO] Checking region: eu-west-1
    [INFO] No relevant ingress rules to change

* The following example shows the CLI tool being used to force
  update a security group rule from: ``123.456.789`` to:
  ``987.654.321`` in the region: ``eu-west-1``.

  .. code:: console

    $ aep update -f 123.456.789 987.654.321
    [INFO] Force changing IP
    [INFO] From: 123.456.789
    [INFO] To: 987.654.321
    [INFO] Checking account: Personal
    [INFO] Checking region: eu-west-1
    [INFO] Successfully added new security group ingress rule
    [INFO] Successfully deleted old security group ingress rule