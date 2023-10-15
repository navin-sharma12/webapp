import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

const securityGroup = new aws.ec2.SecurityGroup("app-sg", {
    vpcId: "vpc-0e2f7969965dabb7a",
    ingress: [
        {
            protocol: "tcp",
            fromPort: 80,
            toPort: 80,
            cidrBlocks: ["0.0.0.0/0"],
            ipv6_cidr_blocks: ["::/0"],
        },
        {
            protocol: "tcp",
            fromPort: 443,
            toPort: 443,
            cidrBlocks: ["0.0.0.0/0"],
            ipv6_cidr_blocks: ["::/0"],
        },
        {
            protocol: "tcp",
            fromPort: 22,
            toPort: 22,
            cidrBlocks: ["10.0.0.41/32"],
        },
    ],
    tags: {
        Name: "allow_tls",
    }
});

const ec2 = new aws.ec2.Instance("my-instance", {
    instanceType: "t2.micro",
    ami: "ami-0a6593468d8ca9b9f",
    vpcSecurityGroupIds: [securityGroup.id],
    rootBlockDevice: {
        volumeSize: 25,
        volumeType: "gp2",
    },
    tags: {
        Name: "My EC2 Instance",
    },
});