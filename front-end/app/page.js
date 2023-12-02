import React from 'react'
import './globals.css'
import Link from 'next/link'
import Commit from './Commit'
import ContractBalance from './balance'

 
const Home = async () => {
     


    return(
        <div >
            <nav className="flex items-center justify-between gap-4 p-4 bg-gray-200 text-gray-200 font-bold shadow appearance-none border">
                <div className='flex items-center'>
                    <Link href='../' className=' text-red-500 hover:text-red-800'><strong>Home</strong></Link>
                </div>
                    <h2 className='text-red-600 text-2xl font-bold'><strong>Randomness Beacon</strong></h2>
                <div className="flex items-center">
                   <ContractBalance/>
                </div>
            </nav>
            <div>                 
                <Commit/>
            </div>
        </div>
    )
}

export default Home