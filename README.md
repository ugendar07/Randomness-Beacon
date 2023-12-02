# Ethereum Randomness Beacon

## Overview

The Ethereum Randomness Beacon is a smart contract-based solution for generating random numbers on the Ethereum blockchain. Users can provide inputs to the smart contract, and the beacon will use these inputs to produce a verifiable and unbiased random number.

Additionally, a frontend application has been developed to provide a user-friendly interface for interacting with the randomness beacon smart contract.

## Features

- **Randomness Beacon Smart Contract:** The core functionality of the project is implemented in an Ethereum smart contract. Users can input their data, and the smart contract will generate a random number based on this data.

- **Verifiable Randomness:** The generated random number is verifiable by users, ensuring transparency and fairness.

- **User-Friendly Frontend:** A frontend application has been developed to facilitate easy interaction with the randomness beacon. Users can input their data and retrieve the generated random number.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/)
- [Truffle](https://www.trufflesuite.com/truffle) - Smart contract development framework
- [Ganache](https://www.trufflesuite.com/ganache) - Local blockchain for testing

### Installation

1. Clone the repository:

   git clone [Randomness-Beacon](https://github.com/ugendar07/Randomness-Beacon.git)

2. Navigate to the project directory:
     
     ```cd randomness-beacon```

3. Install dependencies:

     ```npm install```

4. Compile and deploy the smart contract:

     ```
     truffle compile
     truffle migrate
     ```
5. Run the frontend application:

      ```npm run start```

## Usage
- Connect your Ethereum wallet to the frontend application.
- Input your data into the randomness beacon smart contract.
- Retrieve the generated random number.


## License
This project is licensed under the MIT License.

## Acknowledgments
Special thanks to Truffle for providing an excellent smart contract development framework.
## Contact
For questions or support, please contact ugendar07@gmail.com.

