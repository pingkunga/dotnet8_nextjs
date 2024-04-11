'use server'

import { cookies } from "next/headers";

//type user
type User = {
  username: string,
  password: string,
}

//|-------------------NEXT INTERNAL----------------|
//AuthLogin Component --Call--> authAction.login --> DOTNET API
//|-----------------------------------------------|
//Async Login function
async function login(user: User) {
    try
    {
        //Next.js prefer fetch over axios

        //fetch request
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_API}/Authenticate/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        if (!response.ok)
        {
            //throw new Error('An error occurred');
            return { success: false , data: await response.json() };
        }
        //return response
        const token = await response.json();

        //แปลกๆ ทำไมต้องใช้ cookies แทนการใช้ localStorage
        // Save Token in Cookies
        cookies().set('accessToken', token.accessToken, {
            maxAge: 60 * 60 * 24, // 1 day
        })

        // Refresh Token in Cookies
        cookies().set('refreshToken', token.refreshToken, {
            maxAge: 60 * 60 * 24, // 1 day
        })

        console.log(token);
        return { success: true, data: await token };
    }
    catch (error)
    {
        console.error('An error occurred', error);
        return { success: false , data: error };

    }
}

// Logout Function
async function logout() {
    try {
      // Make a POST request to the logout API
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_API}/Authenticate/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (response.ok) {
        cookies().set('accessToken', '', {
          maxAge: 0,
        })
        cookies().set('refreshToken', '', {
          maxAge: 0,
        })
        return { success: true }
      } else {
        return { success: false }
      }      
    } catch (error) {
        console.error('An error occurred during the logout process:', error)
        return { success: false, error }
    }
}

export {
    login, logout
};