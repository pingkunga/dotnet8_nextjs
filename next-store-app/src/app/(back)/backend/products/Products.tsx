"use client";

//React
import React, { useEffect, useRef, useState } from "react";

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
  IconButton,
  TablePagination
} from "@mui/material";

// Custom Components
import DashboardCard from "@/app/components/back/shared/DashboardCard";

// Business Logic
import { createProduct, deleteProduct, getAllProducts, updateProduct } from "@/app/services/actions/productAction";
import { IconClearAll, IconEdit, IconEye, IconPlus, IconTrash, IconX } from "@tabler/icons-react";
import { formatDate, formatDateToISOWithoutMilliseconds, numberWithCommas } from "@/app/utils/CommonUtil";

// React Hook Form and Yup for Form Validation
import { Controller, useForm } from "react-hook-form"
import * as Yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { FileUploadOutlined } from "@mui/icons-material";

type Product = {
  product_id: number;
  category_id: number;
  category_name: string;
  product_name: string;
  unit_price: number;
  product_picture: string;
  unit_in_stock: number;
  created_date: string;
  modified_date: string;
};

// Types for product post
type ProductAdd = {
  category_id: string
  product_name: string
  unit_price: number
  unit_in_stock: number
  created_date: string
  modified_date: string
}

type ProductEdit = {
  product_id: number
  category_id: string
  product_name: string
  unit_price: number
  unit_in_stock: number
  modified_date: string
}





type Props = {};

export default function ProductsPage({}: Props) {

  //=============================================================
  // Search
  const [searchCategory, setSearchCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  //=============================================================
  // Pagination
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(3);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch Products
  const [products, setProducts] = useState([]);

  const fetchProducts = async (page: number, limit: number, searchCategory: string, searchQuery: string) => {
    try {
      console.log(page);
      console.log(limit);

      const response = await getAllProducts(page+1, limit, searchCategory, searchQuery);
      setTotalCount(response.totalRecords);
      setProducts(response.products);
    } catch (error) {
      console.error("An error occurred while fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts(page, limit, searchCategory, searchQuery);
  }, [page, limit, searchCategory, searchQuery]);

  console.log(products);

  //=============================================================
  // Preview Product Dialog
  //=============================================================

  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handlePreviewDialogOpen = (product: Product) => {
    setSelectedProduct(product);
    setOpenPreviewDialog(true);
  }

  const handlePreviewDialogClose = () => {
    setOpenPreviewDialog(false);
  }

  //=============================================================
  // Add Product Dialog
  //=============================================================
  const [openAddDialog, setOpenAddDialog] = useState(false);
  
  const handleAddDialogOpen = () => {
    setOpenAddDialog(true);
  }

  const handleAddDialogClose = () => {
    setOpenAddDialog(false);
    setImagePreviewUrl('') // Clear the image preview
    setImageFileName('') // Clear the image file name
    
    //Reset Form
    reset({
      category_id: "",
      product_name: "",
      unit_price: 0,
      unit_in_stock: 0,
      created_date: new Date().toISOString(),
      modified_date: new Date().toISOString(),
    });
  }


  //Form Validation
  const productPostSchema: any = Yup.object().shape({
    category_id: Yup.string().required("Category is required"),
    product_name: Yup.string().required("Product Name is required"),
    unit_price: Yup.number().required("Unit Price is required").moreThan(0, "Unit Price must be greater than 0"),
    unit_in_stock: Yup.number().required("Unit in Stock is required").moreThan(0, "Unit in Stock must be greater than 0")
  });

  const { control, handleSubmit, formState: { errors }, reset, } = useForm<ProductAdd>({
    defaultValues: {
      category_id: "",
      product_name: "",
      unit_price: 0,
      unit_in_stock: 0,
      created_date: formatDateToISOWithoutMilliseconds(new Date()),
      modified_date: formatDateToISOWithoutMilliseconds(new Date()),
    },
    resolver: yupResolver(productPostSchema),
  });

  //handle form submit
  const onSubmitProduct = async (data: ProductAdd) => {
    //console.log(data);
    const formData = new FormData();
    formData.append("category_id", data.category_id);
    formData.append("product_name", data.product_name);
    formData.append("unit_price", data.unit_price.toString());
    formData.append("unit_in_stock", data.unit_in_stock.toString());
    formData.append("created_date", data.created_date);
    formData.append("modified_date", data.modified_date);

    // Append image file to form data
    if (fileInputRef.current.files[0]) {
      formData.append("image", fileInputRef.current.files[0])
    }
    
    // Display the key/value pairs
    new Response(formData).text().then(console.log);

    // Call the API to save the data
    try {
      const response = await createProduct(formData)
      console.log(response)
      fetchProducts(page, limit, searchCategory, searchQuery) 
      handleAddDialogClose() 
    } catch (error) {
      console.error("Failed to create product:", error);
    }
  }

  //Dropdown for Category - refactor to call api later
  const categories = [
    { name: "Mobile", value: "1" },
    { name: "Tablet", value: "2" },
    { name: "Smart Watch", value: "3" },
    { name: "Labtop", value: "4"}
  ]

  // State for image preview
  const [imagePreviewUrl, setImagePreviewUrl] = useState("")
  const [imageFileName, setImageFileName] = useState("")
  const fileInputRef:any = useRef(null); // Ref for the file input
 
  // Handle file change
  const handleFileChange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader: any = new FileReader()
    
        reader.onloadend = () => {
          // console.log(reader.result)
          setImagePreviewUrl(reader.result) // This is now the base64 encoded data URL of the file
          setImageFileName(file.name) // Set the file name
        }
    
        reader.readAsDataURL(file); // Read the file as a Data URL
      } else {
        setImagePreviewUrl('')// Reset or clear the preview if no file is selected
        setImageFileName('')
      }
    }  
    
    // Remove image preview
    const removeImage = () => {
      // Clear the preview URL
      setImagePreviewUrl('')
      // Clear the file input value
      fileInputRef.current.value = ''
    }

  //=============================================================
  // Edit Product Dialog
  //=============================================================
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedProductForEdit, setSelectedProductForEdit] = useState<Product | null>(null);

  const handleEditDialogOpen = (product: Product) => {
    resetEdit({
      product_name: product.product_name,
      unit_price: product.unit_price,
      unit_in_stock: product.unit_in_stock,
      category_id: product.category_id.toString(),
      modified_date: formatDateToISOWithoutMilliseconds(new Date()),
    })
    setSelectedProductForEdit(product)
    setOpenEditDialog(true);
  }

  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
  }

  // React Hook Form for editing product
  const {
    control: controlEdit,
    handleSubmit: handleSubmitEdit,
    formState: { errors: errorsEdit },
    reset: resetEdit,
  } = useForm<ProductEdit>({
    resolver: yupResolver(productPostSchema) as any,
  })
  
  
  // Handle Submit Edit Produc
  const onSubmitEdit = async (data: ProductEdit) => {
    console.log(data)

    // รับค่าเป็น FormData
    const formData = new FormData()
    // กำหนดค่าให้กับ FormData
    formData.append("product_id", data.product_id.toString());
    formData.append("product_name", data.product_name)
    formData.append("unit_price", data.unit_price.toString())
    formData.append("unit_in_stock", data.unit_in_stock.toString())
    formData.append("category_id", data.category_id)
    formData.append("modified_date", data.modified_date)

    // Append image file to form data
    if (fileInputRef.current.files[0]) {
      formData.append("image", fileInputRef.current.files[0])
    }
    
    // Display the key/value pairs
    new Response(formData).text().then(console.log);
    
    // Call your API to submit the edited product
    try {
      if (!selectedProductForEdit) {
        console.error("No product selected for edit")
        return
      }
      const response = await updateProduct(selectedProductForEdit.product_id, formData)
      console.log(response)
      fetchProducts(page, limit, searchCategory, searchQuery) 
      handleEditDialogClose() 
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  }


  //=============================================================
  // Delete Product
  //=============================================================

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProductIdForDelete, setSelectedProductIdForDelete] = useState<number | null>(null);

  const handleDeleteDialogOpen = (productId: number) => {
    setSelectedProductIdForDelete(productId);
    setDeleteDialogOpen(true);
  }

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedProductIdForDelete(null);
  }

  const handleDeleteProduct = async () => {
    if (selectedProductIdForDelete) {
      try {
        // Call your API to delete the product
        console.log("Deleting product with ID:", selectedProductIdForDelete)
        const response = await deleteProduct(selectedProductIdForDelete)
        console.log(response)
        fetchProducts(page, limit, searchCategory, searchQuery) 
        handleDeleteDialogClose() 
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  }
  //=============================================================
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
            <Button variant="contained" color="primary" onClick={handleAddDialogOpen}>
              <IconPlus size={16} /> &nbsp;Add Product
            </Button>
          </Stack>
        </CardContent>

        <Stack
            direction="row"
            m={2}
            justifyContent="space-between"
            alignItems={"center"}
          >
            <FormControl fullWidth>
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-select-label"
                value={searchCategory}
                label="Category"
                onChange={(e) => setSearchCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Search Products"
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchQueryChange}
              sx={{ marginLeft: 2 }}
            />
            <Box>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchCategory('');
                  }}
                  sx={{ marginLeft: 2, height: '50px' }}
                >
                  <IconClearAll size={16} /> &nbsp;Clear
                </Button>
            </Box>
        </Stack>
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
                      onClick={() => handlePreviewDialogOpen(product)}
                    >
                      <IconEye size={16} />
                    </Button>
                    <Button
                      variant="contained"
                      color="warning"
                      sx={{ mr: 1, minWidth: "30px" }}
                      onClick={() => handleEditDialogOpen(product)}
                    >
                      <IconEdit size={16} />
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      sx={{ mr: 1, minWidth: "30px" }}
                      onClick={() => handleDeleteDialogOpen(product.product_id)}
                    >
                      <IconTrash size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination 
            rowsPerPageOptions={[3, 5, 10]}
            component="div"
            count={totalCount}
            rowsPerPage={limit}
            page={page}
            onPageChange={(e, newPage) => {
              setPage(newPage);
              fetchProducts(newPage, limit, searchCategory, searchQuery);
            }}
            onRowsPerPageChange={(e) => {
              setLimit(parseInt(e.target.value, 10));
              setPage(0);
              fetchProducts(0, parseInt(e.target.value, 10), searchCategory, searchQuery);
            }}
          />
        </Box>
      </Card>

      { /* Add Dialog for Add Product */ }
      <Dialog
        open={openAddDialog}
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

              { /* image choose and preview */}
              <TextField
                    variant="standard"          
                    type="text"
                    InputProps={{
                      endAdornment: (
                        <IconButton component="label">
                          <FileUploadOutlined />
                          <input
                            accept="image/*"
                            type="file"
                            hidden
                            onChange={handleFileChange}
                            ref={fileInputRef}
                          />
                        </IconButton>
                      ),
                    value: imageFileName ? imageFileName : "",
                    }}
              />

              {imagePreviewUrl && (
                <Box sx={{ mt: 2, mb: 2, textAlign: 'center' }}>
                  <Box sx={{ textAlign: 'right'}}>
                    <Button onClick={removeImage} variant="outlined" style={{ display: 'inline-block'}}>
                      <IconX size={16} />
                    </Button>
                  </Box>
                  <img src={imagePreviewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '10px' }} />
                </Box>
              )}

            </DialogContent>
            <DialogActions>
              <Button onClick={handleAddDialogClose} color="primary">Cancel</Button>
              <Button type="submit" color="primary">Save</Button>
            </DialogActions>
          </form>
      </Dialog>

      { /* Preview Dialog for Product */ }
      {
      selectedProduct && 
        <Dialog open={openPreviewDialog} onClose={handlePreviewDialogClose}>
          <DialogTitle>Product Preview</DialogTitle>
          <DialogContent>
              <Stack direction="row" spacing={2}>
                <img
                  src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL_API}/${selectedProduct?.product_picture}`}
                  alt={selectedProduct?.product_name}
                  style={{ width: "60%" }}
                />
                <Box>
                  <Typography variant="h6">{selectedProduct?.product_name}</Typography>
                  <Typography variant="body1">{selectedProduct?.category_name}</Typography>
                  <Typography variant="body1">Price: {(selectedProduct?.unit_price != undefined) && numberWithCommas(selectedProduct.unit_price)}</Typography>
                  <Typography variant="body1">Unit in Stock: {selectedProduct?.unit_in_stock}</Typography>
                  <Typography variant="body1">Created: { (selectedProduct?.created_date != undefined) && formatDate(selectedProduct.created_date)}</Typography>
                  <Typography variant="body1">Modified: { (selectedProduct?.modified_date != undefined) && formatDate(selectedProduct.modified_date)}</Typography>
                </Box>
              </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handlePreviewDialogClose} color="primary">Close</Button>
          </DialogActions>
        </Dialog>
      }

      { /* Edit Dialog for Product */ }
      <Dialog open={openEditDialog} onClose={handleEditDialogClose}>
        <DialogTitle sx={{mt:'20px'}}>Edit Product</DialogTitle>
          <form 
            onSubmit={handleSubmitEdit(onSubmitEdit)}
            noValidate
            autoComplete="off"
          >
            <DialogContent sx={{width: '400px'}}>

              {/* Preview Old Image */}
              <img src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL_API}/${selectedProductForEdit?.product_picture}`} alt={selectedProductForEdit?.product_name} style={{ width: '100%', marginBottom:'20px' }} />

              <Controller
                name="product_id"
                control={controlEdit}
                defaultValue={selectedProductForEdit?.product_id || 0}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="dense"
                    label="Product ID"
                    type="text"
                    fullWidth
                    variant="outlined"
                    disabled
                  />
                )}
              />

              <Controller
                name="product_name"
                control={controlEdit}
                defaultValue={selectedProductForEdit?.product_name || ''}
                render={({ field }) => (
                  <TextField
                    {...field}
                    autoFocus
                    margin="dense"
                    label="Product Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    error={errorsEdit.product_name ? true : false}
                    helperText={errorsEdit.product_name?.message}
                  />
                )}
              />

              <Controller
                name="unit_price"
                control={controlEdit}
                defaultValue={selectedProductForEdit?.unit_price || 0}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="dense"
                    label="Unit Price"
                    type="number"
                    fullWidth
                    variant="outlined"
                    error={errorsEdit.unit_price ? true : false}
                    helperText={errorsEdit.unit_price?.message}
                  />
                )}
              />

              <Controller
                name="unit_in_stock"
                control={controlEdit}
                defaultValue={selectedProductForEdit?.unit_in_stock || 0}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="dense"
                    label="Unit in Stock"
                    type="number"
                    fullWidth
                    variant="outlined"
                    error={errorsEdit.unit_in_stock ? true : false}
                    helperText={errorsEdit.unit_in_stock?.message}
                  />
                )}
              />

              <FormControl fullWidth variant="outlined" margin="dense">
                <InputLabel id="category_name-label">Category</InputLabel>
                <Controller
                  name="category_id"
                  control={controlEdit}
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
                <FormHelperText error={errorsEdit.category_id ? true : false}>
                  {errorsEdit.category_id?.message}
                </FormHelperText>
              </FormControl>

              { /* image choose and preview */}
              <TextField
                    variant="standard"          
                    type="text"
                    InputProps={{
                      endAdornment: (
                        <IconButton component="label">
                          <FileUploadOutlined />
                          <input
                            accept="image/*"
                            type="file"
                            hidden
                            onChange={handleFileChange}
                            ref={fileInputRef}
                          />
                        </IconButton>
                      ),
                    value: imageFileName ? imageFileName : "",
                    }}
              />

              {imagePreviewUrl && (
                <Box sx={{ mt: 2, mb: 2, textAlign: 'center' }}>
                  <Box sx={{ textAlign: 'right'}}>
                    <Button onClick={removeImage} variant="outlined" style={{ display: 'inline-block'}}>
                      <IconX size={16} />
                    </Button>
                  </Box>
                  <img src={imagePreviewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '10px' }} />
                </Box>
              )}
            </DialogContent>

            <DialogActions>
              <Button onClick={handleEditDialogClose}>Cancel</Button>
              <Button type="submit" variant="contained">Update</Button>
            </DialogActions>
          </form>
      </Dialog>

      { /* Delete Dialog for Product */ }
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description" 
      >
        <DialogTitle id="alert-dialog-title">{"Delete Product"}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Are you sure you want to delete this product?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">Cancel</Button>
          <Button onClick={handleDeleteProduct} color="error" autoFocus>Delete</Button>
        </DialogActions>
      </Dialog>

    </>
  );
}
