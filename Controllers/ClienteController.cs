using Microsoft.AspNetCore.Mvc;

namespace VetFront.Controllers
{
    public class ClienteController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
