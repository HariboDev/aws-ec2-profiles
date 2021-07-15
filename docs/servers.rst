**********
🖧 Servers
**********

Description
===========

This command allows you to add, remove and edit self managed servers
from the CLI.

The servers command follows the following format:

.. code:: console

  $ aep servers [ARGUMENTS]

To see a list of all the self managed servers registered with the CLI
tool, execute ``aep list --managed self``:

.. code:: console

  $ aep list --managed self
  [INFO] Config file located
  [INFO] Data file located
  [INFO] Instances gathered
  ┌───────┬────────────────┬─────────────────┬─────────────────┬──────────────┬─────────┬────────────┬──────────┬─────────┬────────────┐
  │ Index │ Name           │ Address         │ Key Pair        │ Username     │ State   │ Accessible │ Location │ Account │ Managed By │
  ├───────┼────────────────┼─────────────────┼─────────────────┼──────────────┼─────────┼────────────┼──────────┼─────────┼────────────┤
  │ 1     │ example_server │ 123.456.789.123 │ example_key.pem │ example_user │ unknown │ true       │ N/A      │ N/A     │ Self       │
  └───────┴────────────────┴─────────────────┴─────────────────┴──────────────┴─────────┴────────────┴──────────┴─────────┴────────────┘

Arguments
=========

Add
---

This argument begins the registration process of a self managed
server to the CLI.

Usage
*****

.. code:: console

  $ aep servers add

At this point, you will be prompted to enter:

* Server Name:

  * Type: ``string``
  * Required: ``false``
  * Description: Customisable user friendly name.
  * Default: ``null``
  * Example: ``Dev Server``

* Server Address

  * Type: ``string``
  * Required: ``true``
  * Description: IP or hostname of the server.
  * Example: ``123.456.789.123`` or ``dev.example.com``

* Key Pair Name

  * Type: ``string``
  * Required: ``false``
  * Description: Private key name. If ``N/A`` will be ignored and password
    will be forced upon SSH.
  * Default: ``N/A``
  * Example: ``example_key.pem``

* Username

  * Type: ``string``
  * Required: ``true``
  * Description: Username of user to use upon SSH.
  * Example: ``example_user``

* Location

  * Type: ``string``
  * Required: ``false``
  * Description: Location of the server. If ``N/A`` will be ignored.
  * Default: ``N/A``
  * Example: ``London Datacenter``

.. note::
  After submitting your server details, the CLI will then check if the
  server is accessible on port ``22`` automatically.

These server details will then be saved and a summary of all instances registered
with the CLI can be displayed using the :doc:`🏷️ List <list>` command.

Example
*******

.. code:: console

  $ aep server add
  Server Name: Dev Server
  Server Address: 123.456.789.123
  Key Pair Name [N/A]: example_key.pem
  Username: example_user
  Server Location [N/A]: London Datacenter
  [INFO] Successfully saved instances

Edit
----

This argument begins the modification process of a self managed server in the CLI.

Usage
*****

.. code:: console

  $ aep servers edit

At this point, you will be prompted to enter the IP of the server you wish to modify.

You will then be prompted to enter an updated:

* Server Name:

  * Type: ``string``
  * Required: ``false``
  * Description: Customisable user friendly name.
  * Default: ``null``
  * Example: ``Dev Server``

* Server Address

  * Type: ``string``
  * Required: ``true``
  * Description: IP or hostname of the server.
  * Example: ``123.456.789.123`` or ``dev.example.com``

* Key Pair Name

  * Type: ``string``
  * Required: ``false``
  * Description: Private key name. If ``N/A`` will be ignored and password
    will be forced upon SSH.
  * Default: ``N/A``
  * Example: ``example_key.pem``

* Username

  * Type: ``string``
  * Required: ``true``
  * Description: Username of user to use upon SSH.
  * Example: ``example_user``

* Location

  * Type: ``string``
  * Required: ``false``
  * Description: Location of the server. If ``N/A`` will be ignored.
  * Default: ``N/A``
  * Example: ``London Datacenter``

.. note::
  If you press enter while editing a certain field, the value will not change.
  Instead, the existing value will be used.

.. note::
  After submitting your changed server details, the CLI will then check if the
  server is accessible on port ``22`` automatically.

These server details will then be saved and a summary of all instances registered
with the CLI can be displayed using the :doc:`🏷️ List <list>` command.

Example
*******

.. code:: console

  $ aep servers edit
  Server address to edit: 123.456.789.123
  Server Name [Dev Server]: Prod Server
  Server Address [123.456.789.123]: 
  Key Pair Name [example_key.pem]: 
  Username [example_user]: 
  Server Location [London Datacenter]: 
  [INFO] Successfully saved instances file

Remove
------

This argument begins the deregistration process of a self managed server
from the CLI.

Usage
*****

.. code:: console

  $ aep servers remove

At this point, you will be prompted to enter the IP of the server you wish to
deregister from the CLI.

Example
*******

.. code:: console

  $ aep servers remove
  Server address to remove: 123.456.789.123
  [INFO] Successfully saved instances file