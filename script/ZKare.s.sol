// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import {ZKare} from "src/ZKare.sol";
import {EAS} from "lib/eas-contracts/contracts/EAS.sol";
import {SchemaRegistry} from "lib/eas-contracts/contracts/SchemaRegistry.sol";

contract DeployZKare is Script {
  function run() public {
    vm.startBroadcast();
    ZKare zkare = new ZKare("My zkare contract", "AIR", 0xC2679fBD37d54388Ce493F1DB75320D236e1815e, 0x7b24C7f8AF365B4E308b6acb0A7dfc85d034Cb3f);
    console.log("ZKare Contract deployed at", address(zkare));
    vm.stopBroadcast();
  }
}
