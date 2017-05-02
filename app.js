// Import the page's CSS. Webpack will know what to do with it.
//import "/Elliot/app/stylesheets/app.css";

// Import libraries we need.
//import { default as Web3} from 'web3';
//import { default as contract } from 'truffle-contract'

/*
 * When you compile and deploy your Voting contract,
 * truffle stores the abi and deployed address in a json
 * file in the build directory. We will use this information
 * to setup a Voting abstraction. We will use this abstraction
 * later to create an instance of the Voting contract.
 * Compare this against the index.js from our previous tutorial to see the difference
 * https://gist.github.com/maheshmurthy/f6e96d6b3fff4cd4fa7f892de8a1a1b4#file-index-js
 */

//import voting_artifacts from '/Elliot/build/contracts/Voting.json'

// Checks Web3 support 

var contractAddress = '0x1e9d5e4ed8ef31cfece10b4c92c9057f991f36bc';
var contractABI = [ { "constant": false, "inputs": [ { "name": "candidate", "type": "bytes32" } ], "name": "totalVotesFor", "outputs": [ { "name": "", "type": "uint8" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "candidate", "type": "bytes32" } ], "name": "validCandidate", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "bytes32" } ], "name": "votesReceived", "outputs": [ { "name": "", "type": "uint8", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "x", "type": "bytes32" } ], "name": "bytes32ToString", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "candidateList", "outputs": [ { "name": "", "type": "bytes32", "value": "0x5361726168000000000000000000000000000000000000000000000000000000" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "candidate", "type": "bytes32" } ], "name": "voteForCandidate", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "contractOwner", "outputs": [ { "name": "", "type": "address", "value": "0x" } ], "payable": false, "type": "function" }, { "inputs": [ { "name": "candidateNames", "type": "bytes32[]" } ], "payable": false, "type": "constructor" } ];

var Voting;
var ethervote;

let candidates = {"Sarah": "candidate-1", "Mike": "candidate-2", "Elliot": "candidate-3"}

window.voteForCandidate = function(candidate) {
  let candidateName = $("#candidate").val();
  try {
    $("#msg").html("Vote has been submitted. The vote count will increment as soon as the vote is recorded on the blockchain. Please wait.")
    $("#candidate").val("");

    /* Voting.deployed() returns an instance of the contract. Every call
     * in Truffle returns a promise which is why we have used then()
     * everywhere we have a transaction call
     */
    
      ethervote.voteForCandidate(candidateName, {gas: 140000, from: web3.eth.accounts[0]}).then(function() {
        let div_id = candidates[candidateName];
        return ethervote.totalVotesFor(web3.sha3(candidateName)).then(function(v) {
          $("#" + div_id).html(v.toString());
          $("#msg").html("");
        });
      });
  } catch (err) {
    console.log(err);
  }
}

$( document ).ready(function() {
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source like Metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  Voting = web3.eth.contract(contractABI);
  ethervote = Voting.at(contractAddress);

  //Voting.setProvider(web3.currentProvider);
  let candidateNames = Object.keys(candidates);
  for (var i = 0; i < candidateNames.length; i++) {
    let name = candidateNames[i];
    
    ethervote.totalVotesFor(5361726168).then(function(v) {
      $("#" + candidates[name]).html(v.toString());
    }); 
    
  }
});
