using Microsoft.AspNetCore.Mvc;

namespace VetFront.Controllers
{
    public class FarmaciaController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
