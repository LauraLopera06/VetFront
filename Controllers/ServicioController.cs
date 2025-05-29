using Microsoft.AspNetCore.Mvc;

namespace VetFront.Controllers
{
    public class ServicioController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
