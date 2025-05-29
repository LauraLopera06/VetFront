using Microsoft.AspNetCore.Mvc;

namespace VetFront.Controllers
{
    public class CitaController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
