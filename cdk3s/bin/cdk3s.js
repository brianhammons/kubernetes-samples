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