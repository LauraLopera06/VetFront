using Microsoft.AspNetCore.Mvc;

namespace VetFront.Controllers
{
    public class InventarioMedicamentoController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
