using Microsoft.AspNetCore.Mvc;

namespace VetFront.Controllers
{
    public class LoginController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
