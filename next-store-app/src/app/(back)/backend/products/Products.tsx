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
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material";

// Custom Components
import DashboardCard from "@/app/components/back/shared/DashboardCard";

// Business Logic
import { getAllProducts } from "@/app/services/actions/productAction";
import { IconEdit, IconEye, IconPlus, IconTrash } from "@tabler/icons-react";
import { formatDate, numberWithCommas } from "@/app/utils/CommonUtil";

// React Hook Form and Yup for Form Validation
import { Controller, useForm } from "react-hook-form"
import * as Yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"

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

// Types for product post
type ProductPost = {
  category_id: string
  product_name: string
  unit_price: number
  unit_in_stock: number
  product_picture: string
  created_date: string
  modified_date: string
}




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


  //Form Validation
  const productPostSchema: any = Yup.object().shape({
    category_id: Yup.string().required("Category is required"),
    product_name: Yup.string().required("Product Name is required"),
    unit_price: Yup.number().required("Unit Price is required"),
    unit_in_stock: Yup.number().required("Unit in Stock is required"),
    product_picture: Yup.string().required("Product Picture is required"),
  });

  const { control, handleSubmit, formState: { errors } } = useForm<ProductPost>({
    defaultValues: {
      category_id: "",
      product_name: "",
      unit_price: 0,
      unit_in_stock: 0,
      product_picture: "",
      created_date: new Date().toISOString(),
      modified_date: new Date().toISOString(),
    },
    resolver: yupResolver(productPostSchema),
  });

  //handle form submit
  const onSubmitProduct = async (data: ProductPost) => {
    console.log(data);
    // Call the API to save the data
  }

  //Dropdown for Category - refactor to call api later
  const categories = [
    { name: "Mobile", value: "1" },
    { name: "Tablet", value: "2" },
    { name: "Smart Watch", value: "3" },
    { name: "Labtop", value: "4"}
  ]

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
          <form noValidate 
                onSubmit={handleSubmit(onSubmitProduct)}  
                autoComplete="off">
            <DialogTitle id="form-dialog-title">Add Product</DialogTitle>

            <DialogContent sx={{width: '350px'}}>
              
              <FormControl fullWidth variant="outlined" margin="dense">
                <InputLabel id="category_name-label">Category</InputLabel>
                <Controller
                  name="category_id"
                  control={control}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <Select
                      labelId="category_name-label"
                      id="category_id"
                      label="Category"
                      value={value}
                      onChange={onChange} // Use field.onChange for change handler
                      error={!!error} // Use fieldState.error to determine if there's an error
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.value} value={category.value}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                <FormHelperText error={errors.category_id ? true : false}>
                  {errors.category_id?.message}
                </FormHelperText>
              </FormControl>

              <Controller
                name="product_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    autoFocus
                    margin="dense"
                    id="product_name"
                    label="Product Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    error={errors.product_name ? true : false}
                    helperText={errors.product_name?.message}
                  />
                )}
              />
              <Controller
                name="unit_price"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="dense"
                    id="unit_price"
                    label="Unit Price"
                    type="number"
                    fullWidth
                    variant="outlined"
                    error={errors.unit_price ? true : false}
                    helperText={errors.unit_price?.message}
                  />
                )}
              />

              <Controller
                name="unit_in_stock"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="dense"
                    id="unit_in_stock"
                    label="Unit in Stock"
                    type="number"
                    fullWidth
                    variant="outlined"
                    error={errors.unit_in_stock ? true : false}
                    helperText={errors.unit_in_stock?.message}
                  />
                )}
              />


              <Controller 
                name="product_picture"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="dense"
                    id="product_picture_name"
                    label="Product Picture Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    error={errors.product_picture ? true : false}
                    helperText={errors.product_picture?.message}
                  />
                )}
              />

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
