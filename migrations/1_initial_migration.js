const RandomnessBeacon = artifacts.require("./RandomnessBeacon");
 
module.exports = function(deployer) {
  deployer.deploy(RandomnessBeacon);
};