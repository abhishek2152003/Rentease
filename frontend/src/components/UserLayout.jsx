import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const UserLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow pt-20">
                <Outlet />
            </main>
            <footer className="bg-zinc-900 text-zinc-400 py-8 text-center text-sm mt-12">
                &copy; {new Date().getFullYear()} RentEase. All rights reserved.
            </footer>
        </div>
    );
};

export default UserLayout;
