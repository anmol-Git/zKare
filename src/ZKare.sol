// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "forge-std/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "sismo-connect-solidity/SismoLib.sol"; // <--- add a Sismo Connect import
import {EAS} from "lib/eas-contracts/contracts/EAS.sol";
import {SchemaRegistry} from "lib/eas-contracts/contracts/SchemaRegistry.sol";
/*
 * @title ZKare
 * @author ZKare
 * @dev Simple contract used for ZK powered medical research studies
 * It will be used to demonstrate how to integrate Sismo Connect
 */
contract ZKare is ERC20, SismoConnect {
  using Counters for Counters.Counter;
  error AlreadyClaimed();
  using SismoConnectHelper for SismoConnectVerifiedResult;
  mapping(uint256 => bool) public claimed;
  mapping(address => string) public doctors;
  mapping(uint256 => string) public studies;
  event StudyCreated(uint256 cnt, string name);
  event DoctorCreated(address addr, string name);
  Counters.Counter public studyCounter;
  
  EAS private eas;
  SchemaRegistry private schemaRegistry;

  // add your appId as a constant
  bytes16 public constant APP_ID = 0x173cf2e3342bc071b8a96f96f195b118;
  // use impersonated mode for testing
  bool public constant IS_IMPERSONATION_MODE = true;

  constructor(
    string memory name,
    string memory symbol,
    address _eas,
    address _schemaRegistry
  )
    ERC20(name, symbol)
    SismoConnect(buildConfig(APP_ID, IS_IMPERSONATION_MODE)) // <--- Sismo Connect constructor
  {
    eas = EAS(_eas);
    schemaRegistry = SchemaRegistry(_schemaRegistry);

  }

  function addDoctor(address addr, string memory name) public {
    // eas.attest({
    //   subject: addr,
    //   schema: schemaRegistry.getSchemaId("doctor"),
    //   data: abi.encode(name)
    // });
    doctors[addr] = name;
    emit DoctorCreated(addr, name);
  }

  function createStudy(string memory name) public {
    studyCounter.increment();
    uint256 cnt = studyCounter.current();
    studies[cnt] = name;
    emit StudyCreated(cnt, name);
  }

  function claimWithSismo(bytes memory response) public {
    SismoConnectVerifiedResult memory result = verify({
      responseBytes: response,
      // we want the user to prove that he owns a Sismo Vault
      // we are recreating the auth request made in the frontend to be sure that 
      // the proofs provided in the response are valid with respect to this auth request
      auth: buildAuth({authType: AuthType.VAULT}),
      // we also want to check if the signed message provided in the response is the signature of the user's address
      signature:  buildSignature({message: abi.encode(msg.sender)})
    });

    // if the proofs and signed message are valid, we take the userId from the verified result
    // in this case the userId is the vaultId (since we used AuthType.VAULT in the auth request), 
    // it is the anonymous identifier of a user's vault for a specific app 
    // --> vaultId = hash(userVaultSecret, appId)
    uint256 vaultId = result.getUserId(AuthType.VAULT);

    // we check if the user has already claimed the airdrop
    if (claimed[vaultId]) {
      revert AlreadyClaimed();
    }
    // each vaultId can claim 100 tokens
    uint256 airdropAmount = 100 * 10 ** 18;

    // we mark the user as claimed. We could also have stored more user airdrop information for a more complex airdrop system. But we keep it simple here.
    claimed[vaultId] = true;

    // we mint the tokens to the user
    _mint(msg.sender, airdropAmount);
  }
}
