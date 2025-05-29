using Microsoft.AspNetCore.Mvc;

namespace VetFront.Controllers
{
    public class MedicamentoController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
