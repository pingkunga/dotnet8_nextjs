import React from 'react'
import { styled } from '@mui/material/styles'
import { TextField } from '@mui/material'

const CustomTextField = styled(
  React.forwardRef(
    function component(props: any, ref: any){
      return <TextField ref={ref} {...props} />
    })
)(({ theme }) => ({
  '& .MuiOutlinedInput-input::-webkit-input-placeholder': {
    color: theme.palette.text.secondary,
    opacity: '0.8',
  },
  '& .MuiOutlinedInput-input.Mui-disabled::-webkit-input-placeholder': {
    color: theme.palette.text.secondary,
    opacity: '1',
  },
  '& .Mui-disabled .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.grey[200],
  },
}))
export default CustomTextField