using Microsoft.AspNetCore.Mvc;

namespace VetFront.Controllers
{
    public class SedeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
