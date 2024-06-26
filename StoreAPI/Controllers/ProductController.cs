using Microsoft.AspNetCore.Mvc;
using StoreAPI.Data;
using StoreAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace StoreAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ProductController: ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _env;

    public ProductController(ApplicationDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    [AllowAnonymous]
    // GET: api/product/testConnection
    [HttpGet("TestConnection")]
    public void TestConnection()
    {
        if (_context.Database.CanConnect())
        {
            Response.WriteAsync("Connected to database");
        }
        else
        {
            Response.WriteAsync("Not connected to database");
        }
    }


    //TO DO
    // 1 pagination
    // 2 search
    [HttpGet]
    public async Task<ActionResult<IEnumerable<product>>> GetProducts([FromQuery] int page=1, [FromQuery] int limit=10
                                                                    , [FromQuery] int? searchCategory=null
                                                                    , [FromQuery] string searchQuery=null)
    {
        //return await _context.products.ToListAsync();

        int skip = (page - 1) * limit;
        //Join with categories
        var query = _context.products
            .Join(
                _context.categories,
                p => p.category_id,
                c => c.category_id,
                (p, c) => new
                {
                    p.product_id,
                    p.product_name,
                    p.unit_price,
                    p.unit_in_stock,
                    c.category_name,
                    p.product_picture,
                    p.created_date,
                    p.modified_date,
                    p.category_id
                }
            );

        if (searchCategory.HasValue)
        {
            query = query.Where(p => p.category_id == searchCategory);
        }
        
        if (!string.IsNullOrEmpty(searchQuery))
        {
            //Case sensitive
            //query = query.Where(p => EF.Functions.Like(p.product_name, $"%{searchQuery}%"));
            
            //Case insensitive
            query = query.Where(p => EF.Functions.ILike(p.product_name!, $"%{searchQuery}%"));
        }

        var products = await query
                        .OrderByDescending(p => p.product_id)
                        .Skip(skip)
                        .Take(limit)
                        .ToListAsync();

        int totalRecords = await _context.products.CountAsync();

        int currentRecords = products.Count();
        
        return Ok(new {TotalRecords = totalRecords
                     , CurrentRecords = currentRecords
                     , Products = products});
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<product>> GetProduct(int id)
    {
        var product = await _context.products.FindAsync(id);

        if (product == null)
        {
            return NotFound();
        }

        return Ok(product);
    }

    // POST: /api/Product   
    [HttpPost]
    public async Task<ActionResult<product>> CreateProduct([FromForm] product product, IFormFile? image)
    {
        _context.products.Add(product);

        if(image != null){
            string fileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);

            string uploadFolder = Path.Combine(_env.WebRootPath, "uploads");

            if (!Directory.Exists(uploadFolder))
            {
                Directory.CreateDirectory(uploadFolder);
            }

            using (var fileStream = new FileStream(Path.Combine(uploadFolder, fileName), FileMode.Create))
            {
                await image.CopyToAsync(fileStream);
            }
            product.product_picture = fileName;
        }
        else
        {
            product.product_picture = "noimg.jpg";
        }

        await _context.SaveChangesAsync();

        return Ok(product);
    }


    [HttpPut("{id}")]
    public async Task<ActionResult<product>> UpdateProduct(int id, [FromForm] product product, IFormFile? image)
    {
        if (id != product.product_id)
        {
            return BadRequest();
        }

        var existingProduct = await _context.products.FindAsync(id);
        if (existingProduct == null)
        {
            return NotFound();
        }

        existingProduct.product_name = product.product_name;
        existingProduct.unit_price = product.unit_price;
        existingProduct.unit_in_stock = product.unit_in_stock;
        existingProduct.category_id = product.category_id;
        existingProduct.modified_date = DateTime.Now;


        if(image != null){
            string fileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);

            string uploadFolder = Path.Combine(_env.WebRootPath, "uploads");

            if (!Directory.Exists(uploadFolder))
            {
                Directory.CreateDirectory(uploadFolder);
            }

            using (var fileStream = new FileStream(Path.Combine(uploadFolder, fileName), FileMode.Create))
            {
                await image.CopyToAsync(fileStream);
            }

            if (existingProduct.product_picture != "noimg.jpg"){
                string oldFilePath = Path.Combine(uploadFolder, existingProduct.product_picture);
                if (System.IO.File.Exists(oldFilePath))
                {
                    System.IO.File.Delete(oldFilePath);
                }
            }
            existingProduct.product_picture = fileName;
        }

        _context.Entry(existingProduct).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return Ok(existingProduct);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<product>> DeleteProduct(int id)
    {
        var product = await _context.products.FindAsync(id);

        if (product == null)
        {
            return NotFound();
        }

        if (product.product_picture != "noimg.jpg"){
            string uploadFolder = Path.Combine(_env.WebRootPath, "uploads");
            string filePath = Path.Combine(uploadFolder, product.product_picture);
            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }
        }

        _context.products.Remove(product);
        await _context.SaveChangesAsync();

        return Ok(product);
    }

    /*
    // ฟังก์ชันสำหรับการดึงข้อมูลสินค้าทั้งหมด
    // GET: /api/Product
    [HttpGet]
    public ActionResult<product> GetProducts()
    {
        // LINQ สำหรับการดึงข้อมูลจากตาราง Products ทั้งหมด
        // var products = _context.products.ToList();

        // แบบอ่านที่มีเงื่อนไข
        // var products = _context.products.Where(p => p.unit_price > 45000).ToList();

        // แบบเชื่อมกับตารางอื่น products เชื่อมกับ categories
        var products = _context.products
            .Join(
                _context.categories,
                p => p.category_id,
                c => c.category_id,
                (p, c) => new
                {
                    p.product_id,
                    p.product_name,
                    p.unit_price,
                    p.unit_in_stock,
                    c.category_name
                }
            ).ToList();

        // ส่งข้อมูลกลับไปให้ผู้ใช้งาน
        return Ok(products);
    }

    // ฟังก์ชันสำหรับการดึงข้อมูลสินค้าตาม id
    // GET: /api/Product/{id}
    [HttpGet("{id}")]
    public ActionResult<product> GetProduct(int id)
    {
        // LINQ สำหรับการดึงข้อมูลจากตาราง Products ตาม id
        var product = _context.products.FirstOrDefault(p => p.product_id == id);

        // ถ้าไม่พบข้อมูลจะแสดงข้อความ Not Found
        if (product == null)
        {
            return NotFound();
        }

        // ส่งข้อมูลกลับไปให้ผู้ใช้งาน
        return Ok(product);
    }

    // ฟังก์ชันสำหรับการเพิ่มข้อมูลสินค้า
    // POST: /api/Product
    [HttpPost]
    public ActionResult<product> CreateProduct(product product)
    {
        // เพิ่มข้อมูลลงในตาราง Products
        _context.products.Add(product);
        _context.SaveChanges();

        // ส่งข้อมูลกลับไปให้ผู้ใช้
        return Ok(product);
    }

    // ฟังก์ชันสำหรับการแก้ไขข้อมูลสินค้า
    // PUT: /api/Product/{id}
    [HttpPut("{id}")]
    public ActionResult<product> UpdateProduct(int id, product product)
    {
        // ดึงข้อมูลสินค้าตาม id
        var existingProduct = _context.products.FirstOrDefault(p => p.product_id == id);

        // ถ้าไม่พบข้อมูลจะแสดงข้อความ Not Found
        if (existingProduct == null)
        {
            return NotFound();
        }

        // แก้ไขข้อมูลสินค้า
        existingProduct.product_name = product.product_name;
        existingProduct.unit_price = product.unit_price;
        existingProduct.unit_in_stock = product.unit_in_stock;
        existingProduct.category_id = product.category_id;

        // บันทึกข้อมูล
        _context.SaveChanges();

        // ส่งข้อมูลกลับไปให้ผู้ใช้
        return Ok(existingProduct);
    }

    // ฟังก์ชันสำหรับการลบข้อมูลสินค้า
    // DELETE: /api/Product/{id}
    [HttpDelete("{id}")]
    public ActionResult<product> DeleteProduct(int id)
    {
        // ดึงข้อมูลสินค้าตาม id
        var product = _context.products.FirstOrDefault(p => p.product_id == id);

        // ถ้าไม่พบข้อมูลจะแสดงข้อความ Not Found
        if (product == null)
        {
            return NotFound();
        }

        // ลบข้อมูล
        _context.products.Remove(product);
        _context.SaveChanges();

        // ส่งข้อมูลกลับไปให้ผู้ใช้
        return Ok(product);
    }

    */
}