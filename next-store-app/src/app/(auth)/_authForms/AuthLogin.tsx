// Material UI Components
import { 
  Stack, 
  Typography, 
  InputAdornment, 
  Box, 
  Button, 
  Divider, 
  Alert, 
  FormControlLabel, 
  FormGroup 
} from '@mui/material'
import * as Icons from "@mui/icons-material/"

// Other Components
import { loginType } from "@/app/(auth)/types/auth"
import CustomCheckbox from "@/app/components/forms/theme-elements/CustomCheckbox"
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField"
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel"
import AuthSocialButtons from "./AuthSocialButtons"

// Next Components
import Link from "next/link"
import { useRouter } from 'next/navigation'

// React Hook Form and Yup for Form Validation
import { Controller, useForm } from "react-hook-form"
import * as Yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { login } from '@/app/services/actions/authAction'
import { useState } from 'react'

// Types or Interfaces
type User = {
  username: string
  password: string
}


export default function AuthLogin({ title, subtitle, subtext }: loginType) {
  const router = useRouter()
  const initaalValues: User = {
    username: "", //pingkunga1
    password: "", //As@1234
  }

  // Yup Validation Schema
  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required").min(5, "Username must be at least 5 characters").trim(),
    password: Yup.string().required("Password is required").trim(),
  })

  // React Hook Form
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: initaalValues
  })

  const [loginStatus, setLoginStatus] = useState('')

  const onSubmitLogin = async (data: User) => {
    console.log(data)
    // Call API
    const response = await login(data)
    console.log(response)
    // Redirect to Home Page
    // router.push('/')
    if (response.success) {
      console.log('Login Success')
      setLoginStatus("Success")
      router.push('/backend/dashboard')
    }
    else{
      setLoginStatus("Error")
      console.log('Login Failed' , response.data);
    }
  }
  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h3" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}

      <AuthSocialButtons title="Sign in with" />
      <Box mt={3}>
        <Divider>
          <Typography
            component="span"
            color="textSecondary"
            variant="h6"
            fontWeight="400"
            position="relative"
            px={2}
          >
            or sign in with
          </Typography>
        </Divider>
      </Box>
      
      {/* Login Status */}
    
      { loginStatus && (
          <Alert severity={loginStatus === 'Success' ? 'success':'error'} sx={{ mt: 2 }}>
            <Typography variant="body2">
              {loginStatus === 'Success' ? 'Login Successfull' : 'Login Failed'}
            </Typography>
          </Alert>
        )
      }

      {/* form noValidate use with yup*/}
      <form 
       onSubmit={handleSubmit(onSubmitLogin)}
       noValidate
       autoComplete="off"
       >
        <Stack>

          <Box>
            <CustomFormLabel htmlFor="username">Username</CustomFormLabel>
            <Controller name='username' 
                        control={control}
                        render={({ field }) => (
                          <CustomTextField 
                            {...field}
                            id="username" 
                            variant="outlined" 
                            fullWidth 
                            inputProps={{
                              startadornment: (
                                <InputAdornment position="start">
                                  <Icons.Person />
                                </InputAdornment>
                              ),
                            }}
                            autoComplete="username"
                            autoFocus
                            error={(errors.username?.message ?? "") != ""}
                            // helperText={errors.username?.message?.toString()}
                          />
                )}
              />
              {/* Show Error Message */}
              {
                errors.username && (
                  <Alert severity="error">{errors.username.message}</Alert>
                )
              }
          </Box>

          <Box>
            <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
            <Controller name='password'
                        control={control}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            id="password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            inputProps={{
                              startadornment: (
                                <InputAdornment position="start">
                                  <Icons.Lock />
                                </InputAdornment>
                              ),
                            }}
                            autoComplete="current-password"
                            error={(errors.password?.message ?? "") != ""}
                            // helperText={errors.password?.message?.toString()}
                          />
                )}
              />
              {/* Show Error Message */}
              {
                errors.password && (
                  <Alert severity="error">{errors.password.message}</Alert>
                )
              }
          </Box>

          <Stack
            justifyContent="space-between"
            direction="row"
            alignItems="center"
            my={2}
          >
            <FormGroup>
              <FormControlLabel
                control={<CustomCheckbox defaultChecked />}
                label="Remeber this Device"
              />
            </FormGroup>
            <Typography
              component={Link}
              href="/forgotpass"
              fontWeight="500"
              sx={{
                textDecoration: "none",
                color: "primary.main",
              }}
            >
              Forgot Password ?
            </Typography>
          </Stack>

        </Stack>
        {/* <Box>
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            component={Link}
            href="/"
            type="submit"
          >
            Sign In
          </Button>
        </Box> */}

        <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            type="submit"
          >
            Sign In
          </Button>
      </form>
      {subtitle}
    </>
  )
}
  
