***********
🔌 Connect
***********

Description
===========

This command allows you to connect to an AWS or self managed instance
using either the instance index, name or address. This command also has
the ability to override the username, private key, private key directory
and password that will be used in the SSH connection handshake.

.. note::
  Index for accounts begin at 0, not 1.

The connect command follows the following format:

.. code:: console

  $ aep connect [OPTIONS]

.. note::
  It is recommended that you run the :doc:`🏷️ List <list>` command to
  ensure you are passing in the correct instance details when attempting
  to connect to the EC2 instance.

Options
=======

* ``--address | -a``

  * Type: ``string``
  * Description: The address of the EC2 instance you to connect to.
  * Example: ``123.456.789.123``

* ``--directory | -d``

  * Type: ``string``
  * Description: Override the directory which is searched for the private key file.
  * Example: ``~/my_ssh_keys``

* ``--index | -i``

  * Type: ``integer``
  * Description: The instance index you want to connect to.
  * Example: ``0``

* ``--key | -k``
  
  * Type: ``string``
  * Description: Override the private key file name that will be used to SSH.
  * Example: ``my_key_file.pem``

* ``--name | -n``

  * Type: ``string``
  * Description: The instance name you want to connect to.
  * Example: ``my_server``

* ``--password | -p``

  * Type: ``boolean``
  * Description: Prompt for password instead of private key. Takes precedence over private key.

* ``--username | -u``

  * Type: ``string``
  * Description: Override the username used in the SSH connection.
  * Example: ``test_user``

Examples
========

* The example below shows the CLI tool being used to connect to an EC2
  instance with the IP address: ``123.456.789.123``. In this example,
  the CLI tool attempts to find the private key file and uses the username
  described in the EC2 instance metadata to connect to the instance.

  .. code:: console

    $ aep connect --address 123.456.789.123

    [INFO] Connecting to "SERVER_NAME" as "EXAMPLE_USER" at "123.456.789.123:22"
    [INFO] If these details are incorrect, execute to update instance details and try again
    [INFO] Attempting to connect...

* This example shows the CLI tool being used to connect to an EC2 instance
  with the name: ``example_server``. It also overrides the username and
  password that will be used to connect to the instance.

  .. code:: console

    $ aep connect --name example_server --username example_user --password
    Enter password for pi@123.456.789.123:22: MyPassword

    [INFO] Connecting to "example_server" as "example_user" at "123.456.789.123:22"
    [INFO] If these details are incorrect, execute "aep list" to update instance details and try again
    [INFO] Attempting to connect...

* The example below shows the CLI tool being used to connect to an EC2
  instance with the index: ``0``. It also overrides the username,
  private key and private key directory. By doing this, the CLI tool
  will attempt to find the new private key file in the specified
  directory and use it along with the new username to connect to
  the instance.

  .. code:: console

    $ aep connect -i 0 -u example_user -d ~/ssh_keys -k my_key_file.pem

    [INFO] Connecting to "SERVER_NAME" as "example_user" at "123.456.789.123:22"
    [INFO] If these details are incorrect, execute to update instance details and try again
    [INFO] Attempting to connect...