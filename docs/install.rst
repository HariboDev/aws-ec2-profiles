*******
Install
*******

AWS EC2 Profiles (AEP) can be installed using NPM:

.. code:: console

   $ npm install --global @haribodev/aws-ec2-profiles

To check the tool has been installed correctly, execute the following command and
you should see the command's help output:

.. code:: console

   $ aep

   Retrieves AWS EC2 instances and connect to them using SSH.
   Update security group ingress rules with your new public IP.

   VERSION
   @haribodev/aws-ec2-profiles/x.x.x platform_name node-vx.x.x

   USAGE
   $ aep [COMMAND]

   COMMANDS
   accounts   Display registered AWS accounts
   configure  Configure the CLI
   connect    Connect using SSH to an EC2 instance
   help       display help for aep
   list       Display EC2 instances
   update     Update security groups with your new public IP

It is recommended that you read the usage documentation for each of the commands.