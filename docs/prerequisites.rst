*************
Prerequisites
*************

AWS EC2 Profiles (AEP) requires the following:

* NodeJS v8.0.0 or later installed with NPM.
* The following AWS Permissions:

  * ``ec2:DescribeInstances``
  * ``ec2:DescribeInstanceStatus``
  * ``ec2:DescribeImages``
  * ``ec2:DescribeTags``
  * ``ec2:DescribeKeyPairs``
  * ``ec2:DescribeSecurityGroups``
  * ``ec2:AuthorizeSecurityGroupIngress``
  * ``ec2:RevokeSecurityGroupIngress``.
  
* Permissions on the SSH private key directory should be ``700`` (``drwx------``).
* Permissions on the SSH private key should be ``600`` (``-rw-------``).