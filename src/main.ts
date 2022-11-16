import {Command} from "commander";
import {SubnetChecker} from "./SubnetChecker";

const program = new Command();

program
  .requiredOption("--cidr-blocks <cidrBlocks>", "AWS Subnet CIDR Blocks joined by comma(,)")
  .requiredOption("--region <region>", "AWS region")
  .option("--vpc-id <vpcId>", "AWS VPC ID")
  .parse();

export interface Arguments {
  cidrBlocks: string;
  region: string;
  vpcId?: string;
}

new SubnetChecker(program.opts()).run()
  .then(r => console.log(r));
