'use client'
import React from 'react' 
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { User } from 'next-auth'

const NavBar = () => {
    const { data: session } = useSession()
    const user : User = session?.user
  return (
      <nav>
          <div>
              <a href='#'>Mystery Message</a>
              {session && session.user ? <><span>welcome {user.name}</span>  <button>Logout</button></> : <Link href='/sign-in'>Sign In</Link>}
          </div>
    </nav>
  )
}

export default NavBar;
