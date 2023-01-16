import * as cdk from 'aws-cdk-lib';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as c9 from '@aws-cdk/aws-cloud9';

export class Cloud9SpotInstanceStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, keyName: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // VPC
        const vpc = new ec2.Vpc(this, 'MyVpc', { maxAzs: 2 });

        // EC2 Instance
        const spotInstance = new ec2.Instance(this, 'SpotInstance', {
            instanceType: new ec2.InstanceType('t3.micro'),
            machineImage: new ec2.AmazonLinuxImage(),
            spotPrice: '0.01',
            vpc: vpc,
            keyName: keyName,
        });

        // Cloud9 Environment
        new c9.CfnEnvironmentEC2(this, 'MyCloud9Environment', {
            instanceType: 't3.micro',
            subnetId: vpc.publicSubnets[0].subnetId,
            automaticStopTimeMinutes: 60,
            ownerArn: cdk.Aws.ACCOUNT_ID,
            name: 'MyCloud9Environment',
            description: 'My Cloud9 Environment',
            connectionType: 'SSH',
            connectionProtocol: 'TCP',
            ec2InstanceId: spotInstance.instanceId
        });
    }
}
