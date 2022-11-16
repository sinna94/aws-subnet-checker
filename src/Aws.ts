import AWS, {EC2} from "aws-sdk";
import {DescribeSubnetsRequest} from "aws-sdk/clients/ec2";

export class Aws {

  public static describeSubnets = (region: string, cidrs: string[]) => {
    Aws.setConfig(region);
    const request: DescribeSubnetsRequest = {
      Filters: [{Name: "cidr-block", Values: cidrs}]
    }
    const ec2 = new EC2();
    return ec2.describeSubnets(request).promise()
  }

  private static setConfig(region: string) {
    AWS.config.getCredentials(function (err) {
      if (err) console.log(err.stack);
      // credentials not loaded
    });

    AWS.config.update({region})
  }

  private constructor() {
  }
}