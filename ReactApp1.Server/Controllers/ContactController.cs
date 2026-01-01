using Microsoft.AspNetCore.Mvc;

namespace ReactApp1.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        [HttpPost]
        public IActionResult SendContact([FromBody] ContactRequest request)
        {
            // Demo: just echo back
            return Ok(new { success = true, message = "Contact form received", data = request });
        }
    }

    public class ContactRequest
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Message { get; set; }
    }
}
