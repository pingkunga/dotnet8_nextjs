import { Button, Typography } from '@mui/material'
import React from 'react'
import { AddCircleOutline as AddCirIcon } from '@mui/icons-material'


type Props = {}

export default function HomePage({}: Props) {
  return (
    <>
    <Typography variant="h1">Hello World</Typography>

    <Button variant="contained" color="primary"> Test Button </Button>

    <div>
      <AddCirIcon color="primary" />
      <AddCirIcon color="secondary" />
      <AddCirIcon color="error" />
      <AddCirIcon color="warning" />
      <AddCirIcon color="info" />
      <AddCirIcon color="success" />

    </div>
  </>
  )
}