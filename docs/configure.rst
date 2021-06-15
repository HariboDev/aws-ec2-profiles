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

:Note:
  It is recommended that this command be manually re-ran if any of
  the data files become corrupt or the package functionality does not
  run as expected.

During the execution of this command, config and data directories are
created. You will then be prompted to:

* Specify the default private key directory

  This directory will be used by the CLI when attempting to connect to
  and EC2 instance, however this functionality can be overriden (see
  the :doc:`🔌 Connect <connect>` documentation).

  The default directory will be your Downloads directory.

* Add an account to the CLI

  You will be prompted to enter:

  * An AWS Account Name:

    * Type: ``string``
    * Required: ``true``
    * Description: Customisable user friendly name. Does not have to represent
      the actual account name.
    * Example: ``Personal Account``

  * AWS Access Key

    * Type: ``string``
    * Required: ``true``
    * Description: Access Key of a user within the AWS account provided by AWS.
    * Example: ``AKIAIOSFODNN7EXAMPLE``

  * AWS Secret Access Key

    * Type: ``string``
    * Required: ``true``
    * Description: Secret Access Key of a user within the AWS account provided
      by AWS.
    * Example: ``wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY``

  You will then be asked if you want to add another account. The only
  valid inputs for this prompt are and are not case sensitive:

  * ``yes`` or ``y``
  * ``no`` or ``n``

Behind the scenes, the CLI will also attempt to get your current
public IP address for future reference in the :doc:`🔌 Connect
<connect>` and :doc:`🏷️ List <list>` commands. An SSH script will
also be created for when you use the :doc:`🔌 Connect <connect>`
command.

These pieces of data and configuration data will be saved in the
following locations:

* Data:

  * Unix: ``~/.data/aws-ec2-profiles/data.json``
  * Windows: ``%LOCALAPPDATA%/aws-ec2-profiles/data.json``

* Configuration data:

  * Unix: ``~/.cache/aws-ec2-profiles/config.json``
  * Windows: ``~/.cache/aws-ec2-profiles/config.json``

Arguments
=========

This command does not take any arguments.