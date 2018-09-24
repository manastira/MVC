﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AdvMasterDetails.Controllers
{
    public class HomeController : Controller
    {
        // GET: Home
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult getProductCategories()
        {
            List<Category> categories = new List<Category>();

            using (MasterDetailsEntities1 dc = new MasterDetailsEntities1())
            {
                categories = dc.Categories.OrderBy(a => a.CategoryNames).ToList();
            }
                return new JsonResult { Data = categories, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        public JsonResult getProducts(int categoryID)
        {
            List<Product> products = new List<Product>();
            using (MasterDetailsEntities1 dc = new MasterDetailsEntities1())
            {
                products = dc.Products.Where(a => a.CategoryID.Equals(categoryID)).OrderBy(a=>a.ProductName).ToList();
            }
            return new JsonResult { Data = products, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        [HttpPost]
        public JsonResult save(OrderMaster order)
        {
            bool status = false;
            DateTime dateOrg;
            var isValidDate = DateTime.TryParseExact(order.OrderDate.ToShortDateString(), "mm-dd-yyyy", null, System.Globalization.DateTimeStyles.None, out dateOrg);

            if(isValidDate)
            {
                order.OrderDate = dateOrg;
            }

            var isValidModel = TryUpdateModel(order);
            if(isValidModel)
            {
                using (MasterDetailsEntities1 dc = new MasterDetailsEntities1())
                {
                    dc.OrderMasters.Add(order);
                    dc.SaveChanges();
                    status = true;
                }
            }
            return new JsonResult { Data = new { status = status } };
        }
    }
}