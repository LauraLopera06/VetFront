using Microsoft.AspNetCore.Mvc;

namespace VetFront.Controllers
{
    public class ConsultorioController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
