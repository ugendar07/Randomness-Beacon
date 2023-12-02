// test/RandomnessBeacon.js

const RandomnessBeacon = artifacts.require("RandomnessBeacon");

contract("RandomnessBeacon", (accounts) => {
  let instance;

  before(async () => {
    instance = await RandomnessBeacon.new();
  });


  // %%%%%%%%%%%%%%%%%%%%%%% The 1st test case  %%%%%%%%%%%%%%%%%%%%%%%%%%
  it('ensures that contract is deployed succesfully', async() =>{
    let contractBalance = await web3.eth.getBalance(instance.address)
    console.log("The Initial balance of Contract",contractBalance)
    assert.equal(contractBalance,0,'the initial massege count should be 0')
   } )



  // %%%%%%%%%%%%%%%%%%%%%%% The 2nd test case  %%%%%%%%%%%%%%%%%%%%%%%%%%

  it("should commit and reveal successfully", async () => {
    const revealValue = "0x123456";
    const salt =  'abc'
    const hexValue = await web3.utils.utf8ToHex(revealValue)
    const hexSalt = await web3.utils.utf8ToHex(salt)
     
    // const valueToCommit = web3.utils.keccak256(revealValue);
    const valueToCommit = await instance.getSaltedHash(hexValue,hexSalt);
    // console.log("the commited value that we are passing :",valueToCommit)
    const balalenceBefore = await web3.eth.getBalance(instance.address);
    // console.log("The contract ballence before commit :", balalenceBefore)
    const { logs } = await instance.commit(valueToCommit, { value: 10000 });
    const balalenceAfter = await web3.eth.getBalance(instance.address);
    console.log("The contract ballence after commit :", balalenceAfter)

    assert.equal(logs[0].event, "CommitHash", "CommitHash event not emitted");

    const blockNumber = logs[0].args.blockNumber.toNumber();

    // console.log("the hash of the")

     
    const { logs: revealLogs } = await instance.reveal(hexValue,hexSalt);


    assert.equal(revealLogs[0].event, "RevealHash", "RevealHash event not emitted");
    let revealedValues
    // const revealedValues = await instance.revealedValues();
    const EventsCommit = await instance.getPastEvents('RevealHash', { fromBlock: 0, toBlock: 'latest' });
    EventsCommit.map(event => {
      revealedValues = event.returnValues.revealAns
    })
    console.log("The Bytes32 Revealed Values  :",revealedValues.replace(/0+$/, ''))

    const balalenceAfterReveal = await web3.eth.getBalance(instance.address);
    // console.log("The contract ballence before commit :", balalenceAfterReveal)
    const revealedPadded = web3.utils.hexToUtf8(revealedValues)
    assert.equal(revealedPadded, revealValue, "Revealed values do not match");
  });



    // %%%%%%%%%%%%%%%%%%%%%%% The 3rd test case  %%%%%%%%%%%%%%%%%%%%%%%%%%


  it("Should get the XOR of revealed values ", async () => {
    const value = "0x12345678910";
    const salt = 'abc'
    const hexValue = await web3.utils.utf8ToHex(value)
    const hexSalt = await web3.utils.utf8ToHex(salt)
    
    // console.log("the hexValue  is  :",hexValue)
    const valueToCommit = await instance.getSaltedHash(hexValue,hexSalt);
    const balalenceBefore = await web3.eth.getBalance(instance.address);

    await instance.commit(valueToCommit, { value: 10000 });
    // const EventsCommit = await instance.getPastEvents('DebugEvents', { fromBlock: 0, toBlock: 'latest' });

    // console.log(EventsCommit.map(event => {
    //   return {
    //     message: event.returnValues.sender,
    //     dataHash: event.returnValues.dataHash,
    //     blockNumber: event.returnValues.blockNumber
    //   };
    // }));

    await instance.reveal(hexValue,hexSalt);

    let revealedValues
    const balalenceAfter = await web3.eth.getBalance(instance.address);

    // console.log("The Random Number is :", revealedValues)
    const Events = await instance.getPastEvents('RevealHash', { fromBlock: 'latest', toBlock: 'latest' });

    Events.map(event =>{
      revealedValues = event.returnValues.revealAns
    })
    console.log("The Bytes32 Revealed value is  : ",revealedValues.replace(/0+$/, ''))

    // const Events1 = await instance.getPastEvents('DebugEvents1', { fromBlock: 0, toBlock: 'latest' });

    // console.log(Events1.map(event => {
    //   return {
    //     Number : event.returnValues.number,
    //     Hash: event.returnValues.message
    //   };
    // }));

    assert.equal(balalenceAfter, balalenceBefore, "Revealed values do not match");
  })

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%  The 4th test case  %%%%%%%%%%%%%%%%%%%%%%%%%%
  it("It should check for revealed parties " , async () => {
    const value1 = "My Random Number"
    const salt = 'abcd'
    const hexSalt = await web3.utils.utf8ToHex(salt)
    const getHex1 = web3.utils.utf8ToHex(value1)

    const balalenceBefore = await web3.eth.getBalance(instance.address);
    const valueToCommit1 = await instance.getSaltedHash(getHex1,hexSalt);
    await instance.commit(valueToCommit1 , {value : 10000, from : accounts[0]})

    await instance.reveal(getHex1,hexSalt)

    const Events1 = await instance.getPastEvents('RandomNumber', { fromBlock: 'latest', toBlock: 'latest' });

    Events1.map(event =>{
      randNumber = event.returnValues.randNumber
    })
    console.log("The Random number is  : ",randNumber)

    
    const balalenceAfter = await web3.eth.getBalance(instance.address);

    assert.equal(balalenceBefore,balalenceAfter,"The reveals are not equals to required no.of reveals")
  })

    // %%%%%%%%%%%%%%%%%%%%%%% The 5th test case  %%%%%%%%%%%%%%%%%%%%%%%%%%

  it("Should Commit and returns the Contract Balance Correctly :", async () =>{
     
    const value1 = "My Random Number"
    const salt = 'abcd'
    const hexSalt = await web3.utils.utf8ToHex(salt)
    const getHex1 = web3.utils.utf8ToHex(value1)
    

    const valueToCommit1 = await instance.getSaltedHash(getHex1,hexSalt);
    await instance.commit(valueToCommit1 , {value : 10000, from : accounts[0]})

    const value2 = "0x123ABC456def789GHI"
    const getHex2 = web3.utils.utf8ToHex(value2)
    const valueToCommit2 = await instance.getSaltedHash(getHex2,hexSalt);
    await instance.commit(valueToCommit2 , {value : 10000, from : accounts[1]})
  
    const value3 = "I Don't Know What to put"
    const getHex3 = web3.utils.utf8ToHex(value3)
    const valueToCommit3 = await instance.getSaltedHash(getHex3,hexSalt);
    await instance.commit(valueToCommit3 , {value : 10000, from : accounts[2]})

  
    const EventsCommit = await instance.getPastEvents('CommitHash', { fromBlock: 0, toBlock: 'latest' });
    console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%: The committed values are :%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")
    console.log(EventsCommit.map(event => {
      return {
        address: event.returnValues.sender,
        dataHash: event.returnValues.dataHash,
        blockNumber: event.returnValues.blockNumber
      };
    }));


    const balance = await web3.eth.getBalance(instance.address)

    assert.equal(balance , 30000 ,"The contract Balance Should be Added")
  })


    // %%%%%%%%%%%%%%%%%%%%%%% The 6th test case  %%%%%%%%%%%%%%%%%%%%%%%%%%


  it("Should Return the deducted amount to the respective Accounts After reveal :", async () => {
    const value1 = "My Random Number"
    const salt = 'abcd'
    const hexSalt = await web3.utils.utf8ToHex(salt)
    const getHex1 = web3.utils.utf8ToHex(value1)
    await instance.reveal(getHex1,hexSalt , {from : accounts[0]});

    const value2 = "0x123ABC456def789GHI"
    const getHex2 = web3.utils.utf8ToHex(value2)
    await instance.reveal(getHex2,hexSalt , {from : accounts[1]});

    const value3 = "I Don't Know What to put"
    const getHex3 = web3.utils.utf8ToHex(value3)
    await instance.reveal(getHex3,hexSalt , {from : accounts[2]});
     

    const Events = await instance.getPastEvents('RevealHash', { fromBlock: 0, toBlock: 'latest' });
    console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%: The revealed Values are :%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")
    console.log(Events.map(event => {
      return {
        address: event.returnValues.sender,
        revealedValue: web3.utils.hexToUtf8(event.returnValues.revealAns)
      };
    }));

    let randNumber
    const Events1 = await instance.getPastEvents('RandomNumber', { fromBlock: 'latest', toBlock: 'latest' });

    Events1.map(event =>{
      randNumber = event.returnValues.randNumber
    })
    console.log("The Random number is  : ",randNumber)
    // const random = await instance.randNumber()
    // console.log("the function call of random number is :",random)

    const Events12 = await instance.getPastEvents('DebugEvents', { fromBlock: 'latest', toBlock: 'latest' });

    console.log(Events12.map(event =>{
      return{ message: event.returnValues.message,
      hash : event.returnValues.Hash
      }
    }))

    const Events123 = await instance.getPastEvents('DebugEvents1', { fromBlock: 'latest', toBlock: 'latest' });

    console.log(Events123.map(event =>{
      return{ message: event.returnValues.message,
      number : event.returnValues.number
      }
    }))
    console.log("The Random number is  : ",randNumber)
    
  
    // const revealedValue = await instance.revealedValues();
    // console.log("The generated Random Value is :" , revealedValue)

    const balance = await web3.eth.getBalance(instance.address)

    assert.equal(balance , 0 ,"The contract Balance Should be deducted")

  })


    // %%%%%%%%%%%%%%%%%%%%%%% The 7th test case  %%%%%%%%%%%%%%%%%%%%%%%%%%

  it("Sholud not commit untill the preveious committed value is revealed :", async () => {
     
    const value1 = "0x12345678901"
    const salt = 'abcd'
    const hexSalt = await web3.utils.utf8ToHex(salt)
    const getHex1 = web3.utils.utf8ToHex(value1)
    const valueToCommit1 = await instance.getSaltedHash(getHex1,hexSalt);
    await instance.commit(valueToCommit1 , {value : 10000})
    

    try{
      const value2 = "0x0987654321"
      const getHex2 = web3.utils.utf8ToHex(value2)
      const valueToCommit2 = await instance.getSaltedHash(getHex2,hexSalt);
      await instance.commit(valueToCommit2 , {value : 10000})

      assert.fail('Commit should fail');
    } catch(error){
      assert.include(error.message, 'VM Exception while processing transaction: revert Previous commitment not revealed -- Reason given: Previous commitment not revealed', 'Expected "Commit should fail" error');
    }

    const EventsCommit = await instance.getPastEvents('CommitHash', { fromBlock: 'latest', toBlock: 'latest' });
    console.log(EventsCommit.map(event => {
      return {
        address: event.returnValues.sender,
        dataHash: event.returnValues.dataHash,
        blockNumber: event.returnValues.blockNumber
      };
    }));

  })


    // %%%%%%%%%%%%%%%%%%%%%%% The 8th test case  %%%%%%%%%%%%%%%%%%%%%%%%%%

  it("Should not reveal same value again ", async () => {
    const value1 = "0x12345678901"
    const salt = 'abcd'
    const hexSalt = await web3.utils.utf8ToHex(salt)
    const getHex1 = web3.utils.utf8ToHex(value1)
    await instance.reveal(getHex1,hexSalt);

    try{
      const value1 = "0x12345678901"
      const getHex1 = web3.utils.utf8ToHex(value1)
      await instance.reveal(getHex1,hexSalt);

      assert.fail('Reveal should fail');
    } catch(error){
      assert.include(error.message, 'VM Exception while processing transaction: revert Already revealed -- Reason given: Already revealed.', 'Expected "Already Revealed" error');
    }

    const EventsCommit = await instance.getPastEvents('RevealHash', { fromBlock: 'latest', toBlock: 'latest' });
    console.log(EventsCommit.map(event => {
      return {
        address: event.returnValues.sender,
        revealedValue: web3.utils.hexToUtf8(event.returnValues.revealAns)
      };
    }));

     
     
  })

});
