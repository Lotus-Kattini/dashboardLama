import Expances from "./components/expances/Expanses";
import Dashboard from "./pages/Dashboard";
import Login from './Auth/Login'
import { Route,Routes } from "react-router-dom";
import Categories from "./components/categories/Categories";
import Updatecategory from './components/categories/Updatecategory'
import Updateexpenses from "./components/expances/Updateexpenses";
import CategorieShowTable from "./components/categories/ShowCategoreisAG";
import ShowexpensesAG from "./components/expances/ShowExpensesAG";
import Layout from "./layout/Layout";
import ProducShow from "./components/products/ProuctShow";
import Addproduct from "./components/products/Addproduct";
import Updateproduct from "./components/products/Updateproduct";
import Productdetails from './components/products/productDetails/Productdetails'
import AddsubCategory from "./components/subcategories/AddsubCategory";
import ShowSubCategories from "./components/subcategories/ShowSubcategories";
import UpdateSubcategory from "./components/subcategories/UpdatesubCategory";
import ShowOrders from "./components/orders/OrdersShow";
import UpdateOrder from "./components/orders/UpdateOrder";
import ProductDetailsShow from "./components/products/productDetails/ProductDetailsShow";
import DetailsShow from "./components/products/productDetails/DeatilsShow";
import RequireAuth from "./Auth/RequireAuth";
import Page404 from "./errors/Page404";
import UpdateProductdetails from "./components/products/productDetails/UpdateDetails";

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/*' element={<Page404/>}/>
        <Route element={<RequireAuth/>}>
        <Route path="/dashboard-main" element={<Layout/>}/>
        <Route path="/dashboard" element={<Dashboard/>}>
          <Route path="addexpences" element={<Expances/>}/>
          <Route path="expences" element={<ShowexpensesAG/>}/>
          <Route path="expences/update/:id" element={<Updateexpenses/>}/>
          <Route path="categories" element={<CategorieShowTable/>}/>
          <Route path="addcategory" element={<Categories/>}/>
          <Route path="categories/update/:id" element={<Updatecategory/>}/>
          <Route path="sub-categories" element={<ShowSubCategories/>}/>
          <Route path="sub-categories/add" element={<AddsubCategory/>}/>
          <Route path="sub-categories/update/:id" element={<UpdateSubcategory/>}/>
          <Route path="products" element={<ProducShow/>}/>
          <Route path="addproduct" element={<Addproduct/>}/>
          <Route path="products/update/:id" element={<Updateproduct/>}/>
          <Route path="products/product-details-add/:id" element={<Productdetails/>}/>
          <Route path="products/product-details-showing/:id" element={<ProductDetailsShow/>}/>
          <Route path="products/product-details-forone/:id" element={<DetailsShow/>}/>
          <Route path="products/product-details-update/:id" element={<UpdateProductdetails/>}/>
          <Route path="orders" element={<ShowOrders/>}/>
          <Route path="orders/update/:id" element={<UpdateOrder/>}/>
        </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
