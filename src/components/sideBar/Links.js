import {CiViewTable } from "react-icons/ci";
import { MdOutlineCategory } from "react-icons/md";
import { IoAddCircle } from "react-icons/io5";
import { GrMoney } from "react-icons/gr";
import { AiFillProduct } from "react-icons/ai";
import { GiBuyCard } from "react-icons/gi";

export const Links=[
    {
        name:'Expanses',
        path:'expences',
        icon:<CiViewTable/>,
        role:'1995'
    },
    {
        name:'Categories',
        path:'categories',
        icon:<MdOutlineCategory/>,
        role:''
    },
    {
        name:'Sub Categories',
        path:'sub-categories',
        icon:<GrMoney/>,
        role:''
    },
    {
        name:'Products',
        path:'products',
        icon:<AiFillProduct/>,
        role:''
    },
    {
        name:'Orders',
        path:'orders',
        icon:<GiBuyCard/>,
        role:''
    },
]
