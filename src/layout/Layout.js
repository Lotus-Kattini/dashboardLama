import React, { useEffect, useState } from 'react'
import SidebarCard from '../components/cards/Card'
import { MdAttachMoney, MdCategory, MdStore } from 'react-icons/md';
import expensesImage from '../Assets/form.jpg';
import categoriesImage from '../Assets/form.jpg';
import productsImage from '../Assets/form.jpg';
import { GiBuyCard } from "react-icons/gi";


function Layout() {
  
  return (
    <div className="dashboard-cards">
        <SidebarCard
          title="Expenses"
          link="/dashboard/expences"
          icon={MdAttachMoney}
          image={expensesImage}
        />
        <SidebarCard
          title="Categories"
          link="/dashboard/categories"
          icon={MdCategory}
          image={categoriesImage}
        />
        <SidebarCard
          title="Products"
          link="/dashboard/products"
          icon={MdStore}
          image={productsImage}
        />
        <SidebarCard
          title="SubCategories"
          link="/dashboard/sub-categories"
          icon={MdCategory}
          image={productsImage}
        />
        <SidebarCard
          title="Orders"
          link="/dashboard/orders"
          icon={GiBuyCard}
          image={productsImage}
        />
        <div>
      </div>
      </div>
  )
}

export default Layout