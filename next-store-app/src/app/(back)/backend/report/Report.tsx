"use client"

import DashboardCard from '@/app/components/back/shared/DashboardCard'
import { Typography, Box } from '@mui/material'
import React from 'react'

type Props = {}

export default function ReportPage({}: Props) {
  return (
    <>
        <Box mt={2}>
            <DashboardCard title="Report">
                <Typography>This is a report page</Typography>
            </DashboardCard>
        </Box>

        <Box mt={2}>
            <DashboardCard title="Report Summary">
                <>
                    <Typography>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatibus eligendi sequi adipisci minima eum quaerat, sapiente, debitis possimus reprehenderit placeat quo error quibusdam saepe necessitatibus asperiores eaque rerum dignissimos? Perspiciatis facere delectus pariatur magnam accusantium ullam eligendi natus iusto? Fuga dolores quisquam iusto ullam dignissimos accusantium odio quasi, voluptas doloribus?</Typography>

                    <Typography mt={2}>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatibus eligendi sequi adipisci minima eum quaerat, sapiente, debitis possimus reprehenderit placeat quo error quibusdam saepe necessitatibus asperiores eaque rerum dignissimos? Perspiciatis facere delectus pariatur magnam accusantium ullam eligendi natus iusto? Fuga dolores quisquam iusto ullam dignissimos accusantium odio quasi, voluptas doloribus?</Typography>
                </>
            </DashboardCard>
        </Box>
    </>
  )
}