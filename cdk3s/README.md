# BUILDING THE K3S CLUSTER WITH AWS CDK

In the following example, we will be using the AWS CDK in Javascript. To work with the AWS CDK, you must have an AWS account and credentials and have installed Node.js and the AWS CDK Toolkit. See AWS CDK Prerequisites (https://docs.aws.amazon.com/cdk/latest/guide/work-with.html#work-with-prerequisites).

To provision the k3s cluster, we will use the cdk-k3s-cluster library. From your terminal, create a new project directory and launch the cdk app:

```
mkdir k3s-greengrass-demo
cd k3s-greengrass-demo
cdk init app -l javascript
yarn add cdk-k3s-cluster
yarn add @aws-cdk/aws-ec2
```

Next, we will modify the application code in ./bin/cdk3s.js to launch the new k3s cluster like below:

```
#!/usr/bin/env node
const cdk = require('@aws-cdk/core');
const ec2 = require('@aws-cdk/aws-ec2')
const k3s = require('cdk-k3s-cluster')
const { Cdk3SStack } = require('../lib/cdk3s-stack');

const app = new cdk.App();

const env = {
    region: app.node.tryGetContext('region') || process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION,
    account: app.node.tryGetContext('account') || process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT
};

const k3sStack = new Cdk3SStack(app, 'k3sCluster', { env });

new k3s.Cluster(k3sStack, 'Cluster', {
    vpc: k3s.VpcProvider.getOrCreate(k3sStack),
    workerMinCapacity: 3,
    workerInstanceType: new ec2.InstanceType('a1.medium'),
    controlPlaneInstanceType: new ec2.InstanceType('a1.medium'),
    bucketRemovalPolicy: cdk.RemovalPolicy.DESTROY
})
```

Run the follow commands to first see the changes, then deploy the stack:

```
cdk diff
cdk deploy
```
