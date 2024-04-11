"use client"

//React
import React, { useEffect, useState } from 'react'

// Material-UI
import { Box
       , Table
       , TableBody
       , TableCell
       , TableContainer
       , TableHead
       , TableRow
       , Paper, 
       Card,
       CardContent,
       Stack,
       Typography,
       Button} from '@mui/material'

// Custom Components
import DashboardCard from '@/app/components/back/shared/DashboardCard'

// Business Logic
import { getAllProducts } from '@/app/services/actions/productAction'

type Product = {
  product_id: number
  category_name: string
  product_name: string
  unit_price: number
  product_picture: string
  unit_in_stock: number
  created_date: string
  modified_date: string
}

type Props = {}

export default function ProductsPage({ }: Props) {

  const [products, setProducts] = useState([])

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts()
      setProducts(response)
    } catch (error) {
      console.error('An error occurred while fetching products:', error)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  console.log(products)

  return (
    <>
      <Card
        sx={{ padding: 0, border: `1px solid #eee`, borderRadius: 1 }}
        variant={"outlined"}
      >
        <CardContent sx={{ pt: "16px", pb: "0px" }}>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="space-between"
            alignItems={"center"}
          >
            <Typography variant="h5">Products</Typography>
            <Button
              variant="contained"
              color="primary"
            >
              Add Product
            </Button>
          </Stack>
        </CardContent>
      {/* <Box mt={2}>
        <DashboardCard title="Products">
          
          <TableContainer component={Paper}> */}
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                      <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Product</TableCell>
                          <TableCell>Category</TableCell>
                          <TableCell>Price</TableCell>
                          <TableCell>Unit</TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {products.map((product: Product) => (
                          <TableRow
                              key={product.product_id}
                              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                              <TableCell component="th" scope="product">
                                  {product.product_id}
                              </TableCell>
                              <TableCell>{product.product_name}</TableCell>
                              <TableCell>{product.category_name}</TableCell>
                              <TableCell>{product.unit_price}</TableCell>
                              <TableCell>{product.unit_in_stock}</TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
          {/* </TableContainer>

        </DashboardCard>
      </Box> */}
      </Card>
    </>
  )
}