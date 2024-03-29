using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StoreAPI.Data;
using StoreAPI.Models;

[ApiController]
[Route("api/[controller]")]
public class CategoryController: ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CategoryController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<category>>> GetCategories()
    {
        return await _context.categories.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<category>> GetCategory(int id)
    {
        var category = await _context.categories.FindAsync(id);

        if (category == null)
        {
            return NotFound();
        }

        return Ok(category);
    }

    [HttpPost]
    public async Task<ActionResult<category>> CreateCategory([FromForm] category category)
    {
        _context.categories.Add(category);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetCategory", new { id = category.category_id }, category);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCategory(int id, [FromForm] category category)
    {
        if (id != category.category_id)
        {
            return BadRequest();
        }

        _context.Entry(category).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!CategoryExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    private bool CategoryExists(int id)
    {
        return _context.categories.Any(e => e.category_id == id);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<category>> DeleteCategory(int id)
    {
        var category = await _context.categories.FindAsync(id);

        if (category == null)
        {
            return NotFound();
        }

        _context.categories.Remove(category);
        await _context.SaveChangesAsync();

        return Ok(category);
    }
}