************
📄 Accounts
************

Description
===========

This command allows you to view, register, modify and deregister accounts
to the CLI. Internal and cross account roles can also be assumed.

The accounts command follows the following format:

.. code:: console

  $ aep accounts [ARGUMENTS] [OPTIONS]

.. note::
  This command can also take a flag: ``--detail`` or ``-d``. This flag will
  unmask the Secret Access Key and show it as plaintext in the console.

By executing the ``accounts`` command without any arguments, displays all the
accounts registered with the CLI to the console:

.. code:: console

  $ aep accounts
  [INFO] Config file located
  ┌───────┬──────────────┬──────────────────────┬──────────────────────────────────────────┐
  │ Index │ Account Name │ Access Key           │ Secret Access Key                        │
  ├───────┼──────────────┼──────────────────────┼──────────────────────────────────────────┤
  │ 0     │ Personal     │ AKIAIOSFODNN7EXAMPLE │ ************************************EKEY │
  └───────┴──────────────┴──────────────────────┴──────────────────────────────────────────┘

Arguments
=========

Add
---

This argument begins the registration process of an AWS account to the CLI.

Usage
*****

.. code:: console

  $ aep accounts add

At this point, you will be prompted to enter:

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

* Do you need to assume a role? [y/n]

  * Type: ``boolean``
  * Required: ``true``
  * Description: Do you need to assume a role in order to retrieve EC2 instances.
  * Example: ``y`` or ``n``

* Role ARN

  * Type: ``string``
  * Required: ``true``
  * Description: If you answered yes to the previous question, enter the role ARN
    you need to use. This role can be an internal or cross account role.
  * Example: ``arn:aws:iam::123456789012:role/Example_Role``

These credentials will then be saved and a summary of all accounts registered
with the CLI will be displayed.

Options
*******

* ``--detail | -d``
  
  When the summary of accounts are shown in the terminal after the registration
  of an account to the CLI, the Secret Access Key will not be masked and instead
  will be shown in plaintext.

Example
*******

.. code:: console

  $ aep accounts add
  [INFO] Config file located
  AWS Account Name: Personal
  AWS Access Key: AKIAIOSFODNN7EXAMPLE
  AWS Secret Access Key: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
  Do you need to assume a role? [y/n]: y
  Role ARN: arn:aws:iam::123456789012:role/Example_Role
  [INFO] Successfully saved config data
  ┌───────┬──────────────┬──────────────────────┬──────────────────────────────────────────┬─────────────────────────────────────────────┐
  │ Index │ Account Name │ Access Key           │ Secret Access Key                        │ Role ARN                                    │
  ├───────┼──────────────┼──────────────────────┼──────────────────────────────────────────┼─────────────────────────────────────────────┤
  │ 0     │ Personal     │ AKIAIOSFODNN7EXAMPLE │ ************************************EKEY │ arn:aws:iam::123456789012:role/Example_Role │
  └───────┴──────────────┴──────────────────────┴──────────────────────────────────────────┴─────────────────────────────────────────────┘

Edit
----

This argument begins the modification process of an AWS account in the CLI.

Usage
*****

.. code:: console

  $ aep accounts edit

At this point, you will be prompted to enter the index number of the account
you wish to modify. Only a valid index will be accepted.

.. note::
  Index for accounts begin at 0, not 1.

You will then be prompted to enter an updated:

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

* Do you need to assume a role? [y/n]

  * Type: ``boolean``
  * Required: ``true``
  * Description: Do you need to assume a role in order to retrieve EC2 instances.
  * Example: ``y`` or ``n``

* Role ARN

  * Type: ``string``
  * Required: ``true``
  * Description: If you answered yes to the previous question, enter the role ARN
    you need to use. This role can be an internal or cross account role.
  * Example: ``arn:aws:iam::123456789012:role/Example_Role``


.. note::
  If you press enter while editing a certain field, the value will not change.
  Instead, the existing value will be used.

Options
*******

* ``--detail | -d``
  
  When modifying an account, the Secret Access Key will be shown as
  plaintext.

  Additionally, When the summary of accounts are shown in the terminal
  after the modification of an account, the Secret Access Key will not
  be masked and instead will be shown as plaintext.

Example
*******

.. code:: console

  $ aep accounts edit
  [INFO] Config file located
  Account index to edit: invalid_index
  [ERROR] Invalid index
  Account index to edit: 0
  AWS Account Name [Personal]: Work
  AWS Access Key [AKIAIOSFODNN7EXAMPLE]:
  AWS Secret Access Key [************************************EKEY]:
  Do you need to assume a role? [y/n]: y
  Role ARN [arn:aws:iam::123456789012:role/Example_Role]:
  [INFO] Successfully saved config data
  ┌───────┬──────────────┬──────────────────────┬──────────────────────────────────────────┬─────────────────────────────────────────────┐
  │ Index │ Account Name │ Access Key           │ Secret Access Key                        │ Role ARN                                    │
  ├───────┼──────────────┼──────────────────────┼──────────────────────────────────────────┼─────────────────────────────────────────────┤
  │ 0     │ Work         │ AKIAIOSFODNN7EXAMPLE │ ************************************EKEY │ arn:aws:iam::123456789012:role/Example_Role │
  └───────┴──────────────┴──────────────────────┴──────────────────────────────────────────┴─────────────────────────────────────────────┘


Remove
------

This argument begins the deregistration process of an AWS account from the CLI.

Usage
*****

.. code:: console

  $ aep accounts remove

At this point, you will be prompted to enter the index number of the account
you wish to deregister from the CLI. Only a valid index will be accepted.

.. note::
  Index for accounts begin at 0, not 1.

Options
*******

* ``--detail | -d``
  
  When the summary of accounts are shown in the terminal after the deregistration
  of an account from the CLI, the Secret Access Key will not be masked and instead
  will be shown as plaintext.

Example
*******

.. code:: console

  $ aep accounts remove
  [INFO] Config file located
  Account index to remove: invalid_index
  [ERROR] Invalid index
  Account index to remove: 0
  [INFO] Successfully saved config data
  ┌───────┬──────────────┬────────────┬───────────────────┬──────────┐
  │ Index │ Account Name │ Access Key │ Secret Access Key │ Role ARN │
  └───────┴──────────────┴────────────┴───────────────────┴──────────┘