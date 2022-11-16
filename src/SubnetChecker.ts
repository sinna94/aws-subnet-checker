import {EC2} from "aws-sdk";
import {Arguments} from "./main";
import {Aws} from "./Aws";

/**
 * check cidr blocks usable
 */
export class SubnetChecker {
  private readonly args: Arguments
  private readonly checkResultByCidr: Record<string, boolean>;

  constructor(args: Arguments) {
    this.args = args;
    this.checkResultByCidr = this.getCheckResultByCidr(args);
  }

  private getCheckResultByCidr(args: Arguments) {
    const cidrs = args.cidrBlocks.split(",");

    return cidrs.reduce((resultObj, cidr) => {
      resultObj[cidr] = true;
      return resultObj
    }, {} as Record<string, boolean>);
  }

  /**
   * @return
   * ex)
   * {
   *   '172.31.34.0/24': false,
   *   '172.31.35.0/24': false,
   *   '172.31.36.0/24': true
   * }
   */
  public run = () => {
    const cidrs = Object.keys(this.checkResultByCidr)

    return Aws.describeSubnets(this.args.region, cidrs)
      .then(this.checkSubnet)
      .then(() => {
          return this.checkResultByCidr;
        }
      ).catch(err => console.error(err));
  }

  private checkSubnet = (result: EC2.DescribeSubnetsResult) => {
    const subnetsPartition = this.partitionSubnetsByVpcId(result.Subnets ?? []);

    this.filterCidrBlockExist(subnetsPartition[0])
      .forEach(subnet => {
        this.checkResultByCidr[subnet.CidrBlock!!] = false;
      });

    this.filterCidrBlockExist(subnetsPartition[1])
      .forEach(subnet => {
        delete this.checkResultByCidr[subnet.CidrBlock!!]
      });
  }

  private partitionSubnetsByVpcId = (subnets: EC2.SubnetList): Array<Array<EC2.Subnet>> => {
    const {vpcId} = this.args;

    if (vpcId) {
      return this.partition(subnets, vpcId)
    }

    return [subnets, []]
  }

  private partition(subnets: EC2.SubnetList, vpc_id: string): Array<Array<EC2.Subnet>> {
    return subnets?.reduce((acc, subnet) => {
      const index = subnet.VpcId === vpc_id ? 0 : 1;
      acc[index].push(subnet);
      return acc;
    }, [[], []] as Array<Array<EC2.Subnet>>);
  }

  private filterCidrBlockExist(subnets: Array<EC2.Subnet>) {
    return subnets
      .filter(subnet => subnet.CidrBlock);
  }
}
