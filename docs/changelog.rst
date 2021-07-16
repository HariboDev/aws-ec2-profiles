*********
Changelog
*********

.. role:: latest
.. role:: deprecated

This page records all notable changes to AWS EC2 Profiles (AEP). The format
is based on `Keep a Changelog`_ and this project adheres to `Semantec Versioning`_.

.. _Keep a Changelog: https://keepachangelog.com/en/1.0.0/
.. _Semantec Versioning: https://semver.org/

v3.1.0 - 2021-07-16 [:latest:`LATEST`]
==============================================

Added
-----

- Ability to use internal and cross account roles in order to communicate with AWS
- Added role column in table from the accounts command


Changed
-------

- Updated CLI description


v3.0.0 - 2021-07-15
==============================================

Added
-----

- Add, remove and edit self managed servers with *Is port 22 open?* check
- Added *Is port 22 open?* check every time the list command is run
- SSH capability to self managed servers
- Added ``Managed By`` column onto list table with values of ``AWS`` or ``Self``
- Added ``managed`` or ``-m`` flags to list command to filter for ``aws`` or ``self`` managed instances


Changed
-------

- Updated CLI description
- Updated error messages when an SSH connection fails
- Updated info messages on the list command
- Updated welcome message for ``postinstall`` hook


Removed
-------

- Detail flag from list command, will now list all attributes regardless


Fixed
-----

- Account filtering with ``--account`` or ``-a`` flag on the list command not working


v2.0.0 - 2021-07-10
==============================================

Added
-----

- Ability to SSH using a password with ``--password`` or ``-p`` flag
- Password precedence over private key
- Private key ``.ppk`` compatibility
- Built-in ability to SSH with NodeJS
- ``~`` conversion to absolute path
- Error message with remedy if no accounts are registered when list command was executed
- Error message if invalid username or password was provided when connect command was executed
- Error message if invalid private key was provided when connect command was provided
- Error message if time out while waiting for handshake when connect command was executed


Changed
-------

- Set the default directory for SSH keys to be ``~/.ssh``
- Private key files do not need to have a ``.pem`` or ``.ppk`` extension as automatic searches are done
- Improved error remedy suggestions


Removed
-------

- Python SSH script creation during the configure command


Fixed
-----

- Accounts and credentials being deleted on package update or when configure command was executed
- Account name, access key and secret access key not being required when adding an account


Security
--------

- Removed unused library and script imports


v1.3.7 - 2021-06-15 [:deprecated:`DEPRECATED`]
==============================================

Changed
-------

- Updated website to `https://aep.haribodev.uk`_

.. _https://aep.haribodev.uk: https://aep.haribodev.uk


v1.3.6 - 2021-06-15 [:deprecated:`DEPRECATED`]
==============================================

Added
-----

- Added docs
- Added bug report issue template
- Added feature request issue template
- Added improve documentation issue template
- Added pull request template


Fixed
-----

- Corrected help message for the ``--region`` or ``-r`` flag on the list command


v1.3.5 - 2021-04-10 [:deprecated:`DEPRECATED`]
==============================================

Added
-----

- Override key file flag with ``--key`` or ``-k`` on the connect command


Changed
-------

- Updated configure command description
- Updated website to `https://www.haribo.dev`_

.. _https://www.haribo.dev: https://www.haribo.dev


Removed
-------

- Hardcoded private key extension of ``.pem`` to allow for more key types


Fixed
-----

- Removed duplicate sections from NPM README.md
- Corrected help message for ``--detail`` or ``-d`` flag on the accounts command


v1.3.1 - 2021-02-09 [:deprecated:`DEPRECATED`]
==============================================

Removed
-------

- Unnecessary console logs from the update command


Fixed
-----

- Update command not terminating if invalid arguments supplied when using the ``--force`` or ``-f`` flag


v1.3.0 - 2021-02-09 [:deprecated:`DEPRECATED`]
==============================================

Added
-----

- Force flag and functionality to the update command


v1.2.1 - 2020-12-18 [:deprecated:`DEPRECATED`]
==============================================

Changed
-------

- Changed CHANGELOG.md format


v1.2.0 - 2020-12-18 [:deprecated:`DEPRECATED`]
==============================================

Added
-------

- CHANGELOG.md in root directory

Changed
-------

- Updated CONTRIBUTING.md
- Updated LICENSE


v1.1.0 - 2020-12-18 [:deprecated:`DEPRECATED`]
==============================================

Changed
-------

- Refactored code for the configure command


v1.0.1 - 2020-12-17 [:deprecated:`DEPRECATED`]
==============================================

Added
-----

- Added CONTRIBUTING.md
- Added LICENSE


v1.0.0 - 2020-12-17 [:deprecated:`DEPRECATED`]
==============================================

Initial public release