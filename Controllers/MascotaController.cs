using Microsoft.AspNetCore.Mvc;

namespace VetFront.Controllers
{
    public class MascotaController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
