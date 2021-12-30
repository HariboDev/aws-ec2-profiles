*************
⚙️ Configure
*************

Description
===========

The configure command can be ran by executing the following:

.. code:: console

  $ aep configure

This command is automatically ran after installing the package using
NPM.

.. note::
  It is recommended that this command be manually re-ran if any of
  the data files become corrupt or the package functionality does not
  run as expected.

During the execution of this command, config and data directories are
created. You will then be prompted to specify the default private key
directory.

This directory will be used by the CLI when attempting to connect to
and EC2 instance, however this functionality can be overriden (see
the :doc:`🔌 Connect <connect>` documentation).

The default directory will be your ``~/.ssh`` directory.

Behind the scenes, the CLI will also attempt to get your current
public IP address for when you execute the :doc:`🔌 Connect
<connect>` and :doc:`🏷️ List <list>` commands.

These pieces of data and configuration data will be saved in the
following locations:

* Data:

  * Unix: ``~/.data/aws-ec2-profiles/data.json``
  * Windows: ``%LOCALAPPDATA%/aws-ec2-profiles/data.json``

* Configuration data:

  * Unix: ``~/.config/aws-ec2-profiles/config.json``
  * Windows: ``~/.config/aws-ec2-profiles/config.json``

Arguments
=========

This command does not take any arguments.