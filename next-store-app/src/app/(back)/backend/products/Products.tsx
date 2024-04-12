"use client";

//React
import React, { useEffect, useState } from "react";

// Material-UI
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Stack,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

// Custom Components
import DashboardCard from "@/app/components/back/shared/DashboardCard";

// Business Logic
import { getAllProducts } from "@/app/services/actions/productAction";
import { IconEdit, IconEye, IconPlus, IconTrash } from "@tabler/icons-react";
import { formatDate, numberWithCommas } from "@/app/utils/CommonUtil";
import { Form } from "react-hook-form";

type Product = {
  product_id: number;
  category_name: string;
  product_name: string;
  unit_price: number;
  product_picture: string;
  unit_in_stock: number;
  created_date: string;
  modified_date: string;
};

type Props = {};

export default function ProductsPage({}: Props) {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts();
      setProducts(response);
    } catch (error) {
      console.error("An error occurred while fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  console.log(products);

  const [openDialog, setOpenDialog] = useState(false);
  
  const handleDialogOpen = () => {
    setOpenDialog(true);
  }

  const handleDialogClose = () => {
    setOpenDialog(false);
  }

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
            <Button variant="contained" color="primary" onClick={handleDialogOpen}>
              <IconPlus size={16} /> &nbsp;Add Product
            </Button>
          </Stack>
        </CardContent>
        <Box sx={{ overflow: "auto", width: { sm: "auto" } }}>
          <Table
            aria-label="products"
            sx={{
              whiteSpace: "nowrap",
              mt: 2,
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    ID
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Picture
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Product
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Category
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Price
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Unit
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Created
                  </Typography>
                </TableCell>
                <TableCell sx={{ width: "100px" }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Manage
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product: Product) => (
                <TableRow
                  key={product.product_id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="product">
                    {product.product_id}
                  </TableCell>
                  <TableCell>
                    <img
                      src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL_API}/${product.product_picture}`}
                      alt={product.product_name}
                      style={{ width: "50px" }}
                    />
                  </TableCell>
                  <TableCell>{product.product_name}</TableCell>
                  <TableCell>{product.category_name}</TableCell>
                  <TableCell>{numberWithCommas(product.unit_price)}</TableCell>
                  <TableCell>{product.unit_in_stock}</TableCell>
                  <TableCell>{formatDate(product.created_date)}</TableCell>
                  <TableCell>
                    {/* Button View, Edit and Delete with Icon */}
                    <Button
                      variant="contained"
                      color="info"
                      sx={{ mr: 1, minWidth: "30px" }}
                    >
                      <IconEye size={16} />
                    </Button>
                    <Button
                      variant="contained"
                      color="warning"
                      sx={{ mr: 1, minWidth: "30px" }}
                    >
                      <IconEdit size={16} />
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      sx={{ mr: 1, minWidth: "30px" }}
                    >
                      <IconTrash size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Card>

      { /* Add Dialog for Add Product */ }
      <Dialog
        open={openDialog}
        aria-labelledby="form-dialog-title">
          <form noValidate>
            <DialogTitle id="form-dialog-title">Add Product</DialogTitle>
            <DialogContent>
              <Typography variant="h6">Product Information</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose} color="primary">Cancel</Button>
              <Button type="submit" color="primary">Save</Button>
            </DialogActions>
          </form>
      </Dialog>
    </>
  );
}
