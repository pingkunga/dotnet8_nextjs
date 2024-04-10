'use server'

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
        console.log(token);
        return { success: true, data: await token };
    }
    catch (error)
    {
        console.error('An error occurred', error);
        return { success: false , data: error };

    }
}

export {
    login,
};