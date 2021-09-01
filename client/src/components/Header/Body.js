
import About from '../Body/About';
import Contact from '../Body/Contact';
import Catalog from '../Body/Catalog';
import Users from '../Body/Users';
import AddWorkers from '../Body/AddWorkers';
import Workers from '../Body/Workers';
import Packages from '../Body/Packages';
import Blog from '../Body/Blog';
import Chat from '../Body/Chat';
import AddPost from '../Body/AddPost'
import {Pie, Bar} from '../Body/Charts';


import Distribution from '../Body/Distribution';
import Map from '../Body/Map';



const Body = ({ title }) => {
    if (title == 'about') { return (<About />); }
    if (title == 'contact') { return (<Contact />); }
    if (title == 'catalog') { return (<Catalog />); }
    if (title == 'users') { return (<Users />); }
    if (title == 'packages') { return (<Packages />); }
    if (title == 'workers') { return (<Workers />); }
    if (title == 'add_workers') { return (<AddWorkers />); }
    if (title == 'distribution')  { return (<Distribution />); }
    if (title == 'map')  { return (<Map />); }
    if (title == 'bar')  { return (<Bar />); }
    if (title == 'pie')  { return (<Pie />); }
    if (title == 'chat')  { return (<Chat />); }
    if (title == 'blog')  { return (<Blog />); }
    if (title == 'addpost')  { return (<AddPost />); }
}

export default Body;








