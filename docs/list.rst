********
🏷️ List
********

Description
===========

This command gathers all EC2 instances from all regions (customisable)
and from all accounts registered with the CLI tool (customisable). Self
managed instances will also appear. AWS and self managed instances will
be checked for SSH connectivity to determine if they are accessible.
This and other information is summarised and displayed in a table
within the console.

The list command follows the following format:

.. code:: console

  $ aep list [OPTIONS]

Options
=======

* ``--account | -a``

  * Type: ``string[]``
  * Description: Only get instances from a specific account(s)
  * Default: ``all``
  * Example: ``$ aep list --account Personal Work Sandbox``

* ``--region | -r``

  * Type: ``string[]``
  * Description: Only list instances in a specific region(s)
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
  * Example: ``$ aep list --region eu-west-1 eu-west-2``

* ``--managed`` | ``-m``

  * Type: ``string[]``
  * Description: Only list instances under a specific management(s)
  * Default: ``all``
  * Options:
    * ``aws``
    * ``self``
  * Example: ``$ aep list --managed aws``

* ``--state | -s``

  * Type: ``string[]``
  * Description: Only list instances in a specific state(s)
  * Default: ``all``
  * Options:
    * ``pending``
    * ``running``
    * ``stopping``
    * ``stopped``
    * ``shutting-down``
    * ``terminated``
  * Example: ``$ aep list --state pending running``

.. note::
  When gathering AWS and self managed instances, the CLI will then check if the
  servers are accessible on port ``22`` automatically. This will then be displayed
  in the outputted table.


Examples
========

* This example shows the CLI tool being used to list all EC2 instances
  across all acounts but only in the regions: ``eu-west-1`` and
  ``eu-north-1``.

  .. code:: console

    $ aep list --account Personal
    [INFO] Config file located
    [INFO] Checking account: Personal
    [INFO] Checking region: eu-west-1
    [INFO] Checking region: eu-north-1
    [INFO] Checking account: Work
    [INFO] Checking region: eu-west-1
    [INFO] Checking region: eu-north-1
    ┌───────┬─────────────────┬─────────────────┬──────────────────┬───────────────┬─────────┬────────────┬────────────┬──────────┬────────────┐
    │ Index │ Name            │ Address         │ Key Pair         │ Username      │ State   │ Accessible │ Region     │ Account  │ Managed By │
    ├───────┼─────────────────┼─────────────────┼──────────────────┼───────────────┼─────────┼────────────┼────────────┼──────────┼────────────┤
    │ 0     │ example_server  │ 123.456.789.123 │ example_key.pem  │ example_user  │ running │ true       │ eu-west-1  │ Personal │ AWS        │
    ├───────┼─────────────────┼─────────────────┼──────────────────┼───────────────┼─────────┼────────────┼────────────┤──────────┼────────────┤
    │ 1     │ example_server2 │ 987.654.321.987 │ example_key2.pem │ example_user2 │ stopped │ false      │ eu-west-1  │ Personal │ AWS        │
    ├───────┼─────────────────┼─────────────────┼──────────────────┼───────────────┼─────────┼────────────┼────────────┤──────────┼────────────┤
    │ 2     │ example_server3 │ 456.789.123.456 │ example_key3.pem │ example_user3 │ unknown │ true       │ N/A        │ N/A      │ Self       │
    └───────┴─────────────────┴─────────────────┴──────────────────┴───────────────┴─────────┴────────────┴────────────┴──────────┴────────────┘


* The example below shows the CLI tool being used to list all EC2
  instances in the account: ``Personal`` with the ``--managed`` flag
  set to ``aws`` to ignore any self managed instances.

  .. code:: console

    $ aep list --account Personal
    [INFO] Config file located
    [INFO] Checking account: Personal
    [INFO] Checking region: us-east-1
    [INFO] Checking region: us-east-2
    [INFO] Checking region: us-west-1
    [INFO] Checking region: us-west-2
    [INFO] Checking region: ap-south-1
    [INFO] Checking region: ap-northeast-1
    [INFO] Checking region: ap-northeast-2
    [INFO] Checking region: ap-southeast-1
    [INFO] Checking region: ap-southeast-2
    [INFO] Checking region: ca-central-1
    [INFO] Checking region: eu-central-1
    [INFO] Checking region: eu-west-1
    [INFO] Checking region: eu-west-2
    [INFO] Checking region: eu-west-3
    [INFO] Checking region: eu-north-1
    [INFO] Checking region: sa-east-1
    ┌───────┬─────────────────┬─────────────────┬──────────────────┬───────────────┬─────────┬────────────┬────────────┬──────────┬────────────┐
    │ Index │ Name            │ Address         │ Key Pair         │ Username      │ State   │ Accessible │ Region     │ Account  │ Managed By │
    ├───────┼─────────────────┼─────────────────┼──────────────────┼───────────────┼─────────┼────────────┼────────────┼──────────┼────────────┤
    │ 0     │ example_server  │ 123.456.789.123 │ example_key.pem  │ example_user  │ running │ true       │ eu-west-1  │ Personal │ AWS        │
    ├───────┼─────────────────┼─────────────────┼──────────────────┼───────────────┼─────────┼────────────┼────────────┤──────────┼────────────┤
    │ 1     │ example_server2 │ 987.654.321.987 │ example_key2.pem │ example_user2 │ stopped │ false      │ eu-north-1 │ Personal │ AWS        │
    └───────┴─────────────────┴─────────────────┴──────────────────┴───────────────┴─────────┴────────────┴────────────┴──────────┴────────────┘

* This example shows the CLI tool being used to list all EC2
  instances in the region: ``eu-west-1`` and only in the states:
  ``pending`` or ``running``.

  .. code:: console

    $ aep list -r eu-west-1 -s pending running
    [INFO] Config file located
    [INFO] Checking account: Personal
    [INFO] Checking region: eu-west-1
    ┌───────┬─────────────────┬─────────────────┬──────────────────┬───────────────┬─────────┬────────────┬────────────┬──────────┐
    │ Index │ Name            │ Address         │ Key Pair         │ Username      │ State   │ Accessible │ Region     │ Account  │
    ├───────┼─────────────────┼─────────────────┼──────────────────┼───────────────┼─────────┼────────────┼────────────┼──────────┤
    │ 0     │ example_server  │ 123.456.789.123 │ example_key.pem  │ example_user  │ running │ true       │ eu-west-1  │ Personal │
    └───────┴─────────────────┴─────────────────┴──────────────────┴───────────────┴─────────┴────────────┴────────────┴──────────┘
